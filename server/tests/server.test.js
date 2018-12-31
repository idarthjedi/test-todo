let expect = require('expect');
let request = require('supertest');

let { app } = require('./../server');
let { TodoModel } = require('./../models/todo');

const todos = [
	{
		text: 'First created todo',
	}, {
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


