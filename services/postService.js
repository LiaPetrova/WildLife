const Post = require("../models/Post");
const User = require("../models/User");

async function getAll() {
    return Post.find({}).lean();
}

async function getById (id) {
    return Post.findById(id).populate('owner').populate('votes').lean();
}

async function getByIdRaw (id) {
    return Post.findById(id);

}

async function createPost (data, userId) {
    let post = {
        title: data.title,
        keyword: data.keyword,
        location: data.location,
        date: data.date,
        description: data.description,
        imageUrl: data.imageUrl,
        owner: data.owner
    }
    post = await Post.create(post);

    const user = await User.findById(userId);
    user.myPosts.push(post);
    await user.save();

}

async function upVote (postId, userId) {
    const post = await Post.findById(postId);
    post.votes.push(userId);
    post.rating++;

    return post.save();
}

async function downVote (postId, userId) {
    const post = await Post.findById(postId);
    post.votes.push(userId);
    post.rating--;

    return post.save();
}

async function editPost (postId, data) {
    const post = await Post.findById(postId);
    
    post.title = data.title;
    post.keyword = data.keyword;
    post.location = data.location;
    post.imageUrl = data.imageUrl;
    post.description = data.description;
    post.date = data.date;
    
    return post.save();
} 

async function deletePost (postId) {
    const user = await User.findOne({ 'myPosts': postId});
    const index = user.myPosts.indexOf(postId);
    user.myPosts.splice(index,1);
    await user.save();
    return Post.findByIdAndRemove(postId);
}

async function getPostsByUser (userId) {
    const user = await User.findById(userId).populate('myPosts').lean();
    return user;
}

module.exports = {
    getById,
    getByIdRaw,
    createPost,
    getAll,
    upVote,
    downVote,
    editPost,
    deletePost,
    getPostsByUser
}