const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const pool = require('../config/database');

// Validation middleware
const cartItemValidation = [
  check('product_id').isInt({ min: 1 }),
  check('quantity').isInt({ min: 1 })
];

/**
 * @route   GET /api/cart
 * @desc    Get user's cart items
 * @access  Private
 */
router.get('/', async (req, res) => {
  try {
    const [cartItems] = await pool.query(`
      SELECT ci.*, p.title, p.price, p.image_url, p.status 
      FROM cart_items ci 
      JOIN products p ON ci.product_id = p.id 
      WHERE ci.user_id = ?
    `, [req.user.id]);

    // Calculate total
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.json({
      status: 'success',
      data: {
        items: cartItems,
        total: Number(total.toFixed(2))
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

/**
 * @route   POST /api/cart
 * @desc    Add item to cart
 * @access  Private
 */
router.post('/', cartItemValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }

    const { product_id, quantity } = req.body;

    // Check if product exists and is active
    const [products] = await pool.query(
      'SELECT * FROM products WHERE id = ? AND status = "active"',
      [product_id]
    );

    if (products.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found or unavailable'
      });
    }

    // Check if item already in cart
    const [existingItems] = await pool.query(
      'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?',
      [req.user.id, product_id]
    );

    if (existingItems.length > 0) {
      // Update quantity if item exists
      await pool.query(
        'UPDATE cart_items SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
        [quantity, req.user.id, product_id]
      );
    } else {
      // Add new item to cart
      await pool.query(
        'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [req.user.id, product_id, quantity]
      );
    }

    // Get updated cart
    const [cartItems] = await pool.query(`
      SELECT ci.*, p.title, p.price, p.image_url 
      FROM cart_items ci 
      JOIN products p ON ci.product_id = p.id 
      WHERE ci.user_id = ?
    `, [req.user.id]);

    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.status(201).json({
      status: 'success',
      data: {
        items: cartItems,
        total: Number(total.toFixed(2))
      }
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

/**
 * @route   PUT /api/cart/:id
 * @desc    Update cart item quantity
 * @access  Private
 */
router.put('/:id', [check('quantity').isInt({ min: 1 })], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }

    const { quantity } = req.body;

    // Update cart item
    await pool.query(
      'UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?',
      [quantity, req.params.id, req.user.id]
    );

    // Get updated cart
    const [cartItems] = await pool.query(`
      SELECT ci.*, p.title, p.price, p.image_url 
      FROM cart_items ci 
      JOIN products p ON ci.product_id = p.id 
      WHERE ci.user_id = ?
    `, [req.user.id]);

    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.json({
      status: 'success',
      data: {
        items: cartItems,
        total: Number(total.toFixed(2))
      }
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

/**
 * @route   DELETE /api/cart/:id
 * @desc    Remove item from cart
 * @access  Private
 */
router.delete('/:id', async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM cart_items WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    // Get updated cart
    const [cartItems] = await pool.query(`
      SELECT ci.*, p.title, p.price, p.image_url 
      FROM cart_items ci 
      JOIN products p ON ci.product_id = p.id 
      WHERE ci.user_id = ?
    `, [req.user.id]);

    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.json({
      status: 'success',
      data: {
        items: cartItems,
        total: Number(total.toFixed(2))
      }
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

/**
 * @route   DELETE /api/cart
 * @desc    Clear user's cart
 * @access  Private
 */
router.delete('/', async (req, res) => {
  try {
    await pool.query('DELETE FROM cart_items WHERE user_id = ?', [req.user.id]);

    res.json({
      status: 'success',
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

module.exports = router;
