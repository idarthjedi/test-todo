/* eslint-disable no-console */

const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoApp',
	(err, db) => {

		if (err) {
			return console.log('Unable to connect to db server');
		}

		console.log('Connected to MongoDB Server.');

		db.collection('Users').findOneAndUpdate(
			{
				_id: new ObjectID('5c22de4ac17edc054d151ed7'),
			},
			{
				$set: { name: 'Jediah' },
				$inc: { age: 1 },
			},
			{ returnOriginal: false }).then((result) => {
			console.log(result);
		}).finally(() => {
			db.close();
		});
	});

