#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function checkDistFiles() {
  const campaignDist = path.join(__dirname, 'packages/modules/campaign-manager/dist/main.js');
  const paymentsDist = path.join(__dirname, 'packages/modules/health-payments/dist/main.js');
  const cssDist = path.join(__dirname, 'packages/css/dist/index.css');

  return fs.existsSync(campaignDist) && fs.existsSync(paymentsDist) && fs.existsSync(cssDist);
}

async function buildPackages() {
  log('🔨 Building local packages...', colors.yellow);
  
  return new Promise((resolve, reject) => {
    const buildProcess = spawn('npm', ['run', 'build:packages'], {
      stdio: 'inherit',
      cwd: __dirname
    });
    
    buildProcess.on('close', (code) => {
      if (code === 0) {
        log('✅ Packages built successfully!', colors.green);
        resolve();
      } else {
        log('❌ Package build failed!', colors.red);
        reject(new Error('Package build failed'));
      }
    });
  });
}

async function startDevelopment() {
  log('🚀 Starting DIGIT Health Campaign Development Server...', colors.cyan);
  
  try {
    // Check if dist files exist, if not build them
    if (!checkDistFiles()) {
      await buildPackages();
    }
    
    log('🔄 Starting development servers...', colors.blue);
    
    // Start the concurrent processes
    const devProcess = spawn('npx', [
      'concurrently',
      '--names', 'CSS,Campaign,Payments,Webpack',
      '--prefix-colors', 'yellow,magenta,green,cyan',
      '"cd packages/css && npm run start"',
      '"cd packages/modules/campaign-manager && npm run build:dev -- --watch"',
      '"cd packages/modules/health-payments && npm run build:dev -- --watch"',
      '"webpack serve --config webpack.dev.js --port 3000"'
    ], {
      stdio: 'inherit',
      cwd: __dirname
    });
    
    devProcess.on('close', (code) => {
      log(`Development server stopped with code ${code}`, colors.yellow);
    });
    
    // Handle process termination
    process.on('SIGINT', () => {
      log('🛑 Stopping development servers...', colors.red);
      devProcess.kill('SIGINT');
      process.exit(0);
    });
    
  } catch (error) {
    log(`❌ Error: ${error.message}`, colors.red);
    process.exit(1);
  }
}

startDevelopment();