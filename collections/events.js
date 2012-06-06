define([
    'backbone'
  , 'models/event'
], function(Backbone, Event) {
    return Backbone.Collection.extend({
        model: Event
      , url: function (models) {
            var url = app.getComponent('settings').getUrl();
            url += '/api/v1-dev';

            if (this.tracker) {
                url += '/trackers/' + this.tracker.get('id');
            }

            url += '/events';
            return url;
      }
      , parse: function(response) {
            return response.events;
        }
    });
});
