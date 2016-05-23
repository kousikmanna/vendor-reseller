angular.module('becho')

.controller('DashCtrl', function($scope, $state, $ionicSideMenuDelegate, userService) {

    $scope.openMenu = function () {
        $ionicSideMenuDelegate.toggleLeft();
    }

    userService.resellerList()
        .then(function(response) {
            $scope.totalResellers = response.length;
        });

    $scope.userType = {};

    var userRole = localStorage.getItem('becho_user');
    if(userRole.vendor){
        $scope.userType.role = 'Vendor';
    }else if(userRole.reseller){
        $scope.userType.role = 'Reseller';
    }

    console.log('userRole',$scope.userType);
    $scope.chartConfig = {
        options: {
            chart: {
                type: 'column',
                borderWidth: 1,
                borderColor: '#d9d9d9',
                marginBottom: 40,
                marginTop: 30,
                marginLeft: 55,
                marginRight: 15,
                width: null,
                height: null,
                plotBorderWidth: 1,
                plotBorderColor: '#d9d9d9'
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