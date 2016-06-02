/**
 * Created by chathura on 6/1/16.
 */
function ChartController($http, $scope, programService) {
    var ctrl = this;
    this.programs = [];
    this.program;

    this.dataElements = [];
    this.xAxisPeriods = ["Daily", "Weekly", "Monthly", "Yearly"];

    this.yAxisDataElement;
    this.xAxisPeriod;

    this.refreshDataElements = function () {
        console.log("refreshing..");
        programService.getProgramDataElements(ctrl.program).then(function (dataElements) {
            ctrl.dataElements = dataElements;
            console.log(dataElements);
        }).catch(function () {
            console.log("Error in fetching data elements for " + ctrl.program)
        })
    }

    $scope.dropzoneConfig = {
        'options': { // passed into the Dropzone constructor
            'url': '../../fileResources'
        },
        'eventHandlers': {
            'sending': function (file, xhr, formData) {
            },
            'success': function (file, response) {
                console.log(response);
            }
        }
    };

    /**
     * Loading list of programs
     */
    programService.getPrograms().then(function (programs) {
        ctrl.programs = programs;
    }).catch(function () {
        console.log("error in loading programs");
    });
}