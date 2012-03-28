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
  , 'activities/map'
  , 'activities/nav'
  , 'activities/settings'

  // Services
  , 'services/settings'
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
  , mapActivity
  , navActivity
  , settingsActivity

  // Services
  , settings
) {
    Activity.defaultTemplates = {
        loading: 'common/loading'
      , error: 'common/error'
    };

    Component.DEBUG = true;
    Intent.DEBUG = true;

    var app = Object.create(Application);

    app.DEBUG = true;
    window.app = app;
    window.Intent = Intent;

    app.defineComponent(settings).start();
    app.defineComponent(mapActivity);
    app.defineComponent(navActivity);
    app.defineComponent(settingsActivity);

    app.predefined('nav');

    app.onInit(function() {

        Activity.container = $("#pages");

        //navActivity.start();
    });

    var mainActivities = [
        mapActivity
      , settingsActivity
    ];
    var currentActivity = null;

    // singleton for main activities
    _.each(mainActivities, function(activity) {
        var originalStart = activity.start;
        activity.start = function(intent) {
            if (originalStart.call(activity, intent)) {
                // activity is successfully started, delete previous one
                // If it's not the same activity
                if (currentActivity && currentActivity !== activity) {
                    currentActivity.stop();
                }

                currentActivity = activity;
            }
        }
    });

    return app;
});

