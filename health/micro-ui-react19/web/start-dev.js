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
  const required = [
    'packages/modules/campaign-manager/dist/main.js',
    'packages/css/dist/index.css',
    'packages/modules/pgr/dist/main.js',
    'packages/modules/health-hrms/dist/main.js',
    'packages/modules/health-payments/dist/main.js',
    'packages/modules/health-dss/dist/main.js',
  ];
  return required.every((p) => fs.existsSync(path.join(__dirname, p)));
}

const isWindows = process.platform === 'win32';

async function buildPackages() {
  log('🔨 Building local packages...', colors.yellow);

  return new Promise((resolve, reject) => {
    const buildProcess = spawn('npm', ['run', 'build:packages'], {
      stdio: 'inherit',
      cwd: __dirname,
      shell: isWindows
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

    // Build commands — use platform-appropriate path separators and shell syntax
    const sep = isWindows ? '\\' : '/';
    const cssDir = `packages${sep}css`;
    const campaignDir = `packages${sep}modules${sep}campaign-manager`;
    const hrmsDir = `packages${sep}modules${sep}health-hrms`;
    const pgrDir = `packages${sep}modules${sep}pgr`;
    const paymentsDir = `packages${sep}modules${sep}health-payments`;
    const dssDir = `packages${sep}modules${sep}health-dss`;

    const commands = [
      `"cd ${cssDir} && npm run start"`,
      `"cd ${campaignDir} && npm run build:dev -- --watch"`,
      `"cd ${hrmsDir} && npm run build:dev -- --watch"`,
      `"cd ${pgrDir} && npm run build:dev -- --watch"`,
      `"cd ${paymentsDir} && npm run build:dev -- --watch"`,
      `"cd ${dssDir} && npm run build:dev -- --watch"`,
      '"webpack serve --config webpack.dev.js --port 3000"'
    ];

    // Start the concurrent processes
    const devProcess = spawn('npx', [
      'concurrently',
      '--names', 'CSS,Campaign,HRMS,PGR,Payments,DSS,Webpack',
      '--prefix-colors', 'yellow,magenta,green,blue,red,white,cyan',
      ...commands
    ], {
      stdio: 'inherit',
      cwd: __dirname,
      shell: isWindows
    });

    devProcess.on('close', (code) => {
      log(`Development server stopped with code ${code}`, colors.yellow);
    });

    // Handle process termination
    const shutdownSignal = isWindows ? 'SIGTERM' : 'SIGINT';
    process.on('SIGINT', () => {
      log('🛑 Stopping development servers...', colors.red);
      devProcess.kill(shutdownSignal);
      process.exit(0);
    });

  } catch (error) {
    log(`❌ Error: ${error.message}`, colors.red);
    process.exit(1);
  }
}

startDevelopment();
