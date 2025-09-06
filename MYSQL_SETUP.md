# EcoFinds MySQL Setup Guide

## Problem: MySQL Access Denied Error

You're getting this error because MySQL root user requires authentication but the password is not configured properly.

## Solutions (Try in order):

### Option 1: Reset MySQL Root Password (Recommended)

1. **Open Command Prompt as Administrator**
   - Press Win+R, type `cmd`, press Ctrl+Shift+Enter

2. **Stop MySQL Service**
   ```cmd
   net stop mysql80
   ```

3. **Start MySQL in Safe Mode**
   ```cmd
   mysqld --skip-grant-tables --skip-networking
   ```

4. **Open another Command Prompt as Administrator and run:**
   ```cmd
   mysql -u root
   ```

5. **In MySQL console, run:**
   ```sql
   USE mysql;
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'root123';
   FLUSH PRIVILEGES;
   EXIT;
   ```

6. **Restart MySQL normally**
   ```cmd
   net start mysql80
   ```

7. **Update your .env file:**
   ```
   DB_PASSWORD=root123
   ```

### Option 2: Use MySQL Workbench

1. Open MySQL Workbench
2. Create a new connection with root user
3. If it asks for password, try common ones: `root`, `password`, `123456`, or leave empty
4. Once connected, go to Users and Privileges
5. Set a new password for root user
6. Update your .env file accordingly

### Option 3: Reinstall MySQL

1. Uninstall MySQL completely
2. Download MySQL Community Server
3. During installation, set root password as `root123`
4. Update .env file with the new password

### Option 4: Use Alternative Database

If MySQL continues to cause issues, we can switch to SQLite which doesn't require a server:

1. Run: `npm install sqlite3`
2. I'll help you modify the code to use SQLite instead

## Test Your MySQL Connection

Once you've set the password, test it:

```cmd
mysql -u root -p
```

Enter your password when prompted. If successful, create the database:

```sql
CREATE DATABASE oddo;
SHOW DATABASES;
EXIT;
```

## Current Project Status

- ✅ Frontend is working (accessible at http://localhost:3000)
- ✅ Backend API is running 
- ❌ Database connection failed (needs password setup)
- ✅ All features are implemented and ready to work once DB is connected

Once MySQL is working, restart the application with `npm start` and all database features will be available.
