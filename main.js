require([
    'domReady'
  , 'app'
], function (domReady, app) {
    domReady(function() {
        app.start();
    });
});
