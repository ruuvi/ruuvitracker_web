'use strict';

function updateNavi($location, pageClass) {
    $('ul.nav li').removeClass('active')
    var curr = $('.' + pageClass);
    curr.addClass("active");
}

/* Controllers */
function DefaultCtrl(analytics, $scope, $location) {
    updateNavi($location, 'page-link-help');
}


function FrontCtrl(analytics, $scope, $location) {
    updateNavi($location, 'page-link-index');
}


function MapCtrl(analytics, $rootScope, $scope, $location, mapService, geoCodingService, soundService, trackerService, trackerStorage) {
    updateNavi($location, 'page-link-map');

    mapService.open("map-canvas");

    if(mapService.isTouchDevice() ) {
        // touch devices do not have zoom controls, move 
        // fullscreen toggle to top
        $("#map-fullscreen-container").attr("style", "top: 0;");
    }
    $rootScope.showFullscreen = false;
    function resizeMap() {
        var mapContainer = $("#map-canvas");
        if (!mapContainer.length) {
            return;
        }

        var windowHeight = $(window).height();
        var mapTop = Math.ceil(mapContainer.position().top);
        var footerHeight = $("footer").height();
        var newMapSize = windowHeight - mapTop - footerHeight - 1;
        mapContainer.height(newMapSize);
        mapService.redraw();
    };

    $(window).resize(resizeMap)
    // bootstrap transition.end event occurs when animation transition ends
    // for example when navi is collapsed and map needs to be resized
    //$(document).on($.support.transition.end, resizeHandler);


    // TODO check if it possible to show menu on top of map and let
    // map use 100% of available space
    // TODO togging fullscreen should trigger resize
    resizeMap();

    trackerStorage.restoreSelectedTrackers();

    $scope.locateMe = function() {
        console.log("locateMe:");
        mapService.centerOnSelf();
    };
    
    $scope.toggleFullscreen = function() {
        if($rootScope.showFullscreen) {
            $("#top-navigation").show();
            $("#map-toolbar").show();
        } else {
            $("#top-navigation").hide();
            $("#map-toolbar").hide();
        }
        $rootScope.showFullscreen = !$rootScope.showFullscreen;
        resizeMap();
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
            //soundService.playPing();
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

function TrackersListCtrl(analytics, $scope, $resource, $location, trackerStorage, configuration) {
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

function CreateTrackerCtrl(analytics, $scope, $location, $resource, configuration) {
    updateNavi($location, 'page-link-trackers');
    // AngularJS silliness, must quote : in port number
    var url = configuration.ruuvitracker.url.replace(/:([01-9]+)/, '\\:$1');
    // TODO move to dependency injection/trackerService
    var Tracker = $resource(url + 'trackers', {},
                            {createTracker: {method: 'POST'}});

    $scope.generateSharedSecret = function() {
        var secret = '';
        var values = "wertyupadfghjkzxcvbm";
        values += "WERTYUPADFHJKLZXCVBNM";
        values += "234789";
        for(var i = 0; i < 20; i ++) {
            var index = Math.floor(Math.random()*values.length);
            secret += values[index];
        }
        $scope.shared_secret = secret;
    };
    $scope.createTracker = function(trackerCode,
        sharedSecret, trackerName, demoPassword) {
        var expected = ["#" + "ruu" + "vi", "enK".replace(/n/,"nN").toLowerCase().replace(/nn/,"n").replace(/(k)/,"$1$1i")].join("p");
        if(demoPassword != expected) {
            $scope.feedback = {error: true, message: "Wrong demo password"};
            return;
        }
        console.log("creating ", trackerCode);
        function success(e) {
            console.log("Successfully created new tracker", e.tracker);
            $scope.feedback = {success: true, 
                               message: "Successfully created new tracker",
                               tracker: e.tracker};
        };
        function error(e) {
            var data = e.data;
            var msg;
            if(data.error && data.error.message) {
                console.log("Failed to create tracker", data.error.message);
                msg=data.error.message;
            } else {
                console.log("Failed to create tracker:", data.status);
                msg="Failed to create tracker";
            }
            $scope.feedback = {error: true, message: msg};
        };
        var result = Tracker.createTracker({tracker: {name: trackerName, code: trackerCode, shared_secret: sharedSecret}}, success, error);
        
    }
}

function ErrorCtrl(analytics, $scope) {}

function DebugCtrl(analytics, $scope, $location, trackerStorage) {
    updateNavi($location, 'page-link-debug');
    trackerStorage.listenEventReceived(function(event) {
        $scope.latestEvent = event;
        $scope.$apply();
    });
}

