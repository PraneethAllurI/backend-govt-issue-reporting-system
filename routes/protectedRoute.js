const express = require('express')
const router = express.Router();
const verifyToken = require('../middlewares/authenticateUserJwt')

router.get('/protected-endpoint', verifyToken, (req, res) => {
    // Example: accessing user info from the decoded JWT
    const { user_id, username } = req.user;
    console.log("protected endpoint part is done")
    res.json({ message: 'User data accessible', user_id, username });
  });

  module.exports = router;
  