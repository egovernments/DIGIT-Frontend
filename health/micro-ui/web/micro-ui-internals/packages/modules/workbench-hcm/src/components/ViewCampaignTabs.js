import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DeliveryComponent from './DeliveryComponent';
import UsersComponent from './UsersComponent';
import StockTransactionComponent from './StockTransactionComponent';

const ViewCampaignTabs = ({ 
  projectId, 
  boundaryType, 
  boundaryCode, 
  loading = false,
  defaultTab = 'delivery' 
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(defaultTab);

  const tabs = [
    {
      id: 'delivery',
      label: t('DELIVERY'),
      icon: '🚚',
      component: DeliveryComponent,
      description: 'View delivery records and distribution data'
    },
    {
      id: 'users',
      label: t('USERS'),
      icon: '👥',
      component: UsersComponent,
      description: 'View user accounts and staff information'
    },
    {
      id: 'stock',
      label: t('STOCK_TRANSACTIONS'),
      icon: '📦',
      component: StockTransactionComponent,
      description: 'View stock movements and inventory transactions'
    }
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: '#fff'
    }}>
      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        borderBottom: '2px solid #e5e7eb',
        backgroundColor: '#f8f9fa',
        padding: '0 20px'
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            style={{
              padding: '16px 24px',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: loading ? 'not-allowed' : 'pointer',
              borderBottom: activeTab === tab.id ? '3px solid #3b82f6' : '3px solid transparent',
              color: activeTab === tab.id ? '#3b82f6' : '#6b7280',
              fontWeight: activeTab === tab.id ? '600' : '400',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              opacity: loading ? 0.6 : 1,
              position: 'relative'
            }}
            disabled={loading}
            onMouseEnter={(e) => {
              if (!loading && activeTab !== tab.id) {
                e.target.style.color = '#374151';
                e.target.style.backgroundColor = '#f3f4f6';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading && activeTab !== tab.id) {
                e.target.style.color = '#6b7280';
                e.target.style.backgroundColor = 'transparent';
              }
            }}
          >
            <span style={{ fontSize: '16px' }}>{tab.icon}</span>
            <span>{tab.label}</span>
            {activeTab === tab.id && (
              <div style={{
                position: 'absolute',
                bottom: '-2px',
                left: 0,
                right: 0,
                height: '3px',
                backgroundColor: '#3b82f6',
                borderRadius: '2px 2px 0 0'
              }} />
            )}
          </button>
        ))}
      </div>

      {/* Tab Description */}
      <div style={{
        padding: '12px 20px',
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #e5e7eb',
        fontSize: '13px',
        color: '#6b7280',
        fontStyle: 'italic'
      }}>
        {tabs.find(tab => tab.id === activeTab)?.description}
      </div>

      {/* Campaign Info Header */}
      {(projectId || boundaryType || boundaryCode) && (
        <div style={{
          padding: '12px 20px',
          backgroundColor: '#eff6ff',
          borderBottom: '1px solid #bfdbfe',
          fontSize: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            {projectId && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontWeight: '500', color: '#1e40af' }}>Project:</span>
                <span style={{ 
                  color: '#1e40af',
                  backgroundColor: '#dbeafe',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {projectId}
                </span>
              </div>
            )}
            
            {boundaryType && boundaryCode && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontWeight: '500', color: '#1e40af' }}>Boundary:</span>
                <span style={{ 
                  color: '#1e40af',
                  backgroundColor: '#dbeafe',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {boundaryType}: {boundaryCode}
                </span>
              </div>
            )}

            {loading && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                color: '#059669'
              }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  border: '2px solid #d1fae5',
                  borderTop: '2px solid #059669',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                <span style={{ fontSize: '12px', fontStyle: 'italic' }}>
                  Loading campaign data...
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab Content */}
      <div style={{ 
        flex: 1, 
        overflow: 'hidden',
        position: 'relative'
      }}>
        {ActiveComponent ? (
          <ActiveComponent
            projectId={projectId}
            boundaryType={boundaryType}
            boundaryCode={boundaryCode}
            loading={loading}
          />
        ) : (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            color: '#6b7280',
            fontSize: '16px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
              <div>Select a tab to view campaign data</div>
            </div>
          </div>
        )}
      </div>

      {/* Add CSS for animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default ViewCampaignTabs;