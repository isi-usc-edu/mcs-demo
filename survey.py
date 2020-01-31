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

HIT_MAPPING = {
    '3CESM1J3FLMTK3L3IBUJTFO9Z2CW6F': 's0',
    '39HYCOOPLR4W0064OWWAQNWAINTMDG': 's1',
    '31KSVEGZ47BM6MJNAZXH4AF5VQVRWF': 's1',
    '3K8CQCU3LHK1RORVHSG0VQAVUT7WNX': 's2',
    '3MXX6RQ9FYOPL7KON1N94NWZAF9P40': 's2',
    '3GL25Y6856DAY6BLFWXMKUZ2Y53MXG': 's3',
    '3IYI9285XVJWU0U5L3O7QPMBTUFJC4': 's4',
    '3XEIP58NM36FXJTFG2KSH20O615ZLK': 's5',
}


def read_json(filename):
    trials = json.load(open(filename))
    return trials


def filter_responses(responses):
    return [r for r in responses if r['hit_id'] in INCLUDED_HITS]

def map_scenarios(responses):
    for response in responses:
        response['scenario'] = HIT_MAPPING[response['hit_id']]
    return responses


def write_csv(responses, filename):
    f = open(filename, 'w')
    writer = csv.writer(f)

    writer.writerow([
        'created_at',
        'hit_id',
        'worker_id',
        'scenario',
        'enjoyment',
        'returning',
    ])

    for response in responses:
        writer.writerow([
            response['ts'],
            response['hit_id'],
            response['worker_id'],
            response['scenario'],
            response['enjoyment'],
            response['returning'],
        ])
    f.close()


if __name__ == '__main__':
    survey_responses = read_json('./survey_responses.json')
    survey_responses = filter_responses(survey_responses)
    survey_responses = map_scenarios(survey_responses)
    write_csv(survey_responses, 'survey_responses.csv')
