#!/usr/bin/env node

const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

// Console colors
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

// Helper for colored logs
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

// --- Modules to watch ---
const modules = [
  "birth",
  "death",
  "firenoc",
  "property-tax",
  "tl",
  "ws",
  "hrms",
  "pgr",
  "receipts",
  "bills",
  "engagement",
  "finance",
];

// --- Check if dist folders exist for CSS + all modules ---
function checkDistFiles() {
  const cssDist = path.join(__dirname, "packages/css/dist/index.css");
  const missing = [];

  if (!fs.existsSync(cssDist)) missing.push("css");

  for (const mod of modules) {
    const distPath = path.join(__dirname, `packages/modules/${mod}/dist/main.js`);
    if (!fs.existsSync(distPath)) {
      missing.push(mod);
    }
  }

  if (missing.length > 0) {
    log(`⚠️  Missing dist files for: ${missing.join(", ")}`, colors.yellow);
    return false;
  }

  return true;
}

// --- Build all packages if dist missing ---
async function buildPackages() {
  log("🔨 Building local packages...", colors.yellow);

  return new Promise((resolve, reject) => {
    const buildProcess = spawn("npm", ["run", "build:packages"], {
      stdio: "inherit",
      cwd: __dirname,
    });

    buildProcess.on("close", (code) => {
      if (code === 0) {
        log("✅ Packages built successfully!", colors.green);
        resolve();
      } else {
        log("❌ Package build failed!", colors.red);
        reject(new Error("Package build failed"));
      }
    });
  });
}

// --- Start dev servers for CSS, modules, and Webpack ---
async function startDevelopment() {
  log("🚀 Starting DIGIT Multi-Module Development Server...", colors.cyan);

  try {
    // Check dist and build if needed
    if (!checkDistFiles()) {
      await buildPackages();
    }

    log("🔄 Starting module development servers...", colors.blue);

    // Construct concurrent commands dynamically
    const concurrentNames = ["CSS", ...modules.map((m) => m.toUpperCase()), "WEBPACK"];
    const prefixColors = ["yellow", ...Array(modules.length).fill("magenta"), "cyan"];

    const concurrentCommands = [
      `"cd packages/css && npm run start"`,
      ...modules.map(
        (m) => `"cd packages/modules/${m} && npm run build:dev -- --watch"`
      ),
      `"webpack serve --config webpack.dev.js --port 3000"`,
    ];

    // Run all in parallel
    const devProcess = spawn(
      "npx",
      [
        "concurrently",
        "--names",
        concurrentNames.join(","),
        "--prefix-colors",
        prefixColors.join(","),
        ...concurrentCommands,
      ],
      {
        stdio: "inherit",
        cwd: __dirname,
      }
    );

    devProcess.on("close", (code) => {
      log(`Development server stopped with code ${code}`, colors.yellow);
    });

    // Graceful shutdown
    process.on("SIGINT", () => {
      log("🛑 Stopping development servers...", colors.red);
      devProcess.kill("SIGINT");
      process.exit(0);
    });
  } catch (error) {
    log(`❌ Error: ${error.message}`, colors.red);
    process.exit(1);
  }
}

startDevelopment();
