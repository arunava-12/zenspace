#!/bin/bash

# ZenSpace Structure Diagnostic Tool
# This script checks what files and directories exist in your current project

echo "=========================================="
echo "  ZenSpace Structure Diagnostic"
echo "=========================================="
echo ""

# Check current directory
echo "📍 Current Directory:"
pwd
echo ""

echo "📁 Directory Contents:"
echo "===================="
ls -la
echo ""

echo "📊 Structure Analysis:"
echo "===================="

# Check for frontend files
echo ""
echo "🎨 FRONTEND FILES:"
echo "------------------"

if [ -d "components" ]; then
    echo "✅ components/ exists"
    echo "   Files: $(ls components 2>/dev/null | wc -l)"
else
    echo "❌ components/ NOT FOUND"
fi

if [ -d "pages" ]; then
    echo "✅ pages/ exists"
    echo "   Files: $(ls pages 2>/dev/null | wc -l)"
else
    echo "❌ pages/ NOT FOUND"
fi

if [ -d "store" ]; then
    echo "✅ store/ exists"
    echo "   Files: $(ls store 2>/dev/null | wc -l)"
else
    echo "❌ store/ NOT FOUND"
fi

if [ -f "App.tsx" ]; then
    echo "✅ App.tsx exists"
else
    echo "❌ App.tsx NOT FOUND"
fi

if [ -f "index.tsx" ]; then
    echo "✅ index.tsx exists"
else
    echo "❌ index.tsx NOT FOUND"
fi

if [ -f "index.html" ]; then
    echo "✅ index.html exists"
else
    echo "❌ index.html NOT FOUND"
fi

# Check for backend files
echo ""
echo "⚙️  BACKEND FILES:"
echo "------------------"

if [ -d "server" ]; then
    echo "✅ server/ exists"
    echo "   Files: $(find server -type f 2>/dev/null | wc -l)"
    echo "   Structure:"
    tree server -L 2 2>/dev/null || ls -R server 2>/dev/null || echo "   (install 'tree' for better view)"
else
    echo "❌ server/ NOT FOUND"
fi

if [ -d "backend" ]; then
    echo "⚠️  backend/ already exists (partially migrated?)"
    echo "   Files: $(find backend -type f 2>/dev/null | wc -l)"
else
    echo "ℹ️  backend/ not created yet"
fi

# Check for config files
echo ""
echo "⚙️  CONFIG FILES:"
echo "------------------"

if [ -f "package.json" ]; then
    echo "✅ package.json exists"
else
    echo "❌ package.json NOT FOUND"
fi

if [ -f "tsconfig.json" ]; then
    echo "✅ tsconfig.json exists"
else
    echo "❌ tsconfig.json NOT FOUND"
fi

if [ -f "vite.config.ts" ]; then
    echo "✅ vite.config.ts exists"
else
    echo "❌ vite.config.ts NOT FOUND"
fi

if [ -f ".env.example" ]; then
    echo "✅ .env.example exists"
else
    echo "❌ .env.example NOT FOUND"
fi

# Check for existing migrations
echo ""
echo "🔄 MIGRATION STATUS:"
echo "------------------"

if [ -d "frontend" ]; then
    echo "⚠️  frontend/ already exists"
    if [ -d "frontend/src" ]; then
        echo "   frontend/src/ exists"
        echo "   Files: $(find frontend/src -type f 2>/dev/null | wc -l)"
    fi
else
    echo "ℹ️  frontend/ not created yet (good - ready to migrate)"
fi

if [ -d "backend" ]; then
    echo "⚠️  backend/ already exists"
    if [ -d "backend/src" ]; then
        echo "   backend/src/ exists"
        echo "   Files: $(find backend/src -type f 2>/dev/null | wc -l)"
    fi
else
    echo "ℹ️  backend/ not created yet (good - ready to migrate)"
fi

# Summary
echo ""
echo "=========================================="
echo "📋 SUMMARY & RECOMMENDATIONS"
echo "=========================================="
echo ""

HAS_FRONTEND=false
HAS_BACKEND=false

if [ -d "components" ] || [ -d "pages" ] || [ -f "App.tsx" ]; then
    HAS_FRONTEND=true
fi

if [ -d "server" ]; then
    HAS_BACKEND=true
fi

if [ "$HAS_FRONTEND" = true ] && [ "$HAS_BACKEND" = true ]; then
    echo "✅ This is a FULL-STACK project (Frontend + Backend)"
    echo ""
    echo "Recommended migration:"
    echo "1. Create frontend/ and backend/ directories"
    echo "2. Move components/, pages/, store/ → frontend/src/"
    echo "3. Move server/ → backend/src/"
    
elif [ "$HAS_FRONTEND" = true ] && [ "$HAS_BACKEND" = false ]; then
    echo "ℹ️  This is a FRONTEND-ONLY project"
    echo ""
    echo "Recommended migration:"
    echo "1. Create frontend/ directory"
    echo "2. Move all files to frontend/src/"
    echo "3. Skip backend creation (no server code found)"
    
elif [ "$HAS_FRONTEND" = false ] && [ "$HAS_BACKEND" = true ]; then
    echo "ℹ️  This is a BACKEND-ONLY project"
    echo ""
    echo "Recommended migration:"
    echo "1. Create backend/ directory"
    echo "2. Move server/ to backend/src/"
    
else
    echo "❌ No recognizable project structure found"
    echo ""
    echo "Please verify you're in the correct directory:"
    echo "Expected: ~/Desktop/arunava/zenspace/"
    echo "Current:  $(pwd)"
fi

echo ""
echo "=========================================="
