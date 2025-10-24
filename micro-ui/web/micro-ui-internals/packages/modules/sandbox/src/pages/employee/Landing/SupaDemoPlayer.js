import React from 'react';


const wrapperStyle = {
  position: 'relative',
  boxSizing: 'content-box',
  maxHeight: '80vh', 
  width: '100%',
  aspectRatio: '1.6',
  padding: '40px 0 40px 0',
};

const iframeStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
};

const SupaDemoPlayer = ({ src, title = "Embedded Demo" }) => {
  
  if (!src) {
    return null;
  }

  return (
    <div style={wrapperStyle}>
      <iframe
        src={src}
        style={iframeStyle}
        loading="lazy"
        title={title}
        allow="clipboard-write"
        frameBorder="0" 
        allowFullScreen   
      ></iframe>
    </div>
  );
};

export default SupaDemoPlayer;









