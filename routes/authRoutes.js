const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const pool = require('../config/database');
const authMiddleware = require('../middleware/authMiddleware');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'frontend', 'img', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage setup for avatar uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `avatar_${req.user?.id || 'anon'}_${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });

// Validation middleware
const registerValidation = [
  check('username').trim().isLength({ min: 3 }).escape(),
  check('email').isEmail().normalizeEmail(),
  check('password').isLength({ min: 6 })
];

const loginValidation = [
  check('email').isEmail().normalizeEmail(),
  check('password').notEmpty()
];

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 'error', errors: errors.array() });
    }

    const { username, email, password } = req.body;
    const [existingUsers] = await pool.query(
      'SELECT * FROM users WHERE email = ? OR username = ?',[email, username]
    );
    if (existingUsers.length > 0) {
      return res.status(400).json({ status: 'error', message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await pool.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    const token = jwt.sign(
      { id: result.insertId, username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      status: 'success',
      data: { token, user: { id: result.insertId, username, email } }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/login', loginValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 'error', errors: errors.array() });
    }

    const { email, password } = req.body;

    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      status: 'success',
      data: { token, user: { id: user.id, username: user.username, email: user.email } }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, username, email, profile_image, phone, bio, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    if (users.length === 0) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }
    res.json({ status: 'success', data: { user: users[0] } });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

/**
 * @route   PUT /api/auth/profile
 * @desc    Update profile fields
 * @access  Private
 */
router.put('/profile', authMiddleware, [
  check('username').optional().trim().isLength({ min: 3 }).escape(),
  check('email').optional().isEmail().normalizeEmail(),
  check('phone').optional().trim().escape(),
  check('bio').optional().trim().escape()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 'error', errors: errors.array() });
    }

    const { username, email, phone, bio } = req.body;
    await pool.query(
      'UPDATE users SET username = COALESCE(?, username), email = COALESCE(?, email), phone = COALESCE(?, phone), bio = COALESCE(?, bio) WHERE id = ?',
      [username || null, email || null, phone || null, bio || null, req.user.id]
    );

    const [users] = await pool.query(
      'SELECT id, username, email, profile_image, phone, bio FROM users WHERE id = ?',
      [req.user.id]
    );

    res.json({ status: 'success', data: { user: users[0] } });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

/**
 * @route   PUT /api/auth/password
 * @desc    Change password
 * @access  Private
 */
router.put('/password', authMiddleware, [
  check('currentPassword').notEmpty(),
  check('newPassword').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 'error', errors: errors.array() });
    }
    const { currentPassword, newPassword } = req.body;

    const [users] = await pool.query('SELECT password FROM users WHERE id = ?', [req.user.id]);
    if (users.length === 0) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    const match = await bcrypt.compare(currentPassword, users[0].password);
    if (!match) {
      return res.status(400).json({ status: 'error', message: 'Current password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashed, req.user.id]);

    res.json({ status: 'success', message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

/**
 * @route   POST /api/auth/avatar
 * @desc    Upload avatar image
 * @access  Private
 */
router.post('/avatar', authMiddleware, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'No file uploaded' });
    }
    const relativePath = `/frontend/img/uploads/${req.file.filename}`;
    await pool.query('UPDATE users SET profile_image = ? WHERE id = ?', [relativePath, req.user.id]);

    res.status(201).json({ status: 'success', data: { profile_image: relativePath } });
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

module.exports = router;
