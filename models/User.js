const { model, Schema, Types } = require('mongoose');

const EMAIL_PATTERN = /^[A-Za-z]+@[a-zA-z]+\.[a-zA-Z]+$/i;
//TODO
const userSchema = new Schema({
    email: { type: String, validate: {
        validator: (value) => (EMAIL_PATTERN.test(value)),
        message: 'Invalid Email' 
    }},
    firstName: { type: String, minLength: [3, 'First name must be at least 3 characters long']},
    lastName: { type: String, minLength: [5, 'Last name must be at least 5 characters long']},
    myPosts: { type: [Types.ObjectId], default: [], ref: 'Post'},
    hashedPassword: { type: String, required: true }
});

userSchema.index({ email : 1 }, {
    collation: {
        locale: 'en',
        strength: 2
    }
});

const User = model('User', userSchema);

module.exports = User;