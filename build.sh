#!/bin/bash
echo "Installing dependencies..."
npm ci

echo "Installing Vite locally..."
npm install --save-dev vite

echo "Building project..."
node_modules/.bin/vite build

echo "Build completed!" 