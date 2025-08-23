import React from 'react';
import { Card, Button, TextBlock } from '@egovernments/digit-ui-components';

const CustomFormStep = ({ 
  heading, 
  subHeading, 
  children, 
  onSelect, 
  onSkip, 
  config, 
  t, 
  isDisabled,
  forcedError,
  ...props 
}) => {
  return (
    <Card
      variant="primary"
      customStyle={{
        padding: '1.5rem',
        marginBottom: '1rem',
        border: forcedError ? '1px solid #D4351C' : '1px solid #B1B4B6',
      }}
      {...props}
    >
      {heading && (
        <TextBlock
          variant="h2"
          subVariant="primary"
          customStyle={{
            marginBottom: '0.5rem',
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#0B4B66'
          }}
        >
          {heading}
        </TextBlock>
      )}
      
      {subHeading && (
        <TextBlock
          variant="p"
          subVariant="secondary"
          customStyle={{
            marginBottom: '1rem',
            fontSize: '0.875rem',
            color: '#505A5F'
          }}
        >
          {subHeading}
        </TextBlock>
      )}
      
      <div className="form-step-content">
        {children}
      </div>
      
      <div className="form-step-actions" style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginTop: '1.5rem',
        justifyContent: 'flex-end'
      }}>
        {onSkip && (
          <Button
            variant="tertiary"
            size="medium"
            onButtonClick={onSkip}
            label={t ? t('CS_COMMON_SKIP') : 'Skip'}
          />
        )}
        {onSelect && (
          <Button
            variant="primary"
            size="medium"
            onButtonClick={onSelect}
            isDisabled={isDisabled}
            label={t ? t('CS_COMMON_NEXT') : 'Next'}
          />
        )}
      </div>
    </Card>
  );
};

export default CustomFormStep;