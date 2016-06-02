/**
 * Created by chathura on 6/1/16.
 */
function DashboardController($http, $scope, toastService) {
    var ctrl = this;

    ctrl.show = function () {
        toastService.showToast("Hi");
    }
}