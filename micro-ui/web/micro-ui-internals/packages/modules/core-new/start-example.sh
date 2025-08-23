#!/bin/bash

echo "🚀 Starting Core New Module Example App..."
echo ""
echo "📦 Building the core module first..."
yarn build

echo ""
echo "🔧 Installing example app dependencies..."
cd example
yarn install

echo ""
echo "🌐 Starting the example app..."
echo "📍 The app will open at http://localhost:3011"
echo ""
yarn start