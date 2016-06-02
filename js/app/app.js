var app = angular.module('long-charts', ['ngMaterial', 'ngRoute', 'longitudinalChartControllers','dropzone']);
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

controllers.controller('DashboardController', DashboardController);
controllers.controller('ChartController', ChartController);

/*Drop Zone*/
angular.module('dropzone', []).directive('dropzone', function () {
    return function (scope, element, attrs) {
        var config, dropzone;

        config = scope[attrs.dropzone];

        // create a Dropzone for the element with the given options
        dropzone = new Dropzone(element[0], config.options);

        // bind the given event handlers
        angular.forEach(config.eventHandlers, function (handler, event) {
            dropzone.on(event, handler);
        });
    };
});

app.directive('chart', function () {
    return {
        restrict: 'E',
        replace:true,
        template: '<canvas id="chartCanvas" width="400" height="400"></canvas>',
        link: function (scope, element, attrs) {
            console.log(element);
            var ctx = element[0].getContext("2d");
            var myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                    datasets: [{
                        label: '# of Votes',
                        data: [12, 19, 3, 5, 2, 3],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255,99,132,1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });
        }
    }
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
