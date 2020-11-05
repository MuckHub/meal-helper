const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');

router.get('/signUp', usersController.renderSignUp);
router.post('/signUp', usersController.register);

router.get('/signIn', usersController.renderSignIn);
router.post('/signIn', usersController.login);

router.get('/logout', usersController.logout);

module.exports = router;
