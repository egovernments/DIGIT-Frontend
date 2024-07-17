import React from 'react';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', lang: 'English' },
  { code: 'fr', lang: 'French' },
  { code: 'hi', lang: 'Hindi' },
];

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const changeLang = (lng) => {
    i18n.changeLanguage(lng);
    // localStorage.setItem("i18nextLng", lng);
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '10px',
      }}
    >
      {languages.map((row, idx) => {
        return (
          <button
            style={{
              borderRadius: '8px',
              border: '1px solid black',
              padding: '0.6em 1.2em',
              fontSize: '1em',
              fontWeight: '500',
              fontFamily: 'inherit',
              backgroundColor: 'white',
              cursor: 'pointer',
              transition: 'border-color 0.25s',
            }}
            key={row.code}
            onClick={() => changeLang(row.code)}
          >
            {row.lang}
          </button>
        );
      })}
    </div>
  );
};

export default LanguageSelector;
