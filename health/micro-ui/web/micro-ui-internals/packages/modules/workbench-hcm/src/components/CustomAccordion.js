import React, { useState } from "react";

const CustomAccordion = ({ title, content, isOpen: initialOpen = false, className = "" }) => {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`custom-accordion ${className}`} style={{
      border: '1px solid #e0e0e0',
      borderRadius: '4px',
      marginBottom: '8px',
      backgroundColor: '#fff',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <div
        className="accordion-header"
        onClick={toggleAccordion}
        style={{
          padding: '12px 16px',
          backgroundColor: isOpen ? '#f5f5f5' : '#fff',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: isOpen ? '1px solid #e0e0e0' : 'none',
          transition: 'all 0.3s ease'
        }}
      >
        <span style={{
          fontWeight: '500',
          fontSize: '16px',
          color: '#333'
        }}>
          {title}
        </span>
        <span style={{
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s ease',
          fontSize: '14px',
          color: '#666'
        }}>
          ▼
        </span>
      </div>
      
      {isOpen && (
        <div
          className="accordion-content"
          style={{
            padding: '16px',
            backgroundColor: '#fff',
            animation: 'fadeIn 0.3s ease-in-out'
          }}
        >
          {content}
        </div>
      )}
      
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

const CustomAccordionList = ({ children, className = "" }) => {
  return (
    <div className={`custom-accordion-list ${className}`} style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    }}>
      {children}
    </div>
  );
};

export { CustomAccordion, CustomAccordionList };