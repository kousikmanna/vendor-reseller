angular.module('becho')

.controller('UserCtrl', function($scope, $rootScope, $state, $ionicPopup, $ionicModal, $ionicLoading, $timeout, userService) {
    $scope.signUpPage = function() {
        $state.go('signup');
    }
    $scope.LoginPage = function() {
        $state.go('login');
    }

    $scope.login = function(user) {
      $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
          });
        userService.login(user)
            .then(function(response) {
              $ionicLoading.hide();
                var token = response.data.token;
                localStorage.setItem('becho_token', token);
                delete response.data.token;
                var user = JSON.stringify(response.data);
                localStorage.setItem('becho_user', user); 
                $rootScope.userDetails = response;
                $rootScope.userPermissionAs = JSON.parse(localStorage.getItem('becho_user'));
                console.log('userdeta---------->',$rootScope.userPermissionAs);
                $state.go('tab.dash', {}, {reload: true});
            }, function(err) {
              $ionicLoading.hide();
              var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Please check your credentials!'
              });
            });
    }

    $scope.signUp = function(user) {
        var roleList = new Array();
        if(user.role[0] != undefined && user.role[0] != "NO"){
          roleList.push(user.role[0]);
        }
        if(user.role[1] != undefined && user.role[1] != "NO"){
          roleList.push(user.role[1]);
        }
        user.role = roleList; 
        $ionicLoading.show({
          content: 'Loading',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
        });
        console.log('user',user);
        userService.signUp(user)
          .then(function(response) {
              $ionicLoading.hide();
              $scope.openModal();
              $scope.user_id = response.id;
          }).catch(function(err) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'signup failed!',
                template: 'Please check your Details!'
            });
        })
    }

    $scope.verifyOtp = function(abc) {
        userService.verifyotp(abc, $scope.user_id)
            .then(function(response) {
                var token = response.data[0].token;
                localStorage.setItem('becho_token', token);
                delete response.data[0].token;
                var user = JSON.stringify(response.data[0]);
                localStorage.setItem('becho_user', user);
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