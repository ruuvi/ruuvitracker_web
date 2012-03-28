define(['backbone'], function(Backbone) {
    return Backbone.Model.extend({
        type: 'event'
      , urlRoot: 'http://ruuvi-server.herokuapp.com/api/v1-dev/events'
      , defaults: {
            id: null
          , tracker_id: null
          , event_time: null
          , store_time: null
          , location: {
                lat: null
              , lon: null
            }
          , extension_values: {}
        }
      , toFormattedJSON: function() {
            var data = this.toJSON();
            return data;
        }
    });
});

