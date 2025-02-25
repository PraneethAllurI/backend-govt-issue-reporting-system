const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const verifyAdmin = require("../middlewares/authenticateAdminJwt");

// Fetch all reported issues
router.get("/issues", verifyAdmin, adminController.getAllIssues);

// Update issue status
router.put("/issue/:id/status", verifyAdmin, adminController.updateIssueStatus);

// Delete an issue
router.delete("/issue/:id", verifyAdmin, adminController.deleteIssue);

module.exports = router;
