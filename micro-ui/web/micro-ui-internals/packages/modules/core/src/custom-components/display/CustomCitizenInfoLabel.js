import React from 'react';
import { TextBlock } from '@egovernments/digit-ui-components';

const CustomCitizenInfoLabel = ({ 
  info, 
  text, 
  className, 
  style,
  textStyle,
  infoStyle,
  ...props 
}) => {
  return (
    <div 
      className={`citizen-info-label ${className || ''}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
        ...style
      }}
      {...props}
    >
      {info && (
        <TextBlock
          variant="p"
          subVariant="secondary"
          customStyle={{
            fontSize: '0.75rem',
            fontWeight: '500',
            color: '#505A5F',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            margin: '0',
            ...infoStyle
          }}
        >
          {info}
        </TextBlock>
      )}
      
      {text && (
        <TextBlock
          variant="p"
          subVariant="primary"
          customStyle={{
            fontSize: '0.875rem',
            fontWeight: '400',
            color: '#0B4B66',
            margin: '0',
            wordBreak: 'break-word',
            ...textStyle
          }}
        >
          {text}
        </TextBlock>
      )}
    </div>
  );
};

export default CustomCitizenInfoLabel;