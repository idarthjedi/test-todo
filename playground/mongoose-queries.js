/* eslint-disable no-console */
const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { TodoModel } = require('./../server/models/todo');
//const { UserModel } = require('./../server/models/user');

let id = '5c297dc0b051b39f05ebae3e';

if (!ObjectID.isValid(id)) {
	console.log('ObjectId Invalid');
}

/*TodoModel.find({
	_id: id,
}).then((todos) => {
	console.log('Todos', todos);
});

TodoModel.findOne({
	_id: id,
}).then((todo) => {
	console.log('Todo', todo);

});*/

TodoModel.findById(id).then((todo) => {
	if (!todo) {
		return console.log('Todo not found');
	}
	console.log('Todo by ID', todo);

}).catch((err) => console.log(err));
