var nilonapoApp = angular.module('nilonapoApp', ['ui.router', 'ui.bootstrap']);

nilonapoApp.controller('profileController', function ($scope, $http, $stateParams, peopleFactory) {

    var activeProfile = $stateParams.name;
    $scope.profile = {};

    $scope.maxRate = 5;

    $scope.hoveringOver = function (value) {
        $scope.overStar = value;
        $scope.percent = 100 * (value / this.maxRate);
    };

    peopleFactory.getProfiles().then(function (response) {
        if (activeProfile == undefined) {
            $scope.Profile = response.People[0];
            $scope.rate = $scope.Profile.rating;

        } else {
            angular.forEach(response.People, function (item) {
                if (item.name == activeProfile) {
                    $scope.Profile = item;
                    $scope.rate = item.rating;
                }
            });
        }
    });

});

nilonapoApp.controller('navigationController', function ($scope, peopleFactory) {

    $scope.activeIndex = 0;
    $scope.Profiles = [];
    peopleFactory.getProfiles().then(function (response) {
        $scope.Profiles = response.People;
    });

    $scope.SetActiveIndex = function (index) {
        $scope.activeIndex = index;
    }

});

nilonapoApp.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/content/default');

    $stateProvider
        
        .state('content', {
            abstract: true,
            url: "/content",
            templateUrl: "content.html",
            data: {
                pageTitle: 'default'
            }
        })

        .state('content.default', {
            url: '/default',
            templateUrl: 'profile.html',
            controller: 'profileController',
            data: {
                pageTitle: 'default'
            }
        })
    
        .state('content.profile', {
            url: '/profile/:name',
            templateUrl: 'profile.html',
            controller: 'profileController',
            data: {
                pageTitle: 'default'
            }
        });

});

nilonapoApp.factory('peopleFactory', ['$http', function ($http) {

    var profiles = [];

    return {
        getProfiles: function () {
            return $http.get('people.json').then(function (response) {
                profiles = response.data;
                return profiles;
            })
        }
    };

}]);