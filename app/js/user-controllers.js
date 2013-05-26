'use strict';

function updateNavi($location, pageClass) {
    $('ul.nav li').removeClass('active')
    var curr = $('.' + pageClass);
    curr.addClass("active");
}

/* Controllers */
function successHandler($scope, $log, logMsg, feedbackMsg) {
    return function(e) {
        $log.info(logMsg);
        $scope.feedback = {success: true, 
                           message: feedbackMsg,
                           tracker: e.tracker};
    };
}

function errorHandler($scope, $log, logPostfix, feedbackPostfix) {
    return function(e) {
        var data = e.data;
        var msg;
        if(data.error && data.error.message) {
            $log.info("Failed to " + logPostfix, data.error.message);
            msg=data.error.message;
            } else {
                $log.info("Failed to " + logPostfix, data.status);
                msg="Failed to " + feedbackPostfix;
            }
            $scope.feedback = {error: true, message: msg};
    };
}

function validEmail($scope, username) {
    if(!username || typeof(username) == 'undefined') {
        // browser may accept 'foo@email', but it is passed as
        // undefined to here
        $scope.feedback = {error: true, 
                               message: "Email address is required."};
        return false;
    }
    return true;
}

function CreateUserCtrl($log, $scope, $location, userResource) {
    updateNavi($location, 'page-users');
    $scope.createUser = function(username, password, retyped_password) {
        if(!validEmail($scope, username)) {
            return;
        }
        if(password != retyped_password) {
            $scope.feedback = {error: true, 
                               message: "Passwords do not match."};
            return;
        }

        if(!password) {
            $scope.feedback = {error: true, 
                               message: "Password is required."};
            return;
        }

        var success = successHandler($scope, $log,
                                     "Successfully created new user",
                                     "User account " + username + " has been created."); 
        var error = errorHandler($scope, $log, 
                                 "create user " + username, 
                                 "create user. Try again later.");

        var result = userResource.create({user: {username: username, 
                                                 email: username, 
                                                 password: password}}, 
                                         success, error);   
    }
}

function AuthenticationCtrl($log, $scope, $location, authResource) {
    updateNavi($location, 'page-users');
    $scope.loginUser = function(username, password) {
        if(!validEmail($scope, username)) {
            return;
        }

        var success = successHandler($scope, $log,
                                     "User " + username + " logged in",
                                     "User account " + username + " has been created."); 
        var error = errorHandler($scope, $log, 
                                 "login " + username, 
                                 "login. Try again later.");

        var result = authResource.authenticate({user: {username: username, 
                                                       password: password}}, 
                                               success, error);
    }
}

function GroupsListCtrl($log, $scope, $location, userResource) {
    $scope.groups = [{id:1, name: "ryhma1"},
                     {id:2, name: "ryhma2"}];

}

function CreateGroupCtrl($log, $scope, $location, groupResource) {
    $scope.createGroup = function() {
        var success = successHandler($scope, $log, 
                                     "Creating a new group " + group.name, 
                                     "Group  " + group.name + " has been created."); 
        var error = errorHandler($scope, $log, 
                                 "create group " + group.name, 
                                 "create group. Try again later");
        groupResource.create({group: group.name}, success, error);
    }
}
