const authController = require("../controllers/authController");
const defaultController = require("../controllers/defaultController");
const homeController = require("../controllers/homeController");
const postController = require("../controllers/postController");
const profileController = require("../controllers/profileController");

module.exports = (app) => {
    app.use('/', homeController);
    app.use('/auth', authController);
    app.use('/post', postController);
    app.use('/profile', profileController);
    app.all('*', defaultController);
};