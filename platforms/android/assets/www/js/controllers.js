angular.module('becho')

.controller('AppCtrl', function($scope, $state, $ionicPopup, userService) {
  // $scope.username = AuthService.username();

  // $scope.$on(AUTH_EVENTS.notAuthorized, function(event) {
  //   var alertPopup = $ionicPopup.alert({
  //     title: 'Unauthorized!',
  //     template: 'You are not allowed to access this resource.'
  //   });
  // });

  // $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
  //   AuthService.logout();
  //   $state.go('login');
  //   var alertPopup = $ionicPopup.alert({
  //     title: 'Session Lost!',
  //     template: 'Sorry, You have to login again.'
  //   });
  // });

  // $scope.setCurrentUsername = function(name) {
  //   $scope.username = name;
  // };
})

.controller('loginCtrl', function($scope, $state, $location, $stateParams, $ionicPopup, $ionicModal, userService) {
    $scope.loginPageShow = true;
    $scope.signup = false;
    $scope.signUpPage = function() {
        $scope.signup = true;
        $scope.loginPageShow = false;
    }
    $scope.LoginPage = function() {
        $scope.signup = false;
        $scope.loginPageShow = true;
    }

    $scope.login = function(user) {
        userService.login(user)
            .then(function(response) {
                console.log('response-------->',response);
                localStorage.setItem('becho', response.data.token);
                $state.go('tab.dash', {}, {reload: true});
            }, function(err) {
              var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Please check your credentials!'
              });
            });
    }

    $scope.signUp = function(user) {
        user.role = [];
        user.role.push(user.vendor, user.reseller);
        for(var i=0; i<user.role.length; i++) {
          if(user.role[i] === false || user.role[i] === 'undefined') {
            user.role.splice(i,1);
          }
        }
        userService.signUp(user)
          .then(function(response) {
              $scope.openModal();
              $scope.user_id = response.id;
          }).catch(function(err) {
            var alertPopup = $ionicPopup.alert({
                title: 'signup failed!',
                template: 'Please check your Details!'
            });
        })
    }

    $scope.verifyOtp = function(abc) {
        userService.verifyotp(abc, $scope.user_id)
            .then(function(response) {
                localStorage.setItem('becho', response.data[0].token);
                console.log('data----->', response);
                $scope.closeModal();
                $state.go('tab.account', {}, {reload: true});
            }).catch(function(err) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Verification failed',
                    template: 'Please enter correct OTP!'
                });
            })
    }

    $ionicModal.fromTemplateUrl('verify_otp.html', {
        scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.openModal = function() {
            $scope.modal.show();
        };
        $scope.closeModal = function() {
            $scope.modal.hide();
        };
          // Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });
          // Execute action on hide modal
        $scope.$on('modal.hidden', function() {
            // Execute action
        });
          // Execute action on remove modal
        $scope.$on('modal.removed', function() {
            // Execute action
        });
})

.controller('DashCtrl', function($scope, $state) {
  $scope.logout = function() {
    window.localStorage.clear();
    $state.go('login');
  }
})

.controller('ProductsCtrl', function($scope) {})

.controller('ChatDetailCtrl', function($scope, $stateParams) {})

.controller('AccountCtrl', function($scope, userService, $ionicPopup) {
  $scope.updateaccount = function(user) {
      userService.updateAccount(user)
        .then(function(response) {
          var alertPopup = $ionicPopup.alert({
            title: 'Account settings',
            template: 'Your details has been updated successfully.'
          });
          console.log('response-------->',response);
        }).catch(function(err) {
          console.log('err-------->',err)
        })
  }

});
