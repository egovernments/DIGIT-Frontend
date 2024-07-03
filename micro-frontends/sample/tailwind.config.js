/** @type {import('tailwindcss').Config} */
const themeSwapper = require('tailwindcss-theme-swapper')

export default {
  darkMode: 'class', // Enable dark mode based on a class

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    themeSwapper({
      themes: [
        {
          name: 'theme-light',
          extend: {
            colors: {
              primary: '#ff6363',
              secondary: '#1c1c1e',
            },
          },
        },
        {
          name: 'theme-dark',
          extend: {
            colors: {
              primary: '#0d7377',
              secondary: '#323232',
            },
          },
        },
      ],
    }),
    
      function({ addBase, theme }) {
        addBase({
          '.theme-light': {
            '--tw-color-primary': '#ff6363',
            '--tw-color-secondary': '#1c1c1e',
          },
          '.theme-dark': {
            '--tw-color-primary': '#0d7377',
            '--tw-color-secondary': '#323232',
          },
        });
      },
    
  ],
}