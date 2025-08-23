import React from 'react';
import { TextBlock, BreadCrumb } from '@egovernments/digit-ui-components';

const CustomHeader = ({ 
  heading, 
  subHeading, 
  breadcrumbs, 
  children,
  showTenant = true,
  styles,
  className,
  ...props 
}) => {
  const stateInfo = Digit.ULBService.getStateId();
  
  return (
    <div 
      className={`custom-header ${className || ''}`}
      style={{
        padding: '1.5rem 0 1rem 0',
        borderBottom: '1px solid #E5E5E5',
        marginBottom: '1.5rem',
        ...styles
      }}
      {...props}
    >
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <BreadCrumb
            crumbs={breadcrumbs.map(crumb => ({
              path: crumb.path,
              content: crumb.content || crumb.name,
              show: true
            }))}
          />
        </div>
      )}
      
      <div className="header-content">
        {heading && (
          <TextBlock
            variant="h1"
            subVariant="primary"
            customStyle={{
              margin: '0 0 0.5rem 0',
              fontSize: '2rem',
              fontWeight: '700',
              color: '#0B4B66',
              lineHeight: '1.2'
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
              margin: '0 0 1rem 0',
              fontSize: '1rem',
              color: '#505A5F',
              lineHeight: '1.4'
            }}
          >
            {subHeading}
          </TextBlock>
        )}
        
        {showTenant && stateInfo?.code && (
          <TextBlock
            variant="p"
            subVariant="secondary"
            customStyle={{
              margin: '0',
              fontSize: '0.875rem',
              color: '#757575',
              fontWeight: '500'
            }}
          >
            {stateInfo.name || stateInfo.code}
          </TextBlock>
        )}
        
        {children}
      </div>
    </div>
  );
};

export default CustomHeader;