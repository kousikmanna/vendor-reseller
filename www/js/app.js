// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('becho', ['ionic', 'ui.router', 'ionMdInput', 'ngMessages', 'underscore', 'highcharts-ng'])

.run(function($ionicPlatform, $state) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    if(localStorage.getItem('token') !== null) {
      return true;
    } else {
      $state.go('login');
    }
  });
})

.factory('httpinterceptor', ['$q', function($q) {  
      return {
        responseError: function(response) {
            if (response.status == 401 || response.data.status == 401){
                localStorage.clear();
                window.location = '/login';
            }
            return $q.reject(response);
        },
        request: function (config) {
           config.headers = config.headers || {};
           if (window.localStorage && localStorage.getItem('token')) {
               var token = localStorage.getItem("token");
               config.headers.Authorization = 'Bearer ' + token;
           }
           return config;
       },
      }
  }])

.config(function($stateProvider, $urlRouterProvider, $httpProvider, $ionicConfigProvider) {
  $httpProvider.interceptors.push('httpinterceptor');
  $ionicConfigProvider.tabs.position('bottom');

  // var resolve= {
  //       auth: (['$q', '$state', function($q, $state) {
  //           var defer = $q.defer();
  //           console.log('in');
  //           if(localStorage.getItem('becho')) {
  //               console.log('hello');
  //               defer.resolve({
  //                   user:  function() {
  //                        return true;
  //                   }
  //               });
  //           } else {
  //               console.log('else');
  //               defer.reject();
  //               $state.go('login');
  //           }
  //           return defer.promise;
  //       }])
  // };

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  //setup an abstract state for the tabs directive
    .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html',
        // resolve: resolve
    })

    // Each tab has its own nav history stack:  

    .state('tab.account', {
        url: '/account',
        views: {
            'tab-account': {
                templateUrl: 'templates/tab-account.html',
                controller: 'AccountCtrl'
            }
        }
    })

    .state('tab.dash', {
        url: '/dash',
        views: {
            'tab-dash': {
            templateUrl: 'templates/tab-dash.html',
            controller: 'DashCtrl'
            }
        }
    })

    .state('tab.products', {
        url: '/products',
        views: {
            'tab-products': {
                templateUrl: 'templates/tab-products.html',
                controller: 'ProductsCtrl'
            }
        }
    })

    .state('tab.add-product', {
        url: '/add-product',
        views: {
            'tab-products': {
                templateUrl: 'templates/products-add.html',
                controller: 'ProductsCtrl'
            }
        }
    })

    .state('tab.chat-detail', {
        url: '/chats/:chatId',
            views: {
                'tab-chats': {
                templateUrl: 'templates/chat-detail.html',
                controller: 'ChatDetailCtrl'
            }
        }
    });

  // if none of the above states are matched, use this as the fallback
  // $urlRouterProvider.otherwise('/login');
  $urlRouterProvider.otherwise('/tab/dash');

});