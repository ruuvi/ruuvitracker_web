'use strict';

// Declare app level module which depends on filters, and services
angular.module('ruuvitracker', ['ngResource', 'ruuvitracker.filters', 'ruuvitracker.services', 
                                'ruuvitracker.directives', 'analytics']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {templateUrl: 'partials/front.html', controller: FrontCtrl});
    $routeProvider.when('/map', {templateUrl: 'partials/map.html', controller: MapCtrl});
    $routeProvider.when('/trackers', {templateUrl: 'partials/trackers-list.html', controller: TrackersListCtrl});
    $routeProvider.when('/create-tracker', {templateUrl: 'partials/create-tracker.html', controller: CreateTrackerCtrl});
    $routeProvider.when('/debug', {templateUrl: 'partials/debug.html', controller: DebugCtrl});
    $routeProvider.when('/help', {templateUrl: 'partials/help.html', controller: DefaultCtrl});
    $routeProvider.when('/error', {templateUrl: 'partials/error.html', controller: ErrorCtrl});
    $routeProvider.otherwise({redirectTo: '/'});
  }]).
  config(['$locationProvider', function($locationProvider) {
      // $locationProvider.html5Mode(true).hashPrefix('!');
  }]);
