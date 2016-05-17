angular.module('becho')

.service('userService', function($q, $http) {
    this.login = function(user) {
        var deffered = $q.defer();
        console.log('user',user);
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
        $http.post(becho_base_url+'/user/create', user, {headers: { 'Content-Type' : 'application/json'}})
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
        var deffered = $q.defer();
        $http.post(becho_base_url+'/user/account', user)
            .success(function(response) {
                deffered.resolve(response);
            }).error(function(err) {
                deffered.reject(err);
            })
        return deffered.promise;    
    }

     this.uploadProfilePic = function(user) {
        var deffered = $q.defer();
        $http.post(becho_base_url+'/image_upload', user)
            .success(function(res) {
                deffered.resolve(res);
            }).error(function(err) {
                deffered.reject(err);
            })
        return deffered.promise;    
    }

    this.uploadProductPic = function(user) {
        var deffered = $q.defer();
        $http.post(becho_base_url+'/image_upload', user)
            .success(function(res) {
                deffered.resolve(res);
            }).error(function(err) {
                deffered.reject(err);
            })
        return deffered.promise;    
    }
    
    this.productAdd = function(product) {
        var deffered = $q.defer();
        $http.post(becho_base_url+'/product/addproduct', product)
            .success(function(res) {
                deffered.resolve(res);
            }).error(function(err) {
                deffered.reject(err);
            })
        return deffered.promise;    
    }

    this.pushProduct = function(productList){
        var deffered = $q.defer();
        $http.post(becho_base_url+'/product/push', productList)
            .success(function(res){
                console.log('res',res);
                deffered.resolve(res);
            })
            .error(function(err) {
                deffered.reject(err);
            })
        return deffered.promise;
    }

    this.fetchProduct = function(){
        var deffered = $q.defer();
        $http.get(becho_base_url+'/product/list/mine')
            .success(function(res){
                deffered.resolve(res);
            })
            .error(function(err) {
                deffered.reject(err);
            })
        return deffered.promise;

    }

    this.getProduct = function(productId) {
        var deffered = $q.defer();
        $http.get(becho_base_url+'/product/get/detail/'+productId)
            .success(function(res){
                deffered.resolve(res);
            })
            .error(function(err) {
                deffered.reject(err);
            })
        return deffered.promise;
    }

    this.updateProduct = function(product){
        var deffered = $q.defer();
        $http.put(becho_base_url+'/product/update', product)
            .success(function(res){
                deffered.resolve(res);
            })
            .error(function(err) {
                deffered.reject(err);
            })
        return deffered.promise;
    }

    this.resellerList = function(){
        var deffered = $q.defer();
        $http.get(becho_base_url+'/reseller/list')
            .success(function(res){
                deffered.resolve(res);
            })
            .error(function(err) {
                deffered.reject(err);
            })
        return deffered.promise;

    }

     this.pushToSeseller = function(products){
        var deffered = $q.defer();
        $http.post(becho_base_url+'/product/push', products)
            .success(function(res){
                deffered.resolve(res);
            })
            .error(function(err) {
                deffered.reject(err);
            })
        return deffered.promise;

    }

    this.fetchFeed = function(){
        var deffered = $q.defer();
        console.log('fetchFeed');
        $http.get(becho_base_url+'/product/myfeed')
            .success(function(res){
                deffered.resolve(res);
            })
            .error(function(err) {
                deffered.reject(err);
            })
        return deffered.promise;

    }

});
