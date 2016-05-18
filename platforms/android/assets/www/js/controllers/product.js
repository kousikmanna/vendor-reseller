angular.module('becho')

.controller('ProductsCtrl', function($scope, $rootScope, $cordovaCamera, $ionicHistory, $state, $ionicPopup, $stateParams, $ionicModal, userService) {
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

    $scope.takePicture = function () {
      console.log('takePicture1');
      var options = {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 100,
        targetHeight: 100,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false,
      correctOrientation:true
      };

      $cordovaCamera.getPicture(options).then(function(imageData) {
        console.log('takePicture2');
        var image = document.getElementById('1234');
        image.src = "data:image/jpeg;base64," + imageData;
         console.log('image',image);
      }, function(err) {
        console.log('err',err);
        // error
      });
    } 

    $scope.choosePicture = function () {
        var options = {
          quality: 75,
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
          allowEdit: true,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 300,
          targetHeight: 300,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: false
      };

          $cordovaCamera.getPicture(options).then(function (imageData) {
              var image = document.getElementById('5678');
              image.src = "data:image/jpeg;base64," + imageData;
              // $scope.imgURI = "data:image/jpeg;base64," + imageData;
          }, function (err) {
              // An error occured. Show a message to the user
          });
      }

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