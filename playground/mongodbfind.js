/* eslint-disable no-console */
//import { MongoClient } from 'mongodb';
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, db) => {
	if (err) {
		return console.log('unable to connect to db server');
	}

	console.log('Connected to MongoDB Server.');

	/*	db.collection('Todos').find({
			_id:
				new ObjectID('5c22dcf31c2ef0053f1faf6e'),
		}).toArray().then((docs) => {

			console.log('Todos');
			console.log(JSON.stringify(docs, undefined, 2));

		}, (err) => {
			console.log('Unable to fetch TODOs');

		}).finally(() => {
			db.close();
		});*/

	db.collection('Users').find({name: 'Jediah'}).count().then((count) => {

		console.log(`Total Todos found ${count}`);

	}, (err) => {
		console.log('Unable to fetch TODOs');

	}).finally(() => {
		db.close();
	});
});