module.exports = {
    content: [
        './src/**/*.{js,jsx,ts,tsx}',
        './public/index.html',
    ],
    theme: {
        extend: {
            colors: {
                'custom-color': '#ff7f7f', // Custom pink color
                'custom-blue': '#1e3a8a',  // Custom blue color
            },
        },
    },
    plugins: [],
};
