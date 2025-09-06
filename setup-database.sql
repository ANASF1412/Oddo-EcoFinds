-- EcoFinds Database Setup Script
-- Run this in MySQL Workbench or command line as root/admin user

-- Create database
CREATE DATABASE IF NOT EXISTS oddo;

-- Create development user (no password for easier project setup)
CREATE USER IF NOT EXISTS 'dev_user'@'localhost';
GRANT ALL PRIVILEGES ON oddo.* TO 'dev_user'@'localhost';
FLUSH PRIVILEGES;

-- Use the database
USE oddo;

-- Show success message
SELECT 'Database and user created successfully!' as Status;
SELECT 'You can now run: npm start' as NextStep;
