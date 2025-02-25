const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  username: { type: String, required: true, },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String },
  location: { type: { type: String, default: 'Point' }, coordinates: [Number] },
  status: { type: String, default: 'Reported' },
  createdAt: { type: Date, default: Date.now },

}
);

module.exports = mongoose.model('Issue', issueSchema); 
