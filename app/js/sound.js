'use strict';

var SoundService = function() {
    var pingUrl = "snd/ping.wav";
    var wavMime = "audio/wav"
    var map = {ping: pingUrl};

    var play = function(id) {
        if(!new Audio().canPlayType(wavMime)) {
            return;
        }
        var url = map[id];
        var audio = new Audio();
        audio.src = url;
        audio.type = wavMime;
        audio.play();        
    }

    /* Plays ping sound */
    this.playPing = function() {
        console.log("playPing:");
        play("ping");
    };
};
