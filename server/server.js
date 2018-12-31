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

//Route for creating a new todo
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

//Route for getting all todos
app.get('/todos', (req, res) => {
	TodoModel.find().then((todos) => {
		res.send({ todos });
	}), (err) => {
		res.status(400).send(err);
	};
});

app.listen(3000, () => {
	console.log(`Started on port ${port}`);
});

module.exports = { app };

