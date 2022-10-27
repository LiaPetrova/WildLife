const { hasUser, isOwner } = require('../middlewares/guards');
const preload = require('../middlewares/preload');
const { createPost, getAll, editPost, upVote, downVote, deletePost } = require('../services/postService');
const { parseError } = require('../util/parser');

const postController = require('express').Router();

postController.get('/create', (req, res) => {
    res.render('create', {
        title: 'Create Post'
    });
});

postController.post('/create', hasUser(), async (req, res) => {

    const post = req.body;
    post.owner = req.user;

    try {
        if(Object.values(req.body).some(v => v == '')) {
            throw new Error('All fields are required');
        }

        await createPost(post, req.user._id);
        res.redirect('/post/catalog');

    } catch (error) {
        res.render('create', {
            title: 'Create Post',
            post,
            errors: parseError(error)
        });
    }
});

postController.get('/catalog', async (req, res) => {
    const posts = await getAll();

    res.render('catalog', {
        title: 'Posts Catalog',
        posts
    });
});

postController.get('/:id/details', preload(true), async (req, res) => {
    const post = res.locals.post;
    post.hasVoted = post.votes.some(v => v._id.toString() == req.user?._id);
    post.isOwner = post.owner._id.toString() == req.user?._id;
    const emailsArray = [];
    post.votes.forEach(v => emailsArray.push(v.email));
    post.votersEmails = emailsArray.join(', ');

    res.render('details', {
        title: post.title,
        post
    });
});

postController.get('/:id/upvote', hasUser(), preload(true), async (req, res) => {
    const post = res.locals.post;

    try {
        if (req.user._id.toString() == post.owner._id.toString()) {
            post.isOwner = true;
            throw new Error ('You cannot vote for your own post')
        }

        if(post.votes.some(u => u._id.toString() == req.user._id.toString())) {
            post.hasVoted = true;
            throw new Error ('You cannot vote for the same post twice')
        }

        await upVote(post._id, req.user._id);
        res.redirect(`/post/${post._id}/details`);

    } catch(error) {
        res.render('details', {
            title: `${post.title}`,
            post,
            errors: parseError(error)
        });
    }
});


postController.get('/:id/downvote', hasUser(), preload(true), async (req, res) => {
    const post = res.locals.post;

    try {
        if (req.user._id.toString() == post.owner._id.toString()) {
            post.isOwner = true;
            throw new Error ('You cannot vote for your own post')
        }

        if(post.votes.some(u => u._id.toString() == req.user._id.toString())) {
            post.hasVoted = true;
            throw new Error ('You cannot vote for the same post twice')
        }

        await downVote(post._id, req.user._id);
        res.redirect(`/post/${post._id}/details`);

    } catch(error) {
        res.render('details', {
            title: `${post.title}`,
            post,
            errors: parseError(error)
        });
    }
});

postController.get('/:id/edit', preload(true), isOwner(), async (req, res) => {

    const post = res.locals.post

    res.render('edit', {
        title: `Edit ${post.title}`,
        post
    });

});

postController.post('/:id/edit', preload(true), isOwner(), async (req, res) => {

    const post = res.locals.post;
    const edited = req.body;
    edited._id = post._id;

    try {

        await editPost(post._id, edited);
        res.redirect(`/post/${post._id}/details`);
    } catch(error) {

        res.render('edit', {
        title: `Edit ${post.title}`,
        post: edited,
        errors: parseError(error)
        });
    }
});

postController.get('/:id/delete', preload(true), isOwner(), async (req, res) => {
    await deletePost(res.locals.post._id);
    res.redirect('/post/catalog');
});


module.exports = postController;