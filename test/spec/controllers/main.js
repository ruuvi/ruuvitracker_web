'use strict';

describe('Controller: DefaultCtrl', function () {

  // load the controller's module
  beforeEach(module('ruuvitracker'));

  var MainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('DefaultCtrl', {
      $scope: scope
    });
  }));

  it('should not break', function () {
   // expect(scope.awesomeThings.length).toBe(3);
  });
});
