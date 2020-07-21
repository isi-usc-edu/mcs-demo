#!/usr/bin/env python3
from flask import (
    Flask,
    jsonify,
    request,
)
import uuid
import time
import requests
from bson import ObjectId
from threading import Thread
from flask import session
from flask_pymongo import PyMongo
from flask_session import Session
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
app.secret_key = os.environ.get('APP_SECRET', '')

# Add mongo db settings for logging
MONGO_URI = os.environ.get('MONGO_URI', 'mongodb://0.0.0.0:27017/mcs')
app.config["MONGO_URI"] = MONGO_URI
mongo = PyMongo(app)

# Initialize the flask session
SESSION_TYPE = 'mongodb'
SESSION_MONGODB = mongo.cx
SESSION_MONGODB_DB = 'mcs'
SESSION_MONGODB_COLLECT = 'sessions'
SESSION_USE_SIGNER = True
app.config.from_object(__name__)
Session(app)

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

    if not data:
        blocks.append({
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "Err.. can't find this record in our database :("
            },
        })
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

    for index, d in enumerate([data['s1'], data['s2']]):
        label = 'TRUE ✔️' if d['output'] else 'FALSE! ❌'
        blocks.append({
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "{}. *{}* - {}".format(index + 1, d['input'], label),
            },
        })
        system_output = ""
        for system_id, system in SYSTEMS.items():
            model_name = system.get('model_name')
            probability = round(float(d['scores'][model_name].get('prob', 0)), 2)
            score = round(float(d['scores'][model_name].get('score', 0)), 2)
            system_output += "{} ({}): {}% (score: {})\n".format(
                system_id.replace('_', ' ').capitalize(),
                model_name,
                probability,
                score,
            )
        blocks.append({
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": system_output,
            }
        })
        blocks.append({"type": "divider"})

    summary = "*Majority vote:*\n"
    for index, d in enumerate([data['s1'], data['s2']]):
        if d['output']:
            label = 'TRUE ✔️' if d['output'] else 'FALSE! ❌'
            summary += "  ---> {}. {} - {}\n{} out of {} system votes\n".format(
                index + 1,
                d['input'],
                label,
                d['votes'],
                len(SYSTEMS),
            )
    summary += "\n*User evaluation: {}*\n".format(data.get('evaluation', 'none'))
    blocks.append({
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": summary,
        }
    })

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


