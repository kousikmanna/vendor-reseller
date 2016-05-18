angular.module('becho')

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