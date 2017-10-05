var loginService = 'https://assignment2-jgene543.c9users.io/login';

app.controller('loginController', function($scope, $http, $window) {

     $scope.loginForm = {};
     $scope.loginForm.username = 'username';
     $scope.loginForm.password = 'password';
     $scope.loginForm.message = 'Please Enter Your Credentials';

     $scope.welcome = 'Welcome ' + $window.sessionStorage.firstName + ' ' + $window.sessionStorage.lastName;

     $scope.loginForm.submit = function() {
          var loginData = {
               username: $scope.loginForm.username,
               password: $scope.loginForm.password
          };

          $http
               .post(loginService, loginData)
               .then(function(data, status, headers, config) {
                    console.log(data.data);
                    if (data.data.success) {
                         $window.sessionStorage.token = data.data.token;
                         $scope.isAuthenticated = true;
                         console.log('authenticated');
                         $window.sessionStorage.userID = data.data.userID;
                         $window.sessionStorage.firstName = data.data.firstname;
                         $window.sessionStorage.lastName = data.data.lastname;
                         $scope.welcome = 'Welcome ' + data.data.firstname + ' ' + data.data.lastname;



                         window.setTimeout(remindUser, 1740000); //remind user in 29 minutes
                         window.setTimeout(kickUser, 1800000); //kick user in 30 minutes

                         function remindUser() {
                              alert('You session is expiring in 1 minute');
                         }

                         function kickUser() {
                              alert('You have been signed off');
                              $scope.welcome = '';
                              $scope.message = '';
                              $scope.isAuthenticated = false;
                              delete $window.sessionStorage.token;
                              delete $window.sessionStorage.userID;
                              delete $window.sessionStorage.firstName;
                              delete $window.sessionStorage.lastName;
                              window.location = '#/';
                         }


                    }
                    else {
                         // Erase the token if the user fails to log in
                         delete $window.sessionStorage.token;
                         $scope.isAuthenticated = false;

                         // Handle login errors here
                         $scope.error = data.data.message;
                         $scope.welcome = '';

                    }
               });





     };


     $scope.logout = function() {
          $scope.welcome = '';
          $scope.message = '';
          $scope.isAuthenticated = false;
          delete $window.sessionStorage.token;
          delete $window.sessionStorage.userID;
          delete $window.sessionStorage.firstName;
          delete $window.sessionStorage.lastName;
          location.reload();
     };






























});
