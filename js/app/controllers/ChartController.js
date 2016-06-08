/**
 * Created by chathura on 6/1/16.
 */
function ChartController($location, $routeParams, $scope, programService, chartService, toastService, validationService) {
    var ctrl = this;

    this.lc = new LongitudinalChart();
    if ($routeParams.id) {
        var chartId = $routeParams.id;
        chartService.getChart(chartId).then(function (chart) {
            ctrl.lc = chart;
            ctrl.refreshDataElements();
        })
    }

    this.programs = [];
    this.dataElements = [];
    this.xAxisPeriods = ["Daily", "Weekly", "Monthly", "Yearly"];

    this.navBack = function () {
        $location.path("/");
    }

    this.previewAvailable = function () {
        return this.lc.data.length > 0;
    }

    this.snap = function () {
        var canvas = document.getElementById('chart-preview');
        var img = canvas.toDataURL("png");
        return img;
    }

    this.saveChart = function () {
        this.validateChart(function () {
            chartService.saveChart(ctrl.lc).then(function (resp) {
                if (resp.httpStatusCode == 201) {
                    ctrl.navBack();
                    toastService.showToast("Chart saved!");
                }
            }, function (error) {
                //handle updates
                if (error.status == 409) {
                    chartService.deleteChart(ctrl.lc).then(function () {
                        console.info("Chart deleted");
                        ctrl.saveChart();
                    })
                }
            });
        });
    }

    this.validateChart = function (callback) {
        //other validations

        ctrl.lc.img = this.snap();
        if (ctrl.lc.id == undefined) {
            chartService.generateId().then(function (resp) {
                ctrl.lc.id = resp.codes[0];
                callback();
            });
        } else {
            callback();
        }
    }

    this.refreshDataElements = function () {
        ctrl.yAxisDataElement = undefined;
        programService.getProgramDataElements(ctrl.lc.program).then(function (dataElements) {
            ctrl.dataElements = dataElements;
        }).catch(function () {
            console.log("Error in fetching data elements for " + ctrl.program)
        })
    }

    /*Drop zone*/
    $scope.dropzoneConfig = {
        'options': { // passed into the Dropzone constructor
            'url': '#',
            'dictDefaultMessage': 'Drop CSV file here'
        },
        'eventHandlers': {
            'sending': function (file, xhr, formData) {
            },
            'success': function (file, response) {
                console.log(response);
            },
            'addedfile': function (file) {
                var reader = new FileReader();
                reader.onload = function () {
                    var csvData = reader.result;
                    ctrl.loadDataFromCSV(csvData);
                };
                reader.readAsText(file);
            }
        },
    };

    ctrl.loadDataFromCSV = function (csvData) {
        ctrl.lc.centiles = [];

        var rows = csvData.split('\r\n');

        //first row is centile names, remove it
        var centileNames = rows.splice(0, 1).toString().split(",");
        centileNames.forEach(function (centileName) {
            var c = new Centile();
            c.name = centileName;
            ctrl.lc.centiles.push(c);
        });

        rows.forEach(function (row, i) {
            if (i >= ctrl.lc.centiles.length) {//just to make sure every thing is smooth
                return;
            }
            var separatedValues = row.split(",");
            separatedValues.forEach(function (value, j) {
                ctrl.lc.centiles[i].data[j] = value;
            });
        });
        ctrl.applyDataFromCSV();
    };

    /**
     * will be called by UI inputs
     */
    ctrl.applyData = function () {
        //do stuff
        ctrl.applyDataFromCSV();
    }

    ctrl.applyDataFromCSV = function () {
        var selectedData = [];
        var selectedSeries = [];
        var selectedDataColors = [];

        var maxDataLength = 0;
        ctrl.lc.centiles.forEach(function (centile) {
            if (centile.selected) {
                selectedData.push(centile.data);
                maxDataLength = maxDataLength < centile.data.length ? centile.data.length : maxDataLength;
                selectedSeries.push(centile.name);
                selectedDataColors.push(centile.color);
            }
        });

        ctrl.lc.labels = [];
        for (var i = 0; i < maxDataLength; i++) {
            ctrl.lc.labels.push(i + 1);
        }
        ctrl.lc.series = selectedSeries;
        ctrl.lc.data = selectedData;
        ctrl.lc.dataColors = selectedDataColors;
        $scope.$apply();
    };

    /**
     * Loading list of programs
     */
    programService.getPrograms().then(function (programs) {
        ctrl.programs = programs;
    }).catch(function () {
        console.log("error in loading programs");
    });

    /**
     * Local modals
     * */
    function Centile() {
        this.name;
        this.data = [];
        this.color = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
        this.selected = true;
    }

    function LongitudinalChart() {
        this.id;
        this.title;//title of the chart
        this.program;//program Id
        this.yAxisDataElement;
        this.xAxisPeriod;
        this.centiles = [];
        this.img;

        this.enabled = false;

        //graphical configurations
        this.labels = [];
        this.series = [];
        this.data = [];
        this.dataColors = [];
    }
}