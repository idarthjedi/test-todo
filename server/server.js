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

module.exports = {app};

