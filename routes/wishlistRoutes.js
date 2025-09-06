const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const pool = require('../config/database');

/**
 * @route   POST /api/wishlist/:productId
 * @desc    Add/remove product from wishlist
 * @access  Private
 */
router.post('/:productId', authMiddleware, async (req, res) => {
    try {
        const productId = req.params.productId;

        // Check if product exists
        const [products] = await pool.query(
            'SELECT * FROM products WHERE id = ?',
            [productId]
        );

        if (products.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Product not found'
            });
        }

        // Check if product is already in wishlist
        const [existing] = await pool.query(
            'SELECT * FROM wishlist WHERE user_id = ? AND product_id = ?',
            [req.user.id, productId]
        );

        if (existing.length > 0) {
            // Remove from wishlist
            await pool.query(
                'DELETE FROM wishlist WHERE user_id = ? AND product_id = ?',
                [req.user.id, productId]
            );

            // Decrease wishlist count
            await pool.query(
                'UPDATE products SET wishlist_count = wishlist_count - 1 WHERE id = ?',
                [productId]
            );

            res.json({
                status: 'success',
                message: 'Product removed from wishlist',
                data: {
                    inWishlist: false
                }
            });
        } else {
            // Add to wishlist
            await pool.query(
                'INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)',
                [req.user.id, productId]
            );

            // Increase wishlist count
            await pool.query(
                'UPDATE products SET wishlist_count = wishlist_count + 1 WHERE id = ?',
                [productId]
            );

            res.json({
                status: 'success',
                message: 'Product added to wishlist',
                data: {
                    inWishlist: true
                }
            });
        }
    } catch (error) {
        console.error('Wishlist toggle error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
});

/**
 * @route   GET /api/wishlist
 * @desc    Get user's wishlist
 * @access  Private
 */
router.get('/', authMiddleware, async (req, res) => {
    try {
        const [wishlist] = await pool.query(`
            SELECT w.*, p.*, u.username as seller_name
            FROM wishlist w
            JOIN products p ON w.product_id = p.id
            JOIN users u ON p.user_id = u.id
            WHERE w.user_id = ?
            ORDER BY w.created_at DESC
        `, [req.user.id]);

        res.json({
            status: 'success',
            data: {
                wishlist
            }
        });
    } catch (error) {
        console.error('Get wishlist error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
});

/**
 * @route   DELETE /api/wishlist
 * @desc    Clear user's wishlist
 * @access  Private
 */
router.delete('/', authMiddleware, async (req, res) => {
    try {
        // Get products in user's wishlist
        const [products] = await pool.query(
            'SELECT product_id FROM wishlist WHERE user_id = ?',
            [req.user.id]
        );

        // Update wishlist count for each product
        for (const product of products) {
            await pool.query(
                'UPDATE products SET wishlist_count = wishlist_count - 1 WHERE id = ?',
                [product.product_id]
            );
        }

        // Clear wishlist
        await pool.query('DELETE FROM wishlist WHERE user_id = ?', [req.user.id]);

        res.json({
            status: 'success',
            message: 'Wishlist cleared'
        });
    } catch (error) {
        console.error('Clear wishlist error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
});

module.exports = router;
