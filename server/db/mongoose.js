let mongoose = require('mongoose');

//Set the mongoose Promise library to the default CommonJS library
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp'); //.then(() => {

module.exports = {
	mongoose
};



