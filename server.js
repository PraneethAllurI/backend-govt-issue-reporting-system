const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const socketIO = require('socket.io');


dotenv.config();
//import routes 
const userRoutes = require('./routes/authRoute')
const issueRoutes = require('./routes/issueRoute')
const adminRoutes = require('./routes/adminRoutes')

const app = express();
app.use(express.json());

// ✅ Proper CORS configuration
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));


// Routes
app.use('/api', userRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/admin', adminRoutes);

//load route
app.get('/', (req, res) => {
  res.send('Hello, world! MongoDB connected successfully.');
});


// Start the server
const server = app.listen(process.env.PORT || 4000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});

// Real-time communication
const io = socketIO(server);
io.on('connection', (socket) => {
  console.log('A user connected');
  // Handle events
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
