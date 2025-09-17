import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Common header component for Elasticsearch-powered data components
 * Handles loading states, errors, retry functionality, and summary cards
 */
const ElasticsearchDataHeader = ({
  // Loading and error states
  loading = false,
  error = null,
  onRetry = null,
  
  // Data and metadata
  data = [],
  metadata = {},
  progress = {},
  
  // Configuration
  title = '',
  errorMessage = 'Failed to load data',
  showProgress = true,
  showSummaryCards = true,
  
  // Custom summary cards data
  summaryCards = [],
  
  // Styling
  containerStyle = {},
  headerStyle = {},
  progressStyle = {},
  errorStyle = {},
  summaryCardsStyle = {}
}) => {
  const { t } = useTranslation();

  // Default progress styles
  const defaultProgressStyle = {
    marginTop: '12px',
    ...progressStyle
  };

  // Default error styles
  const defaultErrorStyle = {
    margin: '20px',
    padding: '16px',
    backgroundColor: '#fee',
    border: '1px solid #fcc',
    borderRadius: '4px',
    color: '#c00',
    ...errorStyle
  };

  // Default summary cards container style
  const defaultSummaryCardsStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
    margin: '16px 20px',
    ...summaryCardsStyle
  };

  // Default summary card style
  const summaryCardStyle = {
    backgroundColor: '#f8f9fa',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid #e9ecef',
    textAlign: 'center'
  };

  // Default retry button style
  const retryButtonStyle = {
    marginTop: '12px',
    padding: '8px 16px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  };

  return (
    <div style={{ width: '100%', ...containerStyle }}>
      {/* Header section */}
      {title && (
        <div style={{ 
          padding: '20px',
          borderBottom: '1px solid #e9ecef',
          ...headerStyle 
        }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>
            {t(title)}
          </h2>
          
          {/* Data count info */}
          {!loading && !error && data && data.length > 0 && (
            <div style={{ 
              marginTop: '8px',
              fontSize: '14px',
              color: '#6c757d'
            }}>
              {metadata.totalRecords ? (
                <span>
                  Showing {data.length.toLocaleString()} of {metadata.totalAvailable?.toLocaleString() || metadata.totalRecords.toLocaleString()} records
                </span>
              ) : (
                <span>
                  {data.length.toLocaleString()} records
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Progress indicator */}
      {loading && showProgress && (
        <div style={defaultProgressStyle}>
          <div style={{
            backgroundColor: '#f8f9fa',
            border: '1px solid #e9ecef',
            borderRadius: '4px',
            padding: '12px',
            margin: '0 20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid #007bff',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginRight: '8px'
              }}></div>
              <span style={{ fontWeight: '500' }}>Loading data...</span>
            </div>
            
            {progress.progress !== undefined && (
              <div>
                <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '4px' }}>
                  Progress: {Math.round(progress.progress)}%
                  {progress.batchesCompleted && progress.totalBatches && (
                    <span> ({progress.batchesCompleted}/{progress.totalBatches} batches)</span>
                  )}
                  {progress.recordsReceived && (
                    <span> • {progress.recordsReceived.toLocaleString()} records</span>
                  )}
                </div>
                <div style={{
                  width: '100%',
                  backgroundColor: '#e9ecef',
                  borderRadius: '2px',
                  height: '6px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${progress.progress}%`,
                    backgroundColor: '#007bff',
                    height: '100%',
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
              </div>
            )}
          </div>
          
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      )}

      {/* Error display */}
      {error && (
        <div style={defaultErrorStyle}>
          <div style={{ fontWeight: '600', marginBottom: '4px' }}>
            {t(errorMessage)}
          </div>
          <div style={{ fontSize: '14px' }}>
            {error}
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              style={retryButtonStyle}
              onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
            >
              {t('Retry')}
            </button>
          )}
        </div>
      )}

      {/* Summary cards */}
      {!loading && !error && showSummaryCards && summaryCards.length > 0 && (
        <div style={defaultSummaryCardsStyle}>
          {summaryCards.map((card, index) => (
            <div key={card.key || index} style={summaryCardStyle}>
              <div style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: card.valueColor || '#007bff',
                marginBottom: '4px'
              }}>
                {card.value}
              </div>
              <div style={{
                fontSize: '14px',
                color: '#6c757d',
                fontWeight: '500'
              }}>
                {t(card.label)}
              </div>
              {card.subtitle && (
                <div style={{
                  fontSize: '12px',
                  color: '#868e96',
                  marginTop: '4px'
                }}>
                  {card.subtitle}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ElasticsearchDataHeader;