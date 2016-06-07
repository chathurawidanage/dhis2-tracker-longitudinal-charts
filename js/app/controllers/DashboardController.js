/**
 * Created by chathura on 6/1/16.
 */
function DashboardController($location, $scope, toastService, chartService, programService) {
    var ctrl = this;
    this.charts = [];

    ctrl.loadCharts = function () {
        chartService.getAllIds().then(function (ids) {
            ids.forEach(function (id) {
                chartService.getChart(id).then(function (chart) {
                    ctrl.charts.push(chart);
                })
            })
        });
    }

    ctrl.getProgramName = function (programId) {
       /* return programService.getProgramNameById(programId).then(function (name) {
            console.log(name);
            return name;
        })*/
    };

    ctrl.loadCharts();

    ctrl.new = function () {
        $location.path('/new');
    }
}