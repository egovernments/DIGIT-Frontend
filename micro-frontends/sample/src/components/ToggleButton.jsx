// ToggleButton.js

import React from 'react';

const ToggleButton = ({ onClick,opened }) => {
  return (
    <>
    <button
      className={`fixed top-1/2 right-0 transform -translate-y-1/2 bg-indigo-500 text-white py-2 px-4 rounded-l-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 z-50 ${opened ? 'opacity-50' : 'opacity-100'}`}
      onClick={onClick}
    >
      {opened?"Click on any text":"Enable Admin Mode"}
    </button>
    <div className={`fixed bottom-5 right-5 bg-white border border-gray-300 p-4 rounded-md shadow-md transition-opacity ${opened? 'opacity-90' : 'opacity-0'}`}>
      <h1 className="text-xl font-semibold text-gray-900">Click anywhere on the screen</h1>
    </div>
    </>
  );
};

export default ToggleButton;
