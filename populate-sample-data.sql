-- EcoFinds Sample Data Population Script
-- This script populates the database with realistic sample data

USE oddo;

-- Clear existing data (if any)
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM cart_items;
DELETE FROM reviews;
DELETE FROM messages;
DELETE FROM wishlist;
DELETE FROM product_views;
DELETE FROM products;
DELETE FROM users;

-- Insert Sample Users
INSERT INTO users (username, email, password, profile_image, bio, phone, rating, rating_count, created_at) VALUES
('john_eco', 'john@email.com', '$2a$10$K7L6qJ9mZ8N1xR3pY5vQ2eF4H7G8J9K0L1M2N3O4P5Q6R7S8T9U0V1', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', 'Passionate about sustainable living and finding great deals on quality items!', '+1-555-0101', 4.8, 25, '2024-01-15 10:30:00'),
('green_sarah', 'sarah@email.com', '$2a$10$K7L6qJ9mZ8N1xR3pY5vQ2eF4H7G8J9K0L1M2N3O4P5Q6R7S8T9U0V2', 'https://images.unsplash.com/photo-1494790108755-2616b612b0e2?w=150&h=150&fit=crop&crop=face', 'Love giving pre-loved items a second chance. Mother of two, environmental advocate.', '+1-555-0102', 4.9, 18, '2024-01-20 14:22:00'),
('mike_vintage', 'mike@email.com', '$2a$10$K7L6qJ9mZ8N1xR3pY5vQ2eF4H7G8J9K0L1M2N3O4P5Q6R7S8T9U0V3', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', 'Vintage collector and sustainability enthusiast. Always looking for unique finds!', '+1-555-0103', 4.7, 32, '2024-02-01 09:15:00'),
('eco_emma', 'emma@email.com', '$2a$10$K7L6qJ9mZ8N1xR3pY5vQ2eF4H7G8J9K0L1M2N3O4P5Q6R7S8T9U0V4', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', 'Zero waste lifestyle advocate. Selling items to declutter and help others save money.', '+1-555-0104', 5.0, 12, '2024-02-10 16:45:00'),
('tech_dave', 'dave@email.com', '$2a$10$K7L6qJ9mZ8N1xR3pY5vQ2eF4H7G8J9K0L1M2N3O4P5Q6R7S8T9U0V5', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', 'Tech professional upgrading devices regularly. All items tested and in great condition.', '+1-555-0105', 4.6, 28, '2024-02-15 11:30:00');

-- Insert Sample Products
INSERT INTO products (user_id, title, description, price, category, image_url, status, share_count, view_count, wishlist_count, created_at) VALUES
-- Electronics
(5, 'iPhone 13 - Excellent Condition', 'Barely used iPhone 13 in pristine condition. Includes original box, charger, and screen protector already applied. Battery health at 98%. Perfect for someone wanting a premium phone at a great price!', 599.99, 'electronics', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop', 'active', 15, 89, 23, '2024-03-01 10:00:00'),
(5, 'MacBook Air M1 - Like New', 'MacBook Air with M1 chip, 8GB RAM, 256GB SSD. Used for only 6 months. Comes with original charger and packaging. Perfect for students or professionals. No scratches or dents.', 899.99, 'electronics', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=400&h=300&fit=crop', 'active', 8, 156, 45, '2024-03-02 14:30:00'),
(1, 'Sony WH-1000XM4 Headphones', 'Premium noise-canceling headphones in excellent condition. Includes carrying case and all original accessories. Amazing sound quality and battery life. Selling due to upgrade.', 249.99, 'electronics', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop', 'active', 12, 67, 18, '2024-03-03 09:15:00'),

-- Furniture
(2, 'Vintage Wooden Coffee Table', 'Beautiful solid wood coffee table with character. Some minor wear that adds to its charm. Perfect centerpiece for any living room. Dimensions: 48"x24"x16". Must pick up.', 180.00, 'furniture', 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop', 'active', 5, 34, 12, '2024-03-04 16:20:00'),
(3, 'Mid-Century Modern Armchair', 'Authentic 1960s armchair in great condition. Recently reupholstered in high-quality fabric. A true statement piece for any home. Perfect for reading nook or living room accent.', 320.00, 'furniture', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop', 'active', 7, 45, 19, '2024-03-05 11:45:00'),
(4, 'IKEA Desk - White', 'Clean, minimalist desk perfect for home office or study. In excellent condition with minimal wear. Easy to assemble/disassemble for transport. Great for small spaces.', 75.00, 'furniture', 'https://images.unsplash.com/photo-1541558869434-2840d308329a?w=400&h=300&fit=crop', 'active', 3, 28, 8, '2024-03-06 13:10:00'),

-- Clothing
(2, 'Designer Winter Coat - Size M', 'Luxury wool coat from premium brand. Worn only a few times. Size Medium, fits true to size. Perfect for cold weather. Dry cleaned and ready to wear. Original price $400.', 150.00, 'clothing', 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=400&h=300&fit=crop', 'active', 6, 42, 15, '2024-03-07 15:30:00'),
(4, 'Vintage Leather Jacket - Size L', 'Classic leather jacket with amazing patina. Well-cared for vintage piece from the 80s. Size Large. Perfect for motorcycle riders or fashion enthusiasts. A timeless piece!', 180.00, 'clothing', 'https://images.unsplash.com/photo-1520975916090-3105956dac38?w=400&h=300&fit=crop', 'active', 9, 73, 22, '2024-03-08 08:45:00'),
(1, 'Running Shoes - Nike, Size 10', 'Nike running shoes in great condition. Size 10 mens. Minimal wear, mostly used for gym workouts. Clean and sanitized. Perfect for casual wear or light running.', 60.00, 'clothing', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop', 'active', 4, 31, 9, '2024-03-09 12:20:00'),

-- Books
(3, 'Programming Books Collection', 'Collection of 8 programming books including JavaScript, Python, and React. All in excellent condition. Perfect for someone learning to code or expanding their library. Selling as a set.', 120.00, 'books', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop', 'active', 2, 19, 6, '2024-03-10 14:15:00'),
(1, 'Classic Literature Set', 'Beautiful hardcover collection of classic novels including Pride & Prejudice, 1984, To Kill a Mockingbird, and more. 12 books total. Perfect condition, barely read.', 80.00, 'books', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop', 'active', 1, 15, 4, '2024-03-11 10:30:00'),

-- Other items
(5, 'Professional Camera Tripod', 'Heavy-duty tripod for DSLR cameras. Extends up to 6 feet. Perfect condition with carrying case. Great for photography enthusiasts or videographers. Barely used.', 90.00, 'other', 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop', 'active', 3, 25, 7, '2024-03-12 16:50:00'),
(2, 'Yoga Mat & Accessories Set', 'Premium yoga mat with blocks, strap, and carrying bag. Lightly used, excellent condition. Perfect for home practice or studio classes. Non-slip surface, eco-friendly material.', 45.00, 'other', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop', 'active', 2, 18, 5, '2024-03-13 09:25:00'),
(3, 'Kitchen Stand Mixer', 'KitchenAid stand mixer in working condition. Some cosmetic wear but functions perfectly. Includes dough hook, whisk, and paddle. Great for baking enthusiasts on a budget.', 200.00, 'other', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop', 'active', 8, 52, 16, '2024-03-14 13:40:00'),

-- Recently sold items
(1, 'Vintage Bicycle - SOLD', 'Beautiful restored vintage bicycle. Perfect for city commuting or leisure rides. New tires and tune-up included.', 280.00, 'other', 'https://images.unsplash.com/photo-1558618666-1f1d413c8f6a?w=400&h=300&fit=crop', 'sold', 11, 78, 0, '2024-02-20 11:15:00'),
(4, 'Guitar - Acoustic - SOLD', 'Yamaha acoustic guitar in excellent condition. Perfect for beginners or experienced players. Includes case and picks.', 220.00, 'other', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop', 'sold', 6, 95, 0, '2024-02-25 15:30:00');

-- Insert Sample Reviews
INSERT INTO reviews (product_id, reviewer_id, seller_id, rating, comment, created_at) VALUES
(1, 2, 5, 5, 'Amazing phone in perfect condition! Exactly as described. Fast shipping and great communication from seller.', '2024-03-15 10:30:00'),
(1, 3, 5, 5, 'Excellent deal for an iPhone 13. Dave was very responsive and the phone is like new. Highly recommend!', '2024-03-16 14:20:00'),
(2, 1, 5, 5, 'MacBook works perfectly! Great price for the condition. Professional seller, would buy from again.', '2024-03-17 09:15:00'),
(4, 5, 2, 4, 'Beautiful coffee table with lots of character. Minor scratches as mentioned but adds to the charm.', '2024-03-18 16:45:00'),
(5, 1, 3, 5, 'Gorgeous armchair! Fits perfectly in my living room. Mike was great to work with.', '2024-03-19 11:30:00'),
(7, 3, 2, 5, 'Perfect coat for winter! Exactly as described and fits great. Sarah was very helpful.', '2024-03-20 13:25:00'),
(8, 4, 4, 4, 'Love this vintage jacket! Has some wear but thats expected and looks great.', '2024-03-21 15:10:00'),
(14, 2, 1, 5, 'Great guitar for the price! John was very accommodating with pickup time.', '2024-03-01 12:45:00');

-- Insert Sample Messages
INSERT INTO messages (sender_id, receiver_id, product_id, message, read_at, created_at) VALUES
(2, 5, 1, 'Hi! Is the iPhone 13 still available? Im very interested.', '2024-03-14 10:35:00', '2024-03-14 10:30:00'),
(5, 2, 1, 'Yes, its still available! Would you like to arrange a meetup?', '2024-03-14 10:40:00', '2024-03-14 10:38:00'),
(2, 5, 1, 'Perfect! I can meet this weekend. What time works for you?', '2024-03-14 10:45:00', '2024-03-14 10:42:00'),
(1, 3, 5, 'Is the armchair still available? I love mid-century modern pieces!', '2024-03-16 14:20:00', '2024-03-16 14:15:00'),
(3, 1, 5, 'Yes it is! Its a beautiful piece. Would you like to see more photos?', NULL, '2024-03-16 14:25:00'),
(4, 2, 7, 'Does the winter coat run true to size? Im usually between M and L.', '2024-03-18 09:30:00', '2024-03-18 09:25:00'),
(2, 4, 7, 'It fits true to size. Im a medium and it fits perfectly with room for layers.', NULL, '2024-03-18 09:35:00');

-- Insert Sample Wishlist items
INSERT INTO wishlist (user_id, product_id, created_at) VALUES
(1, 2, '2024-03-15 10:00:00'),
(1, 5, '2024-03-15 10:05:00'),
(1, 8, '2024-03-15 10:10:00'),
(2, 3, '2024-03-16 14:00:00'),
(2, 6, '2024-03-16 14:05:00'),
(3, 1, '2024-03-17 09:00:00'),
(3, 11, '2024-03-17 09:05:00'),
(4, 5, '2024-03-18 16:00:00'),
(4, 12, '2024-03-18 16:05:00'),
(5, 4, '2024-03-19 11:00:00');

-- Insert Sample Product Views
INSERT INTO product_views (user_id, product_id, view_count, last_viewed_at) VALUES
(1, 2, 3, '2024-03-15 10:30:00'),
(1, 5, 2, '2024-03-15 11:00:00'),
(2, 1, 5, '2024-03-16 14:30:00'),
(2, 3, 2, '2024-03-16 15:00:00'),
(3, 4, 1, '2024-03-17 09:30:00'),
(3, 8, 4, '2024-03-17 10:00:00'),
(4, 7, 3, '2024-03-18 16:30:00'),
(5, 6, 2, '2024-03-19 11:30:00');

-- Insert Sample Cart items
INSERT INTO cart_items (user_id, product_id, quantity, created_at) VALUES
(1, 3, 1, '2024-03-20 10:00:00'),
(1, 12, 1, '2024-03-20 10:05:00'),
(2, 6, 1, '2024-03-20 11:00:00'),
(3, 9, 1, '2024-03-20 14:00:00'),
(3, 11, 1, '2024-03-20 14:05:00'),
(4, 10, 1, '2024-03-20 16:00:00');

-- Insert Sample Orders
INSERT INTO orders (user_id, total_amount, status, created_at) VALUES
(2, 599.99, 'completed', '2024-03-15 11:00:00'),
(1, 320.00, 'completed', '2024-03-17 10:00:00'),
(4, 150.00, 'completed', '2024-03-19 17:00:00'),
(3, 280.00, 'completed', '2024-02-28 14:00:00'),
(2, 220.00, 'completed', '2024-03-02 16:00:00');

-- Insert Sample Order Items
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(1, 1, 1, 599.99),
(2, 5, 1, 320.00),
(3, 7, 1, 150.00),
(4, 13, 1, 280.00),
(5, 14, 1, 220.00);

-- Show summary of inserted data
SELECT 'Sample data inserted successfully!' AS Status;
SELECT 'Users' AS Table_Name, COUNT(*) AS Count FROM users
UNION ALL
SELECT 'Products', COUNT(*) FROM products
UNION ALL
SELECT 'Reviews', COUNT(*) FROM reviews
UNION ALL
SELECT 'Messages', COUNT(*) FROM messages
UNION ALL
SELECT 'Wishlist', COUNT(*) FROM wishlist
UNION ALL
SELECT 'Cart Items', COUNT(*) FROM cart_items
UNION ALL
SELECT 'Orders', COUNT(*) FROM orders
UNION ALL
SELECT 'Order Items', COUNT(*) FROM order_items;
