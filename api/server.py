#!/usr/bin/env python3
from flask import (
    Flask,
    jsonify,
    request,
)
from flask_pymongo import PyMongo
from flask_cors import CORS

import torch
from torch.utils.data import (
    DataLoader,
    RandomSampler,
    SequentialSampler,
    TensorDataset,
)
from torch.utils.data.distributed import DistributedSampler

from scipy.special import softmax

from transformers import (
    AdamW,
    BertConfig,
    BertForMultipleChoice,
    BertTokenizer,
    XLNetConfig,
    XLNetForMultipleChoice,
    XLNetTokenizer,
    RobertaConfig,
    RobertaForMultipleChoice,
    RobertaTokenizer,
    WarmupLinearSchedule,
    WEIGHTS_NAME,
)

from tqdm import (
    tqdm,
    trange,
)

from slack_client import SlackClient, SlackError
from datetime import datetime
import logging
import random
import json
import os

logger = logging.getLogger(__name__)


app = Flask(__name__, static_url_path='')
CORS(app)


# Add mongo db settings for logging
MONGO_URI = os.environ.get('MONGO_URI', 'mongodb://0.0.0.0:27017/mcs')
app.config["MONGO_URI"] = MONGO_URI
mongo = PyMongo(app)

# Slack api settings
SLACK_TOKEN = os.environ.get('SLACK_TOKEN', '')
slack_client = SlackClient(SLACK_TOKEN)


SYSTEMS = {
    'system_1': {
        'model_name': 'roberta',
        'model_path': 'models/taska_roberta',
        'classes': (RobertaConfig, RobertaForMultipleChoice, RobertaTokenizer),
        'tokenizer': None,
        'device': None,
        'model': None,
    },
    'system_2': {
        'model_name': 'bert',
        'model_path': 'models/taska_bert',
        'classes': (BertConfig, BertForMultipleChoice, BertTokenizer),
        'tokenizer': None,
        'device': None,
        'model': None,
    },
}


MODEL_CLASSES = {
    'bert': (BertConfig, BertForMultipleChoice, BertTokenizer),
    'xlnet': (XLNetConfig, XLNetForMultipleChoice, XLNetTokenizer),
    'roberta': (RobertaConfig, RobertaForMultipleChoice, RobertaTokenizer)
}


# load trained models
def load_models(system):
    system['device'] = torch.device("cuda" if torch.cuda.is_available() and not False else "cpu")
    n_gpu = torch.cuda.device_count()
    logging.basicConfig(
        format='%(asctime)s - %(levelname)s - %(name)s -   %(message)s',
        datefmt='%m/%d/%Y %H:%M:%S',
        level=logging.INFO if -1 in [-1, 0] else logging.WARN
    )
    config_class, model_class, tokenizer_class = system['classes']
    config = config_class.from_pretrained(system['model_path'])
    system['tokenizer'] = tokenizer_class.from_pretrained(system['model_path'])
    system['model'] = model_class.from_pretrained(
        system['model_path'],
        from_tf=bool('.ckpt' in system['model_path']),
        config=config
    )
    system['model'].to(system['device'])


def select_field(features, field):
    return [
        [
            choice[field]
            for choice in features
        ]
    ]


def send_slack_message(data):
    """
       "s1": {
           "system_1": {
               "input": input1,
               "score": round(score_0, 5),
               "lie": bool(min([score_0, score_1, sco
           },
    """
    text = 'New entry in the MCS Demo!'
    blocks = []
    for system_id in SYSTEMS.keys():
        blocks.append({
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "{} ({}):\n\t1. {}: {}% - {}\n\t2. {}: {}% - {}\n\t3. {}: {}% - {}".format(
                    system_id.replace('_', ' ').capitalize(),
                    SYSTEMS[system_id]['model_name'],
                    data['s1'][system_id]['input'], round(float(data['s1'][system_id]['score']), 2), 'LIE! ❌ 🤥' if data['s1'][system_id]['lie'] else 'TRUE ✔️',
                    data['s2'][system_id]['input'], round(float(data['s2'][system_id]['score']), 2), 'LIE! ❌ 🤥' if data['s2'][system_id]['lie'] else 'TRUE ✔️',
                    data['s3'][system_id]['input'], round(float(data['s3'][system_id]['score']), 2), 'LIE! ❌ 🤥' if data['s3'][system_id]['lie'] else 'TRUE ✔️',
                ),
            }
        })
        blocks.append({"type": "divider"})
    slack_client.chat_post_message(
        '#mcs-demo',
        text,
        blocks=json.dumps(blocks),
        username='2 Truths and 1 Lie?',
        as_user='False',
        icon_emoji=':robot_face:',
    )

