import React from 'react';
import ErrorBoundary from './ErrorBoundary'; // Make sure to import your ErrorBoundary component
import ReactQueryWrapper from '../providers/QueryProvider';

const DigitApp = ({ children, ...props }) => (
  <ErrorBoundary >
    <ReactQueryWrapper>
      {React.Children.map(children, child =>
        React.cloneElement(child, { ...props })
      )}
    </ReactQueryWrapper>
  </ErrorBoundary>
);

export default DigitApp;
