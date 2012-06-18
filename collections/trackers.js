define(['backbone', 'models/tracker'], function(Backbone, Tracker) {
    return Backbone.Collection.extend({
        model: Tracker
      , url: function () {
            return app.getComponent('settings').getUrl() + '/api/v1-dev/trackers';
        }
      , parse: function(response) {
            return response.trackers;
        }
      , fetchWithSettings: function(opts) {
            var options = opts || {};
            Intent.create('settings:get').send(this, function(settings) {
                options.url = this.url() + '/' + settings.get('trackers').join(',');
                this.fetch(options);
            });
        }
      , toFormattedJSON: function() {
            return this.map(function(model) {
                return model.toFormattedJSON();
            });
        }
    });
});
