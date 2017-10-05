


app.controller('todosController', function($scope, $http, $state, $window) {
    
    var userID = $window.sessionStorage.userID;
    var todo_serviceURL = 'https://assignment2-jgene543.c9users.io/api/todos/' + userID;
    
    $http.get(todo_serviceURL).then(function(response) {

        var data = response.data;

        var todos = [];

        for (var i = 0; i < data.length; i++) {

            var todo = data[i];

            var priority = todo.priority;
            var status = todo.status;

            var lowPriority = 'low';
            var mediumPriority = 'medium';
            var activeStatus = 'active';
            var pendingStatus = 'pending';


            if (pendingStatus == status) {
                todo.iClass = 'label label-warning pull-right';
            }
            else if (activeStatus == status) {
                todo.iClass = 'label label-info pull-right';
            }
            else {
                todo.iClass = 'label label-success pull-right';
            }

            if (lowPriority == priority) {
                todo.textClass = 'text-green';
            }
            else if (mediumPriority == priority) {
                todo.textClass = 'text-yellow';
            }
            else {
                todo.textClass = 'text-red';
            }
            todos.push(todo);
        }

        $scope.todos = todos;
    });
    $scope.sortField = 'date';
    $scope.sortReverse = false;

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    //DELETE FUNCTION
    $scope.delete = function(id) {
        var deleteLink = todo_serviceURL + '/detail/' + id + '/edit';
        $http.delete(deleteLink).then(function(response) {
            console.log("delete was called allegedly");
        });
        location.reload();
    };
    ///////////////////////////////////////////////////////////////////////////////////////////////////    
    //////////////////////////////////////////////////////////////////////////////////////////////////
    //UPDATE - Prepare

    $scope.editForm = {};
    var todoId = 0;

    $scope.editForm.init = function(id) {

        todoId = id;

        var info_serviceURL = todo_serviceURL + '/detail/' + id;

        $http.get(info_serviceURL).then(function(response) {
            var data = response.data;
            var date = new Date(data.date);
            $scope.editForm.date = date;
            $scope.editForm.status = data.status;
            $scope.editForm.priority = data.priority;
            $scope.editForm.description = data.description;
        });
    };


    //UPDATE - Execute

    $scope.editForm.submit = function() {
        console.log("--> Submitting form");

        var update = [];
        update.date = $scope.editForm.date;
        update.status = $scope.editForm.status;
        update.priority = $scope.editForm.priority;
        update.description = $scope.editForm.description;

        var updateData = {
            date: update.date,
            status: update.status,
            priority: update.priority,
            description: update.description
        };

        console.log(updateData);

        var edit_serviceURL = todo_serviceURL + '/detail/' + todoId + '/edit';

        $http({
            method: 'PUT',
            url: edit_serviceURL,
            data: updateData
        }).then(function(response) {
            console.log("Update was called allegedly");
        });
        location.reload();
    };
    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
    //NEW FORM 

    $scope.newForm = {};
    $scope.newForm.date = new Date(2016 - 04 - 03);
    $scope.newForm.status = "active";
    $scope.newForm.priority = "low";
    $scope.newForm.description = "Just Do It";




    

        $http.get(todo_serviceURL).then(function(response) {
            var data = response.data;
            var ids = [];


            for (var i = 0; i < data.length; i++) {
                var todo = data[i];


                ids[todo.id] = todo.id;

            }
            

            for (var x = 0; x < ids.length + 20; x++) {

                if (ids[x] == null) {
                    $scope.newForm.id = x;
                    break;
                }
            }

        });
       
$scope.newForm.submit = function() {
        console.log("--> Submitting form");

         var newTodo = [];
         newTodo.id = $scope.newForm.id;
        newTodo.date = $scope.newForm.date;
        newTodo.status = $scope.newForm.status;
        newTodo.priority = $scope.newForm.priority;
        newTodo.description = $scope.newForm.description;

        var newData = {
            id: newTodo.id,
            date: newTodo.date,
            status: newTodo.status,
            priority: newTodo.priority,
            description: newTodo.description
        };
        
        
         $http({
            method: 'POST',
            url: todo_serviceURL,
            data: newData
        }).then(function(response) {
            console.log("Update was called allegedly");
        });
        location.reload();
        
    };
    

   

    //////////////////////////////////////////////////////////////////////////
});
