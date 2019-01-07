/* eslint-disable no-console,no-unused-vars */
const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { TodoModel } = require('./../models/todo');
const { UserModel } = require('./../models/user');

const { todos, populateTodos, users, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

//<editor-fold desc="Describe TODOS">
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
			expect((res) => {
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
//</editor-fold>

describe('GET /users/me', () => {
	it('should return user if authenticated', (done) => {

		request(app).
			get('/users/me').
			set('x-auth', users[0].tokens[0].token).
			expect(200).
			expect((res) => {
				expect(res.body._id).toBe(users[0]._id.toHexString());
				expect(res.body.email).toBe(users[0].email);

			}).end(done);
	});

	it('should return a 401 if not authenticated', (done) => {
		request(app).get('/users/me').expect(401).expect((res) => {
			expect(res.body).toEqual({});
		}).end(done);
	});
});

describe('POST /users/', () => {
	it('should create a user', (done) => {

		let email = 'test@example.com';
		let password = 'testPassw0rd!';

		request(app).
			post('/users').
			send({ email, password }).
			expect(200).
			expect((res) => {
				expect(res.headers['x-auth']).toExist();
				expect(res.body._id).toExist();
				expect(res.body.email).toBe(email);
			}).
			end(done);
	});


	it('should throw validation errors', (done) => {

		let email = 'testexample.com';
		let password = 't0rd!';

		request(app).
			post('/users').
			send({ email, password }).
			expect(400).
			end(done);
	});

	it('should enforce email uniqueness', (done) => {

		let email = 'jediah@example.com';
		let password = 'testPassw0rd!';

		request(app).
			post('/users').
			send({ email, password }).
			expect(400).
			end((err) => {
				if (err) {
					return done(err);
				}
				else {
					return done();
				}

			});
	});
});