def send_slack_message(data):
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
            "value": data['id'],
        }
    }, {
        "type": "section",
        "text": {
        "type": "mrkdwn",
        "text": "1. {} \n 2. {}".format(
            data['s1']['input'],
            data['s2']['input'],
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


@app.route('/classify', methods=['POST'])
def classify():
    input1 = request.json.get('s1')
    input2 = request.json.get('s2')

    # create model format data
    text = "Below are two common sense statements."
    context = [text, text]
    endings = [input1, input2]

    # initialize response data format
    data = {
        "s1": {
            "input": input1,
            "output": False,
            "scores": {},
        },
        "s2": {
            "input": input2,
            "output": False,
            "scores": {},
        },
    }

    # check for the false statement
    for system_id, system in SYSTEMS.items():
        model_name = system.get('model_name')
        system_output = get_system_output(system, context, endings)
        for key, value in system_output.items():
            data[key]["scores"][model_name] = {**value}

    # compare system output, collect votes
    for system_id, system in SYSTEMS.items():
        model_name = system.get('model_name')
        s1_prob = data['s1']['scores'][model_name]['prob']
        s2_prob = data['s2']['scores'][model_name]['prob']
        data['s1']['scores'][model_name]['vote'] = int(s1_prob > s2_prob)
        data['s2']['scores'][model_name]['vote'] = int(s2_prob > s1_prob)

    # count the votes
    for key in data.keys():
        data[key]['votes'] = sum([
            system['vote']
            for model_name, system
            in data[key]['scores'].items()
        ])

    # check which statement is the correct one
    data['s1']['output'] = bool(data['s1']['votes'] > data['s2']['votes'])
    data['s2']['output'] = bool(data['s1']['votes'] < data['s2']['votes'])

    # Get a new timestamp and session id
    ts = datetime.now().isoformat()
    uid = session.get('uid')

    # store trial data in the mongo db
    new_entry = mongo.db.trials.insert_one({
        **data,
        'ts': ts,
        'session': uid,
        'hit_id': session.get('hit_id', ''),
        'worker_id': session.get('worker_id', ''),
        'scenario': session.get('scenario', ''),
    })
    data['id'] = str(new_entry.inserted_id)

    # send a slack message
    try:
        send_slack_message(data)
    except Exception as e:
        print('SlackError: {}'.format(e.__str__()))

    # Return json output
    return jsonify(data)


@app.route('/survey', methods=['POST'])
def survey():
    # Get a new timestamp and session id
    ts = datetime.now().isoformat()
    worker_id = session.get('worker_id')
    hit_id = session.get('hit_id')
    uid = session.get('uid')

    # Get survey values from the request body
    enjoyment = request.json.get('enjoyment', None)
    returning = request.json.get('returning', None)

    # store trial data in the mongo db
    updated = mongo.db.survey.update_one(
        {'hit_id': hit_id, 'worker_id': worker_id},
        {'$set': {
            'ts': ts,
            'session': uid,
            'hit_id': hit_id,
            'worker_id': worker_id,
            'enjoyment': enjoyment,
            'returning': returning,
        }}, upsert=True
    )
    return jsonify({'enjoyment': enjoyment, 'returning': returning})


@app.route('/evaluate', methods=['POST'])
def evaluate():
    # Get a new timestamp and session id
    ts = datetime.now().isoformat()
    worker_id = session.get('worker_id')
    hit_id = session.get('hit_id')
    uid = session.get('uid')

    code = ''
    num_trials = 0
    if hit_id:
        num_trials = mongo.db.trials.find({
            'worker_id': worker_id,
            'hit_id': hit_id,
        }).count()
        num_trials = num_trials - 1
        if num_trials >= 5:
            code = str(uuid.uuid4())

    data_id = request.json.get('dataID')
    evaluation = request.json.get('evaluation')

    try:
        updated = mongo.db.trials.update_one(
            {'_id': ObjectId(data_id), 'session': uid},
            {'$set': {
                'evaluation': evaluation,
                'updated_at': ts,
                'code': code,
            }}
        )
    except Exception as e:
        print('Error: {}'.format(str(e)))
        return jsonify({'status': 'not ok'})

    return jsonify({'status': 'ok', 'count': num_trials, 'code': code})


@app.route('/get_eval', methods=['GET'])
def get_eval():
    scenario = request.args.get('scenario')
    scenario = scenario if scenario != 'null' else None

    uid = session.get('uid')
    hit_id = session.get('hit_id')
    worker_id = session.get('worker_id')

    data = mongo.db.trials.find_one({
        "$and": [
            {'evalQ1': None},
            {'evalQ2': None},
            {'evalQ3': None},
            {'scenario': scenario},
            {'session': {
                "$ne": uid,
            }},
            {"$or": [{
                'hit_id': None,
            }, {
                'hit_id': {
                    "$ne": hit_id,
                },
            }]},
            {"$or": [{
                'worker_id': None,
            }, {
                'worker_id': {
                    "$ne": worker_id,
                }
            }]},
        ]
    }, sort=[('ts', -1)])
    if data:
        return jsonify({
            'status': 'ok',
            'id': str(data['_id']),
            's1': data['s1'],
            's2': data['s2'],
        })
    return jsonify({'status': 'not ok'})


@app.route('/set_eval',methods=['POST'])
def set_eval():
    data_id = request.json.get('dataID')
    question = request.json.get('question')
    answer = request.json.get('answer')

    updated = {}
    updated[question] = answer # {'evalQ1': 'yes'}

    obj = mongo.db.trials.update_one(
        {"_id": ObjectId(data_id)},
        {'$set': {**updated}}
    )

    return jsonify({'status': 'ok'})


@app.route('/')
def index():
    ts = datetime.now().isoformat()
    uid = uuid.uuid4()
    session['ts'] = ts
    session['uid'] = uid
    session['hit_id'] = request.args.get('hit_id')
    session['worker_id'] = request.args.get('worker_id')
    session['scenario'] = request.args.get('scenario')
    return app.send_static_file('index.html')


if __name__ == "__main__":
    for system in SYSTEMS.values():
        load_models(system)

    host = os.environ.get('MCS_SERVER_HOST', '0.0.0.0')
    port = int(os.environ.get('MCS_SERVER_PORT', '5005'))

    app.run(host=host, port=port, debug=False)
