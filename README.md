# EcoFinds - Professional Sustainable Marketplace

A modern, fully-functional marketplace for second-hand treasures that promotes sustainable living through conscious consumption.

## � Live Demo & Quick Start

**Try it now with demo credentials:**
- **Email**: `john@email.com` 
- **Password**: `password123`

## 🚀 Production-Ready Features

✅ **Professional UI/UX** - Modern, responsive design with smooth animations  
✅ **Complete Authentication** - Secure JWT-based login/registration system  
✅ **Rich Product Catalog** - 15+ sample products across all categories  
✅ **Advanced Search** - Real-time search with category filtering  
✅ **Mobile Responsive** - Perfect experience on all devices  
✅ **Database Ready** - Full MySQL schema with sample data  
✅ **Deployment Ready** - Configured for Heroku, Vercel, AWS  
✅ **Security** - Password hashing, input validation, CORS protection  

## 🛠️ Tech Stack

**Backend**: Node.js, Express.js, MySQL, JWT, bcryptjs  
**Frontend**: Vanilla JavaScript, Modern CSS, Font Awesome, Google Fonts  
**Database**: MySQL with connection pooling and auto-setup  
**Deployment**: Ready for Heroku, Vercel, Digital Ocean, AWS
- **Product Browsing** - Search and category filtering
- **Shopping Cart** - Add/remove items, checkout
- **Order Management** - Purchase history and tracking

### Advanced Features ✅
- **Review System** - User ratings and comments
- **Messaging** - User-to-user communication
- **Wishlist** - Save favorite items
- **Responsive Design** - Mobile and desktop optimized

## 🛠️ Setup

### Database Setup (One-time only)

1. **Using MySQL Workbench (Recommended):**
   - Connect to your MySQL server
   - Run this SQL script:
   ```sql
   CREATE DATABASE IF NOT EXISTS oddo;
   CREATE USER IF NOT EXISTS 'dev_user'@'localhost';
   GRANT ALL PRIVILEGES ON oddo.* TO 'dev_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

2. **Using Command Line:**
   ```bash
   mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS oddo; CREATE USER IF NOT EXISTS 'dev_user'@'localhost'; GRANT ALL PRIVILEGES ON oddo.* TO 'dev_user'@'localhost'; FLUSH PRIVILEGES;"
   ```

### Application Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Configuration:**
   - The `.env` file is already configured for development
   - Uses `dev_user` with no password for easy project sharing

3. **Start Application:**
   ```bash
   npm start
   ```

4. **Access Application:**
   - Frontend: http://localhost:3000
   - API Health Check: http://localhost:3000/api/health

## 🌟 Real-World Impact

This project demonstrates how technology can address sustainability challenges:

1. **Environmental Benefits**
   - Reduces manufacturing demand
   - Decreases landfill waste
   - Lowers carbon footprint

2. **Social Benefits**
   - Makes quality goods accessible
   - Builds community connections
   - Promotes conscious consumption

3. **Economic Benefits**
   - Creates local marketplace
   - Generates value from used goods
   - Supports circular economy

## 🏆 Technical Highlights

- **Secure Authentication** - JWT-based with bcrypt password hashing
- **RESTful API Design** - Well-structured endpoints with proper HTTP methods
- **Input Validation** - Server-side validation using express-validator
- **Database Design** - Normalized schema with proper relationships
- **Error Handling** - Comprehensive error management
- **Responsive UI** - Mobile-first design approach

## 📱 Pages Implemented

All required wireframe pages are implemented:
- Login/Registration
- Product Listing Feed
- Add New Product
- My Listings
- Product Detail View
- User Dashboard
- Shopping Cart
- Purchase History

## 🎯 Problem Statement Compliance

✅ **All requirements met:**
- User Authentication & Profile Creation
- Product Listing CRUD Operations
- Product Browsing & Category Filtering
- Keyword Search Functionality
- Shopping Cart Implementation
- Purchase History Tracking
- All Wireframe Pages Implemented
- Real-world Problem Solution
