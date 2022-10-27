const { hasUser } = require('../middlewares/guards');
const { getPostsByUser } = require('../services/postService');

const profileController = require('express').Router();

profileController.get('/', hasUser(), async (req, res) => {
    const userData = await getPostsByUser(req.user._id);

    res.render('profile', {
        title: 'Profile Page',
        myPosts: userData.myPosts,
        user: `${userData.firstName} ${userData.lastName}`
    });
});

module.exports = profileController;
