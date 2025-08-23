import React from 'react';
import { CardContainer } from '@egovernments/digit-ui-components';

const CustomCard = (props) => {
  const {
    children,
    className,
    style,
    header,
    subHeader,
    ...rest
  } = props;

  return (
    <CardContainer
      className={`custom-card ${className || ''}`}
      style={{
        padding: '1rem',
        margin: '0.5rem 0',
        borderRadius: '0.375rem',
        border: '1px solid #e5e5e5',
        backgroundColor: '#ffffff',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        ...style
      }}
      {...rest}
    >
      {header && (
        <div className="card-header" style={{ marginBottom: '1rem', fontWeight: '600' }}>
          {header}
        </div>
      )}
      {subHeader && (
        <div className="card-subheader" style={{ marginBottom: '1rem', color: '#666' }}>
          {subHeader}
        </div>
      )}
      {children}
    </CardContainer>
  );
};

export default CustomCard;