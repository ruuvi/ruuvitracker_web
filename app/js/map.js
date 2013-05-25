'use strict';

// See https://github.com/CloudMade/Leaflet/issues/386
// TODO replace with this? 
// https://github.com/shramov/leaflet-plugins/blob/master/examples/marker-rotate.html
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

var MapService = function($log, $rootScope, configuration, storageService, trackerService) {
    // TODO move these to $rootScope?
    var mapView = undefined;
    var selfLocation = undefined;
    var selfMarker = undefined;

    var paths = {};
    $rootScope.sendLocationToServer = false;

    var createMapTiles = function() {
        var tiles = [];
        for(var i = 0; i < configuration.maps.length; i ++) {
            var mapTiles = configuration.maps[i];

            var opts = {title: mapTiles.title,
                        attribution: mapTiles.attribution,
                        maxZoom: mapTiles.maxZoom,
                        minZoom: mapTiles.minZoom || 0};
            var tileLayer = undefined;

            if(mapTiles.type == 'google') {
                tileLayer = new L.Google(mapTiles.map_type, opts);
            } else if(mapTiles.type == 'bing') {
                opts.type = mapTiles.map_type;
                tileLayer = new L.BingLayer(mapTiles.api_key, opts);
            } else {
                var url = mapTiles.url;
                tileLayer = new L.TileLayer(url, opts);
            }
            tiles.push(tileLayer);
        }
        return tiles;
    }

    var storeMapState = function(event) {
        var zoom = mapView.getZoom();
        var location = mapView.getCenter();
        var data = storageService.fetch("map-location", {});
        if(event.layer && event.layer.options.title) {
            data.tiles = event.layer.options.title
        }
        data.zoom = zoom; 
        data.lat = location.lat;
        data.lng = location.lng;
        data.timestamp = new Date().getTime();
        storageService.store("map-location", data);
    };

    var updateMarker = function(marker, newLocation, options) {
        if(!newLocation) {
            return marker;
        }
        if(!marker) {
            $log.info("options", options);
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
        $log.info("loadInitialLocation:", location);
        var data = storageService.fetch("map-location");
        var zoom = configuration.defaultZoom;
        // TODO error handling for corrupt data
        if(data) {
            $log.info("found existing data", data);
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
        $log.info("updateSelfLocation:", newLocation);
        selfLocation = newLocation;
        selfMarker = updateMarker(selfMarker, newLocation, 
                                  {icon: new L.Icon(
                                      {iconUrl: "img/pin-cross.png",
                                       iconSize: [20, 25],
                                       iconAnchor: [10, 25],
                                       popupAnchor: [-3, -76],
                                       className: "self-location"})
                                  });
    };

    var startLocating_internal = function(map) {
        $log.info("startLocating:");
        var opts = {timeout: 10000,
                    maximumAge: 10000,
                    enableHighAccuracy: true,
                    watch: true};
        map.locate(opts);
    };

    function isTouchDevice() {
        return !!('ontouchstart' in window) // works on most browsers 
            || !!('onmsgesturechange' in window); // works on ie10
    }

    this.isTouchDevice = isTouchDevice;

    var create = function(canvasId, startingLocation) {
        $log.info("create:" + canvasId);
        var tiles = createMapTiles();
        var map = new L.Map(canvasId, 
                            {zoom: configuration.defaultZoom,
                             zoomControl: false,
                             });

        // restore selected map layer
        var mapState = storageService.fetch("map-location", {});
        if(mapState.tiles) {
            var defaultLayer = _.find(tiles, function(layer) {
                return layer.options.title == mapState.tiles;
            });
            if(defaultLayer) {
                map.addLayer(defaultLayer);
            } else {
                map.addLayer(tiles[0]);
            }
        } else {
            map.addLayer(tiles[0]);
        }

        var baseMaps = {};
        for(var i = 0; i < tiles.length; i ++) {
           var tile = tiles[i];
            baseMaps[tile.options.title] = tile;
        }

        if(!isTouchDevice()) {
            // disable zoom for touch devices
            L.control.zoom().addTo(map);
        }
        L.control.layers(baseMaps).addTo(map);
        // TODO use geolocation api instead
        // leaflet api loses information
        // TODO tracking user location should be separate service
        map.on("locationfound", function(event) {
            $log.info("location found", event);
            if($rootScope.sendLocationToServer) {
                trackerService.sendEvent(event);
            }
            updateSelfLocation(event.latlng, event.accuracy);
        });
        map.on("locationerror", function(event) {
            $log.info("location error", event);
        });
        var hour = 60 * 60;
        loadInitialLocation(map, startingLocation, hour);
        // listen for move and zoom events so that location can be restored
        map.on("zoomend", storeMapState);
        map.on("moveend", storeMapState);
        map.on("layeradd", storeMapState);

        L.control.scale().addTo(map);
        startLocating_internal(map);
        return map;
    };

    var redisplay = function(canvasId) {
        $log.info("redisplay:" + canvasId);
        var oldContainer = mapView.getContainer();
        var newContainer = $('#' + canvasId);
        newContainer.replaceWith(oldContainer);
        mapView.invalidateSize(false);
    };

    /* Open existing map or create new */
    this.open = function(canvasId, startLocation) {
        $log.info("open:" + canvasId);
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
        $log.info("centerOnSelf:");
        if(selfLocation) {
            this.center(selfLocation, mapView.getZoom());
        }
    }

    /* Center map on given location */
    this.center = function(location, zoom) {
        mapView.setView(location, zoom || configuration.defaultZoom);
    };

    /* Center map on give LatLngBounds object */
    this.centerBounds = function(bounds, maxZoom) {
        $log.info("centerBounds:", bounds.toBBoxString());
        mapView.fitBounds(bounds);
    }

    /* Center map on current self location */
    this.locate = function() {
        $log.info("locate:");
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
        $log.info("stopLocating:");
        mapView.stopLocate();
    };

    this.redraw = function() {
        mapView.invalidateSize(false);
    }

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
        if(event.location.accuracy) {
            if(event.location.accuracy > 100) {
                // skip low accuracy points
                return;
            }
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
            // http://gamedev.stackexchange.com/questions/46463/is-there-an-optimum-set-of-colors-for-10-players
            var colors = ['#ff8080',
                          '#78bef0',
                          '#ded16f',
                          '#cc66c9',
                          '#5dbaac',
                          '#f2a279',
                          '#7182e3',
                          '#92d169',
                          '#bf607c',
                          '#7cddf7',
                          ];
            var color_index = (sessionId || 0) % colors.length;
            session.path = new L.Polyline([event.latlng], 
                                          {color: colors[color_index],
                                           opacity: 0.75});
        } else {
            session.path.addLatLng(event.latlng);
        }

        var angle = event.location.heading;
        if(!tracker.marker) {
            $log.info("Create new marker");
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

        /** TODO if event is received before map is initialized, routes
            and markers are not shown.
            Map should read these (paths) when initializing
        */

        if(mapView) {
            session.path.addTo(mapView);
            tracker.marker.addTo(mapView);
            this.center(event.latlng, mapView.getZoom());
        }
    }
};
MapService.$inject = ['configuration'];
