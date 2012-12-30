'use strict';

var Configuration = function() {
    this.google = {};
    this.google.analyticsId = 'UA-3439345-5'; 
    this.ruuvitracker = {};
    this.ruuvitracker.url = 'http://dev-server.ruuvitracker.fi/api/v1-dev/'
    // center of Helsinki
    this.defaultLocation = new L.LatLng(60.168564, 24.941111);
    this.defaultZoom = 13;
};
