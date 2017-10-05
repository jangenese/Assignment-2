var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'); //used to manipulate POST



router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(methodOverride(function(req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method;
        delete req.body._method;
        return method;
    }
}));

// route middleware to validate :id
router.param('id', function(req, res, next, id) {
    //console.log('validating ' + id + ' exists');
    //find the ID in the Database
    mongoose.model('Employee').findById(id, function(err, employee) {
        //if it isn't found, we are going to repond with 404
        if (err) {
            console.log(id + ' was not found');
            res.status(404);
            var err = new Error('Not Found');
            err.status = 404;
            res.format({
                html: function() {
                    next(err);
                },
                json: function() {
                    res.json({
                        message: err.status + ' ' + err
                    });
                }
            });
            //if it is found we continue on
        }
        else {
            //uncomment this next line if you want to see every JSON document response for every GET/PUT/DELETE call
            //console.log(employee);
            // once validation is done save the new item in the req
            req.id = id;
            // go to the next thing
            next();
        }
    });
});




/* GET New Blob page. */
router.get('/:id/new', function(req, res) {
    res.render('todos/new', {
        empId: req.id,
        title: 'Add New Todo'
    });
});


//POST to create a new ToDo
router.post('/:id', function(req, res) {
    // Get our REST or form values. 
    console.log("update Query Is made");
    var status = req.body.status;
    var priority = req.body.priority;
    var date = req.body.date;
    var description = req.body.description;
    var id = req.body.id;

    mongoose.model('Employee').findOneAndUpdate({
            _id: req.params.id
        }, {
            $addToSet: {
                todo: {
                    "id": id,
                    "status": status,
                    "priority": priority,
                    "date": date,
                    "description": description
                }
            }
        },
        function(err, data) {
            if (err) {
                res.json('Shit');
            }
            else {
                //res.format({
                 //   //HTML response will render the index.jade file in the views/employees folder. We are also setting "employees" to be an accessible variable in our jade view
                 //   html: function() {
                 //       console.log('Record Was Succesfully Added');
                 //       res.redirect('/todos/' + req.id);
                 //   },
                //    //JSON response will show all employees in JSON format
                //    json: function() {
                        res.json(data);
                //    }
              //  });
            }
        });
});




router.route('/:id')
    .get(function(req, res) {
        mongoose.model('Employee').findById(req.id, function(err, employee) {
            if (err) {
                console.log('GET Error: There was a problem retrieving: ' + err);
            }
            else {
                //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
                res.format({
                    //HTML response will render the index.jade file in the views/employees folder. We are also setting "employees" to be an accessible variable in our jade view
                    html: function() {
                        res.render('todos/index', {
                            title: 'All of' + employee._id + '\'s Todo',
                            empId: employee._id,
                            "todos": employee.todo
                        });
                    },
                    //JSON response will show all employees in JSON format
                    json: function() {
                        res.json(employee.todo);
                    }
                });
            }
        });
    });


router.route('/:id/detail/:todoId')
    .get(function(req, res) {
        var todoId = req.params.todoId;
        mongoose.model('Employee').findById(req.id, function(err, employee) {
            if (err) {
                console.log('GET Error: There was a problem retrieving: ' + err);
            }
            else {

                for (var i = 0; i < employee.todo.length; i++) {
                    var todo = employee.todo[i];
                    if (todo.id == todoId) {
                        res.format({
                            html: function() {
                                res.render('todos/show', {
                                    "todo": todo
                                });
                            },
                            json: function() {
                                res.json(todo);
                            }
                        });
                    }
                    console.log(todo);
                }
            }
        });
    });

router.route('/:id/detail/:todoId/edit')
    .get(function(req, res) {
        var todoId = req.params.todoId;
        mongoose.model('Employee').findById(req.id, function(err, employee) {
            if (err) {
                console.log('GET Error: There was a problem retrieving: ' + err);
            }
            else {
                for (var i = 0; i < employee.todo.length; i++) {
                    var todo = employee.todo[i];
                    if (todo.id == todoId) {
                        res.format({
                            html: function() {
                                res.render('todos/edit', {
                                    empId: employee._id,
                                    "todo": todo
                                });
                            },
                            json: function() {
                                res.json(todo);
                            }
                        });
                    }
                    console.log(todo);
                }
            }
        });
    });




//PUT to update a blob by ID
router.put('/:id/detail/:todoId/edit', function(req, res) {
    // Get our REST or form values. These rely on the "name" attributes
    console.log("update Query Is made");
    var status = req.body.status;
    var priority = req.body.priority;
    var date = req.body.date;
    var description = req.body.description;
    var todoId = req.params.todoId;
    //find the document by ID
    mongoose.model('Employee').findOneAndUpdate({
            "_id": req.id,
            "todo.id": todoId
        }, {
            "$set": {
                "todo.$.status": status,
                "todo.$.priority": priority,
                "todo.$.date": date,
                "todo.$.description": description
            }
        },
        function(err, doc) {
            if (err) {
                console.log('Something Went Wrong With The Update');
                console.log(err)
            }
            else {
                console.log('success');
                //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
            //    res.format({
             //       //HTML response will render the index.jade file in the views/employees folder. We are also setting "employees" to be an accessible variable in our jade view
               //     html: function() {
              //          console.log('Record Was Succesfully Deleted');
            //            res.redirect('/todos/' + req.id);
             //       }
            //    });

            }

        }
    );
});



router.delete('/:id/detail/:todoId/edit', function(req, res) {
    var todoId = req.params.todoId;
    mongoose.model('Employee').findById(req.id, function(err, employee) {
        if (err) {
            console.log('GET Error: There was a problem retrieving: ' + err);
        }
        else {
            for (var i = 0; i < employee.todo.length; i++) {
                var todo = employee.todo[i];
                if (todo.id == todoId) {
                    employee.todo.splice(i, 1);
                    employee.save();
                 //   //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
                 //   res.format({
                        //HTML response will render the index.jade file in the views/employees folder. We are also setting "employees" to be an accessible variable in our jade view
                  //      html: function() {
                  //          console.log('Record Was Succesfully Deleted');
                  //          res.redirect('/todos/' + req.id);
                  //      },
                        //JSON response will show all employees in JSON format
                  //      json: function() {
                  //          res.json(employee);
                 //       }
                 //   });
                }
            }
        }
    });
});

module.exports = router;