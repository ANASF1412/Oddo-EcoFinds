-- MySQL Password Reset Script
-- Run this as administrator

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS oddo;

-- Use the database
USE oddo;

-- Grant all privileges to root with password
ALTER USER 'root'@'localhost' IDENTIFIED BY 'root123';
FLUSH PRIVILEGES;

-- Show databases to confirm
SHOW DATABASES;
