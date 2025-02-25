const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");

const userRegister = async (req, res) => {
  const { aadhar, username, email, password, role } = req.body;
  if (!aadhar || !username || !email || !password) {
    return res.status(400).send("Name, email, and password are required.");
  }
  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({message : "Email already registered." });
    }
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role,
      aadhar,
    });
    await user.save();
    res.status(201).json({ message: "User registered" });
  } catch (error) {
    console.log("error is", error);
    res.status(500).json({ message: "Error registering user", error });
  }
};
 
const userLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "No user found" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const accessToken = jwt.sign(
      { user_id: user._id, role: user.role, username : user.username },
      process.env.JWT_SECRET,
      { expiresIn: "2hrs" }
    );
    const refreshToken = jwt.sign(
      { user_id: user._id, role: user.role, username : user.username },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );
    res.json({ accessToken, refreshToken, role: user.role});
  } catch (err) {
    console.log("the error is", err)
    res.status(500).send({ message: "Server error" });
  }
};

const userRefreshToken = async (req, res) => {
  const { token } = req.body;
  if (!token)
    return res.status(400).json({ message: "Refresh token missing" });

  jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid refresh token" });

    const newAccessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1hr" }
    );
    res.json({ accessToken: newAccessToken });
  });
};

const protectedUserAccess = async(req, res) =>{
    try {
        const user = await User.findById(req.user.user_id).select('-password');
        res.status(201).json(user);
      } catch (err) {
        res.status(500).json({ message: 'Error fetching user data' });
      }
}

module.exports = {
  userRefreshToken,
  userRegister,
  userLogin,
  protectedUserAccess,
};
