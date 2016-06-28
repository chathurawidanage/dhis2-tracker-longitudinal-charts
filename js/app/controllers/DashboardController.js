/**
 * Created by chathura on 6/1/16.
 */
function DashboardController($location, $scope, toastService, chartService, programService) {
    var ctrl = this;
    this.charts = [];

    this.loadCharts = function () {
        chartService.getAllCharts().then(function (charts) {
            ctrl.charts=charts;
        });
    }

    this.loadCharts();//load charts

    this.duplicateChart = function (chart) {
        var copy = JSON.parse(JSON.stringify(chart));
        copy.title=copy.title+" (Copy)";
        copy.enabled=false;
        chartService.generateId().then(function (resp) {
            copy.id = resp.codes[0];
            chartService.saveChart(copy).then(function (resp) {
                if (resp.httpStatusCode == 201) {
                    toastService.showToast("Chart duplicated.");
                    ctrl.loadCharts();
                }
            });
        });
    }

    this.deleteChart = function (chart) {
        toastService.showConfirm(
            "Do you really want to delete " + chart.title,
            "This will delete chart including the reference data. This action can;t be recovered.",
            "Delete",
            "Cancel",
            function () {
                chartService.deleteChart(chart).then(function (response) {
                    if (response.httpStatusCode == 200) {
                        toastService.showToast(chart.title + " deleted.");
                        ctrl.loadCharts();
                    }
                })
            }
        )
    }

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