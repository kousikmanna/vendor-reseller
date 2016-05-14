angular.module('becho')

.run(function($rootScope) {
  $rootScope.userDetails= {};
})

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

.controller('loginCtrl', function($scope, $rootScope, $state, $ionicPopup, $ionicModal, userService) {
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
                var token = response.data.token;
                localStorage.setItem('token', token);
                delete response.data.token;
                var user = JSON.stringify(response.data);
                localStorage.setItem('user', user);
                $rootScope.userDetails = response;
                console.log($rootScope.userDetails);
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
                var token = response.data[0].token;
                localStorage.setItem('token', token);
                delete response.data[0].token;
                var user = JSON.stringify(response.data[0]);
                localStorage.setItem('user', user);
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

.controller('ProductsCtrl', function($scope, $rootScope, $state, $ionicPopup, $ionicModal, userService) {
  $scope.base_url={}
  $scope.base_url.url = 'https://s3-ap-southeast-1.amazonaws.com/cashinnew/avatars/';
  $scope.product = {};
  userService.fetchProduct()
      .then(function(response){
        $scope.productList = response;
        console.log('$scope.productList', $scope.productList);
    }).catch(function(err){
        var alertPopup = $ionicPopup.alert({
            title: 'Product not found',
            template: 'Try after some time!'
        });
    });

    $scope.addProducts = function(){
       $state.go('tab.add-product');
    }

    $scope.productAdd = function(product){
      if($scope.product && $scope.product.productPic){
         delete $scope.product.productPic;
      }
      userService.productAdd(product)
          .then(function(response) {
            console.log('response',response)
              var alertPopup = $ionicPopup.alert({
                title: 'Product added',
                template: 'Product added successfully'
              });
          }).catch(function(err) {
             var alertPopup = $ionicPopup.alert({
                title: 'Product not added!',
                template: 'Product not added successfully!'
            });
        })

    }


    $scope.uploadProductPic = function (imgElem) {
      var fileInput = $('#fileinput');
      var filetypeImage = imgElem.files[0].name.split('.').pop();
      if(fileInput.get(0).files.length){
          if ((filetypeImage == "jpg") || (filetypeImage == "png") || (filetypeImage == "jpeg") || (filetypeImage == "JPG") || (filetypeImage == "PNG") || (filetypeImage == "JPEG")){
            $scope.showImageFormatError = false;
          }else{
            $scope.product.productPic  = '';
            $scope.showImageFormatError = true;
            $scope.uploadingProductPic = false;
            $scope.$apply();
            return false;
          }
          $scope.uploadingProductPic = true;
          var fileSize = fileInput.get(0).files[0].size; // in bytes
          var maxSize = 800000;
          if(fileSize>maxSize){
            $scope.profilePicSizeError = true;
            $scope.uploadingProductPic = false; 
            $scope.$apply();
              return false;
          }else{
            $scope.profilePicSizeError = false;
            $scope.$apply();
          }
      }else{
          $scope.uploadingProductPic = false; 
          return false;
      }
      $scope.$apply();    
      var el = imgElem;
      if(imgElem.files[0]){
        $scope.imageData = {};
        var photofile = imgElem.files[0];
        $scope.attach_name = photofile.name;
        $scope.pathForImage = imgElem.files[0].name;
        $scope.$apply();
        var ext = photofile.name.split(".");
        $scope.imageData.ext = ext[ext.length-1];
        var FR= new FileReader();
        FR.readAsDataURL(photofile);
        FR.onload = function (e) {
          $scope.imageData.data = e.target.result.split(",")[1];
          console.log('imageData',$scope.imageData);
          // var imgData = JSON.stringify($scope.imageData.data);   
          // console.log(imgData); 
          userService.uploadProductPic($scope.imageData).then(function(imageUrl){
            console.log('imageUrl',imageUrl);
            $scope.uploadingProductPic = false;
             // console.log('$scope.user1',$scope.user);
            $scope.product.productPic = imageUrl;
           
            var imageName = imageUrl.split("/").pop(-1)
            $scope.product.image = new Array;
            $scope.product.image.push(imageName);
            console.log('$scope.product',$scope.product);
            // console.log('$scope.user2',$scope.user);
          }).catch(function(err){   
            $scope.uploadingProductPic = false;  
            $scope.error = err.message;     
          });
        };
      }   
    };

})

.controller('ChatDetailCtrl', function($scope, $stateParams) {})

.controller('AccountCtrl', function($scope, $rootScope, userService, $ionicPopup) {
  $scope.user = $rootScope.userDetails.data;
  if($scope.user == undefined || $scope.user == null){
     $scope.user={};
  }
  console.log($scope.user);
  $scope.updateaccount = function(user) {
      userService.updateAccount(user)
        .then(function(response) {
          var alertPopup = $ionicPopup.alert({
            title: 'Account settings',
            template: 'Your details has been updated successfully.'
          });
          $scope.user = response.vendor[0];
          console.log(response);
        }).catch(function(err) {
          console.log('err-------->',err)
        })
  }

   $scope.uploadProfilePic = function (imgElem) {
      var fileInput = $('#fileinput');
      var filetypeImage = imgElem.files[0].name.split('.').pop();
      if(fileInput.get(0).files.length){
          if ((filetypeImage == "jpg") || (filetypeImage == "png") || (filetypeImage == "jpeg") || (filetypeImage == "JPG") || (filetypeImage == "PNG") || (filetypeImage == "JPEG")){
            $scope.showImageFormatError = false;
          }else{
            $scope.user.profilePic  = '';
            $scope.showImageFormatError = true;
            $scope.uploadingProfilePic = false;
            $scope.$apply();
            return false;
          }
          $scope.uploadingProfilePic = true;
          var fileSize = fileInput.get(0).files[0].size; // in bytes
          var maxSize = 800000;
          if(fileSize>maxSize){
            $scope.profilePicSizeError = true;
            $scope.uploadingProfilePic = false; 
            $scope.$apply();
              return false;
          }else{
            $scope.profilePicSizeError = false;
            $scope.$apply();
          }
      }else{
          $scope.uploadingProfilePic = false; 
          return false;
      }
      $scope.$apply();    
      var el = imgElem;
      if(imgElem.files[0]){
        $scope.imageData = {};
        var photofile = imgElem.files[0];
        $scope.attach_name = photofile.name;
        $scope.pathForImage = imgElem.files[0].name;
        $scope.$apply();
        var ext = photofile.name.split(".");
        $scope.imageData.ext = ext[ext.length-1];
        var FR= new FileReader();
        FR.readAsDataURL(photofile);
        FR.onload = function (e) {
          $scope.imageData.data = e.target.result.split(",")[1];
          console.log('imageData',$scope.imageData);
          // var imgData = JSON.stringify($scope.imageData.data);   
          // console.log(imgData); 
          userService.uploadProfilePic($scope.imageData).then(function(response){
            console.log('response',response);
            $scope.uploadingProfilePic = false;
             // console.log('$scope.user1',$scope.user);
            $scope.user.profilePic = response;
            // console.log('$scope.user2',$scope.user);
          }).catch(function(err){   
            $scope.uploadingProfilePic = false;  
            $scope.error = err.message;     
          });
        };
      }   
    };

});
