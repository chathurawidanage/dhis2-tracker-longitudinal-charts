/**
 * Created by chathura on 6/1/16.
 */
function ViewerController($location, $scope, $routeParams,toastService, chartService, programService) {
    var ctrl = this;
    this.tei=$routeParams.tei;
    this.program=$routeParams.program;
    console.log(this.tei,this.program);

}