var data = echarts.dataTool.prepareBoxplotData([
    [6,7,7,10,10,8,8,7,6,10,8,10,5,8,8,5,10,4,9,10,8,10,10,10,7,9,7,10,4,9,9,8,10,7,8,8,8,8,10,9,9,8,8,7,10,10,9,10,10,10,9,10,9,10,10,9,5,8,8,10,10,10,5,6,9,8,5,10,5,8,10,6,10,9,6,10,10,10,5,6,8,10,10,9,8,7,8,2,4,2,7,9,6,7,1,3,10,10,8,9,10,8,7,3,4,5,8,10,10,10,5,9,10,7,10,6,9,8,8,4,10,10,8,9,8,8,7,10,6,10,10,4,9,6,7,10,8,10,10,6,10,10,10,10,8,10,10,10,1,10,1,5,10,8,7,10,10,10,3,8,10,9,9,10,10,9,7,8,10,10,7,10,10,9,10,3,10,10,9,9,9,10,9,9,10,9,9,9,9,10,5,8,5,7,7,5,5,10,6,1,10,1,10,9,8,9,5,10],
    [8,10,7,10,10,4,10,7,6,10,3,10,4,9,3,9,10,7,10,10,9,10,10,10,8,10,10,10,8,9,9,9,10,8,10,8,10,9,10,10,10,10,8,4,10,10,10,10,10,10,8,10,10,10,9,9,5,8,10,10,10,10,8,6,8,8,10,10,8,8,10,5,10,10,8,10,10,10,7,4,8,10,10,9,9,9,9,2,6,9,7,9,3,5,1,4,10,10,8,9,10,7,6,3,3,8,8,10,10,10,7,9,10,10,8,7,7,7,5,6,10,8,10,10,9,8,8,10,5,10,10,7,8,6,8,10,10,10,10,7,10,10,10,10,10,10,10,10,8,10,10,10,10,10,10,9,10,10,7,10,10,10,10,10,10,10,9,10,10,10,10,10,10,8,10,5,10,10,9,9,9,10,9,9,10,9,9,9,9,10,5,8,10,7,7,5,5,10,10,1,10,1,10,10,8,10,10,10],
]);

option = {
    title: [
        {
            text: 'User Engagement Survey',
            left: 'center',
        },
        // {
        //     text: 'upper: Q3 + 1.5 * IQR \nlower: Q1 - 1.5 * IQR',
        //     borderColor: '#ccc',
        //     borderWidth: 1,
        //     textStyle: {
        //         fontSize: 14
        //     },
        //     right: '10%',
        //     top: '0%'
        // }
    ],
    tooltip: {
        trigger: 'item',
        axisPointer: {
            type: 'shadow'
        }
    },
    grid: [
        {bottom: '55%'},
        {top: '25%'},
        {left: '35%'},
        {right: '25%'},
    ],
    backgroundColor: 'white',
    textStyle: {fontSize:14},
    xAxis: {
        type: 'category',
        data: data.axisData,
        boundaryGap: true,
        nameGap: 30,
        splitArea: {
            show: false
        },
        axisLabel: {
            formatter: 'engagement {value == 0 ? "engagement" : "asdfasdf"}'
        },
        splitLine: {
            show: false
        },
        nameLocation: 'middle',
        nameTextStyle: {
            fontSize: 16,
            padding: 10,
        },
        axisLabel: {
            formatter: (val) => {return  val == 0 ? 'enjoyment': 'returning'},
            textStyle: {fontSize: 16},
        },
    },
    yAxis: {
        type: 'value',
        name: 'User Rating',
        nameLocation: 'middle',
        splitArea: {
            show: true
        },
        nameTextStyle: {
            fontSize: 16,
            padding: 10,
        },
        axisLabel: {
            formatter: '{value}',
            textStyle: {fontSize: 16},
        },
    },
    series: [
        {
            name: 'boxplot',
            type: 'boxplot',
            data: data.boxData,
            itemStyle: {
    		    color: '#19E565',
                borderColor: '#333'
            },
            tooltip: {
                formatter: function (param) {
                    return [
                        'Experiment ' + param.name + ': ',
                        'upper: ' + param.data[5],
                        'Q3: ' + param.data[4],
                        'median: ' + param.data[3],
                        'Q1: ' + param.data[2],
                        'lower: ' + param.data[1]
                    ].join('<br/>');
                }
            }
        },
        {
            name: 'outlier',
            type: 'scatter',
            data: data.outliers,
            itemStyle: {
    		    color: '#19E565',
                borderColor: '#333'
            },
        }
    ]
};
