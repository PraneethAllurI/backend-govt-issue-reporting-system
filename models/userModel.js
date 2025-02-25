const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema({
  user_id: { 
    type: String, 
    unique: true, 
    default: uuidv4 // Generate unique user_id
  },
  aadhar : {type: Number, required: true},
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'citizen', 'local_authority'], required: true, default : 'citizen'}
});

// Password comparison method
userSchema.methods.matchPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  } 
;

module.exports = mongoose.model('User', userSchema); 
