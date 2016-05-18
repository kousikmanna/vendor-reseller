angular.module('becho')

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