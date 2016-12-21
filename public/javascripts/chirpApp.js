var app = angular.module('chirpApp', ['ngRoute', 'ngResource']).run(function($http, $rootScope) {
  $rootScope.authenticated = false;
  $rootScope.current_user = '';

  $rootScope.signout = function(){
    $http.get('auth/signout');
    $rootScope.authenticated = false;
    $rootScope.current_user = '';
  };
});

app.config(function($routeProvider){
  $routeProvider
    //the timeline display
    .when('/', {
      templateUrl: 'main.html',
      controller: 'mainController'
    })
    //the login display
    .when('/login', {
      templateUrl: 'login.html',
      controller: 'authController'
    })
    //the signup display
    .when('/register', {
      templateUrl: 'register.html',
      controller: 'authController'
    });
});

// app.factory('postService', function($resource){
//   return $resource('/api/posts/:id');
// });

// app.controller('mainController', function(postService, $scope, $rootScope){
//   $scope.posts = postService.query();
//   $scope.newPost = {created_by: '', text: '', created_at: ''};
  
//   // $scope.post = function() {
//   //   $scope.newPost.created_by = $rootScope.current_user;
//   //   $scope.newPost.created_at = Date.now();
//   //   postService.save($scope.newPost, function(){
//   //     console.log("Hello " + $rootScope.current_user);
//   //     $scope.posts = postService.query();
//   //     $scope.newPost = {created_by: '', text: '', created_at: ''};
//   //   });
//   // };
//   $scope.post = function() {
//   $scope.newPost.created_by = $rootScope.current_user;
//   $scope.newPost.created_at = Date.now();
//   console.log("pohnch gaya");
//   postService.save($scope.newPost, function(){
//      console.log("Hello " + $rootScope.current_user);
//     $scope.posts = postService.query();
//     $scope.newPost = {created_by: '', text: '', created_at: ''};
//   });
// };
// });


 app.factory('postService', function($resource){
   return $resource('/api/posts/:id');
});

// app.factory('postService', function($http){
//   var baseUrl = "/api/posts";
//   var factory = {};
//   factory.getAll = function(){
//     return $http.get(baseUrl);
//   };
//   return factory;
// });

app.controller('mainController', function(postService, $http,  $scope, $rootScope){
  $scope.posts = postService.query();
  $scope.newPost = {created_by: '', text: '', created_at: ''};
  
  $scope.post = function() {
   // console.log($scope);
    $scope.newPost.created_by = $rootScope.current_user;
    $scope.newPost.created_at = Date.now();
    postService.save($scope.newPost, function(){
      $scope.posts = postService.query();
      $scope.newPost = {created_by: '', text: '', created_at: ''};
    });
  };
  // Deleting a post
  $scope.delete=function(eachpost){
      id=eachpost._id;
      $http.delete('/api/posts/' + id)
            .success(function(data){        
               $scope.posts = postService.query();
               
      $scope.newPost = {created_by: '', text: '', created_at: ''};
            });

      };

    //       $scope.deleteTodo = function(id) {
    //     $http.delete('/api/todos/' + id)
    //         .success(function(data) {
    //             $scope.todos = data;
    //             console.log(data);
    //         })
    //         .error(function(data) {
    //             console.log('Error: ' + data);
    //         });
    // };



});




app.controller('authController', function($scope, $http, $rootScope, $location){
  $scope.user = {username: '', password: ''};
  $scope.error_message = '';

  $scope.login = function(){
    $http.post('/auth/login', $scope.user).success(function(data){
      if(data.state == 'success'){
        $rootScope.authenticated = true;
        $rootScope.current_user = data.user.username;
        $location.path('/');
      }
      else{
        $scope.error_message = data.message;
      }
    });
  };

  $scope.register = function(){
    $http.post('/auth/signup', $scope.user).success(function(data){
      if(data.state == 'success'){
        $rootScope.authenticated = true;
        $rootScope.current_user = data.user.username;
        $location.path('/');
      }
      else{
        $scope.error_message = data.message;
      }
    });
  };
});