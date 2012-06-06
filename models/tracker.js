define([
    'backbone'
  , 'bb-relational'
  , 'models/event'
  , 'collections/events'
], function(Backbone, r, Event, Events) {
    return Backbone.RelationalModel.extend({
        type: 'tracker'
      , defaults: {
            id: null
          , name: null
          , tracker_identifier: null
          , latest_activity: null
          , events: []
        }

      , relations: [{
            type: Backbone.HasMany
          , key: 'events'
          , relatedModel: Event
          , collectionType: Events
          , reverseRelation: {
                key: 'tracker'
            }
        }]
    });
});
