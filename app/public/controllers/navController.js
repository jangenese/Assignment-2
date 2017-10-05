app.controller('navController', function($scope, $http, $window) {


    var userID = $window.sessionStorage.userID;
    var employee_serviceURL = 'https://assignment2-jgene543.c9users.io/api/employees/' + userID;

    $http.get(employee_serviceURL).then(function(response) {
        $scope.employee = response.data;

    });


   




});