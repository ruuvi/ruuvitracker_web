define(['backbone'], function(Backbone) {
    return Backbone.Model.extend({
        type: 'tracker'
      , defaults: {
            id: null
          , name: null
          , tracker_identifier: null
          , latest_activity: null
          , events: []
        }
      , toFormattedJSON: function() {
            var data = this.toJSON();

            return data;
        }
      , getEvents: function(callback) {
            var tracker = this;
            require(['collections/events'], function(Events) {
                var events = new Events();
                events.fetch({
                    url: events.url() + '/' + tracker.id
                  , success: function() {
                      callback(events);
                    }
                });
            });
        }
    });
});
