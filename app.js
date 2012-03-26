define([
    'jquery'
  , 'underscore'
  , 'backbone'
  // One Page Application
  , 'application'
  , 'activity'
  , 'intent'
  , 'component'
  , 'region'

  // Activities
  , 'activities/nav'
], function(
    $
  , _
  , Backbone
  // One Page Application
  , Application
  , Activity
  , Intent
  , Component
  , Region

  // Activities
  , navActivity
) {
    Activity.defaultTemplates = {
        loading: 'common/loading'
      , error: 'common/error'
    };

    Component.DEBUG = true;

    var app = Object.create(Application);

    app.DEBUG = true;
    window.app = app;
    window.Intent = Intent;

    app.defineComponent(navActivity);

    app.onInit(function() {
        Activity.container = $("#pages");
    });

    return app;
});

