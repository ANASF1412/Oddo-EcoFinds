const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const pool = require('../config/database');

// Validation middleware
const productValidation = [
  check('title').trim().isLength({ min: 3, max: 100 }).escape(),
  check('description').trim().isLength({ min: 10 }).escape(),
  check('price').isFloat({ min: 0 }),
  check('category').trim().notEmpty().escape()
];

/**
 * @route   GET /api/products
 * @desc    Get all products with optional filtering
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { search, category, limit = 10, page = 1 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = 'SELECT p.*, u.username FROM products p JOIN users u ON p.user_id = u.id WHERE p.status = "active"';
    const queryParams = [];

    if (search) {
      query += ' AND (p.title LIKE ? OR p.description LIKE ?)';
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    if (category) {
      query += ' AND p.category = ?';
      queryParams.push(category);
    }

    query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    queryParams.push(Number(limit), Number(offset));

    const [products] = await pool.query(query, queryParams);
    const [totalCount] = await pool.query('SELECT COUNT(*) as count FROM products WHERE status = "active"');

    res.json({
      status: 'success',
      data: {
        products,
        pagination: {
          total: totalCount[0].count,
          page: Number(page),
          limit: Number(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

/**
 * @route   GET /api/products/:id
 * @desc    Get single product by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const [products] = await pool.query(
      'SELECT p.*, u.username FROM products p JOIN users u ON p.user_id = u.id WHERE p.id = ?',
      [req.params.id]
    );

    if (products.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    res.json({
      status: 'success',
      data: {
        product: products[0]
      }
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

/**
 * @route   POST /api/products
 * @desc    Create a new product
 * @access  Private
 */
router.post('/', [authMiddleware, productValidation], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }

    const { title, description, price, category, image_url } = req.body;
    
    const [result] = await pool.query(
      'INSERT INTO products (title, description, price, category, image_url, user_id) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, price, category, image_url || null, req.user.id]
    );

    const [product] = await pool.query(
      'SELECT p.*, u.username FROM products p JOIN users u ON p.user_id = u.id WHERE p.id = ?',
      [result.insertId]
    );

    res.status(201).json({
      status: 'success',
      data: {
        product: product[0]
      }
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

/**
 * @route   PUT /api/products/:id
 * @desc    Update a product
 * @access  Private
 */
router.put('/:id', [authMiddleware, productValidation], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }

    // Check if product exists and belongs to user
    const [products] = await pool.query(
      'SELECT * FROM products WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (products.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found or unauthorized'
      });
    }

    const { title, description, price, category, image_url, status } = req.body;
    
    await pool.query(
      'UPDATE products SET title = ?, description = ?, price = ?, category = ?, image_url = ?, status = ? WHERE id = ?',
      [title, description, price, category, image_url || products[0].image_url, status || products[0].status, req.params.id]
    );

    const [updatedProduct] = await pool.query(
      'SELECT p.*, u.username FROM products p JOIN users u ON p.user_id = u.id WHERE p.id = ?',
      [req.params.id]
    );

    res.json({
      status: 'success',
      data: {
        product: updatedProduct[0]
      }
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete a product
 * @access  Private
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    // Check if product exists and belongs to user
    const [products] = await pool.query(
      'SELECT * FROM products WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (products.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found or unauthorized'
      });
    }

    await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);

    res.json({
      status: 'success',
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

/**
 * @route   GET /api/products/user/:userId
 * @desc    Get all products by user
 * @access  Public
 */
router.get('/user/:userId', async (req, res) => {
  try {
    const [products] = await pool.query(
      'SELECT p.*, u.username FROM products p JOIN users u ON p.user_id = u.id WHERE p.user_id = ? AND p.status = "active"',
      [req.params.userId]
    );

    res.json({
      status: 'success',
      data: {
        products
      }
    });
  } catch (error) {
    console.error('Get user products error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

module.exports = router;
