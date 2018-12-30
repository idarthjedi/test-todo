let mongoose = require('mongoose');

let UserModel = mongoose.model('User', {
	email: {
		type: String,
		required: true,
		minLength: 1,
		trim: true,
	},
});

module.exports = { UserModel };
