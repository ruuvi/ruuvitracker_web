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

function TrackersListCtrl($scope, $resource, $location, trackerStorage) {
    updateNavi($location, 'page-link-trackers');
    // need to escape : in port number due angularjs silliness
    var Tracker = $resource('http://198.61.201.6\\:8000/api/v1-dev/trackers');

    trackerStorage.restoreSelectedTrackers();

    $scope.selectTracker = function(trackerData) {
        trackerStorage.fetchTrackerEvents(trackerData.tracker.id, trackerData.fetch);
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
TrackersListCtrl.$inject = ['$scope', '$resource', '$location', 'trackerStorage'];

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

