'use strict';

function updateNavi($location, pageClass) {
    $('ul.nav li').removeClass('active')
    var curr = $('.' + pageClass);
    curr.addClass("active");
}

/* Controllers */
function DefaultCtrl($scope, $location) {
    updateNavi($location, 'page-link-help');
}
DefaultCtrl.$inject = ['$scope', '$location'];

function FrontCtrl($scope, $location) {
    updateNavi($location, 'page-link-index');
}
FrontCtrl.$inject = ['$scope', '$location'];

function MapCtrl($scope, $location, mapService, geoCodingService, soundService, trackerService, trackerStorage) {
    updateNavi($location, 'page-link-map');

    mapService.open("map-canvas");

    function resizeHandler() {
        var map = $("#map-canvas");
        if (!map.length) {
            return;
        }

        var windowHeight = $(window).height();
        var mapTop = Math.ceil(map.position().top);
        var footerHeight = $("footer").height();
        var newMapSize = windowHeight - mapTop - footerHeight - 1;
        map.height(newMapSize);
    };

    $(window).resize(function() {
        resizeHandler();
    });

    resizeHandler();

    trackerStorage.restoreSelectedTrackers();

    $scope.locateMe = function() {
        console.log("locateMe:");
        mapService.centerOnSelf();
    };
    
    $scope.searchAddress = function(address) {
        console.log("searchAddress:", address);
        if(!address) {
            return;
        }
        // show result closest to current map location
        // TODO improve, finds funny results
        var showClosest = function(data) {
            var currentLocation = mapService.currentCenter();
            console.log("locate found " + data.length + " results");
            if(!data || !data.length) {
                return;
            }
            var sorted = _.sortBy(data, function(item) {
                return currentLocation.distanceTo(new L.LatLng(item.lat, item.lon));
            })
            var closest = sorted[0];
            var closestLoc = new L.LatLng(closest.lat, closest.lon);
            console.log("Show " + closest.display_name + " (" + closestLoc + ")");
            soundService.playPing();
            if(closest.boundingbox) {
                var sw = new L.LatLng(closest.boundingbox[0], closest.boundingbox[2])
                var ne = new L.LatLng(closest.boundingbox[1], closest.boundingbox[3])
                var bounds = new L.LatLngBounds(sw, ne);
                mapService.centerBounds(bounds);
            } else {
                mapService.center(closestLoc);
            }
        };
        
        geoCodingService.searchLocation(address, showClosest);
    };
}
MapCtrl.$inject = ['$scope', '$location', 'mapService', 'geoCodingService', 'soundService', 'trackerService', 
                   'trackerStorage'];

function TrackersListCtrl($scope, $resource, $location, trackerStorage, configuration) {
    updateNavi($location, 'page-link-trackers');
    var Tracker = $resource(configuration.ruuvitracker.url + 'trackers');

    trackerStorage.restoreSelectedTrackers();

    $scope.selectTracker = function(trackerData) {
        trackerStorage.fetchTrackerEvents(trackerData.tracker.id, trackerData.fetch);
    };

    $scope.displayTimeAgo = function(date) {
        if(!date) {
            return null;
        }
        return date.from(new Date());
    };
    $scope.fetchTrackers = function() {
        console.log("fetchTrackers");
        // update view after trackers have been fetched
        function updateView() {
            $scope.$apply();
        };
        $scope.trackers = trackerStorage.listTrackers(updateView);
    };

}
TrackersListCtrl.$inject = ['$scope', '$resource', '$location', 'trackerStorage', 
                            'configuration'];

function CreateTrackerCtrl($scope, $location) {
    updateNavi($location, 'page-link-trackers');
}
CreateTrackerCtrl.$inject = ['$scope', '$location'];

function ErrorCtrl($scope) {}
ErrorCtrl.$inject = [];

function DebugCtrl($scope, $location) {
    updateNavi($location, 'page-link-trackers');
}
DebugCtrl.$inject = ['$scope', '$location'];

