'use strict';

function updateNavi($location, pageClass) {
    $('ul.nav li').removeClass('active')
    var curr = $('.' + pageClass);
    curr.addClass("active");
}

/* Controllers */

function CreateUserCtrl($scope, $log, $location, userResource) {
    updateNavi($location, 'page-users');
    // TODO debug
    $scope.username="foobar@example.com";
    $scope.password="foo";
    $scope.retyped_password="foo";
    $scope.jee="abc";
    var mathingPasswords = function(password, retyped) {

    };
    $scope.createUser = function(email, password, retyped_password) {
        console.log("creating user", email);
        if(password != retyped_password) {
            console.log("passwords do not match");
            $scope.feedback = {error: true, 
                               message: "Passwords do not match."};
            return;
        }
        function success(e) {
            console.log("Successfully created new user", e.tracker);
            $scope.feedback = {success: true, 
                               message: "User account " + email + " has been created.",
                               tracker: e.tracker};
        };
        function error(e) {
            var data = e.data;
            var msg;
            if(data.error && data.error.message) {
                console.log("Failed to create user", data.error.message);
                msg=data.error.message;
            } else {
                console.log("Failed to create user:", data.status);
                msg="Failed to create user. Try again later.";
            }
            $scope.feedback = {error: true, message: msg};
        };
        var result = userResource.create({user: {username: email, email: email, 
                                                 password: password}}, 
                                         success, error);
        
    }
 
}

function CreateTrackerCtrl2(analytics, $scope, $location, $resource, configuration) {
    updateNavi($location, 'page-link-trackers');
    // AngularJS silliness, must quote : in port number
    var url = configuration.ruuvitracker.url.replace(/:([01-9]+)/, '\\:$1');
    // TODO move to dependency injection/trackerService
    var Tracker = $resource(url + 'trackers', {},
                            {createTracker: {method: 'POST'}});

    $scope.generateSharedSecret = function() {
        var secret = '';
        var values = "wertyupadfghjkzxcvbm";
        values += "WERTYUPADFHJKLZXCVBNM";
        values += "234789";
        for(var i = 0; i < 20; i ++) {
            var index = Math.floor(Math.random()*values.length);
            secret += values[index];
        }
        $scope.shared_secret = secret;
    };
    $scope.createTracker = function(trackerCode,
        sharedSecret, trackerName, demoPassword) {
        var expected = ["#" + "ruu" + "vi", "enK".replace(/n/,"nN").toLowerCase().replace(/nn/,"n").replace(/(k)/,"$1$1i")].join("p");
        if(demoPassword != expected) {
            $scope.feedback = {error: true, message: "Wrong demo password"};
            return;
        }
        console.log("creating ", trackerCode);
        function success(e) {
            console.log("Successfully created new tracker", e.tracker);
            $scope.feedback = {success: true, 
                               message: "Successfully created new tracker",
                               tracker: e.tracker};
        };
        function error(e) {
            var data = e.data;
            var msg;
            if(data.error && data.error.message) {
                console.log("Failed to create tracker", data.error.message);
                msg=data.error.message;
            } else {
                console.log("Failed to create tracker:", data.status);
                msg="Failed to create tracker";
            }
            $scope.feedback = {error: true, message: msg};
        };
        var result = Tracker.createTracker({tracker: {name: trackerName, code: trackerCode, shared_secret: sharedSecret}}, success, error);
        
    }
}
