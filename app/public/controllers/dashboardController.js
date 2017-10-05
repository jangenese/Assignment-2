



app.controller('aboutController', function($scope, $http, $window){


if($window.sessionStorage.userID == null){
    console.log('Tried to access about with no authorization');
 window.location = '#/';
}


});