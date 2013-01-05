'use strict';

var Configuration = function() {
    this.google = {};
    this.google.analyticsId = 'UA-3439345-5'; 
    this.ruuvitracker = {};
    this.ruuvitracker.url = 'http://dev-server.ruuvitracker.fi/api/v1-dev/'
    // center of Helsinki
    this.defaultLocation = new L.LatLng(60.168564, 24.941111);
    this.defaultZoom = 13;

    this.maps = [
        {title: "MML Perus",
         url: "http://tiles.kartat.kapsi.fi/peruskartta/{z}/{x}/{y}.jpg",
         attribution: "Maanmittauslaitos",
         maxZoom: 19
        },
        {title: "MML Orto",
         url: "http://tiles.kartat.kapsi.fi/ortokuva/{z}/{x}/{y}.jpg",
         attribution: "Maanmittauslaitos",
         maxZoom: 19,
         minZoom: 13,
        },
        {title: "MML Tausta",
         url: "http://tiles.kartat.kapsi.fi/taustakartta/{z}/{x}/{y}.jpg",
         attribution: "Maanmittauslaitos",
         maxZoom: 19
        }

        /*,
        {title: "OSM",
         url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
         attribution: "Map data &copy; <a href='http://openstreetmap.org'>OpenStreetMap</a> contributors, <a href='http://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>",
         maxZoom: 18
        }*/
    ];
};
