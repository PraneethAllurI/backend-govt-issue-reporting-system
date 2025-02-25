const Issue = require("../models/issueModel");

// Get all reported issues
exports.getAllIssues = async (req, res) => {
  try {
    const issues = await Issue.find().populate("user_id", "username email"); 
    res.json(issues);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update issue status
exports.updateIssueStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedIssue = await Issue.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedIssue) {
      return res.status(404).json({ error: "Issue not found" });
    }

    res.json({ message: "Status updated successfully", issue: updatedIssue });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete an issue
exports.deleteIssue = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedIssue = await Issue.findByIdAndDelete(id);

    if (!deletedIssue) {
      return res.status(404).json({ error: "Issue not found" });
    }

    res.json({ message: "Issue deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
