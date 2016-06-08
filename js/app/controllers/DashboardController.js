/**
 * Created by chathura on 6/1/16.
 */
function DashboardController($location, $scope, toastService, chartService, programService) {
    var ctrl = this;
    this.charts = [];

    this.loadCharts = function () {
        chartService.getAllIds().then(function (ids) {
            ids.forEach(function (id) {
                chartService.getChart(id).then(function (chart) {
                    ctrl.charts.push(chart);
                })
            })
        });
    }

    this.loadCharts();//load charts

    this.editChart = function (chartId) {
        $location.path("/chart/" + chartId);
    }

    this.getProgramName = function (programId) {
        /* return programService.getProgramNameById(programId).then(function (name) {
         console.log(name);
         return name;
         })*/
    };


    this.new = function () {
        $location.path('/new');
    }
}