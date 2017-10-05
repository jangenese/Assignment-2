




app.controller('messagesController', function($scope, $http, $sce, $window){
    
    
    var userID = $window.sessionStorage.userID;
    var message_serviceURL = 'https://assignment2-jgene543.c9users.io/api/messages/' + userID;

     $http.get(message_serviceURL).then(function(response) {
        $scope.messages = response.data;
        
    });
    $scope.sortField = 'date';
    $scope.sortReverse = false;


$scope.uni = {};
    

    $scope.uni.init = function(id) {

        

        var info_serviceURL = message_serviceURL + '/detail/' + id;

        $http.get(info_serviceURL).then(function(response) {
            var data = response.data;
           
            $scope.uni.name = data.contact.university.name;
            $scope.uni.address = data.contact.university.address;
            $scope.uni.city = data.contact.university.city;
            $scope.uni.state = data.contact.university.state;
            $scope.uni.zip = data.contact.university.zip;
            $scope.uni.website = data.contact.university.website;
            $scope.uni.latitude = data.contact.university.latitude;
            $scope.uni.longitude = data.contact.university.longitude;
            $scope.uni.location = "https://maps.googleapis.com/maps/api/staticmap?markers=color:red|" + data.contact.university.latitude + ',++' + data.contact.university.longitude +'&zoom=13&size=600x300&key=AIzaSyBK1ZmAIeQfnlwoN27F_puoloKiHryH9JU';
            
        });
        
        
    };
    
 


 
   
});

