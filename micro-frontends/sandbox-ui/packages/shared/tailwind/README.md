# Setup Guide for SCSS and Tailwind CSS

### 1. Install Required Packages

To set up SCSS and Tailwind CSS, first, install the necessary packages:

```bash
npm install --save-dev sass sass-loader postcss-loader tailwindcss autoprefixer
```

### 2. Configure Tailwind CSS

Create Tailwind Configuration

In the root of your project, create a tailwind.config.js file and configure it to import the shared Tailwind CSS configuration:

```bash
const sharedTailwindConfig = require('./path/to/shared/tailwind.config.js');

module.exports = sharedTailwindConfig;
```

Create PostCSS Configuration

Create a postcss.config.js file in your project root with the following content:

```bash
module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ],
};
```

### 3. Create CSS Folder

In your src directory, create a css folder to hold your global styles.

#### 4. Update Webpack Configuration

Update your webpack.config.js to include loaders for both CSS and SCSS files, and ensure that Tailwind CSS is applied correctly:

```bash
module: {
  rules: [
    {
      test: /\.scss$/i,
      include: path.resolve(__dirname, 'css'),
      exclude: /node_modules/,
      use: [
        'style-loader',
        'css-loader',
        'sass-loader',
        'postcss-loader'
      ],
    },
  ],
}
```

### 5. Import index.scss in your app.js
