#!/bin/bash

# ZenSpace Adaptive Migration Script
# This script detects your current structure and migrates accordingly

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

echo "=========================================="
echo "  ZenSpace Adaptive Migration"
echo "=========================================="
echo ""

# Check current directory
print_status "Current directory: $(pwd)"
echo ""

# Detect what exists
HAS_COMPONENTS=false
HAS_PAGES=false
HAS_STORE=false
HAS_APP_TSX=false
HAS_SERVER=false

[ -d "components" ] && HAS_COMPONENTS=true
[ -d "pages" ] && HAS_PAGES=true
[ -d "store" ] && HAS_STORE=true
[ -f "App.tsx" ] && HAS_APP_TSX=true
[ -d "server" ] && HAS_SERVER=true

# Determine project type
echo "🔍 Detecting project structure..."
echo ""

if [ "$HAS_COMPONENTS" = true ] || [ "$HAS_PAGES" = true ] || [ "$HAS_APP_TSX" = true ]; then
    print_success "Frontend code detected"
    PROJECT_HAS_FRONTEND=true
else
    print_warning "No frontend code found"
    PROJECT_HAS_FRONTEND=false
fi

if [ "$HAS_SERVER" = true ]; then
    print_success "Backend code detected (server/ directory)"
    PROJECT_HAS_BACKEND=true
else
    print_warning "No backend code found (server/ directory missing)"
    PROJECT_HAS_BACKEND=false
fi

echo ""

# Determine migration strategy
if [ "$PROJECT_HAS_FRONTEND" = false ] && [ "$PROJECT_HAS_BACKEND" = false ]; then
    print_error "No recognizable project structure found!"
    print_error "Expected to find: components/, pages/, App.tsx, or server/"
    echo ""
    print_status "Current directory contents:"
    ls -la
    echo ""
    exit 1
fi

# Confirm with user
echo "=========================================="
echo "Migration Plan:"
echo "=========================================="

if [ "$PROJECT_HAS_FRONTEND" = true ] && [ "$PROJECT_HAS_BACKEND" = true ]; then
    echo "Type: Full-Stack (Frontend + Backend)"
    echo ""
    echo "Will create:"
    echo "  ✓ frontend/src/ - for React components and pages"
    echo "  ✓ backend/src/  - for server code"
elif [ "$PROJECT_HAS_FRONTEND" = true ]; then
    echo "Type: Frontend Only"
    echo ""
    echo "Will create:"
    echo "  ✓ frontend/src/ - for React components and pages"
    echo "  ✗ backend/      - skipped (no server code found)"
elif [ "$PROJECT_HAS_BACKEND" = true ]; then
    echo "Type: Backend Only"
    echo ""
    echo "Will create:"
    echo "  ✓ backend/src/  - for server code"
    echo "  ✗ frontend/     - skipped (no frontend code found)"
fi

echo ""
read -p "Proceed with migration? (y/n): " confirm
if [ "$confirm" != "y" ]; then
    print_warning "Migration cancelled"
    exit 0
fi

echo ""
print_status "Starting migration..."

# ===========================================
# FRONTEND MIGRATION
# ===========================================

