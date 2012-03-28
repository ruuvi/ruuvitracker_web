
var module = {
}
var require = {
    baseUrl: '.'
  //, hbs: {
      //disableI18n: true
  //}
  , paths: {
        'jquery':     'http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min'
      , 'Handlebars': 'vendor/requirejs-handlebars/handlebars'
      , 'hbs':        'vendor/requirejs-handlebars/hbs'
      , 'underscore': 'vendor/underscore/underscore-min'
      , 'backbone' :  'vendor/backbone/backbone-min'
      , 'domReady':   'vendor/requirejs/domReady'
      , 'json2':      'vendor/json2'
      , 'tmpl':       'vendor/tmpl'

      , 'application': 'vendor/opa/application'
      , 'activity':    'vendor/opa/activity'
      , 'service':     'vendor/opa/service'
      , 'intent':      'vendor/opa/intent'
      , 'component':   'vendor/opa/component'
      , 'region':      'vendor/opa/region'
      , 'store':       'vendor/opa/store'
    }
  , priority: ['jquery']
};

