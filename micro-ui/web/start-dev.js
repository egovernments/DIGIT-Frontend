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
  const serviceDesignerDist = path.join(__dirname, 'packages/modules/ServiceDesigner/dist/main.js');
  const openPaymentDist = path.join(__dirname, 'packages/modules/open-payment/dist/main.js');
  const publicServicesDist = path.join(__dirname, 'packages/modules/PublicServices/dist/main.js');
  // const cssDist = path.join(__dirname, 'packages/css/dist/index.css');

  return fs.existsSync(serviceDesignerDist) && fs.existsSync(openPaymentDist) && fs.existsSync(publicServicesDist); // && fs.existsSync(cssDist);
}

async function buildPackages() {
  log('🔨 Building local packages...', colors.yellow);

  return new Promise((resolve, reject) => {
    const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";

    const buildProcess = spawn(npmCmd, ['run', 'build2'], {
      stdio: 'inherit',
      cwd: __dirname,
      shell: true
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
  log('🚀 Starting DIGIT Studio Development Server...', colors.cyan);

  try {
    // Check if dist files exist, if not build them
    if (!checkDistFiles()) {
      await buildPackages();
    }

    log('🔄 Starting development servers...', colors.blue);

    // Start the concurrent processes
    const devProcess = spawn(
      process.platform === "win32" ? "npx.cmd" : "npx",
      [
        "concurrently",
        "--names",
        "css,uiComponents,core,ServiceDesigner,PublicServices,OpenPayment,Webpack",
        "--prefix-colors",
        "purple,green,pink,yellow,magenta,blue,cyan",
        '"cd packages/css && npm run build:dev -- --watch"',
        '"cd packages/ui-components && npm run build:dev -- --watch"',
        '"cd packages/modules/core && npm run build:dev -- --watch"',
        '"cd packages/modules/ServiceDesigner && npm run build:dev -- --watch"',
        '"cd packages/modules/PublicServices && npm run build:dev -- --watch"',
        '"cd packages/modules/open-payment && npm run build:dev -- --watch"',
        '"webpack serve --config webpack.dev.js --port 3000"'
      ],
      {
        stdio: "inherit",
        cwd: __dirname,
        shell: true
      }
    );


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