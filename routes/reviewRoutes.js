const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const pool = require('../config/database');

// Validation middleware
const reviewValidation = [
    check('rating').isInt({ min: 1, max: 5 }),
    check('comment').trim().isLength({ min: 3 })
];

/**
 * @route   POST /api/reviews/:productId
 * @desc    Create a review for a product
 * @access  Private
 */
router.post('/:productId', [authMiddleware, reviewValidation], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'error',
                errors: errors.array()
            });
        }

        const { rating, comment } = req.body;
        const productId = req.params.productId;

        // Check if product exists and get seller ID
        const [products] = await pool.query(
            'SELECT user_id FROM products WHERE id = ?',
            [productId]
        );

        if (products.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Product not found'
            });
        }

        const sellerId = products[0].user_id;

        // Check if user has purchased the product
        const [orders] = await pool.query(`
            SELECT o.id 
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            WHERE o.user_id = ? AND oi.product_id = ?
        `, [req.user.id, productId]);

        if (orders.length === 0) {
            return res.status(403).json({
                status: 'error',
                message: 'You must purchase the product before leaving a review'
            });
        }

        // Check if user has already reviewed this product
        const [existingReviews] = await pool.query(
            'SELECT id FROM reviews WHERE product_id = ? AND reviewer_id = ?',
            [productId, req.user.id]
        );

        if (existingReviews.length > 0) {
            return res.status(400).json({
                status: 'error',
                message: 'You have already reviewed this product'
            });
        }

        // Create review
        const [result] = await pool.query(
            'INSERT INTO reviews (product_id, reviewer_id, seller_id, rating, comment) VALUES (?, ?, ?, ?, ?)',
            [productId, req.user.id, sellerId, rating, comment]
        );

        // Update seller's rating
        await pool.query(`
            UPDATE users 
            SET rating = (
                SELECT AVG(rating) 
                FROM reviews 
                WHERE seller_id = ?
            ),
            rating_count = (
                SELECT COUNT(*) 
                FROM reviews 
                WHERE seller_id = ?
            )
            WHERE id = ?
        `, [sellerId, sellerId, sellerId]);

        // Get the created review with user details
        const [review] = await pool.query(`
            SELECT r.*, u.username as reviewer_name
            FROM reviews r
            JOIN users u ON r.reviewer_id = u.id
            WHERE r.id = ?
        `, [result.insertId]);

        res.status(201).json({
            status: 'success',
            data: {
                review: review[0]
            }
        });
    } catch (error) {
        console.error('Create review error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
});

/**
 * @route   GET /api/reviews/product/:productId
 * @desc    Get reviews for a product
 * @access  Public
 */
router.get('/product/:productId', async (req, res) => {
    try {
        const [reviews] = await pool.query(`
            SELECT r.*, u.username as reviewer_name, u.profile_image as reviewer_image
            FROM reviews r
            JOIN users u ON r.reviewer_id = u.id
            WHERE r.product_id = ?
            ORDER BY r.created_at DESC
        `, [req.params.productId]);

        res.json({
            status: 'success',
            data: {
                reviews
            }
        });
    } catch (error) {
        console.error('Get reviews error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
});

/**
 * @route   GET /api/reviews/seller/:sellerId
 * @desc    Get reviews for a seller
 * @access  Public
 */
router.get('/seller/:sellerId', async (req, res) => {
    try {
        const [reviews] = await pool.query(`
            SELECT r.*, u.username as reviewer_name, u.profile_image as reviewer_image,
                   p.title as product_title, p.image_url as product_image
            FROM reviews r
            JOIN users u ON r.reviewer_id = u.id
            JOIN products p ON r.product_id = p.id
            WHERE r.seller_id = ?
            ORDER BY r.created_at DESC
        `, [req.params.sellerId]);

        res.json({
            status: 'success',
            data: {
                reviews
            }
        });
    } catch (error) {
        console.error('Get seller reviews error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
});

module.exports = router;
