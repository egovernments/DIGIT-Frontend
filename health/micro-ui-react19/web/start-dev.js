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

function spawnShellCommand(command, options = {}) {
  if (process.platform === 'win32') {
    return spawn('cmd.exe', ['/d', '/s', '/c', command], options);
  }
  return spawn('sh', ['-lc', command], options);
}

function checkDistFiles() {
  const campaignDist = path.join(__dirname, 'packages/modules/campaign-manager/dist/main.js');
  const cssDist = path.join(__dirname, 'packages/css/dist/index.css');
  
  return fs.existsSync(campaignDist) && fs.existsSync(cssDist);
}

async function buildPackages() {
  log('🔨 Building local packages...', colors.yellow);
  
  return new Promise((resolve, reject) => {
    const buildProcess = spawnShellCommand('npm run build:packages', {
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

    const childProcesses = [
      spawnShellCommand('npm --prefix packages/css run start', {
        stdio: 'inherit',
        cwd: __dirname
      }),
      spawnShellCommand('npm --prefix packages/modules/campaign-manager run build:dev -- --watch', {
        stdio: 'inherit',
        cwd: __dirname
      }),
      spawnShellCommand('npm run start:webpack-only', {
        stdio: 'inherit',
        cwd: __dirname
      })
    ];

    let shuttingDown = false;
    const stopAll = (signal = 'SIGTERM') => {
      if (shuttingDown) return;
      shuttingDown = true;
      childProcesses.forEach((proc) => {
        if (proc && !proc.killed) {
          proc.kill(signal);
        }
      });
    };

    childProcesses.forEach((proc) => {
      proc.on('close', (code) => {
        if (!shuttingDown && code !== 0) {
          log(`Development server stopped with code ${code}`, colors.yellow);
          stopAll('SIGTERM');
          process.exit(code || 1);
        }
      });
    });
    
    // Handle process termination
    process.on('SIGINT', () => {
      log('🛑 Stopping development servers...', colors.red);
      stopAll('SIGINT');
      process.exit(0);
    });
    
  } catch (error) {
    log(`❌ Error: ${error.message}`, colors.red);
    process.exit(1);
  }
}

startDevelopment();