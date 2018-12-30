/* eslint-disable no-console */
let express = require('express');
let bodyParser = require('body-parser');

let { mongoose } = require('./db/mongoose');
let { UserModel } = require('./models/user');
let { TodoModel } = require('./models/todo');

let port = process.env.PORT || 3000;

let app = express();

//set up middleware
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
	//console.log(req.body);
	let todo = new TodoModel({
		text: req.body.text,
	});

	todo.save().then((doc) => {
		res.send(doc);
	}, (err) => {
		res.status(400).send(err);
	});
});

app.listen(3000, () => {
	console.log(`Started on port ${port}`);
});

/*let newUser = new UserModel({
	email: 'jediah@logiodice.com',
}).save().then((doc) => {
	console.log(JSON.stringify(doc, undefined, 2));
}).catch((err) => {
	console.log(err);
});*/

/*let newTodo = new Todo({
	text: 'Cook dinner',
}).save().then((doc) => {
	console.log('Saved Todo'); //, doc);
}, (err) => {
	console.log(err);
});

let newTodo2 = new Todo({
	text: 'Watch a movie',
	completed: true,
	completedAt: new Date('December 28, 2018').getTime(),
}).save().then((doc) => {
	console.log('Saved Todo'); //, doc);
}, (err) => {
	console.log(err);
});*/
