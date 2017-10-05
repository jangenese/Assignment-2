var mongoose = require('mongoose');


var todoSchema = new mongoose.Schema({
    id: Number,
    status: String,
    priority: String,
    date: Date,
    description: String
}, {
    _id: false
});

var messagesSchema = new mongoose.Schema({
    id: Number,
    contact: {
        firstname: String,
        lastname: String,
        university: {
            id: Number,
            name: String,
            address: String,
            city: String,
            state: String,
            zip: String,
            website: String,
            latitude: Number,
            longitude: Number
        },
    },
    date: Date,
    category: String,
    content: String

});



var booksSchema = new mongoose.Schema({
    id: Number,
    isbn10: String,
    isbn13: String,
    title: String,
    category: String
});

var employeeSchema = new mongoose.Schema({
    id: Number,
    guid: String,
    firstname: String,
    lastname: String,
    username: String,
    password: String,
    salt: String,
    todo: [todoSchema],
    messages: [messagesSchema],
    books: [booksSchema]
});

module.exports = mongoose.model('Employee', employeeSchema);
