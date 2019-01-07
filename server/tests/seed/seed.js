const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { TodoModel } = require('./../../models/todo');
const { UserModel } = require('./../../models/user');

const user1ID = new ObjectID();
const user2ID = new ObjectID();

const users = [
	{
		_id: user1ID,
		email: 'jediah@example.com',
		password: 'password1',
		tokens: [
			{
				access: 'auth',
				token: jwt.sign({ _id: user1ID, access: 'auth' }, 'secretsalt').
					toString(),
			}]
	},
	{
		_id: user2ID,
		email: 'amanda@example.com',
		password: 'password2',
	}];

const todos = [
	{
		_id: new ObjectID(),
		text: 'First created todo',
	}, {
		_id: new ObjectID(),
		text: 'Second created todo',
	}];

const populateTodos = (done) => {
	TodoModel.remove({}).then(() => {
		return TodoModel.insertMany(todos);
	}).then(() => done());
};

const populateUsers = (done) => {
	UserModel.remove({}).then(() => {
		let user1 = new UserModel(users[0]).save();
		let user2 = new UserModel(users[1]).save();

		//Wait for both above promises to complete
		return Promise.all([user1, user2]);

	}).then(() => done());
};
module.exports = { todos, populateTodos, users, populateUsers };

