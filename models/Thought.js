const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction');

const thoughtSchema = new Schema({
	thoughtText: {
		type: String,
		required: true,
		minLength: 1,
		maxLength: 280
	},
	createdAt: {
		type: Date,
		default: Date.now,
		get: (v) => {
			return v.toLocaleDateString(undefined, {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			});
		}
	},
	username: {
		type: String,
		required: true,
	},
	reactions: [reactionSchema]
},
	{
		toJSON: {
			virtuals: true,
			getters: true
		},
		id: false
	});

// Create a virtual called reactionCount that retrieves the length of the thought's reactions array field on query.
thoughtSchema.virtual('reactionCount').get(function () {
	return this.reactions.length;
});
const Thought = model('thought', thoughtSchema);
module.exports = Thought;