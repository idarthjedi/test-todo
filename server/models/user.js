const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

let UserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		minLength: 1,
		trim: true,
		unique: true,
		validate: {
			validator: validator.isEmail,
			message: '{VALUE} is not a valid email',
		},
	},
	password: {
		type: String,
		required: true,
		minLength: 8,
	},
	token: [
		{
			access: {
				type: String,
				required: true,
			},
			token: {
				type: String,
				required: true,
			},
		}],
});



//create an Model level override, to prevent the JSON.stringify from deserializing the password or tokens
UserSchema.methods.toJSON = function () {
	let userObject = this.toObject();

	return _.pick(userObject, ['_id', 'email']);
};

//Create an instance level method for the UserSchema to create a JWT token and save it to the database
UserSchema.methods.generateAuthToken = function () {
	let user = this;
	let access = 'auth';

	let token = jwt.sign({ _id: user._id.toHexString(), access }, 'secretsalt').
		toString();

	user.token = user.token.concat([{ access, token }]);

	return user.save().then(() => {
		return token;
	});
};

let UserModel = mongoose.model('User', UserSchema);

module.exports = { UserModel };
