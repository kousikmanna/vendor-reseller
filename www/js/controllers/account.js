angular.module('becho')

.controller('AccountCtrl', function($scope, $rootScope, $cordovaCamera, userService, $ionicPopup) {
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
        $scope.uploadingProfilePic = true;
        var dataObj = {data: imageData};
        userService.uploadProfilePic(dataObj).then(function(imageUrl){
          user.profilePic = imageUrl;
          $scope.uploadingProfilePic = false;
          }).catch(function(err){   
            $scope.error = err.message; 
            $scope.uploadingProfilePic = false;    
          });
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
        var dataObj = {data: imageData};
        $scope.uploadingProfilePic = true;
        userService.uploadProfilePic(dataObj).then(function(imageUrl){
          user.profilePic = imageUrl;
          $scope.uploadingProfilePic = false;  
        }).catch(function(err){   
         $scope.uploadingProfilePic = false;  
          $scope.error = err.message;     
        });
         
      }, function (err) {
          console.log('err',err);
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