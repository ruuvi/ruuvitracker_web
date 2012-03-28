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
          , login: null
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
        if (ls === null) {
            this._save();
        } else {
            this.data.set(ls);
        }
        console.log('load localstorage', ls);
    }

    settings._save = function() {
        var inst = this
          , data = this.data;

        localStorage.setItem('settings', this.data);
    }

    settings.registerIntent('settings:trackers:set', function(intent) {
        if (!_.isEqual(this.data.get('trackers'), intent.data)) {
            this.data.set({trackers: _.clone(intent.data)});

            this.getTrackers(intent);
            this._save();
        }
    });

    settings.registerIntent('settings:trackers:get', function (intent) {
        Intent.create('tracker:get', this.data.get('trackers')).send(this, function (err, trackers) {
            intent.respond(err, trackers);
        });
    });

    settings.registerIntent('settings:get', function (intent) {
        console.log('got it!');
        intent.respond(this.data);
    });

    settings.registerIntent('settins:set', function (intent) {
        this.data.set(intent.data);
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
