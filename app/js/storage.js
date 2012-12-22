'use strict';

var StorageService = function() {
    // TODO add support for cookies
    var useLocalStorage = function() {
        return localStorage;
    };

    var storeLocalStorage = function(key, data) {
        localStorage.setItem(key, data);
    };

    var fetchLocalStorage = function(key) {
        return localStorage.getItem(key);
    };

    var removeLocalStorage = function(key) {
        localStorage.removeItem(key);
    };

    var storeCookie = function(key, data) {
        console.log("storeCookie() not implemented yet");
    };

    var fetchCookie = function(key) {
        console.log("fetchCookie() not implemented yet");
    };

    var removeCookie = function(key) {
        console.log("removeCookie() not implemented yet");
    };

    /* Store data as JSON serialized string and 
       associate data with key */
    this.store = function(key, data) {
        if(useLocalStorage() ) {
            storeLocalStorage(key, JSON.stringify(data));
        } else {
            storeCookie(key, JSON.stringify(data));
        }
    };

    /* Fetch data associated to key and deserialize as JSON. Retunr
       defaultValue if data is not found */
    this.fetch = function(key, defaultValue) {
        var data = undefined;
        if(useLocalStorage() ) {
            data = fetchLocalStorage(key);
        } else {
            data = fetchCookie(key);
        }
        if(!data) {
            return defaultValue
        }
        // TODO exception handling in case for corrupt data
        return JSON.parse(data);
    };

    /* Remove data associated with key */
    this.remove = function(key) {
        if(useLocalStorage() ) {
            removeLocalStorage(key);
        } else {
            removeCookie(key);
        }
    }
};
