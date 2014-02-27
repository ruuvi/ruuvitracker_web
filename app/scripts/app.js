'use strict';

// Declare app level module which depends on filters, and services
angular.module('ruuvitracker', ['ngResource',
                                'ngRoute',
                                // 'ruuvitracker.filters',
                                'ruuvitracker.services',
                                'ruuvitracker.directives',
                                'analytics',
                                'ruuvitracker.c1',
                                'navi']).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {templateUrl: 'views/front.html', controller: 'FrontCtrl'});
  $routeProvider.when('/map', {templateUrl: 'views/map.html', controller: 'MapCtrl'});
  $routeProvider.when('/trackers', {templateUrl: 'views/trackers-list.html', controller: 'TrackersListCtrl'});
  $routeProvider.when('/create-tracker', {templateUrl: 'views/create-tracker.html', controller: 'CreateTrackerCtrl'});

  $routeProvider.when('/groups', {templateUrl: 'views/user/groups-list.html', controller: 'GroupsListCtrl'});
  $routeProvider.when('/create-group', {templateUrl: 'views/user/create-group.html', controller: 'CreateGroupCtrl'});

  $routeProvider.when('/register', {templateUrl: 'views/user/create-user.html', controller: 'CreateUserCtrl'});
  $routeProvider.when('/login', {templateUrl: 'views/user/login.html', controller: 'AuthenticationCtrl'});

  $routeProvider.when('/debug', {templateUrl: 'views/debug.html', controller: 'DebugCtrl'});
  $routeProvider.when('/help', {templateUrl: 'views/help.html', controller: 'DefaultCtrl'});

  $routeProvider.when('/error', {templateUrl: 'views/error.html', controller: 'ErrorCtrl'});
  $routeProvider.otherwise({redirectTo: '/'});
}]).
config(['$locationProvider', function($locationProvider) {
  // $locationProvider.html5Mode(true).hashPrefix('!');
}]).
config(['$httpProvider', function($httpProvider) {
  // Send cookies with request by default
  $httpProvider.defaults.withCredentials = true;
}]);
