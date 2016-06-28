/**
 * Created by chathura on 6/1/16.
 */
function ViewerController($location, $scope, $routeParams, toastService, chartService, programService) {
    var ctrl = this;
    this.tei = $routeParams.tei;
    this.program = $routeParams.program;

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
            chart.options = new Object();
            chart.options.scales = new Object();

            //Y axis labeling
            chart.options.scales.yAxes = [];
            var yAxisObj = new Object();
            yAxisObj.scaleLabel = new Object();
            yAxisObj.scaleLabel.display = true;
            yAxisObj.scaleLabel.labelString = "Test label";
            chart.options.scales.yAxes.push(yAxisObj);



            chart.dso = [{fill: false}, {},{},{},{},{},{},{},{},{}];

            console.log(chart);
        });
    }

    this.loadCharts();

}