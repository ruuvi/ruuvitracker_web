'use strict';

var SoundService = function($log) {
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
        $log.info("playPing:");
        play("ping");
    };
};
