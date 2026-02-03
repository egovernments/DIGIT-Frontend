module.exports = {
  parser: "postcss-scss",
  plugins: [
    require("postcss-import")({
      // Only process CSS imports, let Sass handle SCSS imports
      filter: (url) => {
        return url.endsWith('.css') && !url.includes('.scss');
      }
    }),
    require("postcss-nested"),
    require("tailwindcss"),
    require("postcss-preset-env")({
      stage: 2,
      autoprefixer: { cascade: false },
      features: { "custom-properties": true },
    }),
    require("autoprefixer"),
    require("cssnano")({
      preset: "default",
    }),
  ],
};