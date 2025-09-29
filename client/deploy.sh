#!/bin/bash
# Deployment Script for GitHub Pages
# This script copies the latest changes from client folder to docs folder

echo "🚀 Starting deployment to docs folder..."

# Set source and destination directories
SOURCE_DIR="."
DOCS_DIR="./docs"

# Create docs directory if it doesn't exist
if [ ! -d "$DOCS_DIR" ]; then
    mkdir -p "$DOCS_DIR"
    echo "📁 Created docs directory"
fi

# Copy HTML files
echo "📄 Copying HTML files..."
cp *.html "$DOCS_DIR/" 2>/dev/null || echo "⚠️  No HTML files found"

# Copy root files
echo "📋 Copying configuration files..."
cp *.json "$DOCS_DIR/" 2>/dev/null || echo "⚠️  No JSON files found"
cp *.txt "$DOCS_DIR/" 2>/dev/null || echo "⚠️  No TXT files found"
cp *.xml "$DOCS_DIR/" 2>/dev/null || echo "⚠️  No XML files found"
cp sw.js "$DOCS_DIR/" 2>/dev/null || echo "⚠️  Service worker not found"
cp .htaccess "$DOCS_DIR/" 2>/dev/null || echo "⚠️  .htaccess not found"

# Copy directories
echo "📂 Copying directories..."
if [ -d "js" ]; then
    cp -r js "$DOCS_DIR/"
    echo "✅ Copied js directory"
else
    echo "⚠️  js directory not found"
fi

if [ -d "styles" ]; then
    cp -r styles "$DOCS_DIR/"
    echo "✅ Copied styles directory"
else
    echo "⚠️  styles directory not found"
fi

if [ -d "data" ]; then
    cp -r data "$DOCS_DIR/"
    echo "✅ Copied data directory"
else
    echo "⚠️  data directory not found"
fi

# Copy assets if they exist
if [ -d "assets" ]; then
    cp -r assets "$DOCS_DIR/"
    echo "✅ Copied assets directory"
fi

if [ -d "images" ]; then
    cp -r images "$DOCS_DIR/"
    echo "✅ Copied images directory"
fi

if [ -d "icons" ]; then
    cp -r icons "$DOCS_DIR/"
    echo "✅ Copied icons directory"
fi

echo ""
echo "🎉 Deployment complete!"
echo "📁 Files copied to: $DOCS_DIR"
echo ""
echo "Next steps:"
echo "1. Commit and push changes to GitHub"
echo "2. Enable GitHub Pages in repository settings"
echo "3. Select 'main branch /docs folder' as source"
echo "4. Your site will be available at: https://[username].github.io/[repository]/"
echo ""