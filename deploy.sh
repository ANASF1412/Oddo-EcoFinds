#!/bin/bash

# EcoFinds Deployment Script
echo "🚀 Starting EcoFinds deployment process..."

# Check if required tools are installed
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed. Aborting." >&2; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm is required but not installed. Aborting." >&2; exit 1; }

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env exists, if not create from example
if [ ! -f ".env" ]; then
    echo "⚙️  Creating .env file from example..."
    cp .env.example .env
    echo "⚠️  Please update .env file with your production values!"
fi

# Build/prepare static assets (if needed)
echo "🏗️  Preparing static assets..."

# Check database connection (optional)
echo "🗄️  Database should be configured separately"

# Run production server
echo "🎉 Deployment preparation complete!"
echo ""
echo "🌐 To start your EcoFinds marketplace:"
echo "   npm start"
echo ""
echo "📝 Don't forget to:"
echo "   1. Update .env with production database credentials"
echo "   2. Configure your domain in CORS settings"
echo "   3. Set up SSL certificate"
echo "   4. Configure database connection"
echo ""
echo "🔗 Access your marketplace at: http://localhost:3000"
