'use strict';

/* Services */
angular.module('ruuvitracker.services', []).
    constant('version', '0.1').
    constant('configuration', new Configuration()).
    factory('mapService', ['$log', 'configuration', 'storageService', 'trackerService',
                           function($log, configuration, storageService, trackerService) {  
                               return new MapService($log, configuration, storageService, trackerService); 
                           }] ).
    factory('trackerStorage', ['$log', 'storageService', 'trackerService', 'mapService',
                               function($log, storageService, trackerService, mapService) {
                                   return new TrackerStorage($log, storageService, trackerService, mapService);
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
    factory('trackerResource',
            ['configuration','$resource',
             function(configuration, $resource) {
                 return $resource(configuration.resourceUrl + 'trackers', {},
                                  {createTracker: {method: 'POST'}});
             }])
;
