'use strict';

function updateNavi($location, pageClass) {
    $('ul.nav li').removeClass('active')
    var curr = $('.' + pageClass);
    curr.addClass("active");
}

/* Controllers */

function CreateUserCtrl($log, $scope, $location, userResource) {
    updateNavi($location, 'page-users');
    $scope.createUser = function(email, password, retyped_password) {
        if(password != retyped_password) {
            $scope.feedback = {error: true, 
                               message: "Passwords do not match."};
            return;
        }
        function success(e) {
            $log.info("Successfully created new user", e.tracker);
            $scope.feedback = {success: true, 
                               message: "User account " + email + " has been created.",
                               tracker: e.tracker};
        };
        function error(e) {
            var data = e.data;
            var msg;
            if(data.error && data.error.message) {
                $log.info("Failed to create user", data.error.message);
                msg=data.error.message;
            } else {
                $log.info("Failed to create user:", data.status);
                msg="Failed to create user. Try again later.";
            }
            $scope.feedback = {error: true, message: msg};
        };
        var result = userResource.create({user: {username: email, email: email, 
                                                 password: password}}, 
                                         success, error);   
    }
}

function AuthenticationCtrl($log, $scope, $location, authResource) {
    updateNavi($location, 'page-users');
    $scope.loginUser = function(username, password) {
        console.log(username, password);
        function success(e) {
            $log.info("User " + username + " logged in");
            $scope.feedback = {success: true, 
                               message: "User account " + username + " has been created.",
                               tracker: e.tracker};
        };
        function error(e) {
            var data = e.data;
            var msg;
            if(data.error && data.error.message) {
                $log.info("Failed to login user user " + username, data.error.message);
                msg=data.error.message;
            } else {
                $log.info("Failed to login " + username, data.status);
                msg="Failed to login. Try again later.";
            }
            $scope.feedback = {error: true, message: msg};
        };
        var result = authResource.authenticate({user: {username: username, 
                                                       password: password}}, 
                                               success, error);
        
    }
 
}
