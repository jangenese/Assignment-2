
var mongoose = require('mongoose');
mongoose.connect('mongodb://assignment2:connect123@ds023458.mlab.com:23458/comp4513assignment2');
//mongoose.connect('mongodb://localhost:27017/a2');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    console.log("connected to mongoDB");
});



