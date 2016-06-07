/**
 * Created by chathura on 6/1/16.
 */
function ChartController($document, $scope, programService, chartService, toastService, validationService) {
    var ctrl = this;

    this.lc = new LongitudinalChart();

    this.programs = [];
    this.dataElements = [];
    this.xAxisPeriods = ["Daily", "Weekly", "Monthly", "Yearly"];

    this.previewAvailable = function () {
        return this.lc.data.length > 0;
    }

    this.snap = function () {
        var canvas = document.getElementById('chart-preview');
        console.log(canvas);
        var img = canvas.toDataURL("png");
        return img;
    }

    this.saveChart = function () {
        this.validateChart(function () {
            chartService.saveChart(ctrl.lc).then(function (resp) {
                console.log(resp);
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
            'url': '#'
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
                console.log(file);
            }
        },
        'previewTemplate': '<div class="dz-preview dz-file-preview"> <div class="dz-details"> <div class="dz-filename"><span data-dz-name></span></div> <div class="dz-size" data-dz-size></div> <img data-dz-thumbnail /> </div> <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div> <div class="dz-success-mark"><span>✔</span></div> <div class="dz-error-mark"><span>✘</span></div> <div class="dz-error-message" style="display:none"><span data-dz-errormessage></span></div> </div>'
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

        ctrl.lc.centiles.forEach(function (centile) {
            if (centile.selected) {
                selectedData.push(centile.data);
                selectedSeries.push(centile.name);
                selectedDataColors.push(centile.color);
            }
        });

        ctrl.lc.labels = [1, 2, 3, 4, 5, 6, 7, 8, 9];
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