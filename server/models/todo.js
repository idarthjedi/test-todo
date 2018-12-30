let mongoose = require('mongoose');

let TodoModel = mongoose.model('Todo', {
	text: {
		type: String,
		required: true,
		minLength: 1,
		trim: true,
	},
	completed: {
		type: Boolean,
		default: false,
	},
	completedAt: {
		type: Number,
		default: null,
	},
});

module.exports = { TodoModel };

