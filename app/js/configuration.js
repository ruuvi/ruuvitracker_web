'use strict';

var Configuration = function() {
    this.google = {};
    this.google.analyticsId = 'UA-3439345-5'; 
    this.ruuvitracker = {};
    this.ruuvitracker.url = 'http://dev-server.ruuvitracker.fi/api/v1-dev/'
    // center of Helsinki
    this.defaultLocation = new L.LatLng(60.168564, 24.941111);
    this.defaultZoom = 13;
    this.mapTileServer = {};
    this.mapTileServer.url = "http://tiles.kartat.kapsi.fi/peruskartta/{z}/{x}/{y}.jpg";
    this.mapTileServer.attribution = "Maanmittauslaitos";
    /*
    this.mapTileServer.url = "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    this.mapTileServer.attribution = "Map data &copy; <a href='http://openstreetmap.org'>OpenStreetMap</a> contributors, <a href='http://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>";
    */
};
