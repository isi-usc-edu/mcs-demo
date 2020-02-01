option = {
    title: {
        text: 'Model Accuracy By Scenario',
        left: 'start',
    },
    legend: {textStyle: {fontSize: 35}},
    tooltip: {textStyle: {fontSize: 25}},
    backgroundColor: 'white',
    textStyle: {fontSize: 25},
    dataset: {
        source: [
            ['product', 'RoBERTa', 'BERT', 'XLNet'],
            ['s0', 0.87, 0.87, 0.85],
            ['s1 ', 0.79, 0.75, 0.70],
            ['s2', 0.90, 0.89, 0.77],
            ['s3', 0.85, 0.84, 0.83],
            ['s4', 0.88, 0.80, 0.81],
            ['s5', 0.86, 0.82, 0.82],
        ],
    },
    grid: [
        {bottom: '55%'},
        {top: '55%'}
    ],
    xAxis: {
        type: 'category',
        name: 'Scenario',
        nameLocation: 'middle',
        nameTextStyle: {
            fontSize: 35,
            padding: 20,
        },
        axisLabel: {
            formatter: '{value}',
            textStyle: {
                fontSize: 30,
                padding: 0,
            },
        },
    },
    yAxis: {
        name: 'Model accuracy',
        position: 'left',
        nameLocation: 'middle',
        min: 0.4,
        max: 1.,
        nameTextStyle: {
            fontSize: 35,
            padding: 40,
        },
        axisLabel: {
            formatter: '{value}',
            textStyle: {
                fontSize: 28,
            },
        },
    },
    // Declare several bar series, each will be mapped
    // to a column of dataset.source by default.
    series: [
        {
            type: 'bar',
            label: {
                show: true,
                position: 'top',
                textStyle: {fontSize:20},
            },
            barGap: 0,
            color: 'rgb(255, 69,  0)',
        },
        {
            type: 'bar',
            label: {
                show: true,
                position: 'top',
                textStyle: {fontSize:20},
            },
            barGap: 0,
            color: 'rgb(31,  191, 255)',
        },
        {
            type: 'bar',
            label: {
                show: true,
                position: 'top',
                textStyle: {fontSize:20},
            },
            barGap: 0,
            color: 'rgb(163, 0,   245)',
            // color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            //     offset: 0,
            //     color: 'rgb(255, 158, 68)'
            // }, {
            //     offset: 1,
            //     color: 'rgb(255, 70, 131)'
            // }])
        }
    ]
};

