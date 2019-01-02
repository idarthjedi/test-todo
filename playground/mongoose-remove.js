/* eslint-disable no-console */
const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { TodoModel } = require('./../server/models/todo');
const { UserModel } = require('./../server/models/user');

TodoModel.findByIdAndRemove('5c2cff90127e6e01cd0f20c4').then((todo) => { console.log(todo); });