// src/NavigateButton.js
import React from 'react';
import { navigateToUrl } from 'single-spa';

const NavigateButton = () => {
  const navigate = () => {
    navigateToUrl('/pwc/react-app-two');
  };

  return (
    <button onClick={navigate}>Go to App2</button>
  );
};

export default NavigateButton;
