import React from 'react';
import { LoaderSkeleton } from '@egovernments/digit-ui-components';

const CustomLoader = (props) => {
  const {
    className,
    style,
    page = false,
    ...rest
  } = props;

  if (page) {
    // Full page loader
    return (
      <div 
        className={`custom-loader-page ${className || ''}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          zIndex: 9999,
          ...style
        }}
      >
        <LoaderSkeleton {...rest} />
      </div>
    );
  }

  // Inline loader
  return (
    <div 
      className={`custom-loader ${className || ''}`}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        ...style
      }}
    >
      <LoaderSkeleton {...rest} />
    </div>
  );
};

export default CustomLoader;