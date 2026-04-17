// backend/routes/comment.routes.js
const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const { protect } = require('../middleware/auth.middleware');

// GET /api/comments/post/:postId - Get all comments for a post
router.get('/post/:postId', async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId })
            .populate('author', 'name profilePic')
            .sort({ createdAt: -1 });
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/comments - Create a new comment (line 26 is probably this one)
router.post('/', protect, async (req, res) => {
    try {
        const { post, body } = req.body;
        
        const comment = new Comment({
            post,
            body,
            author: req.user._id
        });
        
        await comment.save();
        
        const populatedComment = await Comment.findById(comment._id)
            .populate('author', 'name profilePic');
        
        res.status(201).json(populatedComment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE /api/comments/:id - Delete a comment
router.delete('/:id', protect, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        
        // Check if user is author or admin
        if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }
        
        await comment.deleteOne();
        res.json({ message: 'Comment deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;