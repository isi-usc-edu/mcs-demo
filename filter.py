#!/usr/bin/env python
import json
import csv

INCLUDED_HITS = [
    '3CESM1J3FLMTK3L3IBUJTFO9Z2CW6F',
    '39HYCOOPLR4W0064OWWAQNWAINTMDG',
    '31KSVEGZ47BM6MJNAZXH4AF5VQVRWF',
    '3K8CQCU3LHK1RORVHSG0VQAVUT7WNX',
    '3MXX6RQ9FYOPL7KON1N94NWZAF9P40',
    '3GL25Y6856DAY6BLFWXMKUZ2Y53MXG',
    '3IYI9285XVJWU0U5L3O7QPMBTUFJC4',
    '3XEIP58NM36FXJTFG2KSH20O615ZLK',
]


def read_json(filename):
    trials = json.load(open(filename))
    return trials


def filter(trials):
    trials = [t for t in trials if t['hit_id']]
    trials = [t for t in trials if 'evaluation' in t]
    trials = [t for t in trials if t['hit_id'] in INCLUDED_HITS]
    trials = [t for t in trials if len(t['s1']['input'].split()) > 1]
    trials = [t for t in trials if len(t['s2']['input'].split()) > 1]
    return trials


def write_csv(trials, filename):
    f = open(filename, 'w')
    writer = csv.writer(f)

    writer.writerow([
        'created_at',
        'updated_at',
        'worker_id',
        'hit_id',
        'scenario',
        'input_1',
        'input_1_votes',
        'input_1_output',
        'input_1_roberta_score',
        'input_1_roberta_prob',
        'input_1_roberta_vote',
        'input_1_bert_score',
        'input_1_bert_prob',
        'input_1_bert_vote',
        'input_1_xlnet_score',
        'input_1_xlnet_prob',
        'input_1_xlnet_vote',
        'input_2',
        'input_2_votes',
        'input_2_output',
        'input_2_roberta_score',
        'input_2_roberta_prob',
        'input_2_roberta_vote',
        'input_2_bert_score',
        'input_2_bert_prob',
        'input_2_bert_vote',
        'input_2_xlnet_score',
        'input_2_xlnet_prob',
        'input_2_xlnet_vote',
        'user_evaluation',
    ])

    for t in trials:
        writer.writerow([
            t['ts'],
            t['updated_at'],
            t['worker_id'],
            t['hit_id'],
            t['scenario'],
            t['s1']['input'],
            t['s1']['votes'],
            t['s1']['output'],
            t['s1']['scores']['roberta']['score'],
            t['s1']['scores']['roberta']['prob'],
            t['s1']['scores']['roberta']['vote'],
            t['s1']['scores']['bert']['score'],
            t['s1']['scores']['bert']['prob'],
            t['s1']['scores']['bert']['vote'],
            t['s1']['scores']['xlnet']['score'],
            t['s1']['scores']['xlnet']['prob'],
            t['s1']['scores']['xlnet']['vote'],
            t['s2']['input'],
            t['s2']['votes'],
            t['s2']['output'],
            t['s2']['scores']['roberta']['score'],
            t['s2']['scores']['roberta']['prob'],
            t['s2']['scores']['roberta']['vote'],
            t['s2']['scores']['bert']['score'],
            t['s2']['scores']['bert']['prob'],
            t['s2']['scores']['bert']['vote'],
            t['s2']['scores']['xlnet']['score'],
            t['s2']['scores']['xlnet']['prob'],
            t['s2']['scores']['xlnet']['vote'],
            int(bool(t['evaluation'] == 'correct')),
        ])
    f.close()


def calc_accuracy(trials):
    summary = {
        's0': {'total': 0, 'roberta': 0, 'bert': 0, 'xlnet': 0},
        's1': {'total': 0, 'roberta': 0, 'bert': 0, 'xlnet': 0},
        's2': {'total': 0, 'roberta': 0, 'bert': 0, 'xlnet': 0},
        's3': {'total': 0, 'roberta': 0, 'bert': 0, 'xlnet': 0},
        's4': {'total': 0, 'roberta': 0, 'bert': 0, 'xlnet': 0},
        's5': {'total': 0, 'roberta': 0, 'bert': 0, 'xlnet': 0}
    }
    for t in trials:
        summary[t['scenario']]['total'] += 1
        if t['evaluation'] == 'correct':
            if t['s1']['output']:
                summary[t['scenario']]['roberta'] += t['s1']['scores']['roberta']['vote']
                summary[t['scenario']]['bert'] += t['s1']['scores']['bert']['vote']
                summary[t['scenario']]['xlnet'] += t['s1']['scores']['xlnet']['vote']
            if not t['s1']['output']:
                summary[t['scenario']]['roberta'] += int(t['s1']['scores']['roberta']['vote'] == 0)
                summary[t['scenario']]['bert'] += int(t['s1']['scores']['bert']['vote'] == 0)
                summary[t['scenario']]['xlnet'] += int(t['s1']['scores']['xlnet']['vote'] == 0)
        if t['evaluation'] == 'incorrect':
            if t['s1']['output']:
                summary[t['scenario']]['roberta'] += int(t['s1']['scores']['roberta']['vote'] == 0)
                summary[t['scenario']]['bert'] += int(t['s1']['scores']['bert']['vote'] == 0)
                summary[t['scenario']]['xlnet'] += int(t['s1']['scores']['xlnet']['vote'] == 0)
            if not t['s1']['output']:
                summary[t['scenario']]['roberta'] += t['s1']['scores']['roberta']['vote']
                summary[t['scenario']]['bert'] += t['s1']['scores']['bert']['vote']
                summary[t['scenario']]['xlnet'] += t['s1']['scores']['xlnet']['vote']

    for scenario, data in summary.items():
        summary[scenario]['roberta_accuracy'] = data['roberta'] / float(data['total'])
        summary[scenario]['bert_accuracy'] = data['bert'] / float(data['total'])
        summary[scenario]['xlnet_accuracy'] = data['xlnet'] / float(data['total'])

    return summary


if __name__ == '__main__':
    trials = read_json('./trials.json')
    trials = filter(trials)
    write_csv(trials, 'trials.csv')

    accuracy = calc_accuracy(trials)
    print(json.dumps(accuracy, indent=4))
