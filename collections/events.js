define(['backbone', 'models/event'], function(Backbone, Event) {
    return Backbone.Collection.extend({
        model: Event
      , url: function () {
            return app.getComponent('settings').getUrl() + '/api/v1-dev/events';
      }
      , parse: function(response) {
            return response.events;
        }
      , toFormattedJSON: function() {
            return this.map(function(model) {
                return model.toFormattedJSON();
            });
        }
    });
});
