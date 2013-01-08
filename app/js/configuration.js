'use strict';

var Configuration = function() {
    this.google = {};
    this.google.analyticsId = 'UA-3439345-5'; 
    this.ruuvitracker = {};
    this.ruuvitracker.url = 'http://dev-server.ruuvitracker.fi/api/v1-dev/';
    // center of Helsinki
    this.defaultLocation = new L.LatLng(60.168564, 24.941111);
    this.defaultZoom = 13;

    this.maps = [
        {title: "MML Perus",
         type: "leaflet",
         url: "http://tiles.kartat.kapsi.fi/peruskartta/{z}/{x}/{y}.jpg",
         attribution: "Maanmittauslaitos",
         maxZoom: 18
        },
        {title: "MML Orto",
         type: "leaflet",
         url: "http://tiles.kartat.kapsi.fi/ortokuva/{z}/{x}/{y}.jpg",
         attribution: "Maanmittauslaitos",
         maxZoom: 18,
         minZoom: 13,
        },
        {title: "MML Tausta",
         type: "leaflet",
         url: "http://tiles.kartat.kapsi.fi/taustakartta/{z}/{x}/{y}.jpg",
         attribution: "Maanmittauslaitos",
         maxZoom: 18
        },

        {title: "OpenStreetMap",
         type: "leaflet",
         url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
         attribution: "Map data &copy; <a href='http://openstreetmap.org'>OpenStreetMap</a> contributors, <a href='http://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>",
         maxZoom: 18
        },

        {title: "Google Roadmap",
         type: "google",
         // Possible types: SATELLITE, ROADMAP, HYBRID, TERRAIN
         map_type: 'ROADMAP',
         attribution: "Google Maps",
         maxZoom: 18
        },
        {title: "Google Satellite",
         type: "google",
         // Possible types: SATELLITE, ROADMAP, HYBRID, TERRAIN
         map_type: 'SATELLITE',
         attribution: "Google Maps",
         maxZoom: 18
        },
        {title: "Google Hybrid",
         type: "google",
         map_type: 'HYBRID',
         attribution: "Google Maps",
         maxZoom: 18
        },
        {title: "Google Terrain",
         type: "google",
         map_type: 'TERRAIN',
         attribution: "Google Maps",
         maxZoom: 18
        },

        {title: "Bing Aerial",
         type: "bing",
         api_key: "Anqm0F_JjIZvT0P3abS6KONpaBaKuTnITRrnYuiJCE0WOhH6ZbE4DzeT6brvKVR5",
         maxZoom: 18,
        }
    ];
};
