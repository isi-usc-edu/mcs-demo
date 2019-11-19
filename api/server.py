#!/usr/bin/env python3
from flask import (
    Flask,
    jsonify,
    request,
)
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

import logging
import random
import json

logger = logging.getLogger(__name__)


app = Flask(__name__, static_url_path='')
CORS(app)


# load trained models
def load_models(model_path='models/taska_model'):
    config_path = 'models/roberta_large'
    device = torch.device("cuda" if torch.cuda.is_available() and not False else "cpu")
    n_gpu = torch.cuda.device_count()
    logging.basicConfig(format='%(asctime)s - %(levelname)s - %(name)s -   %(message)s',
                        datefmt='%m/%d/%Y %H:%M:%S',
                        level=logging.INFO if -1 in [-1, 0] else logging.WARN)
    MODEL_CLASSES = {
        'bert': (BertConfig, BertForMultipleChoice, BertTokenizer),
        'xlnet': (XLNetConfig, XLNetForMultipleChoice, XLNetTokenizer),
        'roberta': (RobertaConfig, RobertaForMultipleChoice, RobertaTokenizer)
    }
    config_class, model_class, tokenizer_class = MODEL_CLASSES['roberta']
    config = config_class.from_pretrained(config_path)
    tokenizer = tokenizer_class.from_pretrained(config_path)
    model = model_class.from_pretrained(model_path, from_tf=bool('.ckpt' in model_path),
                                        config=config)
    model.to(device)

    return tokenizer, model, device


def select_field(features, field):
    return [
        [
            choice[field]
            for choice in features
        ]
    ]


@app.route('/classify')
def classify():
    global tokenizer, model, device

    input1 = request.args.get('s1')
    input2 = request.args.get('s2')
    input3 = request.args.get('s3')

    max_length = 48

    # create model format data
    addtext = "Belows are three commonsense statements."
    contexts = [addtext, addtext, addtext]
    endings = [input1, input2, input3]

    choices_features = []
    for ending_idx, (context, ending) in enumerate(zip(contexts, endings)):
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
    score_0, score_1, score_2 = logits[0]
    score_0, score_1, score_2 = score_0.item(), score_1.item(), score_2.item()
    score_0, score_1, score_2 = 100 * softmax([score_0, score_1, score_2])

    data = {
        "s1": {
            "system_1": {
                "input": input1,
                "score": round(score_0, 5),
                "lie": bool(min([score_0, score_1, score_2]) == score_0),
            },
        },
        "s2": {
            "system_1": {
                "input": input2,
                "score": round(score_1, 5),
                "lie": bool(min([score_0, score_1, score_2]) == score_1),
            },
        },
        "s3": {
            "system_1": {
                "input": input3,
                "score": round(score_2, 5),
                "lie": bool(min([score_0, score_1, score_2]) == score_2),
            },
        },
    }

    # Return json output
    return jsonify(data)


@app.route('/')
def index():
    return app.send_static_file('index.html')


if __name__ == "__main__":
    global tokenizer, model, device
    tokenizer, model, device = load_models('models/taska_model')

    app.run('0.0.0.0', port=5005, debug=False)
