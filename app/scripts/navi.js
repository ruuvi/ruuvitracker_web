'use strict';


function MainNaviCtrl($log, $scope, AuthService, $location) {
  $scope.user = AuthService.user;

  $scope.logout = function() {
    AuthService.logout();
    $location.path('/');
  };
}

var navi = angular.module('navi', []);
navi.controller('MainNaviCtrl', MainNaviCtrl);
