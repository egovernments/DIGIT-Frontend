// SkipToMainContent.jsx
import { useEffect } from 'react';

export default function SkipToMainContent({class_name}) {
  useEffect(() => {
    const handleFirstTab = (e) => {
      if (e.key === 'Tab') {
        const main = document.querySelector(class_name);
        if (main) {
          main.setAttribute('tabindex', '-1'); // Ensure it's focusable
          main.style.outline = 'none';
          main.focus();
        }

        // Remove listener after first Tab
        window.removeEventListener('keydown', handleFirstTab);
      }
    };

    window.addEventListener('keydown', handleFirstTab);
    return () => window.removeEventListener('keydown', handleFirstTab);
  }, []);

  return null; // Nothing to render
}
