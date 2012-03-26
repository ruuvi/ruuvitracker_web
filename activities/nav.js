define([
    'activity'
  , 'intent'
], function(Activity, Intent) {
    var navActivity = Activity.extend();
    navActivity.uid = 'nav';

    navActivity.callbacks = [];
    /*navActivity.delegate('.map', 'click', function() {
        Intent.create('map:show').send();
        return false;
    });*/

    return navActivity;
});
