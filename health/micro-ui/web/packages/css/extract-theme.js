// extract-theme.js - Generate CSS variables from Tailwind config
const fs = require("fs");
const path = require("path");

function extractThemeValues() {
  // Clear require cache to get fresh config
  const configPath = path.resolve("./tailwind.config.js");
  delete require.cache[configPath];

  const tailwindConfig = require(configPath);

  let cssVars = "";

  function processObject(obj, currentPrefix = "") {
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        // Handle nested objects
        const newPrefix = currentPrefix ? `${currentPrefix}-${key}` : key;
        processObject(value, newPrefix);
      } else {
        // Handle primitive values
        const varName = currentPrefix ? `--${currentPrefix}-${key}` : `--${key}`;
        const varValue = Array.isArray(value) ? value.join(", ") : value;
        cssVars += `  ${varName}: ${varValue};\n`;
      }
    }
  }

  // Process digitv2 theme
  if (tailwindConfig.theme.digitv2) {
    processObject(tailwindConfig.theme.digitv2, "digitv2");
  }

  return cssVars;
}

// Generate the CSS content
const cssVars = extractThemeValues();
const timestamp = new Date().toISOString();

const cssContent = `/* Auto-generated from tailwind.config.js */
/* Generated: ${timestamp} */
/* DO NOT EDIT MANUALLY - Run 'npm run generate-theme' to update */

:root {
${cssVars}}

/* Usage Examples:
.your-component {
  gap: var(--digitv2-spacers-spacer3);
  padding: var(--digitv2-spacers-spacer4);
  color: var(--digitv2-lightTheme-text-primary);
  font-family: var(--digitv2-fontFamily-sans);
  font-size: var(--digitv2-fontSize-heading-s-mobile);
}
*/`;

// Ensure src directory exists
const srcDir = "./src";
if (!fs.existsSync(srcDir)) {
  fs.mkdirSync(srcDir, { recursive: true });
}

// Write to file
fs.writeFileSync("./src/theme-variables.css", cssContent);
console.log("✅ CSS variables generated in src/theme-variables.css");
console.log(`📊 Generated ${cssVars.split("\n").filter((line) => line.trim()).length} CSS variables`);

// Optional: List some generated variables for verification
const varLines = cssVars.split("\n").filter((line) => line.trim());
console.log("\n🔍 Sample generated variables:");
varLines.slice(0, 5).forEach((line) => console.log(`   ${line.trim()}`));
if (varLines.length > 5) {
  console.log(`   ... and ${varLines.length - 5} more`);
}
