let mongoose = require('mongoose');

//Set the mongoose Promise library to the default CommonJS library
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI); //.then(() => {

module.exports = {
	mongoose
};



