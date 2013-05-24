'use strict';

var Configuration = function() {
    this.google = {};
    this.google.analyticsId = 'UA-3439345-5'; 
    this.ruuvitracker = {};
    this.ruuvitracker.url = 'http://dev-server.ruuvitracker.fi/api/v1-dev/';
    this.ruuvitracker.url = 'http://localhost:8080/api/v1-dev/';

    // AngularJS silliness, must quote : in port number
    this.resourceUrl = this.ruuvitracker.url.replace(/:([01-9]+)/, '\\:$1');
    // center of Helsinki
    this.defaultLocation = new L.LatLng(60.168564, 24.941111);
    this.defaultZoom = 13;
    this.server = {};
    this.server.fetchSize = 100;

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
        {title: "CloudMade",
         type: "leaflet",
         url: "http://{s}.tile.cloudmade.com/3a812d3f38514cbd8437154fc333930d/997/256/{z}/{x}/{y}.png",
         attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
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
         map_type: 'Aerial',
         api_key: "AmubWuAsFPazPiBi8bT0BlpJNpvTJJ3bIp16jjZiEtcKEX11CMKDgtu1VKaJqxZL",
         maxZoom: 18,
        },
        {title: "Bing Aerial labels",
         type: "bing",
         map_type: 'AerialWithLabels',
         api_key: "AmubWuAsFPazPiBi8bT0BlpJNpvTJJ3bIp16jjZiEtcKEX11CMKDgtu1VKaJqxZL",
         maxZoom: 18,
        },
        {title: "Bing Road",
         type: "bing",
         map_type: 'Road',
         api_key: "AmubWuAsFPazPiBi8bT0BlpJNpvTJJ3bIp16jjZiEtcKEX11CMKDgtu1VKaJqxZL",
         maxZoom: 18,
        },
        
        // birdseye needs centerPoint parameter
        /*
        {title: "Bing Birdseye",
         type: "bing",
         map_type: 'Birdseye',
         api_key: "Anqm0F_JjIZvT0P3abS6KONpaBaKuTnITRrnYuiJCE0WOhH6ZbE4DzeT6brvKVR5",
         maxZoom: 18,
        },
        {title: "Bing Birdseye (l)",
         type: "bing",
         map_type: 'BirdseyeWithLabels',
         api_key: "Anqm0F_JjIZvT0P3abS6KONpaBaKuTnITRrnYuiJCE0WOhH6ZbE4DzeT6brvKVR5",
         maxZoom: 18,
        },
        */

    ];
};
