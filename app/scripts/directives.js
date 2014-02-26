'use strict';

/* Directives */

angular.module('ruuvitracker.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]).
    directive('demopassword', 
              function() {

                  return {
                      require: 'ngModel',
                      link: function(scope, elm, attrs, ctrl) {
                          ctrl.$parsers.unshift(function(viewValue) {

                              var expected = ["#" + "ruu" + "vi", "enK".replace(/n/,"nN").toLowerCase().replace(/nn/,"n").replace(/(k)/,"$1$1i")].join("p");
                              if(viewValue == expected) {
                                  ctrl.$setValidity('demoPassword', true);
                                  return viewValue;
                              } else {
                                  ctrl.$setValidity('demoPassword', false);
                                  return undefined;
                              }
                          });
                      }
                  };
              });
