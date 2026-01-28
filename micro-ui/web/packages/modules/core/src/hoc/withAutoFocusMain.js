import React, { useEffect } from 'react';

const withAutoFocusMain = (WrappedComponent, mainSelector = '.digit-home-main') => {
  return function WithAutoFocusWrapper(props) {
    useEffect(() => {
      const handleFirstTab = (e) => {
        if (e.key === 'Tab') {
          const main = document.querySelector(mainSelector);
          if (main) {
            main.setAttribute('tabindex', '-1');
            main.style.outline = 'none';
            main.focus();
          }
          window.removeEventListener('keydown', handleFirstTab);
        }
      };

      window.addEventListener('keydown', handleFirstTab);
      return () => window.removeEventListener('keydown', handleFirstTab);
    }, []);

    return <WrappedComponent {...props} />;
  };
};

export default withAutoFocusMain;