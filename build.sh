#!/bin/bash
set -euo pipefail
echo "Installing frontend dependencies (ignoring local .npmrc)..."
npm --userconfig=/dev/null install

echo "Installing Vite and plugin (ignoring local .npmrc)..."
npm --userconfig=/dev/null install vite@5.4.1 @vitejs/plugin-react-swc@3.5.0

echo "Creating minimal Vite config..."
cat > vite.config.js << 'EOF'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
EOF

echo "Building frontend (increasing memory limit)..."
export NODE_OPTIONS=--max_old_space_size=4096
echo "NODE_OPTIONS set to $NODE_OPTIONS"
node_modules/.bin/vite build

echo "Frontend build completed!"

echo "Building backend dependencies (ignoring local .npmrc)..."
cd backend
npm --userconfig=/dev/null install --legacy-peer-deps

echo "Building backend..."
npm run build
cd ..

echo "All builds completed!" 