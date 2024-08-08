// src/NavigateButton.js
import React from 'react';
import { navigateToUrl } from 'single-spa';

const NavigateButton = ({link,name}) => {
  const navigate = () => {
    navigateToUrl(`${link}`);
  };

  return (
    <button onClick={navigate}>{name}</button>
  );
};

export default NavigateButton;
