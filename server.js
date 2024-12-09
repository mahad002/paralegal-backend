const express = require('express');
const cors = require('cors'); // Import the cors module
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const caseRoutes = require('./routes/caseRoutes');
const caseCommitRoutes = require('./routes/caseCommitRoutes');
const chatHistoryRoutes = require('./routes/chatRoutes');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware to parse JSON
app.use(express.json());

// Use CORS middleware
app.use(cors());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/case-commits', caseCommitRoutes);
app.use('/api/chat-history', chatHistoryRoutes);

// Simple route to check server status
app.get('/', (req, res) => res.send('API is running...'));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
