/* eslint-disable no-console */
let expect = require('expect');
let request = require('supertest');
let { ObjectID } = require('mongodb');

let { app } = require('./../server');
let { TodoModel } = require('./../models/todo');

const todos = [
	{
		_id: new ObjectID(),
		text: 'First created todo',
	}, {
		_id: new ObjectID(),
		text: 'Second created todo',
	}];

beforeEach((done) => {
	TodoModel.remove({}).then(() => {
		return TodoModel.insertMany(todos);
	}).then(() => done());
});

describe('POST /todos', () => {
	it('should create a new todo', (done) => {
		let text = 'Test Todo Text';

		request(app).post('/todos').send({ text }).expect(200).expect((res) => {
			expect(res.body.text).toBe(text);
		}).end((err, res) => {
			if (err) {
				return done(err);
			}

			//Check the database to see if the Todo was created
			TodoModel.find().then((todos) => {
				expect(todos.length).toBe(3);
				expect(todos[2].text).toBe(text);
				done();
			}).catch((e) => {
				done(e);
			});
		});
	});

	it('should not create a todo with invalid data', (done) => {

		request(app).post('/todos').send({}).expect(400).end((err, res) => {
			if (err) {
				return done(err);
			}

			TodoModel.find().then((todos) => {
				expect(todos.length).toBe(2);
				done();
			}).catch((e) => {
				done(e);
			});
		});

	});

	it('should GET all todos', (done) => {
		request(app).get('/todos').expect(200).expect((res) => {
			expect(res.body.todos.length).toBe(2);
		}).end(done);
	});
});

describe('GET /todos/:id', () => {

	it('should return a todo doc', (done) => {
		request(app).
			get(`/todos/${todos[0]._id.toHexString()}`).
			expect(200).
			expect((res) => {
				expect(res.body.todo.text).toBe(todos[0].text);

			}).end(done);
	});

	it('should return 404 for ObjectID not found', (done) => {
		request(app).
			get(`/todos/${new ObjectID().toHexString()}`).
			expect(404).
			end(done);
	});

	it('should return 404 for invalid ObjectID', (done) => {
		request(app).get('/todos/12345').expect(404).end(done);
	});
});

describe('PATCH /todos/:id', () => {

	it('should set completed=true and a completed date', (done) => {

		request(app).
			patch(`/todos/${todos[1]._id}`).
			send({ completed: true, text: 'New todo text' }).
			expect(200).
			expect((res) => {
				expect(res.body.todo._id).toBe(todos[1]._id.toHexString());
				expect(res.body.todo.text).toBe('New todo text');
				expect(res.body.todo.completed).toBeTruthy();
				expect(res.body.todo.completedAt).toNotBe(null);
			}).
			end(done);
	});

	it('should clear completedAt when completed=false', (done) => {

		request(app).
			patch(`/todos/${todos[1]._id}`).
			send({ completed: false }).
			expect(200).
			expect( (res) => {
				expect(res.body.todo.completedAt).toNotExist();
			}).
			end(done);
	});

	// request(app).
	// 	patch(`/todos/${todos[1]._id}`).
	// 	send({ 'completed': true, 'text': 'New todo text' }).
	// 	expect(200).
	// 	expect((res) => {
	// 		expect(res.body.todo._id).toBe(todos[1]._id.toHexString());
	// 	}).end((err, res) => {
	// 		if (err) {
	// 			return done(err);
	// 		}
	//
	// 		done();
	// 	}).
	// 	catch((err) => {
	// 		done(err);
	// 	});
	//done();

	it('should return 404 for ObjectID not found', (done) => {
		request(app).
			patch(`/todos/${new ObjectID().toHexString()}`).send({}).
			expect(404).
			end(done);
	});

	it('should return 404 for invalid ObjectID', (done) => {
		request(app).patch('/todos/1234').expect(404).send({}).end(done);
	});
});

describe('DELETE /todos/:id', () => {

	it('should return 404 for an invalid ObjectID', (done) => {
		request(app).del('/todos/1234').expect(404).end(done);
	});

	it('should return 404 for ObjectID not found', (done) => {
		request(app).
			del(`/todos/${new ObjectID().toHexString()}`).
			expect(404).
			end(done);
	});

	it('should delete a todo by id', (done) => {
		request(app).del(`/todos/${todos[0]._id}`).expect(200).expect((res) => {
			expect(res.body.todo._id).toBe(todos[0]._id.toHexString());
		}).end((err, res) => {

			if (err) {
				return done(err);
			}
			//confirm the todo no longer exists in the database
			TodoModel.findById(todos[0]._id).then((todo) => {
				expect(todo).toNotExist();

				done();
			}).catch((e) => {
				done(e);
			});
		});
	});
	/*	it('should delete a todo by id', (done) => {
			request(app).del(`/todos/${todos[0]._id}`).expect(200).expect((res) => {
				expect(res.body.todo._id).toBe(todos[0]._id.toHexString());
			}).end((err, res) => {

				//confirm the Todo has been deleted
				TodoModel.findById(todos[0]._id).then((todo) => {
					expect(todos.length).toBe(0);
				}).end(done);
			)
		};*/
});