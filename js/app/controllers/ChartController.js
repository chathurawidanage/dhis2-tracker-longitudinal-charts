/**
 * Created by chathura on 6/1/16.
 */
function ChartController($http, $scope, programService, $timeout) {
    var ctrl = this;
    this.programs = [];
    this.program;

    this.dataElements = [];
    this.xAxisPeriods = ["Daily", "Weekly", "Monthly", "Yearly"];

    this.yAxisDataElement;
    this.xAxisPeriod;

    this.centiles = [];

    this.refreshDataElements = function () {
        console.log("refreshing..");
        ctrl.yAxisDataElement = undefined;
        programService.getProgramDataElements(ctrl.program).then(function (dataElements) {
            ctrl.dataElements = dataElements;
            console.log(dataElements);
        }).catch(function () {
            console.log("Error in fetching data elements for " + ctrl.program)
        })
    }

    /*Chart*/
    $scope.labels = [];
    $scope.series = [];
    $scope.data = [];
    $scope.dataColors = [];
    /* $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
     $scope.series = ['Series A', 'Series B'];
     $scope.data = [
     [65, 59, 80, 81, 56, 55, 40],
     [28, 48, 40, 19, 86, 27, 90]
     ];*/
    $scope.onClick = function (points, evt) {
        console.log(points, evt);
    };

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
                    ctrl.loadData(csvData);
                };
                reader.readAsText(file);
                console.log(file);
            }
        },
        'previewTemplate': '<div class="dz-preview dz-file-preview"> <div class="dz-details"> <div class="dz-filename"><span data-dz-name></span></div> <div class="dz-size" data-dz-size></div> <img data-dz-thumbnail /> </div> <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div> <div class="dz-success-mark"><span>✔</span></div> <div class="dz-error-mark"><span>✘</span></div> <div class="dz-error-message" style="display:none"><span data-dz-errormessage></span></div> </div>'
    };

    ctrl.loadData = function (csvData) {
        ctrl.centiles = [];

        var rows = csvData.split('\n');

        //first row is centile names, remove it
        var centileNames = rows.splice(0, 1).toString().split(",");
        centileNames.forEach(function (centileName) {
            var c = new Centile();
            c.name = centileName;
            ctrl.centiles.push(c);
        });

        rows.forEach(function (row, i) {
            if (i >= ctrl.centiles.length) {//just to make sure every thing is smooth
                return;
            }
            var separatedValues = row.split(",");
            separatedValues.forEach(function (value, j) {
                ctrl.centiles[i].data[j] = value;
            });
        });
        ctrl.applyData();
    };

    ctrl.applyData = function () {
        var selectedData = [];
        var selectedSeries = [];
        var selectedDataColors = [];

        ctrl.centiles.forEach(function (centile) {
            if (centile.selected) {
                selectedData.push(centile.data);
                selectedSeries.push(centile.name);
                selectedDataColors.push(centile.color);
            }
        });

        $scope.labels = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        $scope.series = selectedSeries;
        $scope.data = selectedData;
        $scope.dataColors = selectedDataColors;
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
        this.color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);;
        this.selected = true;
    }
}