if [ "$PROJECT_HAS_FRONTEND" = true ]; then
    echo ""
    print_status "Migrating frontend files..."
    
    # Create frontend structure
    mkdir -p frontend/public
    mkdir -p frontend/src/components
    mkdir -p frontend/src/pages
    mkdir -p frontend/src/store
    mkdir -p frontend/src/types
    mkdir -p frontend/src/constants
    mkdir -p frontend/src/utils
    
    # Move directories
    [ -d "components" ] && cp -r components/* frontend/src/components/ && print_success "Moved components/"
    [ -d "pages" ] && cp -r pages/* frontend/src/pages/ && print_success "Moved pages/"
    [ -d "store" ] && cp -r store/* frontend/src/store/ && print_success "Moved store/"
    
    # Move root files
    [ -f "App.tsx" ] && cp App.tsx frontend/src/ && print_success "Moved App.tsx"
    [ -f "index.tsx" ] && cp index.tsx frontend/src/ && print_success "Moved index.tsx"
    [ -f "types.ts" ] && cp types.ts frontend/src/types/index.ts && print_success "Moved types.ts"
    [ -f "vite-env.d.ts" ] && cp vite-env.d.ts frontend/src/ && print_success "Moved vite-env.d.ts"
    [ -f "constants.tsx" ] && cp constants.tsx frontend/src/constants/index.tsx && print_success "Moved constants.tsx"
    
    # Move HTML
    [ -f "index.html" ] && cp index.html frontend/public/ && print_success "Moved index.html"
    
    # Move config files
    [ -f "vite.config.ts" ] && cp vite.config.ts frontend/ && print_success "Moved vite.config.ts"
    [ -f "tsconfig.json" ] && cp tsconfig.json frontend/ && print_success "Moved tsconfig.json"
    [ -f "package.json" ] && cp package.json frontend/ && print_success "Moved package.json"
    [ -f "package-lock.json" ] && cp package-lock.json frontend/ && print_success "Moved package-lock.json"
    [ -f ".env.example" ] && cp .env.example frontend/ && print_success "Moved .env.example"
    [ -f ".env" ] && cp .env frontend/ && print_warning ".env copied (update if needed)"
    
    # Update vite.config.ts with path aliases
    cat > frontend/vite.config.ts << 'EOF'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@store': path.resolve(__dirname, './src/store'),
      '@types': path.resolve(__dirname, './src/types'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
EOF
    
    print_success "Frontend migration complete!"
fi

# ===========================================
# BACKEND MIGRATION
# ===========================================

if [ "$PROJECT_HAS_BACKEND" = true ]; then
    echo ""
    print_status "Migrating backend files..."
    
    # Create backend structure
    mkdir -p backend/src/controllers
    mkdir -p backend/src/routes
    mkdir -p backend/src/models
    mkdir -p backend/src/middleware
    mkdir -p backend/src/services
    mkdir -p backend/src/config
    mkdir -p backend/src/types
    mkdir -p backend/src/utils
    
    # Move server files
    if [ -d "server" ]; then
        cp -r server/* backend/src/
        print_success "Moved server/ contents"
    fi
    
    # Copy necessary config
    [ -f "tsconfig.json" ] && cp tsconfig.json backend/ && print_success "Copied tsconfig.json to backend"
    [ -f ".env.example" ] && cp .env.example backend/ && print_success "Copied .env.example to backend"
    
    # Create backend package.json
    cat > backend/package.json << 'EOF'
{
  "name": "zenspace-backend",
  "version": "1.0.0",
  "description": "ZenSpace Backend API",
  "main": "dist/index.js",
  "scripts": {
    "dev": "nodemon --exec ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "express": "^4.18.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.0",
    "@types/cors": "^2.8.0",
    "@types/node": "^20.0.0",
    "ts-node": "^10.9.0",
    "nodemon": "^3.0.0",
    "typescript": "^5.0.0"
  }
}
EOF
    
    # Create basic backend entry point if doesn't exist
    if [ ! -f "backend/src/index.ts" ]; then
        cat > backend/src/index.ts << 'EOF'
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'ZenSpace Backend API' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
EOF
        print_success "Created backend entry point"
    fi
    
    print_success "Backend migration complete!"
fi

# ===========================================
# CREATE ROOT PACKAGE.JSON
# ===========================================

if [ "$PROJECT_HAS_FRONTEND" = true ] && [ "$PROJECT_HAS_BACKEND" = true ]; then
    print_status "Creating root package.json for monorepo..."
    
    cat > package.json << 'EOF'
{
  "name": "zenspace",
  "version": "2.0.0",
  "description": "ZenSpace - Restructured",
  "private": true,
  "scripts": {
    "dev": "concurrently \"npm run dev:frontend\" \"npm run dev:backend\"",
    "dev:frontend": "cd frontend && npm run dev",
    "dev:backend": "cd backend && npm run dev",
    "build": "npm run build:frontend && npm run build:backend",
    "build:frontend": "cd frontend && npm run build",
    "build:backend": "cd backend && npm run build",
    "install:all": "cd frontend && npm install && cd ../backend && npm install"
  },
  "devDependencies": {
    "concurrently": "^8.0.0"
  }
}
EOF
    
    print_success "Root package.json created"
fi

# ===========================================
# SUMMARY
# ===========================================

echo ""
echo "=========================================="
print_success "Migration Complete!"
echo "=========================================="
echo ""

if [ "$PROJECT_HAS_FRONTEND" = true ]; then
    echo "📁 Frontend:"
    echo "   Location: ./frontend/"
    echo "   Next steps:"
    echo "     cd frontend"
    echo "     npm install"
    echo "     npm run dev"
    echo ""
fi

if [ "$PROJECT_HAS_BACKEND" = true ]; then
    echo "📁 Backend:"
    echo "   Location: ./backend/"
    echo "   Next steps:"
    echo "     cd backend"
    echo "     npm install"
    echo "     npm run dev"
    echo ""
fi

print_warning "IMPORTANT: Old files are still in place!"
echo ""
echo "After verifying everything works:"
echo ""
echo "You can remove old structure with:"
if [ "$PROJECT_HAS_FRONTEND" = true ]; then
    echo "  rm -rf components/ pages/ store/"
    echo "  rm App.tsx index.tsx types.ts vite-env.d.ts"
    echo "  rm index.html vite.config.ts"
fi
if [ "$PROJECT_HAS_BACKEND" = true ]; then
    echo "  rm -rf server/"
fi
echo ""

print_success "All done! 🎉"
echo ""
