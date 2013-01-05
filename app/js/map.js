'use strict';

// See https://github.com/CloudMade/Leaflet/issues/386
L.Marker.Compass = L.Marker.extend({    
    _reset: function() {
        var pos = this._map.latLngToLayerPoint(this._latlng).round();

        L.DomUtil.setPosition(this._icon, pos);
        if (this._shadow) {
            L.DomUtil.setPosition(this._shadow, pos);
        }

        if (this.options.iconAngle || this.options.iconAngle == 0) {
            var iconAnchor = this.options.icon.options.iconAnchor;

            var translate1 = ' translate(0px, ' + iconAnchor[1]/2 + 'px) ';
            var translate2 = ' translate(0px, ' + -iconAnchor[1]/2 + 'px) ';

            this._icon.style.WebkitTransform = this._icon.style.WebkitTransform  + translate1 + ' rotate(' + this.options.iconAngle + 'deg) ' + translate2;
            this._icon.style.MozTransform = this._icon.style.MozTransform + translate1 + 'rotate(' + this.options.iconAngle + 'deg)' + translate2;
            this._icon.style.MsTransform = this._icon.style.MsTransform + translate1 + 'rotate(' + this.options.iconAngle + 'deg)' + translate2;
            this._icon.style.OTransform = this._icon.style.OTransform + translate1 + 'rotate(' + this.options.iconAngle + 'deg)' + translate2;
        }

        this._icon.style.zIndex = pos.y;
    },

    setIconAngle: function (iconAngle) {

        if (this._map) {
            this._removeIcon();
        }

        this.options.iconAngle = iconAngle;

        if (this._map) {
            this._initIcon();
            this._reset();
        }
    }

});

