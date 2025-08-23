import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18n';
import './mocks/DigitReal';

// Add some global styles
const style = document.createElement('style');
style.textContent = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  #root {
    min-height: 100vh;
  }
  
  /* Custom styles for the language selection components */
  .language-selection-wrapper,
  .citizen-language-selection {
    min-height: 100vh;
    background-color: #f5f5f5;
  }
  
  .language-selection-card {
    max-width: 500px;
    margin: 0 auto;
    padding: 32px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .card-header {
    text-align: center;
    margin-bottom: 24px;
  }
  
  .state-logo {
    height: 64px;
    object-fit: contain;
    margin-bottom: 16px;
  }
  
  .state-name {
    font-size: 24px;
    font-weight: 600;
    color: #333;
  }
  
  .language-button {
    width: 100%;
    margin-bottom: 12px;
  }
  
  .footer-logo {
    height: 24px;
    cursor: pointer;
    opacity: 0.7;
    margin-top: 32px;
  }
  
  .footer-logo:hover {
    opacity: 1;
  }
`;
document.head.appendChild(style);

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);