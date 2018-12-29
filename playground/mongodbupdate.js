/* eslint-disable no-console */
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, db) => {
	if (err) {
		return console.log('Unable to connect to db server');
	}

	console.log('Connected to MongoDB Server.');

	db.collection('Todos').findOneAndUpdate({
		_id: new ObjectID('5c23d25938e1cefa748ad29a'),
	}, {
		$set:
			{
				completed: true,
			}
	}, {
		returnOriginal: false,
	}).then((result) => {
		console.log(result);
	}).finally(() => {
		db.close();
	});

});
