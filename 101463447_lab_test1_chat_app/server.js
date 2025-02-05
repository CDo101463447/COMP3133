const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');  // Import jsonwebtoken for token generation

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Configure Socket.io
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins (update this in production)
    methods: ['GET', 'POST']
  }
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chat_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Import Models
const User = require('./models/User');
const GroupMessage = require('./models/GroupMessage');
const PrivateMessage = require('./models/PrivateMessage');

// Import Routes
const signupRoute = require('./routes/signup');
const loginRoute = require('./routes/login');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files

// Use Routes
app.use('/api/signup', signupRoute);
app.use('/api/login', loginRoute);

// Login Route - generates JWT token upon successful login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ username: user.username }, 'your-secret-key', { expiresIn: '1h' });

    // Send the token in response
    res.status(200).json({ token, message: "Login successful" });
  } catch (err) {
    res.status(500).json({ message: "Error logging in" });
  }
});

// Socket.io Connection Handler
io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);

  // Store active users in a Map
  const activeUsers = new Map();

  // Handle login (after successful login, store username in active users)
  socket.on('login', (username) => {
    activeUsers.set(socket.id, username);
    console.log(`${username} logged in`);
  });

  // Handle room joining
  socket.on('joinRoom', async (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
    
    // Load previous messages
    const messages = await GroupMessage.find({ room }).sort({ date_sent: 1 });
    socket.emit('previousMessages', messages);
  });

  // Handle sending messages
  socket.on('sendMessage', async (messageData) => {
    const newMessage = new GroupMessage({
      from_user: messageData.username,
      room: messageData.room,
      message: messageData.message
    });

    await newMessage.save();

    io.to(messageData.room).emit('receiveMessage', {
      from: messageData.username,
      message: messageData.message,
      timestamp: new Date()
    });
  });

  // Handle private messaging
  socket.on('sendPrivateMessage', async (messageData) => {
    const newMessage = new PrivateMessage({
      from_user: messageData.username,
      to_user: messageData.to_user,
      message: messageData.message
    });

    await newMessage.save();

    socket.to(messageData.to_user).emit('receivePrivateMessage', {
      from: messageData.username,
      message: messageData.message,
      timestamp: new Date()
    });
  });

  // Handle typing indicator
  socket.on('typing', (data) => {
    socket.broadcast.to(data.room).emit('userTyping', {
      username: data.username
    });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    const username = activeUsers.get(socket.id);
    console.log(`${username} disconnected`);
    activeUsers.delete(socket.id);
  });
});

// Start Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
