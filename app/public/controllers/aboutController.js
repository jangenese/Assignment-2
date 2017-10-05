



app.controller('dashboardController', function($scope, $http, $window){


if($window.sessionStorage.userID == null){
    console.log('Tried to access dashboard with no authorization');
 window.location = '#/';
}


});