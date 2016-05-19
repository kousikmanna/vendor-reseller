angular.module('becho')
.controller('FeedCtrl', function($scope, $rootScope, $state, $ionicPopup, $ionicModal, $ionicLoading, userService) {
    console.log('FeedCtrl');
    $scope.base_url={}
    $scope.base_url.url = 'https://s3-ap-southeast-1.amazonaws.com/cashinnew/avatars/';
    userService.fetchFeed()
      .then(function(response){
        console.log('data',response);
        if(response.vendor.length > 0) {
            $.each(response.vendor, function(key, val) {
                console.log('key----->',key);
                console.log('val------>',val);
                userService.getVendor(val.id)
                    .then(function(response) {
                        console.log(response);
                    }).catch(function(err) {
                        return true;
                    })
                });    

        }
        if(response.reseller.length > 0) {
            $.each(response.reseller, function(key, val) {
                // userService.getReseller()
                //     .then(function(response) {
                //         console.log(response);
                //     }).catch(function(err) {
                //         return true;
                //     })
            })
        }
        if(response != null){
            $scope.feedList = response.vendor[0].productlist;
            // $scope.feedList = response.vendor;
            console.log('feedList', JSON.stringify(response));
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