'use strict';

/* Services */
angular.module('ruuvitracker.services', []).
    constant('version', '0.1').
    constant('configuration', new Configuration()).
    factory('mapService', ['$log', '$rootScope', 'configuration', 'storageService', 'trackerService',
                           function($log, $rootScope, configuration, storageService, trackerService) {  
                               return new MapService($log, $rootScope, configuration, storageService, trackerService); 
                           }] ).
    factory('trackerStorage', ['$log', '$rootScope', 'storageService', 'trackerService', 'mapService',
                               function($log, $rootScope, storageService, trackerService, mapService) {
                                   return new TrackerStorage($log, $rootScope, storageService, trackerService, mapService);
                                   return trackerStorage;
                              }] ).
    factory('trackerService', ['$log', 'configuration', 
                               function($log, configuration) {
                                   return new TrackerService($log, configuration);
                               }] ).
    factory('soundService', ['$log',
                             function($log) {
                                 return new SoundService($log);
                             }]).
    factory('storageService', ['$log', 
                               function($log) {
                                   return new StorageService($log);
                               }]).
    factory('geoCodingService', ['$log', 
                                 function($log) {
                                     return new GeoCodingService($log);
                                 }]).
    factory('userResource', 
            ['configuration','$resource',
             function(configuration, $resource) {
                 return $resource(configuration.resourceUrl + 'users', {},
                                  {create: {method: 'POST'}});
             }]).
    factory('authResource', 
            ['configuration','$resource',
             function(configuration, $resource) {
                 return $resource(configuration.resourceUrl + 'auths', {},
                                  {authenticate: {method: 'POST'}});
             }]).
    factory('trackerResource',
            ['configuration','$resource',
             function(configuration, $resource) {
                 return $resource(configuration.resourceUrl + 'trackers', {},
                                  {createTracker: {method: 'POST'}});
             }]).
    factory('groupResource',
            ['configuration','$resource',
             function(configuration, $resource) {
                 return $resource(configuration.resourceUrl + 'groups', {},
                                  {create: {method: 'POST'}});
             }]).
    run(function(trackerStorage)  {
        // Execute at application startup
        trackerStorage.restoreSelectedTrackers();        
    });

