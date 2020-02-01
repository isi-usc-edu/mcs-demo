option = {
    title: {
        text: 'User Participation and Model Performance',
        left: 'left',
    },
    legend: {textStyle: {fontSize:25}},
    tooltip: {textStyle: {fontSize:25}},
    backgroundColor: 'white',
    textStyle: {fontSize:25},
    dataset: {
        source: [
            ['product', 'ensemble', 'participants'],
            ['s0', 0.87, 182],
            ['s1', 0.84, 147],
            ['s2', 0.83, 132],
            ['s3', 0.85, 129],
            ['s4', 0.89, 124],
            ['s5', 0.9, 119],
            ['s6', 0.98, 52],
            ['s7', 0.92, 37],
            ['s8', 0.94, 31],
            ['s9', 0.93, 27],
            ['s10', 0.96, 25],
            ['s11', 0.9, 20],
            ['s12', 0.88, 16],
            ['s13', 1.0, 15],
            ['s14', 0.93, 14],
            ['s15', 0.86, 14],
//            ['s16', 0.75, 8],
//            ['s17', 1.0, 4],
        ]
    },
    grid: [
        {bottom: '55%'},
        {top: '55%'}
    ],
    xAxis: {
        type: 'category',
        name: 'Statements (ordered)',
        nameLocation: 'middle',
        nameTextStyle: {
            fontSize: 25,
            padding: 25,
        },
        axisLabel: {
            formatter: '{value}',
            textStyle: {
                fontSize: 25,
                padding: 0,
            },
        },
    },
    yAxis: [{
        name: 'Model accuracy',
        position: 'left',
        nameLocation: 'middle',
        min: 0.5,
        max: 1.,
        nameTextStyle: {
            fontSize: 25,
            padding: 40,
        },
        axisLabel: {
            formatter: '{value}',
            textStyle: {fontSize: 25},
        },
    },{
        name: 'Number of Participants',
        position: 'right',
        nameLocation: 'middle',
        min: 0,
        max: 200,
        nameTextStyle: {
            fontSize: 25,
            padding: 45,
        },
        axisLabel: {
            formatter: '{value}',
            textStyle: {fontSize: 25},
        },
    }],
    series: [
        {
            type: 'line',
            yAxisIndex: 0,
            label: {
                show: true,
                position: 'top'
            },
            color: 'rgb(255, 135, 92)',
        }, {
            type: 'line',
            yAxisIndex: 1,
            label: {
                show: true,
                position: 'top'
            },
            color: 'rgb(163, 0,   245)',
        }
    ]
};

