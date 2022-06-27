const { Schema, model } = require('mongoose');
const { validEmail } = require('validator');

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validEmail, 'Please enter a valid email address']
  },
  thoughts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'thought'
    }
  ],
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: 'user'
    }
  ]
},
  {
    toJSON: {
      virtuals: true
    },
    id: false
  });

userSchema.virtual('freindCount').get(function () {
  return this.friends.length;
});

const User = model('user', userSchema);

module.exports = User;