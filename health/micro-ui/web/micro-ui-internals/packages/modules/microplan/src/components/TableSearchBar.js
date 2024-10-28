import React, { useState } from 'react';
import { useTranslation } from "react-i18next";

const TableSearchField = ({ onSearch}) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');

  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    onSearch(newQuery); // Trigger search only if input has more than 2 characters
  };

  return (
    <div style={styles.container}>
      <input
        type="text"
        placeholder={t("CS_INBOX_SEARCH")}
        value={query}
        onChange={handleInputChange}
        style={styles.input}
      />
      <div style={styles.iconContainer}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="#888"
        >
          <path d="M10 2a8 8 0 105.297 14.31l4.702 4.697a1 1 0 101.414-1.414l-4.698-4.702A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z" />
        </svg>
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    width: '100%',
    maxWidth: '400px',
  },
  input: {
    width: '100%',
    padding: '8px 40px 8px 12px', // Adds space on the right for the icon
    border: '1px solid #ccc',
    borderRadius: '4px',
    outline: 'none',
    fontSize: '16px',
    boxSizing: 'border-box',
  },
  iconContainer: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none', // Prevents the icon from blocking clicks on the input
  },
};

export default TableSearchField;
