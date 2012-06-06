define(['backbone', 'models/tracker'], function(Backbone, Tracker) {
    return Backbone.Collection.extend({
        model: Tracker
      , url: function () {
            return app.getComponent('settings').getUrl() + '/api/v1-dev/trackers';
        }
      , parse: function(response) {
            return response.trackers;
        }
      , toFormattedJSON: function() {
            return this.map(function(model) {
                return model.toFormattedJSON();
            })
        }
    });
});
