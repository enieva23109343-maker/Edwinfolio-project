// backend/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // Look for 'Authorization: Bearer <token>' in request headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized — please log in first' });
    }

    try {
        // Verify the token using your JWT_SECRET
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the full user object to req.user (minus the password)
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user || req.user.status === 'inactive') {
            return res.status(401).json({ message: 'Account not found or deactivated' });
        }

        next(); // Pass to the next handler
    } catch (err) {
        return res.status(401).json({ message: 'Token is invalid or has expired' });
    }
    // Update profile with image upload
router.put('/profile', verifyToken, upload.single('profilePic'), async (req, res) => {
  try {
    const { name, bio } = req.body;
    const updateData = { name, bio };
    
    if (req.file) {
      updateData.profilePic = `/uploads/${req.file.filename}`;
    }
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      updateData,
      { new: true }
    ).select('-password');
    
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// Change password
router.put('/password', verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.userId);
    
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error changing password' });
  }
});
};

module.exports = { protect };