def get_system_output(system_id, context, endings):
    system = SYSTEMS[system_id]
    tokenizer = system['tokenizer']
    device = system['device']
    model = system['model']
    max_length = 48

    choices_features = []
    for ending_idx, (context, ending) in enumerate(zip(context, endings)):
        text_a = context
        text_b = ending
        inputs = tokenizer.encode_plus(
            text_a,
            text_b,
            add_special_tokens=True,
            max_length=max_length,
        )

        if 'num_truncated_tokens' in inputs and inputs['num_truncated_tokens'] > 0:
            logger.info('Attention! you are cropping tokens (swag task is ok). '
                        'If you are training ARC and RACE and you are poping question + options,'
                        'you need to try to use a bigger max seq length!')

        input_ids, token_type_ids = inputs["input_ids"], inputs["token_type_ids"]
        attention_mask = [1] * len(input_ids)
        # Zero-pad up to the sequence length.
        padding_length = max_length - len(input_ids)
        input_ids = input_ids + ([0] * padding_length)
        attention_mask = attention_mask + ([0] * padding_length)
        token_type_ids = token_type_ids + ([0] * padding_length)

        assert len(input_ids) == max_length
        assert len(attention_mask) == max_length
        assert len(token_type_ids) == max_length
        choices_features.append(
            {
                'input_ids': input_ids,
                'input_mask': attention_mask,
                'segment_ids': token_type_ids
            }
        )

    all_input_ids = torch.tensor(select_field(choices_features, 'input_ids'), dtype=torch.long)
    all_input_mask = torch.tensor(select_field(choices_features, 'input_mask'), dtype=torch.long)
    all_segment_ids = torch.tensor(select_field(choices_features, 'segment_ids'), dtype=torch.long)
    all_label_ids = torch.tensor([1], dtype=torch.long)

    dataset = TensorDataset(all_input_ids, all_input_mask, all_segment_ids, all_label_ids)
    sampler = SequentialSampler(dataset)
    dataloader = DataLoader(dataset, sampler=sampler, batch_size=1)

    # Feed the data into trained model
    for batch in tqdm(dataloader, desc="Evaluating"):
        model.eval()
        batch = tuple(t.to(device) for t in batch)
        with torch.no_grad():
            inputs = {'input_ids': batch[0],
                      'attention_mask': batch[1],
                      'token_type_ids': None,
                      # XLM don't use segment_ids
                      'labels': batch[3]}
            outputs = model(**inputs)
            tmp_eval_loss, logits = outputs[:2]
        preds = logits.detach().cpu().numpy()
        out_label_ids = inputs['labels'].detach().cpu().numpy()

    #Compute the scores
    score_1, score_2, score_3 = logits[0]
    score_1, score_2, score_3 = score_1.item(), score_2.item(), score_3.item()
    prob_1, prob_2, prob_3 = 100 * softmax([score_1/5.0, score_2/5.0, score_3/5.0])

    return (
        (round(score_1, 5), round(prob_1, 5)),
        (round(score_2, 5), round(prob_2, 5)),
        (round(score_3, 5), round(prob_3, 5)),
    )


@app.route('/classify')
def classify():

    input1 = request.args.get('s1')
    input2 = request.args.get('s2')
    input3 = request.args.get('s3')

    # create model format data
    text = "Below are three common sense statements."
    context = [text, text, text]
    endings = [input1, input2, input3]

    (s1_score1, s1_prob1), (s1_score2, s1_prob2), (s1_score3, s1_prob3) = get_system_output('system_1', context, endings)
    (s2_score1, s2_prob1), (s2_score2, s2_prob2), (s2_score3, s2_prob3) = get_system_output('system_2', context, endings)

    # Get a timestamp
    ts = datetime.now().isoformat()

    data = {
        "s1": {
            "system_1": {
                "input": input1,
                "prob": s1_prob1,
                "score": s1_score1,
                "lie": bool(min([s1_score1, s1_score2, s1_score3]) == s1_score1),
            },
            "system_2": {
                "input": input1,
                "prob": s2_prob1,
                "score": s2_score1,
                "lie": bool(min([s2_score1, s2_score2, s2_score3]) == s1_score1),
            },
        },
        "s2": {
            "system_1": {
                "input": input2,
                "prob": s1_prob2,
                "score": s1_score2,
                "lie": bool(min([s1_score1, s1_score2, s1_score3]) == s1_score2),
            },
            "system_2": {
                "input": input2,
                "prob": s2_prob2,
                "score": s2_score2,
                "lie": bool(min([s2_score1, s2_score2, s2_score3]) == s1_score2),
            },
        },
        "s3": {
            "system_1": {
                "input": input3,
                "prob": s1_prob3,
                "score": s1_score3,
                "lie": bool(min([s1_score1, s1_score2, s1_score3]) == s1_score3),
            },
            "system_2": {
                "input": input3,
                "prob": s2_prob3,
                "score": s2_score3,
                "lie": bool(min([s2_score1, s2_score2, s2_score3]) == s1_score3),
            },
        },
    }

    # store trial data in the mongo db
    mongo.db.trials.insert_one({'ts': ts, **data})

    # send a slack message
    try:
        send_slack_message(data)
    except SlackError as e:
        print('SlackError: {}'.format(e.__str__()))

    # Return json output
    return jsonify(data)


@app.route('/')
def index():
    return app.send_static_file('index.html')


if __name__ == "__main__":
    for  system in SYSTEMS.values():
        load_models(system)

    host = os.environ.get('MCS_SERVER_HOST', '0.0.0.0')
    port = int(os.environ.get('MCS_SERVER_PORT', '5005'))

    app.run(host=host, port=port, debug=False)
