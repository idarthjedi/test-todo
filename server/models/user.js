const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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
	tokens: [
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

UserSchema.statics.findByToken = function (token) {
	let User = this;
	let userToken;

	try {
		userToken = jwt.verify(token, 'secretsalt');
	} catch (err) {
		return Promise.reject();
	}

	return User.findOne({
		'_id': userToken._id,
		'tokens.token': token,
		'tokens.access': 'auth',

	});
};
//Create an instance level method for the UserSchema to create a JWT token and save it to the database
UserSchema.methods.generateAuthToken = function () {
	let user = this;
	let access = 'auth';

	let token = jwt.sign({ _id: user._id.toHexString(), access }, 'secretsalt').
		toString();

	user.tokens = user.tokens.concat([{ access, token }]);

	return user.save().then(() => {
		return token;
	});
};

//Create a mongoose middleware that allows us to run a function before the save function is executed
UserSchema.pre('save', function (next) {

	let user = this;

	if (user.isModified('password')) {

		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(user.password, salt, (err, hash) => {
				user.password = hash;
				next();
			});
		});
	} else {
		next();
	}
});
let UserModel = mongoose.model('User', UserSchema);

module.exports = { UserModel };
