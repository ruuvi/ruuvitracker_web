'use strict';

function AuthService($log, authResource) {
  console.log('AuthResource created');
  // TODO check cookie first
  this.user = {authenticated: false};

  var userState = this.user;
  this.login = function(username, password, success, error) {

    var requestSuccess = function (response) {
      userState.authenticated = response.authenticated;
      if(response.authenticated) {
        success(response.user);
      } else {
        error(response.message);
      }
    };
    var requestError = function(e) {
      console.log('error', e);
      if(error) {
        error(e);
      }
    };
    var result = authResource.login({user: {username: username,
                                            password: password}},
                                    requestSuccess, requestError);
  };
  this.logout = function() {
    $log.debug('User ' + userState.name + ' logging out');
    authResource.logout();
    userState.authenticated = false;
  };
}
