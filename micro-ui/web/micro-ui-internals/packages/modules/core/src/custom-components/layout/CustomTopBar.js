import React, { useState } from 'react';
import { Button, TextBlock, Hamburger } from '@egovernments/digit-ui-components';
import { useTranslation } from 'react-i18next';

const CustomTopBar = ({ 
  isMobile = false,
  toggleSidebar,
  userDetails,
  onLogout,
  children,
  className,
  style,
  ...props 
}) => {
  const { t } = useTranslation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  return (
    <div 
      className={`custom-topbar ${className || ''}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 1.5rem',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E5E5E5',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        zIndex: 1000,
        ...style
      }}
      {...props}
    >
      <div className="topbar-left" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {isMobile && toggleSidebar && (
          <Hamburger 
            onToggle={toggleSidebar}
            customStyle={{
              padding: '0.5rem',
              cursor: 'pointer'
            }}
          />
        )}
        
        <div className="logo-section">
          <TextBlock
            variant="h2"
            subVariant="primary"
            customStyle={{
              margin: '0',
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#0B4B66'
            }}
          >
            DIGIT
          </TextBlock>
        </div>
      </div>
      
      <div className="topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {children}
        
        {userDetails && (
          <div 
            className="user-menu"
            style={{ position: 'relative' }}
            onMouseEnter={() => setShowUserMenu(true)}
            onMouseLeave={() => setShowUserMenu(false)}
          >
            <Button
              variant="tertiary"
              size="small"
              label={userDetails.name || userDetails.userName || 'User'}
              customStyle={{
                padding: '0.5rem 1rem',
                fontSize: '0.875rem'
              }}
            />
            
            {showUserMenu && onLogout && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: '0',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E5E5',
                  borderRadius: '0.25rem',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  minWidth: '150px',
                  zIndex: 1001
                }}
              >
                <Button
                  variant="tertiary"
                  size="small"
                  label={t('CORE_COMMON_LOGOUT')}
                  onButtonClick={onLogout}
                  customStyle={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.75rem 1rem',
                    borderRadius: '0',
                    fontSize: '0.875rem'
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomTopBar;