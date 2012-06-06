
define([
    'underscore'
  , 'activity'
  , 'intent'
  , 'collections/trackers'
], function(_, Activity, Intent, Trackers) {

    var initialCenter = new google.maps.LatLng(65.896427, 25.875664);

    var mapActivity = Activity.extend();

    mapActivity.uid = 'mapActivity';
    mapActivity.template = 'map/index';

    mapActivity._markers = [];

    mapActivity.show = function(intent) {
        if (!this.rendered) {
            this.loading();
            this.render({}, function() {
                this.show(intent);
            });
        } else {
            //
        }
    };

    mapActivity.registerIntent('map:show', mapActivity.show);

    mapActivity.initMap = function() {
        if (this.map) {
            throw "Map already initialized!";
        }

        var map = this.map = new google.maps.Map(
            this.sel('.map-container')[0],
            {
                zoom: 12
              , center: initialCenter
              //, disableDefaultUI: true
              //, zoomControl: false
              //, draggable: false
              //, disableDoubleClickZoom: true
              //, keyboardShortcuts: false
              //, scrollWheel: false
              , mapTypeId: google.maps.MapTypeId.ROADMAP
            }
        );

        this.trackers = new Trackers();

        this.trackers.on('reset', function(e) {
            console.log('tracker updated');
            Intent.create('map:loadEvents').send();
        });

        var me = this;
        google.maps.event.addListener(this.map, 'idle', function() {
            me.trackers.fetch();
            google.maps.event.clearListeners(me.map, 'idle');
        });

        return true;
    };

    mapActivity.onRender(mapActivity.initMap);

    mapActivity.loadEvents = function() {
        if (!this.trackers || this.trackers.length === 0) {
            return;
        }

        var me = this;
        this.trackers.each(function(tracker) {
            console.log('tracker::loadEvents', tracker);
            tracker.get('events').on('reset', function(events) {
                console.log('tracker::events', events);

                if (tracker.marker === undefined) {
                    events.each(function(ev) {
                        var marker = new google.maps.Marker({
                            position: new google.maps.LatLng(
                                ev.get('location').latitude
                              , ev.get('location').longitude
                            )
                          , map: me.map

                        });
                        me._markers.push(marker);

                        if (me._markers.length == 1) {
                            var loc = marker.getPosition();
                            console.log(loc);
                            me.map.setCenter(loc);
                        }

                    });

                    console.log(me);
                } else {
                    // set marker
                }
            });

            tracker.get('events').fetch();
        });

    };
    mapActivity.registerIntent('map:loadEvents', mapActivity.loadEvents);

    return mapActivity;
});
