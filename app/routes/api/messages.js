var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'); //used to manipulate POST

router.use(bodyParser.urlencoded({
    extended: true
}))
router.use(methodOverride(function(req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
    }
}))



// route middleware to validate :id
router.param('id', function(req, res, next, id) {
    //console.log('validating ' + id + ' exists');
    //find the ID in the Database
    mongoose.model('Employee').findById(id, function(err, employee) {
        //if it isn't found, we are going to repond with 404
        if (err) {
            console.log(id + ' was not found');
            res.status(404)
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


router.route('/:id')
    .get(function(req, res) {
        mongoose.model('Employee').findById(req.id, function(err, employee) {
            if (err) {
                console.log('GET Error: There was a problem retrieving: ' + err);
            }
            else {


                //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
            //    res.format({
            //        //HTML response will render the index.jade file in the views/employees folder. We are also setting "employees" to be an accessible variable in our jade view
            //        html: function() {
            //            res.render('messages/index', {
            //                title: 'All of' + employee._id + '\'s Messages',
            //                empId: employee._id,
            //                "messages": employee.messages
            //            });
            //        },
                    //JSON response will show all employees in JSON format
             //       json: function() {
                        res.json(employee.messages);
            //        }
           //     });



            }
        });
    });


router.route('/:id/detail/:messageId')
    .get(function(req, res) {
        var messageId = req.params.messageId;
        mongoose.model('Employee').findById(req.id, function(err, employee) {
            if (err) {
                console.log('GET Error: There was a problem retrieving: ' + err);
            }
            else {

                for (var i = 0; i < employee.messages.length; i++) {
                    var message = employee.messages[i];
                    if (message.id == messageId) {
                        res.format({
                            html: function() {
                                res.render('messages/show', {
                                    "message": message
                                });
                            },
                            json: function() {
                                res.json(message);
                            }
                        });
                    }
                    console.log(message);
                }
            }
        });
    });





module.exports = router;