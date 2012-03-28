
define([
    'underscore'
  , 'activity'
], function (_, Activity) {
    var settingsActivity = Activity.extend();

    settingsActivity.uid = "settingsActivity";
    settingsActivity.template = 'settings/index';


    settingsActivity.show = function(intent) {
        if (!this.rendered) {
            this.loading();
            Intent.create('settings:get').send(this, function(settings) {
                console.log(settings);
                var data = {
                    apiUrl: settings.get('apiUrl')
                  , login: settings.get('login')
                  , trackers: settings.get('trackers')
                }
                this.render(data, function() {
                    this.show(intent);
                });
            });
        } else {
            //
        }
    };
    settingsActivity.registerIntent('settings:main', settingsActivity.show);


    settingsActivity.delegate('.nav a', 'click',  function(el) {
        this.sel('.settings-panel').hide();
        this.sel(el.attr('href')).show();
        this.sel('.nav li.active').removeClass('active');
        el.parent().addClass('active');
        return false;
    }); 


    settingsActivity.registerIntent('stop:settingsActivity', function(intent) {
        console.log('asd');
        console.log(this.sel('form').serialize());
        Intent.create('settings:save').send();
    });

    return settingsActivity;
});

