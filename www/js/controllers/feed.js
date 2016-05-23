angular.module('becho')
.controller('FeedCtrl', function($scope, $rootScope, $stateParams, $state, $ionicPopup, $filter, $ionicModal, $ionicLoading, userService) {
    console.log('FeedCtrl');
    $scope.base_url={}
    $scope.base_url.url = 'https://s3-ap-southeast-1.amazonaws.com/cashinnew/avatars/';
    userService.fetchFeed()
      .then(function(response){
        console.log('data',response);
        if(response != null){
            if(response.vendor) {
                $scope.vendorDetails = response.vendor;
            };
            if(response.reseller) {
                $scope.resellerDetails = response.reseller;
            }
            $rootScope.productDetails.push(response);
            console.log('feedList', $scope.vendorDetails);
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


    // $scope.search = function() {
    //     var url = 'data/people.json';
    //     $http.get(url).success(httpSuccess).error(function() {
    //         alert('Unable to get back informations :( ');
    //     });
    // }

    // httpSuccess = function(response) {
    //     $scope.products = response;
    // }

    function getById(arr, id) {
        console.log(arr)
        // for (var d = 0, len = arr.length; d < len; d += 1) {
        //     if (arr[d].id === id) {
        //         return arr[d];  
        //     }
        // }
    }
    // $scope.search();
    $scope.products = getById($rootScope.productDetails ,$stateParams.id);             
})