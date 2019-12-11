const chartLg = 20;

let networkSpeedOption = {
    title: {
        text: '',
        textStyle: {
            color: "#ff0",
            fontSize: 12
        }
    },
    tooltip: {},
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: (function () {
            var now = new Date();
            var res = [];
            var len = chartLg;
            while (len--) {
                res.unshift(now.toLocaleTimeString().replace(/^\D*/, ''));
                now = new Date(now);
            }
            return res;
        })(),
        axisLine: {
            lineStyle: {
                color: 'rgba(255, 255, 255, 1)'
            },
        }
    },
    yAxis: {
        splitLine: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: 'rgba(255, 255, 255, 1)'
            },
        }
    },
    visualMap: {
        show: false,
    },
    series: [{
        type: 'line',
        data: [],
        symbol: 'none',
        smooth: true,
        markLine: {
            silent: true,
            data: [{
                yAxis: 0.15
            }, {
                yAxis: 2
            }]
        },
        lineStyle: {
            width: 0.5,
            color: 'rgba(0, 255, 0, 0.6)',
        },
        areaStyle: {
            color: 'rgba(0, 255, 0, 0.3)'
        },
    }],

    backgroundColor: '#2c343c',
    textStyle: {
        color: 'rgba(255, 255, 255, 1)'
    },
    animation: false
}

let timeupdateOption = {
    title: {
        text: 'timeupdate触发次数: 未知 次/秒',
        textStyle: {
            color: "#ff0",
            fontSize: 12
        }
    },
    tooltip: {},
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: (function () {
            var now = new Date();
            var res = [];
            var len = chartLg;
            while (len--) {
                res.unshift(now.toLocaleTimeString().replace(/^\D*/, ''));
                now = new Date(now);
            }
            return res;
        })(),
        axisLine: {
            lineStyle: {
                color: 'rgba(255, 255, 255, 1)'
            },
        }
    },
    yAxis: {
        splitLine: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: 'rgba(255, 255, 255, 1)'
            },
        }
    },
    visualMap: {
        show: false,
    },
    series: [{
        type: 'line',
        data: [0],
        symbol: 'none',
        step: true,
        lineStyle: {
            width: 0.5,
            color: 'rgba(187, 206, 54, 0.6)',
        },
        areaStyle: {
            color: 'rgba(187, 206, 54, 0.3)'
        },
    }],

    backgroundColor: '#2c343c',
    textStyle: {
        color: 'rgba(255, 255, 255, 1)'
    },
    animation: false
}

let frameSpeedOption = {
    title: {
        text: '刷新帧率: 未知 fps',
        textStyle: {
            color: "#ff0",
            fontSize: 12
        }
    },
    tooltip: {},
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: (function () {
            var now = new Date();
            var res = [];
            var len = chartLg;
            while (len--) {
                res.unshift(now.toLocaleTimeString().replace(/^\D*/, ''));
                now = new Date(now);
            }
            return res;
        })(),
        axisLine: {
            lineStyle: {
                color: 'rgba(255, 255, 255, 1)'
            },
        }
    },
    yAxis: {
        splitLine: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: 'rgba(255, 255, 255, 1)'
            },
        }
    },
    visualMap: {
        show: false,
    },
    series: [{
        type: 'line',
        data: [0],
        symbol: 'none',
        step: true,
        markLine: {
            silent: true,
            data: [{
                yAxis: 25
            }]
        },
        lineStyle: {
            width: 0.5,
            color: 'rgba(78, 166, 253, 0.6)',
        },
        areaStyle: {
            color: 'rgba(78, 166, 253, 0.3)'
        },
    }],

    backgroundColor: '#2c343c',
    textStyle: {
        color: 'rgba(255, 255, 255, 1)'
    },
    animation: false
}

export {
    networkSpeedOption,timeupdateOption, frameSpeedOption, chartLg
}
