define([
    'underscore'
  , 'backbone'
  , 'component'
  , 'intent'
], function(_, Backbone, Component, Intent) {

    var SettingsModel = Backbone.Model.extend({
        defaults: {
            //apiUrl: "http://hollow-mountain-6463.herokuapp.com/",
            apiUrl: "http://ruuvi-server.herokuapp.com"
          , username: null
          , password: null
          , trackers: [1]
        }
    });

    var settings = Component.extend();
    settings.uid = 'settings';
    settings.data = new SettingsModel();

    settings.registerIntent('predefined', function (intent) {
        settings.data.set(intent.data);
        Intent.create('settings:changed').send();
    });

    settings.onInit(function() {
        this._load();
    });

    settings._load = function(callback) {
        var ls = localStorage.getItem('settings');
        console.log('load localstorage', ls);
        if (ls !== undefined && ls !== null) {
            try {
                this.data.set(JSON.parse(ls));
                console.log(this.data);
                return;
            } catch(e) {
                /* handle error */
            }
        }
        this._save();
    };

    settings._save = function() {
        var inst = this
          , data = this.data.toJSON();


        console.log(data);
        localStorage.setItem('settings', JSON.stringify(data));
    };

    settings.registerIntent('settings:trackers:set', function(intent) {
        if (!_.isEqual(this.data.get('trackers'), intent.data)) {
            this.data.set({trackers: _.clone(intent.data)});

            this.data.set('trackers', intent.data);
            //this.getTrackers(intent);
            this._save();
        }
    });

    settings.registerIntent('settings:trackers:get', function (intent) {
        Intent.create('tracker:get', this.data.get('trackers')).send(this, function (err, trackers) {
            intent.respond(err, trackers);
        });
    });

    settings.registerIntent('settings:get', function (intent) {
        intent.respond(this.data);
    });

    settings.registerIntent('settings:set', function (intent) {
        _.each(intent.data, function(data) {
            if (data.name == 'trackers') {
                data.value = data.value.split(',');
            }
            this.data.set(data.name, data.value);
        }, this);

        console.log(this.data);
        this._save();
        Intent.create('settings:changed', this.data.toJSON()).send();
    });

    settings.getUrl = function() {
        return this.data.get('apiUrl');
    };
    settings.registerIntent('settings:apiUrl', function(intent) {
        intent.respond(this.getUrl());
    });


    return settings;
});
