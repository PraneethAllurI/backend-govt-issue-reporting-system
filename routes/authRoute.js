const express = require('express');
const router = express.Router();
const userController = require('../controllers/authController');
const verifyToken = require('../middlewares/authenticateUserJwt');

// Register Route
router.post('/register', userController.userRegister) //register user
router.post('/login', userController.userLogin) //login user
router.post('/refresh-token', userController.userRefreshToken) // refresh token
router.get('/profile', verifyToken, userController.protectedUserAccess) // user access

  module.exports = router;

module.exports = router;
