
require.config({
    baseUrl: '.'
  , hbs: {
      disableI18n: true
    }
  , shim: {
        'underscore': {
            exports: '_'
        }
      , 'jquery': {
            exports: '$'
        }
      , 'backbone': {
            deps: ['underscore', 'jquery']
          , exports: 'Backbone'
        }
      , 'bb-relational': {
            deps: ['backbone']
          , exports: 'Backbone.Relational'
        }
  }

  , paths: {
        'jquery':     'vendor/jquery-1.7.2.min'
      , 'Handlebars': 'vendor/requirejs-handlebars/Handlebars'
      , 'hbs':        'vendor/requirejs-handlebars/hbs'
      , 'underscore': 'vendor/underscore/underscore-min'
      , 'backbone' :  'vendor/backbone/backbone-min'
      , 'domReady':   'vendor/requirejs/domReady'
      , 'json2':      'vendor/json2'
      , 'tmpl':       'vendor/tmpl'
      , 'bb-relational': 'vendor/Backbone-relational/backbone-relational'

      , 'application': 'vendor/opa/application'
      , 'activity':    'vendor/opa/activity'
      , 'service':     'vendor/opa/service'
      , 'intent':      'vendor/opa/intent'
      , 'component':   'vendor/opa/component'
      , 'region':      'vendor/opa/region'
      , 'store':       'vendor/opa/store'
    }
});

define(function() {return true;});
