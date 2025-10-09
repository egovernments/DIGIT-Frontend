import React from "react";

// Fallback components in case the DIGIT UI components are not available
export const Card = ({ children, className, style }) => (
  <div className={`card ${className || ''}`} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '16px', backgroundColor: 'white', ...style }}>
    {children}
  </div>
);

export const Header = ({ children, className, style }) => (
  <h1 className={`header ${className || ''}`} style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 16px 0', ...style }}>
    {children}
  </h1>
);

export const Button = ({ children, onClick, variation, type, style, className }) => (
  <button
    type={type || 'button'}
    onClick={onClick}
    className={`btn btn-${variation || 'primary'} ${className || ''}`}
    style={{
      padding: '12px 24px',
      border: 'none',
      borderRadius: '4px',
      backgroundColor: variation === 'primary' ? '#0B4B66' : '#6c757d',
      color: 'white',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      ...style
    }}
  >
    {children}
  </button>
);

export const TextInput = ({ value, onChange, placeholder, id, style, className }) => (
  <input
    id={id}
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`form-input ${className || ''}`}
    style={{
      width: '100%',
      padding: '12px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      fontSize: '14px',
      ...style
    }}
  />
);

export const CardText = ({ children, style }) => (
  <div className="card-text" style={style}>
    {children}
  </div>
);

export const SubmitBar = ({ children, style }) => (
  <div className="submit-bar" style={{ padding: '16px', borderTop: '1px solid #eee', backgroundColor: '#f8f9fa', ...style }}>
    {children}
  </div>
);