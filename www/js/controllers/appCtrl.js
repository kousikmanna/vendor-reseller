angular.module('becho')

	.controller('AppCtrl', function($scope, $state) {
		$scope.logout = function() {
	        window.localStorage.clear();
	        $state.go('login');
	    };
	})