// backend/server.js
require('dotenv').config(); // Load .env variables FIRST
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth.routes');
const postRoutes = require('./routes/post.routes');
const commentRoutes = require('./routes/comment.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();
connectDB(); // Connect to MongoDB

// ── Middleware ─────────────────────────────────────────────────
// Allow React (port 3000) to call this server
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// Parse incoming JSON request bodies
app.use(express.json());

// Serve uploaded image files as public URLs
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/admin', adminRoutes);

// ── Production Static File Serving ───────────────────────────
if (process.env.NODE_ENV === 'production') {
    // Serve React frontend static files
    app.use(express.static(path.join(__dirname, '../frontend/build')));
    
    // Handle any request that doesn't match API routes
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
    });
}

// ── Start Server ──────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});