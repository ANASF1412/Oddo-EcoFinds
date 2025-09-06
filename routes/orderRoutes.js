const express = require('express');
const router = express.Router();
const pool = require('../config/database');

/**
 * @route   POST /api/orders
 * @desc    Create a new order from cart items
 * @access  Private
 */
router.post('/', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Get cart items
    const [cartItems] = await connection.query(`
      SELECT ci.*, p.price, p.title, p.user_id as seller_id 
      FROM cart_items ci 
      JOIN products p ON ci.product_id = p.id 
      WHERE ci.user_id = ?
    `, [req.user.id]);

    if (cartItems.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Cart is empty'
      });
    }

    // Calculate total amount
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Create order
    const [orderResult] = await connection.query(
      'INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, "pending")',
      [req.user.id, totalAmount]
    );
    const orderId = orderResult.insertId;

    // Create order items
    for (const item of cartItems) {
      await connection.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, item.price]
      );

      // Update product status to 'sold'
      await connection.query(
        'UPDATE products SET status = "sold" WHERE id = ?',
        [item.product_id]
      );
    }

    // Clear user's cart
    await connection.query('DELETE FROM cart_items WHERE user_id = ?', [req.user.id]);

    await connection.commit();

    // Get complete order details
    const [orderDetails] = await connection.query(`
      SELECT o.*, 
             oi.product_id, 
             oi.quantity, 
             oi.price as item_price,
             p.title as product_title
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE o.id = ?
    `, [orderId]);

    res.status(201).json({
      status: 'success',
      data: {
        order: {
          id: orderId,
          total_amount: totalAmount,
          items: orderDetails
        }
      }
    });
  } catch (error) {
    await connection.rollback();
    console.error('Create order error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  } finally {
    connection.release();
  }
});

/**
 * @route   GET /api/orders
 * @desc    Get user's orders
 * @access  Private
 */
router.get('/', async (req, res) => {
  try {
    const [orders] = await pool.query(`
      SELECT o.*, 
             oi.product_id, 
             oi.quantity, 
             oi.price as item_price,
             p.title as product_title,
             p.image_url
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `, [req.user.id]);

    // Group order items by order ID
    const groupedOrders = orders.reduce((acc, order) => {
      const { id, total_amount, status, created_at } = order;
      if (!acc[id]) {
        acc[id] = {
          id,
          total_amount,
          status,
          created_at,
          items: []
        };
      }
      acc[id].items.push({
        product_id: order.product_id,
        title: order.product_title,
        quantity: order.quantity,
        price: order.item_price,
        image_url: order.image_url
      });
      return acc;
    }, {});

    res.json({
      status: 'success',
      data: {
        orders: Object.values(groupedOrders)
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

/**
 * @route   GET /api/orders/:id
 * @desc    Get order details
 * @access  Private
 */
router.get('/:id', async (req, res) => {
  try {
    const [orders] = await pool.query(`
      SELECT o.*, 
             oi.product_id, 
             oi.quantity, 
             oi.price as item_price,
             p.title as product_title,
             p.image_url
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE o.id = ? AND o.user_id = ?
    `, [req.params.id, req.user.id]);

    if (orders.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }

    // Group items under a single order object
    const orderDetails = {
      id: orders[0].id,
      total_amount: orders[0].total_amount,
      status: orders[0].status,
      created_at: orders[0].created_at,
      items: orders.map(order => ({
        product_id: order.product_id,
        title: order.product_title,
        quantity: order.quantity,
        price: order.item_price,
        image_url: order.image_url
      }))
    };

    res.json({
      status: 'success',
      data: {
        order: orderDetails
      }
    });
  } catch (error) {
    console.error('Get order details error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

module.exports = router;