var MapService = function(configuration, storageService, trackerService) {
    var mapView = undefined;
    var selfLocation = undefined;
    var selfMarker = undefined;

    var paths = {};

    var createMapTiles = function() {
        var tiles = [];
        for(var i = 0; i < configuration.maps.length; i ++) {
            var mapTiles = configuration.maps[i];

            var opts = {attribution: mapTiles.attribution,
                        maxZoom: mapTiles.maxZoom,
                       minZoom: mapTiles.minZoom || 0};
            var tileLayer = undefined;
            console.log(mapTiles.title, mapTiles.type);
            if(mapTiles.type == 'google') {
                tileLayer = new L.Google(mapTiles.map_type, opts);
            } else if(mapTiles.type == 'bing') {
                tileLayer = new L.BingLayer(mapTiles.api_key, opts);
            } else {
                var url = mapTiles.url;
                tileLayer = new L.TileLayer(url, opts);
            }
            tileLayer.title = mapTiles.title;
            tiles.push(tileLayer);
        }
        return tiles;
    }

    var storeMapState = function() {
        console.log("storeMapState:");
        var zoom = mapView.getZoom();
        var location = mapView.getCenter();
        var data = {zoom: zoom, 
                    lat: location.lat,
                    lng: location.lng,
                    timestamp: new Date().getTime()};
        storageService.store("map-location", data);
    };

    var updateMarker = function(marker, newLocation, options) {
        if(!newLocation) {
            return marker;
        }
        if(!marker) {
            var newMarker = new L.Marker(newLocation, options);
            newMarker.addTo(mapView);
            return newMarker;
        }
        marker.setLatLng(newLocation);
        marker.update();
        return marker;
    };

    /* Use stored location if it is newer than timeoutSeconds, otherwise use
       default location. */
    var loadInitialLocation = function(map, location, timeoutSeconds) {
        console.log("loadInitialLocation:", location);
        var data = storageService.fetch("map-location");
        var zoom = configuration.defaultZoom;
        // TODO error handling for corrupt data
        if(data) {
            console.log("found existing data", data);
            var now = new Date().getTime();
            if(data.timestamp && (now - (timeoutSeconds * 1000) < data.timestamp) ) { 
                location = new L.LatLng(data.lat, data.lng);
                zoom = data.zoom;
            }
        }
        map.setView(location, zoom || configuration.defaultZoom);
    }

    var updateSelfLocation = function(newLocation, accuracy) {
        // accuracy in meters. 
        // TODO draw accuracy circle?
        console.log("updateSelfLocation:", newLocation);
        selfLocation = newLocation;
        selfMarker = updateMarker(selfMarker, newLocation);
    };

    var startLocating_internal = function(map) {
        console.log("startLocating:");
        var opts = {timeout: 10000,
                    maximumAge: 10000,
                    enableHighAccuracy: true,
                    watch: true};
        map.locate(opts);
    };

    var create = function(canvasId, startLocation) {
        console.log("create:" + canvasId);
        var tiles = createMapTiles();
        var map = new L.Map(canvasId, 
                            {zoom: configuration.defaultZoom, 
                             });
        map.addLayer(tiles[0]);

        var baseMaps = {};
        for(var i = 0; i < tiles.length; i ++) {
           var tile = tiles[i];
            baseMaps[tile.title] = tile;
        }

        L.control.layers(baseMaps).addTo(map);
        // TODO use geolocation api instead
        // leaflet api loses information
        map.on("locationfound", function(event) {
            console.log("location found", event);
            // trackerService.sendEvent(event);
            updateSelfLocation(event.latlng, event.accuracy);
        });
        map.on("locationerror", function(event) {
            console.log("location error", event);
        });
        var hour = 60 * 60;
        loadInitialLocation(map, startLocation, hour);
        map.on("zoomend", storeMapState);
        map.on("moveend", storeMapState);
        L.control.scale().addTo(map);
        startLocating_internal(map);
        return map;
    };

    var redisplay = function(canvasId) {
        console.log("redisplay:" + canvasId);
        var oldContainer = mapView.getContainer();
        var newContainer = $('#' + canvasId);
        newContainer.replaceWith(oldContainer);
        mapView.invalidateSize(false);
    };

    /* Open existing map or create new */
    this.open = function(canvasId, startLocation) {
        console.log("open:" + canvasId);
        if(mapView) {
            redisplay(canvasId);
        } else {
            mapView = create(canvasId, startLocation || configuration.defaultLocation);
        }
    };
    
    /* Center location of current map view */
    this.currentCenter = function() {
        return mapView.getCenter();
    }

    /* Center location of map around latest user position (if
       available) */
    this.centerOnSelf = function() {
        console.log("centerOnSelf:");
        if(selfLocation) {
            this.center(selfLocation, mapView.getZoom());
        }
    }

    /* Center map on given location */
    this.center = function(location, zoom) {
        console.log("center:" + location + "," + zoom);
        mapView.setView(location, zoom || configuration.defaultZoom);
    };

    /* Center map on give LatLngBounds object */
    this.centerBounds = function(bounds, maxZoom) {
        console.log("centerBounds:", bounds.toBBoxString());
        mapView.fitBounds(bounds);
    }

    /* Center map on current self location */
    this.locate = function() {
        console.log("locate:");
        if(selfLocation) {
            this.center(selfLocation, 18);
        }
    };

    /* Start tracking current location */
    this.startLocating = function() {
        return startLocating_internal(this.mapView);
    };
    
    /* Stop tracking current location */
    this.stopLocating = function() {
        console.log("stopLocating:");
        mapView.stopLocate();
    };

    var pathIcon = function(heading) {
        if(heading) {
            return new L.Icon({iconUrl: "img/up-arrow.png",
                                iconSize: [20, 43],
                                iconAnchor: [10, 43]});
        }
        return new L.Icon.Default();
    };

    this.eventReceived = function(event) {
        if(!event.latlng) {
            // not every event has a location
            return;
        }
        var trackerId = event.tracker_id;
        var sessionId = event.event_session_id;
        if(!paths[trackerId]) {
            paths[trackerId] = {};
        }
        var tracker = paths[trackerId];
        if(!tracker[sessionId]) {
            tracker[sessionId] = {};
        }
        var session = tracker[sessionId];
        if(!session.path) {
            console.log("Create new path");
            session.path = new L.Polyline([event.latlng]);
        } else {
            session.path.addLatLng(event.latlng);
        }

        var angle = event.location.heading;
        if(!tracker.marker) {
            console.log("Create new marker");
            // TODO Compass makes slight flashing 
            tracker.marker = new L.Marker.Compass(event.latlng, {
                icon: pathIcon(angle)
            });
            tracker.marker.setIconAngle(angle);
        } else {
            tracker.marker.setLatLng(event.latlng);
            tracker.marker.setIcon(pathIcon(angle));
            tracker.marker.setIconAngle(angle);
        }

        if(mapView) {
            session.path.addTo(mapView);
            tracker.marker.addTo(mapView);
        }
    }
};
MapService.$inject = ['configuration'];
