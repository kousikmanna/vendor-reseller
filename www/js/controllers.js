angular.module('becho')

.run(function($rootScope) {
  $rootScope.userDetails= {};
  if(localStorage.getItem('token') !== null){
    $rootScope.userPermissionAs = JSON.parse(localStorage.getItem('user'));
  }
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

.controller('loginCtrl', function($scope, $rootScope, $state, $ionicPopup, $ionicModal, $ionicLoading, userService) {
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
                localStorage.setItem('token', token);
                delete response.data.token;
                var user = JSON.stringify(response.data);
                localStorage.setItem('user', user);
                var getUser = 
                $rootScope.userDetails = response;
                $rootScope.userPermissionAs = JSON.parse(localStorage.getItem('user'));
                console.log($rootScope.userDetails);
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
  };
  $scope.userType = {}
    var userRole = localStorage.getItem('user');
    if(userRole.vendor){
      $scope.userType.role = 'Vendor';
    }else if(userRole.reseller){
      $scope.userType.role = 'Reseller';
    }
    console.log('userRole',$scope.userType);
  $scope.chartConfig = {
        options: {
            chart: {
                type: 'column'
            }
        },
        yAxis: {
          tickInterval: 5,
            title: { 
              text: 'Number of Products'
            }
        },
        xAxis: {
            type: 'Products',
            categories: ["Jan", "Feb", "Mar", "Apr", "May"],
            title: { 
              text: 'Months'
            }
        },
        series: [{
          showInLegend: false, 
            data: [10, 15, 12, 8, 7],
            color: '#24b0d7'
        }],
        title: {
            text: 'Total Sales',
            style: {
              color: '#999'
            }   
        },

        loading: false
    }
})

.controller('ProductsCtrl', function($scope, $rootScope, $ionicHistory, $state, $ionicPopup, $stateParams, $ionicModal, userService) {
  $scope.base_url={}
  $scope.base_url.url = 'https://s3-ap-southeast-1.amazonaws.com/cashinnew/avatars/';
  $scope.product = {};
  $scope.getdayMonth  = function(date) {
    createdAt = new Date(date);
    createddate = createdAt.getDate();
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    createdMonth = monthNames[createdAt.getMonth()];
    console.log(createdAt);
    return createddate + ' ' + createdMonth;
  }
  userService.fetchProduct()
      .then(function(response){
        if(response != null){
            $scope.productList = response;
            console.log('$scope.productList', $scope.productList);
        }else{
            var alertPopup = $ionicPopup.alert({
                title: 'Product not found',
                template: 'Please add some products!'
            });
        }
        
    }).catch(function(err){
        var alertPopup = $ionicPopup.alert({
            title: 'Product not found',
            template: 'Try after some time!'
        });
    });
   
    // $scope.productCheckList = new Array();
    $scope.pushProductToReseller={};
    var productDetail = new Array();
    $scope.resellerIdList=[];
    $scope.pushProductToReseller.productList = productDetail;

    $scope.selectBtn = true;
    $scope.pushProductToList = function(productId, mrp) {
      $scope.selectBtn = false;
      console.log('productId',productId);
      var checkProduct = _.where($scope.pushProductToReseller.productList, {productId: productId});
      if(checkProduct && checkProduct.length > 0){
          $scope.pushProductToReseller.productList = _.without($scope.pushProductToReseller.productList, _.findWhere($scope.pushProductToReseller.productList, {productId: productId}));
      }else{
          var productObj ={};
          productObj.productId = productId;
          productObj.mrp = mrp;
          $scope.pushProductToReseller.productList.push(productObj);
      }
      console.log('$scope.pushProductToReseller.productList',$scope.pushProductToReseller.productList);
      
    }

    $scope.selectReseller = function(resellerId){
      console.log('resellerId', resellerId);
      var resellerNameList = _.where($scope.resellerIdList, {id: resellerId});
      if(resellerNameList && resellerNameList.length > 0){
           $scope.resellerIdList = _.without($scope.resellerIdList, _.findWhere($scope.resellerIdList, {id: resellerId}));
      
      }else{
        $scope.resellerIdList.push({id: resellerId});
      }
      console.log('$scope.resellerIdList', $scope.resellerIdList);
      
    }
    
    $scope.addProducts = function(){
       $state.go('tab.add-product');
    }

    $scope.productAdd = function(product){
      if($scope.product && $scope.product.productPic){
         delete $scope.product.productPic;
      }
      userService.productAdd(product)
          .then(function(response) {
            console.log('response',response);
              var alertPopup = $ionicPopup.alert({
                title: 'Product added',
                template: 'Product added successfully'
              });
              $state.go('tab.products');
              console.log('$scope.productList', $scope.productList); 
          }).catch(function(err) {
             var alertPopup = $ionicPopup.alert({
                title: 'Product not added!',
                template: 'Product not added successfully!'
            });
        })

    }

    $scope.pushProduct = function() {
      if($scope.pushProductToReseller.productList && $scope.pushProductToReseller.productList.length > 0){
            userService.resellerList()
            .then(function(response) {
              console.log('response',response);
              $scope.resellerList = response;
              $scope.openModal();
            }).catch(function(err) {
               var alertPopup = $ionicPopup.alert({
                  title: 'Reseller',
                  template: 'Reseller not found!'
              });
          })
        
      }else{
        var alertPopup = $ionicPopup.alert({
            title: 'select product',
            template: 'Please select product first then push!'
        });
      }
    }

    $scope.pushToSeseller = function(){
      if($scope.resellerIdList && $scope.resellerIdList.length == 0){
        var alertPopup = $ionicPopup.alert({
            title: 'Select Reseller',
            template: 'Please select reseller first then push!'
        });
      }else if($scope.resellerIdList && $scope.resellerIdList.length > 1){
        var alertPopup = $ionicPopup.alert({
            title: 'Select Reseller',
            template: 'At a time you can select one reseller!'
        });
      }else if($scope.resellerIdList && $scope.resellerIdList.length == 1){
          $scope.pushProductToReseller.reseller = $scope.resellerIdList;
          userService.pushToSeseller($scope.pushProductToReseller)
            .then(function(response) {
              console.log('==response==',response);
              var alertPopup = $ionicPopup.alert({
                  title: 'Product Push',
                  template: 'Product pushed successfully'
              });
              $scope.closeModal();
              $state.go('tab.products');
            }).catch(function(err) {
               var alertPopup = $ionicPopup.alert({
                  title: 'Product Push',
                  template: 'Product not pushed successfully'
              });
              $scope.closeModal();
              $state.go('tab.products');
          })
      }
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

    $ionicModal.fromTemplateUrl('reseller-list.html', {
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
  // $window.location.reload(true);

})



.controller('ProductDetailCtrl', function($scope, $stateParams, $ionicSlideBoxDelegate, userService) {
  $scope.base_url={}
  $scope.base_url.url = 'https://s3-ap-southeast-1.amazonaws.com/cashinnew/avatars/';
  $scope.savediv = true;
  console.log('$stateParams.productId',$stateParams.productId);
  userService.getProduct($stateParams.productId)
      .then(function(response) {
        $scope.product = response;
        console.log('response',response);
      }).catch(function(err) {
        console.log(err);
      });

      $scope.nextSlide = function() {
        $ionicSlideBoxDelegate.next();
      }

    $scope.editProduct = function() {
      $scope.savediv = false;
    }

    $scope.save = function(product) {
      console.log('product',product);
      $scope.savediv = true;
      userService.updateProduct(product)
        .then(function(response) {
          console.log(response)
        }).catch(function(err) {
          console.log(err);
        }) 
    }
})

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

})

.controller('FeedCtrl', function($scope, $rootScope, $state, $ionicPopup, $ionicModal, $ionicLoading, userService) {
    console.log('FeedCtrl');
    $scope.base_url={}
    $scope.base_url.url = 'https://s3-ap-southeast-1.amazonaws.com/cashinnew/avatars/';
    userService.fetchFeed()
      .then(function(response){
        console.log('data',response);
        if(response != null){
            $scope.feedList = response.vendor[0].productlist;
            console.log('$scope.feedList', $scope.feedList);
        }else{
            var alertPopup = $ionicPopup.alert({
                title: 'Feed',
                template: 'Feed not found!'
            });
        }
        
    }).catch(function(err){
        var alertPopup = $ionicPopup.alert({
            title: 'Feed',
            template: 'Try after some time!'
        });
    });
})


