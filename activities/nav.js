define([
    'activity'
  , 'intent'
], function(Activity, Intent) {
    var navActivity = Activity.extend();
    navActivity.uid = 'nav';

    navActivity.template = 'nav/bar';

    navActivity.delegate('.map a', 'click', function() {
        Intent.create('map:show').send();
        this.setActive('.map');
        return false;
    });

    navActivity.delegate('.settings a', 'click', function() {
        Intent.create('settings:main').send();
        this.setActive('.settings');
        return false;
    });

    navActivity.setActive = function (selector) {
        this.sel('.active').removeClass('active');
        this.sel('li'+selector).addClass('active');
    }

    navActivity.onInit(function(intent) {
        if (!this.rendered) {
            this.loading();
            this.render({}, function() {
                //console.log('asd');
            });
        }
    });


    return navActivity;
});
