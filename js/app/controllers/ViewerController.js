/**
 * Created by chathura on 6/1/16.
 */
function ViewerController($location, $scope, $routeParams, toastService, chartService,
                          programService, dataElementService, programIndicatorsService) {
    var ctrl = this;
    this.tei = $routeParams.tei;
    this.program = $routeParams.program;
    this.programName;

    programService.getProgramNameById(ctrl.program).then(function (name) {
        ctrl.programName = name;
        return name;
    });

    this.charts = [];

    this.loadCharts = function () {
        chartService.getAllCharts().then(function (charts) {
            ctrl.charts = charts;
            //drawing in progress
            ctrl.refineCharts();//draw the charts first, let's leisurely refine them
        })
    };

    this.refineCharts = function () {
        this.charts.forEach(function (chart) {
            chart.options.legend = {
                display: true
            }

            //axis labeling
            var chartDependantDataType = parseInt(chart.dependantDataType);

            //Y axis labeling
            chart.options.scales.yAxes = [
                {
                    scaleLabel: {
                        display: true,
                        labelString: ""
                    }
                }
            ];
            if (chartDependantDataType == 2) {//y is a program indicator
                var yProgramIndicatorId = chart.yAxisVariable1;
                programIndicatorsService.getProgramIndicatorNameById(yProgramIndicatorId).then(function (dataElementName) {
                    chart.options.scales.yAxes[0].scaleLabel.labelString = dataElementName;
                });
            } else {//y is a data element
                var yDataElementId = chart.yAxisVariable1;
                dataElementService.getDataElementNameById(yDataElementId).then(function (dataElementName) {
                    chart.options.scales.yAxes[0].scaleLabel.labelString = dataElementName;
                });
            }

            //X axis labeling
            chart.options.scales.xAxes[0].scaleLabel = {
                display: true,
                labelString: ""
            };


            //setting x label
            if (chartDependantDataType == 0 || chartDependantDataType == 2) {//x axis is time
                var xAxisPeriod = parseInt(chart.xAxisPeriod);
                chart.options.scales.xAxes[0].scaleLabel.labelString  = "Age (" + intervalNoun[xAxisPeriod] + ")";
            } else {
                var xDataElementId = chart.yAxisVariable2;
                dataElementService.getDataElementNameById(xDataElementId).then(function (dataElementName) {
                    chart.options.scales.xAxes[0].scaleLabel.labelString= dataElementName;
                });
            }


            //adding patient data
            chart.series.unshift("test");
            chart.dataColors.unshift("#000000");
            /*chart.data.unshift([
             "5", 6, 6.4, 3, 8, "5", "6", "8", "5"
             ]);*/
            chart.data.unshift([]);


            chart.dso = [{
                type: 'line',
                fill: false,
                label: 'Recorded Data',
                borderWidth: 4,
                borderDash: [5, 15],
                borderColor: "white",
                skipNullValues: true,
                showLines: false,
                data: [{
                    x: 0,
                    y: 3.5
                }, {
                    x: 2.5,
                    y: 4.5
                }, {
                    x: 3.5,
                    y: 5
                }]
            }];
        });
    }

    this.loadCharts();

}