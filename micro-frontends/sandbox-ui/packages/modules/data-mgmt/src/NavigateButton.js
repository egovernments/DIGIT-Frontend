// src/NavigateButton.js
import React from 'react';
import { navigateToUrl } from 'single-spa';

const NavigateButton = ({to="two"}) => {
  const navigate = () => {
    navigateToUrl(`/pwc/react-app-${to}`);
  };

  return (
    <button onClick={navigate}>Go to App2</button>
  );
};

export default NavigateButton;
