
define([
    'underscore'
  , 'activity'
  , 'hbs!tmpls/settings/index'
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
                  , username: settings.get('username')
                  , trackers: settings.get('trackers').join(',')
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

    // General-pangel
    settingsActivity.delegate('#settings-general form', 'submit', function(el) {
        var data = $(el).serializeArray();
        Intent.create('settings:set', data).send();
        return false;
    });


    settingsActivity.delegate('#settings-trackers form', 'submit', function(el) {
        var data = $(el).serializeArray();
        Intent.create('settings:set', data).send();
        return false;
    });

    return settingsActivity;
});

