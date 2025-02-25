const Issue = require("../models/issueModel");
//const getCoordinates = require('../utils/geocode');
const { uploadImage } = require("../middlewares/uploads"); // For image upload

// Create a new issue
exports.createIssue = async (req, res) => {
  const { title, description, category, location, } =
    req.body;
    const { user_id, username} = req.user;
    if (!title || !description || !category || !user_id) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const existingIssue = await Issue.findOne({ 
      user_id, 
      title: { $regex: new RegExp(`^${title}$`, "i") }, // Case-insensitive check
      description: { $regex: new RegExp(`^${description}$`, "i") }
    });

    if (existingIssue) {
      return res.status(400).json({ error: "You have already reported this issue!" });
    }
    const image = req.file
    ? await uploadImage(req.file).catch((err) => {
        console.error("Image upload failed:", err);
        return res.status(500).json({ error: 'Image upload failed' }); // Send response if image upload fails
      })
    : null; // Upload image to Cloudinary if exists
  const coordinates = location ? [location.longitude, location.latitude] : [162.62, 6.0];

  // Get coordinates using Google Maps API (latitude and longitude)
  //   let coordinates = [];
  //   if (location) {
  //     try {
  //       coordinates = await getCoordinates(location); // Fetch coordinates using Google Maps API
  //     } catch (error) {
  //       return res.status(500).json({ error: 'Error getting location coordinates.' });
  //     }
  //   }

  try {
    const newIssue = new Issue({
      user_id,
      username,
      title,
      description,
      category,
      location: {
        type: "Point",
        coordinates: coordinates, // Store coordinates (longitude, latitude)
      },
      image, // Store image URL if uploaded
    });

    await newIssue.save();
    res.status(201).json({ message: "Issue reported successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating issue" });
  }
};

// Get issues by user ID
exports.getIssuesByUser = async (req, res) => {
  const { user_id } = req.params;

  // 1. Validate the user_id (assuming it should be a valid ObjectId in MongoDB)
  if (!user_id) {
    return res.status(400).json({ error: "Invalid or missing user_id" });
  }

  try {
    // 2. Query for issues associated with the user_id
    const issues = await Issue.find({ user_id });

    // 3. Handle case where no issues are found
    if (issues.length === 0) {
      return res.status(404).json({ error: "No issues found for this user" });
    }

    // 4. Return issues
    res.json(issues);
  } catch (error) {
    console.error(error);

    // 5. Differentiate error responses based on the type of error
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid user_id format" });
    }

    // 6. General server error response
    res
      .status(500)
      .json({ error: "Internal server error. Please try again later." });
  }
};

