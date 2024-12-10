const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const caseRoutes = require('./routes/caseRoutes');
const caseCommitRoutes = require('./routes/caseCommitRoutes');
const chatHistoryRoutes = require('./routes/chatHistoryRoutes');
const caseNoteRoutes = require('./routes/caseNoteRoutes');
const s3Routes = require('./routes/s3Routes'); 

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json()); // Parse incoming JSON requests
app.use(cors()); // Enable CORS for all routes

// Routes
app.use('/users', userRoutes);
app.use('/cases', caseRoutes);
app.use('/case-commits', caseCommitRoutes);
app.use('/chat-history', chatHistoryRoutes);
app.use('/case-notes', caseNoteRoutes);
app.use('/api/s3', s3Routes);

// Health check route
app.get('/', (req, res) => res.send('Server is running...'));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
