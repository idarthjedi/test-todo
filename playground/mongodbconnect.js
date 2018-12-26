/* eslint-disable no-console */
//import { MongoClient } from 'mongodb';
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, db) => {
	if (err) {
		return console.log('unable to connect to db server');
	}

	/*	db.collection('Todos').insertOne({
			text: 'Something to do',
			completed: false
		}, (err, result) => {
			if (err) {
				return console.log('Error during insert', err);
			}

			console.log(JSON.stringify(result.ops));
		});*/

	db.collection('Users').insertOne({
		name: 'Jediah',
		age: 40,
		location: 'Suffolk',
	}, (err, result) => {
		if (err) {
			return console.log('Error during insert', err);
		}

		console.log(JSON.stringify(result.ops, undefined, 2));
	});
	console.log('Connected to MongoDB Server.');
	db.close();
});