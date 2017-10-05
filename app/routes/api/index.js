var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.json('you reached the api');
});


var employees = require('./employees');
var books = require('./books');
var messages = require('./messages');
var todos = require('./todos');






router.use('/employees', employees);
router.use('/books', books);
router.use('/messages', messages);
router.use('/todos', todos);





module.exports = router;
