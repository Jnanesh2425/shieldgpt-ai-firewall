const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const promptRoutes = require('./routes/promptRoutes');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Test route
app.get('/', (req, res) => {
  res.json({ message: '🛡️ AI Firewall for LLMs - Backend Running' });
});

// API Routes
app.use('/api', promptRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🛡️  AI Firewall Backend is active`);
  console.log(`📡 API ready at http://localhost:${PORT}/api`);
});