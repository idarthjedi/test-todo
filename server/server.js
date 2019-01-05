/* eslint-disable no-console,no-unused-vars */
let config = require('./../config/config');

let _ = require('lodash');
let express = require('express');
let bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

let { mongoose } = require('./db/mongoose');
let { UserModel } = require('./models/user');
let { TodoModel } = require('./models/todo');

let port = process.env.PORT || 3000;

let app = express();

//set up middleware
app.use(bodyParser.json());

//<editor-fold desc="User methods">
app.post('/users', (req, res) => {

	let user = new UserModel(_.pick(req.body, ['email', 'password']));

	user.save().then((user) => {
		//res.send(doc);

		let authToken = user.generateAuthToken();

		//console.log(authToken);
		return authToken;

	}).then((token) => {
		res.header('x-auth', token).send(user);
	}).catch((err) => {
		res.status(400).send(err);
	});

});
//</editor-fold>

//<editor-fold desc="Todo Methods">
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

//Route for getting todo by id
app.get('/todos/:id', (req, res) => {
	let id = req.params.id;

	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}

	TodoModel.findById(id).then((todo) => {
		if (!todo) {
			return res.status(404).send();
		}

		res.send({ todo });
	}), (err) => {
		res.status(400).send({ 'error': 'Error retrieving ID' });
	};
});

//Route for getting all todos
app.get('/todos', (req, res) => {
	TodoModel.find().then((todos) => {
		res.send({ todos });
	}), (err) => {
		res.status(400).send(err);
	};
});

//route for deleting todos
app.delete('/todos/:id', (req, res) => {

	let id = req.params.id;

	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}

	TodoModel.findByIdAndRemove(id).then((todo) => {
		if (!todo) {
			return res.status(404).send();
		}

		res.send({ todo });
	});
});

//route for updating todos
app.patch('/todos/:id', (req, res) => {
	let id = req.params.id;
	let body = _.pick(req.body, ['text', 'completed']);

	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}

	if (_.isBoolean(body.completed) && body.completed) {
		body.completedAt = new Date().getTime();
	} else {
		body.completed = false;
		body.completedAt = null;
	}

	TodoModel.findByIdAndUpdate(id, { $set: body }, { new: true }).
		then((todo) => {
			if (!todo) {
				return res.status(404).send();
			}

			res.send({ todo });

		}).catch((e) => {
		res.status(400).send();

	});
});
//</editor-fold>

app.listen(port, () => {
	console.log(`Started for env ${process.env.NODE_ENV} on port ${port}`);
});

module.exports = { app };

