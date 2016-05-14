angular.module('starter.controllers', [])

.controller('loginCtrl', function($scope, $stateParams, Chats) {
    $scope.login = true;
    $scope.signup = false;
    $scope.signUpPage = function() {
        $scope.signup = true;
        $scope.login = false;
    }
    $scope.LoginPage = function() {
        $scope.signup = false;
        $scope.login = true;
    }

    $scope.login = function(user) {
        console.log(user);
    }

    $scope.signUp = function(user) {
        console.log(user);
    }
})