const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const pool = require('../config/database');

/**
 * @route   POST /api/messages
 * @desc    Send a message to another user
 * @access  Private
 */
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { receiver_id, product_id, message } = req.body;

        // Create message
        const [result] = await pool.query(
            'INSERT INTO messages (sender_id, receiver_id, product_id, message) VALUES (?, ?, ?, ?)',
            [req.user.id, receiver_id, product_id, message]
        );

        // Get the created message with sender details
        const [messages] = await pool.query(`
            SELECT m.*, u.username as sender_name, u.profile_image as sender_image
            FROM messages m
            JOIN users u ON m.sender_id = u.id
            WHERE m.id = ?
        `, [result.insertId]);

        res.status(201).json({
            status: 'success',
            data: {
                message: messages[0]
            }
        });
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
});

/**
 * @route   GET /api/messages/chat/:userId
 * @desc    Get chat history with another user
 * @access  Private
 */
router.get('/chat/:userId', authMiddleware, async (req, res) => {
    try {
        const [messages] = await pool.query(`
            SELECT m.*, 
                   u1.username as sender_name, u1.profile_image as sender_image,
                   u2.username as receiver_name, u2.profile_image as receiver_image,
                   p.title as product_title, p.image_url as product_image
            FROM messages m
            JOIN users u1 ON m.sender_id = u1.id
            JOIN users u2 ON m.receiver_id = u2.id
            LEFT JOIN products p ON m.product_id = p.id
            WHERE (m.sender_id = ? AND m.receiver_id = ?)
               OR (m.sender_id = ? AND m.receiver_id = ?)
            ORDER BY m.created_at ASC
        `, [req.user.id, req.params.userId, req.params.userId, req.user.id]);

        res.json({
            status: 'success',
            data: {
                messages
            }
        });
    } catch (error) {
        console.error('Get chat history error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
});

/**
 * @route   PUT /api/messages/read/:userId
 * @desc    Mark messages from a user as read
 * @access  Private
 */
router.put('/read/:userId', authMiddleware, async (req, res) => {
    try {
        await pool.query(`
            UPDATE messages 
            SET read_at = CURRENT_TIMESTAMP
            WHERE sender_id = ? AND receiver_id = ? AND read_at IS NULL
        `, [req.params.userId, req.user.id]);

        res.json({
            status: 'success',
            message: 'Messages marked as read'
        });
    } catch (error) {
        console.error('Mark messages read error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
});

/**
 * @route   GET /api/messages/unread
 * @desc    Get count of unread messages
 * @access  Private
 */
router.get('/unread', authMiddleware, async (req, res) => {
    try {
        const [result] = await pool.query(`
            SELECT COUNT(*) as count
            FROM messages
            WHERE receiver_id = ? AND read_at IS NULL
        `, [req.user.id]);

        res.json({
            status: 'success',
            data: {
                unreadCount: result[0].count
            }
        });
    } catch (error) {
        console.error('Get unread count error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
});

module.exports = router;
