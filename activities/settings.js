define([
    'underscore'
  , 'activity'
  , 'collections/trackers'
  , 'hbs!tmpls/settings/index'
], function (_, Activity, Trackers) {
    var settingsActivity = Activity.extend();

    settingsActivity.uid = "settingsActivity";
    settingsActivity.template = 'settings/index';


    settingsActivity.show = function(intent) {
        if (!this.rendered) {
            this.loading();
            Intent.create('settings:get').send(this, function(settings) {
                var data = {
                    apiUrl: settings.get('apiUrl')
                  , username: settings.get('username')
                  , selectedTrackers: settings.get('trackers')
                };


                var trcs = new Trackers()
                  , me = this;
                trcs.fetch({success: function(trackers) {

                    data.allTrackers = _.map(trackers.toJSON(), function(obj) {
                        console.log(obj.id, _.indexOf(data.selectedTrackers, obj.id) !== -1, data.selectedTrackers);
                        if (_.indexOf(data.selectedTrackers, obj.id) !== -1) {
                            obj.isActive = true;
                        }
                        return obj;
                    });

                    me.render(data, function() {
                        console.log(data);
                        this.show(intent);
                    });
                }});
            });
        } else {
            //
        }
    };

    settingsActivity.registerIntent('settings:main', settingsActivity.show);

    settingsActivity.delegate('.submenu a', 'click',  function(el) {
        this.sel('.settings-panel').hide();
        this.sel(el.attr('href')).show();
        this.sel('.submenu li.active').removeClass('active');
        el.parent().addClass('active');
        return false;
    }); 

    // General-pangel
    settingsActivity.delegate('#settings-general form', 'submit', function(el) {
        var data = $(el).serializeArray();
        Intent.create('settings:set', data).send();
        return false;
    });


    settingsActivity.delegate('.trackers a', 'click', function(el) {
        $(el).parent().toggleClass('active');
        var trackers = this.sel('.trackers li[class*="active"]').map(function() {
            return $(this).data('id');
        }).get();
        console.log('clicked tracker', el, trackers);
        Intent.create('settings:trackers:set', trackers).send();
        return false;
    });

    return settingsActivity;
});

