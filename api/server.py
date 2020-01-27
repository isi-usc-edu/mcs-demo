#!/usr/bin/env python3
from flask import (
    Flask,
    jsonify,
    request,
)
import time
import requests
from bson import ObjectId
from threading import Thread
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

from slackeventsapi import SlackEventAdapter
from slackclient import SlackClient

from datetime import datetime
import logging
import random
import json
import os
import math

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

# Slack events adapter
SLACK_SIGNING_SECRET = os.environ.get('SLACK_SIGNING_SECRET', '')
slack_events_adapter = SlackEventAdapter(SLACK_SIGNING_SECRET, '/slack', app)


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
    'system_3': {
        'model_name': 'xlnet',
        'model_path': 'models/taska_xlnet',
        'classes': (XLNetConfig, XLNetForMultipleChoice, XLNetTokenizer),
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


def open_modal(data_id, trigger_id):
    data = mongo.db.trials.find_one(ObjectId(data_id))

    blocks = [{
      "type": "section",
      "text": {
        "type": "plain_text",
        "text": "Model output for each one of the input statements:",
        "emoji": True
      }
    }, {
      "type": "divider"
    }]

    for index, d in enumerate([data['s1'], data['s2'], data['s3']]):
        blocks.append({
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "{}. *{}*".format(index + 1, d['input']),
            },
        })
        system_output = ""
        for system_id in SYSTEMS.keys():
            system_output += "{} ({}): {}% (score: {}) - {}\n".format(
                system_id.replace('_', ' ').capitalize(),
                SYSTEMS[system_id].get('model_name'),
                round(float(d['output'][system_id].get('prob', 0)), 2),
                round(float(d['output'][system_id].get('score', 0)), 2),
                'LIE! ❌' if d['output'][system_id].get('lie') else 'TRUE ✔️',
            )
        blocks.append({
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": system_output,
            }
        })
        if index < 2:
            blocks.append({"type": "divider"})


    view = json.dumps({
      "type": "modal",
      "title": {
        "type": "plain_text",
        "text": "Model Output",
        "emoji": True
      },
      "blocks": json.dumps(blocks)
    })

    slack_client.api_call(
        'views.open',
        trigger_id=trigger_id,
        view=view,
        username='Machine Common Sense (DEMO)',
        as_user='False',
        icon_emoji=':robot_face:',
    )


@app.route('/events', methods=['POST'])
def events():
    """
    Handles incoming slack events
    """
    data = json.loads(request.values.get('payload'))
    data_id = data['actions'][0]['value']
    trigger_id = data.get('trigger_id')
    open_modal(data_id, trigger_id)
    return jsonify({'ok': True})


def send_slack_message(data, object_id):
    """
    Send the initial version of the user input (without model output)
    """
    blocks = [{
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": "*New entry in the MCS Demo!*"
        },
        "accessory": {
            "type": "button",
            "text": {
                "type": "plain_text",
                "text": "Show model output",
                "emoji": True
            },
            "value": str(object_id)
        }
    }, {
        "type": "section",
        "text": {
        "type": "mrkdwn",
        "text": "1. {} \n 2. {} \n 3. {}".format(
            data['s1']['input'],
            data['s2']['input'],
            data['s3']['input'],
        )},
    }]

    slack_client.api_call(
        'chat.postMessage',
        channel='#mcs-demo',
        text='New entry in the MCS Demo!',
        blocks=json.dumps(blocks),
        username='Machine Common Sense (DEMO)',
        as_user='False',
        icon_emoji=':robot_face:',
    )


def get_system_output(system, context, endings):
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
        choices_features.append({
            'input_ids': input_ids,
            'input_mask': attention_mask,
            'segment_ids': token_type_ids
        })

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
    score_1, score_2 = logits[0]
    score_1, score_2 = score_1.item(), score_2.item()
    prob_1, prob_2 = 100 * softmax([score_1 / 5.0, score_2 / 5.0])

    return {
        "s1": {
            "score": round(score_1, 5),
            "prob": round(prob_1, 5),
        },
        "s2": {
            "score": round(score_2, 5),
            "prob": round(prob_2, 5),
        },
    }


@app.route('/classify')
def classify():

    input1 = request.args.get('s1')
    input2 = request.args.get('s2')

    # create model format data
    text = "Below are three common sense statements."
    context = [text, text]
    endings = [input1, input2]

    # initialize response data format
    data = {
        "s1": {
            "input": input1,
            "output": {},
        },
        "s2": {
            "input": input2,
            "output": {},
        },
    }

    # check for the "lie" statement
    for system_id, system in SYSTEMS.items():
        lie = {"key": "", "score": 99999}
        output = get_system_output(system, context, endings)
        for key, value in output.items():
            data[key]["output"][system_id] = {**value}
            if value["score"] < lie["score"]:
                lie = {"key": key, "score": value['score']}
        data[lie["key"]]["output"][system_id]["lie"] = True

    # Get a timestamp
    ts = datetime.now().isoformat()

    # store trial data in the mongo db
    new_entry = mongo.db.trials.insert_one({'ts': ts, **data})
    object_id = new_entry.inserted_id

    # send a slack message
    try:
        send_slack_message(data, object_id)
    except Exception as e:
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
