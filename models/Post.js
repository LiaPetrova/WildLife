const { model, Schema, Types } = require('mongoose');

const URL_PATTERN = /https?:\/\/./i;
const DATE_PATTERN = /^(0?[1-9]|[12][0-9]|3[01])[\/\-\.](0?[1-9]|1[012])[\/\-\.]\d{4}$/i;

const postSchema = new Schema ({
    title: { type: String, minLength: [6, 'Title must be at least 6 characters long']},
    keyword: { type: String, minLength: [6, 'Keyword must be at least 6 characters long']},
    location: { type: String, maxLength: [15, 'Location cannot be longer than 15 characters']},
    imageUrl: { type: String, validate: {
        validator: (value) => (URL_PATTERN.test(value)),
        message: 'Invalid URL' 
    }},
    description: { type: String, minLength: [8, 'Description must be at least 8 characters long']},
    date: { type: String, minLength: [10, 'Data must be exactly 10 characters long'], maxLength: [10, 'Data must be exactly 10 characters long'], validate: {
        validator: (value) => (DATE_PATTERN.test(value)),
        message: 'Invalid date' 
    }},
    owner: { type: Types.ObjectId, ref: 'User', required: true},
    votes: { type: [Types.ObjectId], ref: 'User', default: []},
    rating: { type: Number, default: 0}
});

const Post = model('Post', postSchema);

module.exports = Post;