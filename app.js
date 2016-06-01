 var app = angular.module('long-charts', ['ngMaterial', 'ngRoute', 'longitudinalChartControllers']);
    app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'templates/dashboard.html',
            controller: 'DashboardController'
        }).when('/new', {
            templateUrl: 'templates/new-chart.html',
            controller: 'ChartController'
        }).otherwise({
            redirectTo: '/'
        });
    }]);
    var controllers = angular.module('longitudinalChartControllers', []);

    controllers.controller('DashboardController', function ($http, $scope, toastService) {
        var ctrl = this;

        ctrl.show = function () {
            toastService.showToast("Hi");
        }
    });

    controllers.controller('ChartController', function ($http, $scope, programService) {
        var ctrl = this;
        this.programs = [];
        this.program;

        this.dataElements = [];
        this.yAxisDataElement;

        this.refreshDataElements = function () {
            console.log("refreshing..");
            programService.getProgramDataElements(ctrl.program).then(function (dataElements) {
                ctrl.dataElements = dataElements;
                console.log(dataElements);
            }).catch(function () {
                console.log("Error in fetching data elements for " + ctrl.program)
            })
        }

        /**
         * Loading list of programs
         */
        programService.getPrograms().then(function (programs) {
            ctrl.programs = programs;
        }).catch(function () {
            console.log("error in loading programs");
        });
    });

    /**
     * User Service
     **/
    app.factory('userService', function ($http, $q) {
        return {
            getCurrentUserId: function () {
                var defer = $q.defer();
                $http.get('../../api/me.json?fields=id').then(function (response) {
                    defer.resolve(response.data.id);
                }, function (response) {
                    defer.reject(response);
                });
                return defer;
            }
        }
    });

    /**
     * Toast Service
     **/
    app.factory('toastService', function ($mdToast) {
        return {
            showToast: function (msg) {
                $mdToast.show(
                        $mdToast.simple()
                                .textContent(msg)
                                .position('bottom right')
                                .hideDelay(3000)
                );
            }
        }
    });

    /**
     * Program Service handles all the request related to DHIS Programs
     **/
    app.factory('programService', function ($http, $q) {
        return {
            getPrograms: function () {
                var defer = $q.defer();
                $http.get("../../programs.json?paging=false").then(function (response) {
                    defer.resolve(response.data.programs);
                }, function (response) {
                    defer.reject(response);
                });
                return defer.promise;
            },

            getProgramDataElements: function (programId) {
                var defer = $q.defer();
                var url = "../../programs/" + programId + ".json?fields=programStages[programStageDataElements[dataElement[name,id]]]";
                $http.get(url).then(function (response) {
                    var programStages = response.data.programStages;
                    var dataElements = [];
                    var dataElementIds = [];
                    programStages.forEach(function (programStage) {
                        var programStageDataElements = programStage.programStageDataElements;
                        programStageDataElements.forEach(function (programStageDataElement) {
                            var dataElement = programStageDataElement.dataElement;
                            if (dataElementIds.indexOf(dataElement.id) === -1) {
                                dataElements.push(dataElement);
                                dataElementIds.push(dataElement.id);
                            }
                        })
                    });
                    defer.resolve(dataElements);
                }, function (response) {
                    defer.reject(response);
                });
                return defer.promise;
            }
        }
    });
