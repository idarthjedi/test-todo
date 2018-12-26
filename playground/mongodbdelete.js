/* eslint-disable no-console */
//import { MongoClient } from 'mongodb';
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, db) => {
	if (err) {
		return console.log('unable to connect to db server');
	}

	console.log('Connected to MongoDB Server.');

	/*	db.collection('Todos').deleteMany({ title: 'Eat lunch' }).then((result) => {
			console.log(result);
		}).finally(() => {
			db.close();
		});*/

	db.collection('Todos').deleteOne({ title: 'Eat lunch' }).then((result) => {
		console.log(result);
	}).finally(() => {
		db.close();
	});
});