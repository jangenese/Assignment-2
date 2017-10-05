

app.controller('booksController', function($scope, $http, $window){
    
    var userID = $window.sessionStorage.userID;
    var book_serviceURL = 'https://assignment2-jgene543.c9users.io/api/books/' + userID;
     $http.get(book_serviceURL).then(function(response) {
        $scope.books = response.data;
        
    });
    $scope.sortField = 'isbn10';
    $scope.sortReverse = false;

});