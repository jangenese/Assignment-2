var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'); //used to manipulate POST

var app = express();
    var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config'); // get our config file
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






//build the REST operations at the base for employees
//this will be accessible from http://127.0.0.1:3000/employees if the default route for / is left unchanged
router.route('/')
    //GET all employees
    .get(function(req, res, next) {
        //retrieve all employees from Monogo
        mongoose.model('Employee').find({}, function (err, employees) {
              if (err) {
                  return console.error(err);
              } else {
                  //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
          //        res.format({
                      //HTML response will render the index.jade file in the views/employees folder. We are also setting "employees" to be an accessible variable in our jade view
          //          html: function(){
          //              res.render('employees/index', {
          //                    title: 'All my Employees',
          //                    "employees" : employees
          //                });
          //          },
                    //JSON response will show all employees in JSON format
          //          json: function(){
                        res.json(employees);
          //          }
          //      });
              }     
        });
    });
    
    
    
    // route middleware to validate :id
router.param('id', function(req, res, next, id) {
    //console.log('validating ' + id + ' exists');
    //find the ID in the Database
    mongoose.model('Employee').findById(id, function (err, employee) {
        //if it isn't found, we are going to repond with 404
        if (err) {
            console.log(id + ' was not found');
            res.status(404)
            var err = new Error('Not Found');
            err.status = 404;
            res.format({
                html: function(){
                    next(err);
                 },
                json: function(){
                       res.json({message : err.status  + ' ' + err});
                 }
            });
        //if it is found we continue on
        } else {
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
    mongoose.model('Employee').findById(req.id, function (err, employee) {
      if (err) {
        console.log('GET Error: There was a problem retrieving: ' + err);
      } else {
        console.log('GET Retrieving ID: ' + employee._id);
        
   //     res.format({
    //      html: function(){
    //          res.render('employees/show', {
    //            "employee" : employee
     //         });
    //      },
    //      json: function(){
              res.json(employee);
     //     }
     //   });
      }
    });
  });
  
  //GET the individual employee by Mongo ID
router.get('/:id/edit', function(req, res) {
    //search for the employee within Mongo
    mongoose.model('Employee').findById(req.id, function (err, employee) {
        if (err) {
            console.log('GET Error: There was a problem retrieving: ' + err);
        } else {
            console.log(employee);
            //Return the employee
            console.log('GET Retrieving ID: ' + employee._id);
            //format the date properly for the value to show correctly in our edit form
         
            res.format({
                //HTML response will render the 'edit.jade' template
                html: function(){
                       res.render('employees/edit', {
                          title: 'Employee' + employee._id,
                          "employee" : employee
                      });
                 },
                 //JSON response will return the JSON output
                json: function(){
                       res.json(employee);
                 }
            });
        }
    });
});




module.exports = router;