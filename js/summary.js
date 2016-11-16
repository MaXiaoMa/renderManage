$(function () {
    var title = "渲染信息监控<small class='glyphicon'>"+env+"</small>"
    $("#title").html(title);
    //每日渲染数量，图表参数
    var options = {
        chart: {
            type: 'line',
            shadow: true,
            backgroundColor: {
                linearGradient: {x1: 0, y1: 0, x2: 1, y2: 1},
                stops: [
                    [0, '#2a2a2b'],
                    [1, '#3e3e40']
                ]
            },
            style: {
                fontFamily: "'Unica One', sans-serif"
            },
            plotBorderColor: '#606063'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0,
            itemStyle: {
                color: '#E0E0E3'
            },
            itemHoverStyle: {
                color: '#FFF'
            },
            itemHiddenStyle: {
                color: '#606063'
            }
        },
        title: {
            style: {color: '#E0E0E3'},
            text: '统计信息',
            x: -20
        },
        subtitle: {
            style: {color: '#E0E0E3'},
            text: '极渲染',
            x: -20
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            style: {
                color: '#F0F0F0'
            },
            pointFormat: '{series.name}: <b>{point.y}</b>'

        },
        credits: {
            enabled: false,
        },
        xAxis: {
            gridLineColor: '#707073',
            labels: {
                style: {
                    color: '#E0E0E3'
                }
            },
            lineColor: '#707073',
            minorGridLineColor: '#505053',
            tickColor: '#707073',
            title: {
                style: {color: '#A0A0A3'},
                text: '日期'
            },
            categories: []
        },
        yAxis: {
            tickInterval: 5,
            gridLineColor: '#707073',
            labels: {
                style: {
                    color: '#E0E0E3'
                }
            },
            lineColor: '#707073',
            minorGridLineColor: '#505053',
            tickColor: '#707073',
            tickWidth: 1,
            title: {
                style: {color: '#A0A0A3'},
                text: '任务数量'
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true,
                    color: '#eeeeee'
                },
                enableMouseTracking: true
            }
        },
        series: [{"name":"任务数","color":"red","data":[]},
            {"name":"平均等待时间","color":"green","data":[]},
            {"name":"金额","color":"orange","data":[]}]

    };
    //每日平均渲染时间，图表参数
   /* var options1 = {
        chart: {
            type: 'line',
            shadow: true,
            backgroundColor: {
                linearGradient: {x1: 0, y1: 0, x2: 1, y2: 1},
                stops: [
                    [0, '#2a2a2b'],
                    [1, '#3e3e40']
                ]
            },
            style: {
                fontFamily: "'Unica One', sans-serif"
            },
            plotBorderColor: '#606063'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0,
            itemStyle: {
                color: '#E0E0E3'
            },
            itemHoverStyle: {
                color: '#FFF'
            },
            itemHiddenStyle: {
                color: '#606063'
            }
        },
        title: {
            style: {color: '#E0E0E3'},
            text: '每日平均等待时间',
            x: -20
        },
        subtitle: {
            style: {color: '#E0E0E3'},
            text: 'XSrender',
            x: -20
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            style: {
                color: '#F0F0F0'
            },
            pointFormat: '{series.name}: <b>{point.y}</b>'

        },
        credits: {
            enabled: false,
        },
        xAxis: {
            gridLineColor: '#707073',
            labels: {
                style: {
                    color: '#E0E0E3'
                }
            },
            lineColor: '#707073',
            minorGridLineColor: '#505053',
            tickColor: '#707073',
            title: {
                style: {color: '#A0A0A3'},
                text: '日期'
            },
            categories: []
        },
        yAxis: {
            //tickInterval: 0.5,
            gridLineColor: '#707073',
            labels: {
                style: {
                    color: '#E0E0E3'
                }
            },
            lineColor: '#707073',
            minorGridLineColor: '#505053',
            tickColor: '#707073',
            tickWidth: 1,
            title: {
                style: {color: '#A0A0A3'},
                text: '时间（分钟）'
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true,
                    color: '#eeeeee'
                },
                enableMouseTracking: true
            }
        },
        series: [{
            name: '平均时间',
            color:'green',
            data: [0, 0, 0]
        }]

    };*/
    //每日金额，图表参数
    /*var options2 = {
        chart: {
            type: 'line',
            shadow: true,
            backgroundColor: {
                linearGradient: {x1: 0, y1: 0, x2: 1, y2: 1},
                stops: [
                    [0, '#2a2a2b'],
                    [1, '#3e3e40']
                ]
            },
            style: {
                fontFamily: "'Unica One', sans-serif"
            },
            plotBorderColor: '#606063'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0,
            itemStyle: {
                color: '#E0E0E3'
            },
            itemHoverStyle: {
                color: '#FFF'
            },
            itemHiddenStyle: {
                color: '#606063'
            }
        },
        title: {
            style: {color: '#E0E0E3'},
            text: '每日金额',
            x: -20
        },
        subtitle: {
            style: {color: '#E0E0E3'},
            text: 'XSrender',
            x: -20
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            style: {
                color: '#F0F0F0'
            },
            pointFormat: '{series.name}: <b>{point.y}</b>'

        },
        credits: {
            enabled: false,
        },
        xAxis: {
            gridLineColor: '#707073',
            labels: {
                style: {
                    color: '#E0E0E3'
                }
            },
            lineColor: '#707073',
            minorGridLineColor: '#505053',
            tickColor: '#707073',
            title: {
                style: {color: '#A0A0A3'},
                text: '日期'
            },
            categories: []
        },
        yAxis: {
            //tickInterval: 0.5,
            gridLineColor: '#707073',
            labels: {
                style: {
                    color: '#E0E0E3'
                }
            },
            lineColor: '#707073',
            minorGridLineColor: '#505053',
            tickColor: '#707073',
            tickWidth: 1,
            title: {
                style: {color: '#A0A0A3'},
                text: '金额（元）'
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true,
                    color: '#eeeeee'
                },
                enableMouseTracking: true
            }
        },
        series: [{
            name: '金额',
            color:'orange',
            data: [0, 0, 0]
        }]

    };*/
//生成默认图表,每日渲染数量和每日平均渲染时间
    $('#time_number').highcharts(options);
    //$('#time_avg').highcharts(options1)
    //$('#time_price').highcharts(options2)
//加载数据
    var start = getDate(-6);
    var end = getDate(1);
    var requestdata = {start: start, end: end, select: 0};
    var id = '#time_number';
    loadfile(summaryurl, requestdata, fillchart, id);
//获取日期范围
    var select = $('#calendar').find('select').val();
    $('#calendar').find('select').change(function () {
        var select = $('#calendar').find('select').val();
        if (selectlist[select] == 0) {
            var requestdata = {start: getDate(-6), end: getDate(1), select: selectlist[select]};
        } else if (selectlist[select] == 1) {
            var requestdata = {start: getDate(-180), end: getDate(1), select: selectlist[select]};
        } else if (selectlist[select] == 2) {
            var requestdata = {start: getDate(-1825), end: getDate(1), select: selectlist[select]};
        }
        var id = '#time_number';
        loadfile(summaryurl, requestdata, fillchart, id);
    });
    $('#search').on('click', function () {
        var select = $('#calendar').find('select').val();
        var start = $('#calendar').find('#startvalue').val();
        var end = $('#calendar').find('#endvalue').val();
        end = addOneDay(end);

        if (start && end) {
            if (start < end) {
                if (new Date(end) <= new Date(getDate(1))) {
                    var requestdata = {start: start, end: end, select: selectlist[select]};
                    var id = '#time_number';
                    loadfile(summaryurl, requestdata, fillchart, id);
                } else {
                    alert('暂时不能查询未来的数据！')
                }

            } else {
                alert('开始时间不能大于结束时间！')
            }
        } else {
            alert('开始时间和结束时间都需要指定！')
        }
    })

//当样式改变时，重新生成图表
    $('#chartstyle').change(function () {
        var type = $('#chartstyle').val();
        if (typelist[type] == "pie") {
            options.tooltip.pointFormat = '{series.name}: <b>{point.percentage:.1f}%</b>';
           // options1.tooltip.pointFormat = '{series.name}: <b>{point.percentage:.1f}%</b>';
        } else {
            options.tooltip.pointFormat = '{series.name}: <b>{point.y}</b>';
            //options1.tooltip.pointFormat = '{series.name}: <b>{point.y}</b>';
        }
        options.chart.type = typelist[type];
       // options1.chart.type = typelist[type];
        $('#time_number').highcharts(options);
        //$('#time_avg').highcharts(options1);
        //$('#time_avg').highcharts(options2);
    });



})
function getDate(count) {
    var dd = new Date();
    dd.setDate(dd.getDate() + count);
    var y = dd.getFullYear();
    var m = zfill(dd.getMonth() + 1,2);
    var d = zfill(dd.getDate(),2);
    return y + "-" + m + "-" + d;
};
function addOneDay(date) {
    var dd = new Date(date);
    dd.setDate(dd.getDate() + 1);
    var y = dd.getFullYear();
    var m = zfill(dd.getMonth() + 1,2);
    var d = zfill(dd.getDate(),2);
    return y + "-" + m + "-" + d;
}
//日期格式化，如果为个位，则前面加0
function zfill(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length-size);
}