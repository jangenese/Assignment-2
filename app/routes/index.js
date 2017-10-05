var express = require('express');
var app = express();
var router = express.Router();
var mongoose = require('mongoose'); //mongo connection
var bodyParser = require('body-parser'); //parses information from POST
var methodOverride = require('method-override'); //used to manipulate POST
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var api = require('./api/index');

/*

router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Express'
    });
});
*/

app.set('superSecret', config.secret); // secret variable
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

/* GET New Blob page. */
router.get('/auth', function(req, res) {
    res.render('authenticate/login', {
        title: 'Login '
    });
});

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
router.post('/login', function(req, res) {
    // find the user
    mongoose.model('Employee').findOne({
        username: req.body.username
    }, function(err, user) {
        if (err) throw err;
        if (!user) {
            res.json({
                success: false,
                message: 'Authentication failed. User not found.'
            });
        }
        else if (user) {
            // check if password matches
            if (user.password != req.body.password) {
                console.log('wrong password provided');
                res.json({
                    success: false,
                    message: 'Authentication failed. Wrong password.'
                });
            }
            else {
                console.log('Password is Right: ' + req.body.password);
                // if user is found and password is right
                // create a token
                var token = jwt.sign(user, app.get('superSecret'), {
                    expiresInMinutes: 1 // expires in 24 hours
                });
                // return the information including token as JSON
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    userID: user._id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    token: token
                });
               
            }
        }
    });
});

router.get('/signout', function(req,res){
    res.clearCookie('login');
    res.render('/#/login');
     console.log('Sign out');
});


/*
// route middleware to verify a token
router.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });

  } else {

    res.render('authenticate/login', {
        title: 'You Must Login First To Use The Service'
    });
  }
});

*/



router.use('/api', api);

module.exports = router;
