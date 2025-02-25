const express = require('express');
const router = express.Router();
const issueController = require('../controllers/issueController');
const verifyToken = require('../middlewares/authenticateUserJwt'); // Import JWT verification middleware
const { upload } = require('../middlewares/uploads'); // Import multer upload middleware

// Create a new issue (only accessible to authenticated users)
router.post('/create', verifyToken, upload.single('image'), issueController.createIssue);

router.get('/user/:user_id', issueController.getIssuesByUser);

module.exports = router; 
