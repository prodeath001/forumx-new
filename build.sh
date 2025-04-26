#!/bin/bash
echo "Installing dependencies..."
npm install

echo "Explicitly installing Vite and plugin..."
npm install vite@5.4.1 @vitejs/plugin-react-swc@3.5.0

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

echo "Building project..."
./node_modules/.bin/vite build

echo "Build completed!" 