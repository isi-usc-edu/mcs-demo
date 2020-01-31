option = {
    title: {
        text: '',
    },
    legend: {textStyle: {fontSize:14}},
    tooltip: {textStyle: {fontSize:14}},
    backgroundColor: 'white',
    textStyle: {fontSize:14},
    dataset: {
        source: [
            ['product', 'roberta', 'bert', 'xlnet'],
            ['general', 0.87, 0.87, 0.85],
            ['double negation ', 0.79, 0.75, 0.70],
            ['exists/all', 0.90, 0.89, 0.77],
            ['active/passive', 0.85, 0.84, 0.83],
            ['temporal event', 0.88, 0.80, 0.81],
            ['cultural', 0.86, 0.82, 0.82],
        ],
    },
    grid: [
        {bottom: '55%'},
        {top: '55%'}
    ],
    xAxis: {
        type: 'category',
        name: 'Scenario',
        // fontSize:  '50em',
        nameLocation: 'middle',
        nameTextStyle: {
            fontSize: 14,
            padding: 10,
        },
        axisLabel: {
            formatter: '{value}',
            textStyle: {fontSize: 13},
        },
    },
    yAxis: {
        name: 'Model accuracy',
        position: 'left',
        nameLocation: 'middle',
        nameTextStyle: {
            fontSize: 14,
            padding: 20,
        },
        axisLabel: {
            formatter: '{value}',
            textStyle: {fontSize: 14},
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
                textStyle: {fontSize:14},
            },
            fontSize: 14,
            barGap: 0,
            color: 'rgb(255, 69,  0)',
        },
        {
            type: 'bar',
            label: {
                show: true,
                position: 'top',
                textStyle: {fontSize:14},
            },
            barGap: 0,
            color: 'rgb(31,  191, 255)',
        },
        {
            type: 'bar',
            label: {
                show: true,
                position: 'top',
                textStyle: {fontSize:14},
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

