
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

    mapActivity._markers = {};

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
        var id = 1;
        console.log(this.trackers.url());
        this.trackers.fetch({
            url: this.trackers.url() + "/" + id
          , success: function(trs) {
                console.log(trs);
                Intent.create('map:loadEvents').send();
            }
        });

        //google.maps.event.addListener(this.map, 'dragend', _.bind(this.onDragend, this));
        return true;
    };

    mapActivity.onRender(mapActivity.initMap);

    mapActivity.loadEvents = function() {
        if (this.trackers === null || this.trackers.models === null || this.trackers.length == 0) {
            return;
        }
        console.log(this.trackers);

        _.each(this.trackers.models, function(tracker) {
            console.log(tracker);
            tracker.getEvents(function(events) {
                console.log(events);
                if (tracker.marker === undefined) {
                    // create new marker
                } else {
                    // set marker
                }
            });
        });

    }
    mapActivity.registerIntent('map:loadEvents', mapActivity.loadEvents);

    return mapActivity;
});
