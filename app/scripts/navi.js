'use strict';


function MainNaviCtrl($log, $scope, $location, AuthService) {
  $scope.user = AuthService.user;

  $scope.logout = function() {
    AuthService.logout();
    $location.path('/');
  };
}

var navi = angular.module('navi', []);
navi.controller('MainNaviCtrl', ['$log', '$scope', '$location', 'AuthService',
                                 MainNaviCtrl]);
