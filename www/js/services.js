angular.module('becho')

.service('userService', function($q, $http, $rootScope) {
    this.login = function(user) {
        var deffered = $q.defer();
        console.log('use');
        $http.post(becho_base_url+'/user/login', user)
            .success(function(res) {
                deffered.resolve(res);
            }).error(function(err) {
                deffered.reject(err);
            })
        return deffered.promise;    
    };

    this.logout = function() {};

    this.signUp = function(user) {
        var deffered = $q.defer();
        $http.post(becho_base_url+'/user/create', user)
            .success(function(res) {
                deffered.resolve(res);
            }).error(function(err) {
                deffered.reject(err);
            })
        return deffered.promise;
    };

    this.verifyotp = function(otp, user_id) {
        console.log(user_id);
        var deffered = $q.defer();
        $http.post(becho_base_url+'/verify-otp/'+user_id, {"otp":otp})
            .success(function(res) {
                deffered.resolve(res);
            }).error(function(err) {
                deffered.reject(err);
            })
        return deffered.promise;
    }

    this.updateAccount = function(user) {
        console.log(user);
        var deffered = $q.defer();
        $http.post(becho_base_url+'/user/account', user)
            .success(function(response) {
                deffered.resolve(response);
            }).error(function(err) {
                deffered.reject(err);
            })
        return deffered.promise;    
    }

});
