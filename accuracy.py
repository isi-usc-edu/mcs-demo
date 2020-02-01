#!/usr/bin/env python
from dateutil import parser
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


def filter_trials(trials):
    trials = [t for t in trials if t['hit_id']]
    trials = [t for t in trials if 'evaluation' in t]
    trials = [t for t in trials if t['hit_id'] in INCLUDED_HITS]
    trials = [t for t in trials if len(t['s1']['input'].split()) > 1]
    trials = [t for t in trials if len(t['s2']['input'].split()) > 1]
    return trials


def filter_hits(trials):
    hits = {}
    for trial in trials:
        key = '{}:{}'.format(trial['hit_id'], trial['worker_id'])
        hits[key] = []
    return hits


def map_trials_to_hits(trials, hits):
    for key in hits.keys():
        hit_id = key.split(':')[0]
        worker_id = key.split(':')[1]
        hit_trials = [
            trial
            for trial
            in trials
            if trial['hit_id'] == hit_id
            and trial['worker_id'] == worker_id
        ]
        hits[key] = sorted(
            hit_trials,
            key=lambda x: parser.parse(x['ts'])
        )
    return hits

def aggregate(hits):
    aggr = [{
        'name': 's{}'.format(i),
        'total': 0,
        'correct': 0,
    } for i in range(19)]
    for key, hit in hits.items():
        for index, trial in enumerate(hit):
            aggr[index]['total'] += 1
            try:
                aggr[index]['correct'] += int(trial['evaluation'] == 'correct')
            except KeyError:
                import pdb; pdb.set_trace()
    for agg in aggr:
        agg['accuracy'] = agg['correct'] / float(agg['total'])
    return aggr


def write_csv(responses, filename):
    f = open(filename, 'w')
    writer = csv.writer(f)

    writer.writerow([
    ])

    for response in responses:
        writer.writerow([
        ])
    f.close()


if __name__ == '__main__':
    trials = read_json('./trials.json')
    trials = filter_trials(trials)
    hits = filter_hits(trials)
    hits = map_trials_to_hits(trials, hits)
    aggr = aggregate(hits)
    for agg in aggr:
        print([agg['name'], round(agg['accuracy'], 2), agg['total']])

    #write_csv(model_accuracy, 'model_accuracy.csv')
