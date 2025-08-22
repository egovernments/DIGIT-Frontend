import React, { useState, useEffect } from "react";
import { Loader } from "@egovernments/digit-ui-components";

/**
 * Enhanced loader with progressive loading states and user feedback
 */
const EnhancedLoader = ({ 
  page = false, 
  variant = "PageLoader", 
  componentName = "", 
  showProgress = false,
  timeout = 10000 // 10 seconds timeout
}) => {
  const [loadingStage, setLoadingStage] = useState(0);
  const [showTimeout, setShowTimeout] = useState(false);

  const loadingMessages = [
    "Loading components...",
    "Preparing interface...",
    "Almost ready...",
    "Finalizing setup..."
  ];

  useEffect(() => {
    if (!showProgress) return;

    const stages = [
      { delay: 0, stage: 0 },
      { delay: 1000, stage: 1 },
      { delay: 2500, stage: 2 },
      { delay: 4000, stage: 3 },
    ];

    const timers = stages.map(({ delay, stage }) =>
      setTimeout(() => setLoadingStage(stage), delay)
    );

    // Timeout handler
    const timeoutTimer = setTimeout(() => {
      setShowTimeout(true);
    }, timeout);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(timeoutTimer);
    };
  }, [showProgress, timeout]);

  const getLoadingMessage = () => {
    if (showTimeout) {
      return "Taking longer than expected... Please wait";
    }
    
    if (componentName) {
      return `Loading ${componentName}...`;
    }
    
    if (showProgress) {
      return loadingMessages[loadingStage] || loadingMessages[0];
    }
    
    return "Loading...";
  };

  const getProgressPercentage = () => {
    if (showTimeout) return 95;
    return Math.min((loadingStage + 1) * 25, 100);
  };

  if (page) {
    return (
      <div 
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '50vh',
          gap: '16px'
        }}
      >
        <Loader page={true} variant={variant} />
        
        {(showProgress || componentName) && (
          <div style={{
            textAlign: 'center',
            color: '#666',
            fontSize: '14px'
          }}>
            {getLoadingMessage()}
          </div>
        )}
        
        {showProgress && (
          <div style={{
            width: '200px',
            height: '4px',
            backgroundColor: '#f0f0f0',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div
              style={{
                width: `${getProgressPercentage()}%`,
                height: '100%',
                backgroundColor: '#007bff',
                transition: 'width 0.3s ease',
                borderRadius: '2px'
              }}
            />
          </div>
        )}
        
        {showTimeout && (
          <div style={{
            color: '#f56565',
            fontSize: '12px',
            textAlign: 'center',
            marginTop: '8px'
          }}>
            If this continues, please refresh the page
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <Loader variant={variant} />
      {componentName && (
        <span style={{
          marginLeft: '12px',
          color: '#666',
          fontSize: '14px'
        }}>
          Loading {componentName}...
        </span>
      )}
    </div>
  );
};

/**
 * Skeleton loader for specific component types
 */
export const SkeletonLoader = ({ type = "default", rows = 3 }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'table':
        return (
          <div>
            {/* Table Header */}
            <div style={{
              display: 'flex',
              gap: '16px',
              marginBottom: '16px'
            }}>
              {[1,2,3,4].map(i => (
                <div
                  key={i}
                  style={{
                    height: '16px',
                    backgroundColor: '#e2e8f0',
                    borderRadius: '4px',
                    flex: 1,
                    animation: 'pulse 2s infinite'
                  }}
                />
              ))}
            </div>
            {/* Table Rows */}
            {Array.from({ length: rows }).map((_, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  gap: '16px',
                  marginBottom: '12px'
                }}
              >
                {[1,2,3,4].map(i => (
                  <div
                    key={i}
                    style={{
                      height: '12px',
                      backgroundColor: '#f7fafc',
                      borderRadius: '4px',
                      flex: 1,
                      animation: `pulse 2s infinite ${i * 0.1}s`
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        );
      
      case 'form':
        return (
          <div style={{ maxWidth: '400px' }}>
            {Array.from({ length: rows }).map((_, index) => (
              <div key={index} style={{ marginBottom: '20px' }}>
                {/* Label */}
                <div style={{
                  height: '14px',
                  width: '30%',
                  backgroundColor: '#e2e8f0',
                  borderRadius: '4px',
                  marginBottom: '8px',
                  animation: 'pulse 2s infinite'
                }} />
                {/* Input */}
                <div style={{
                  height: '40px',
                  backgroundColor: '#f7fafc',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  animation: `pulse 2s infinite ${index * 0.1}s`
                }} />
              </div>
            ))}
          </div>
        );
      
      case 'card':
        return (
          <div style={{
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '16px'
          }}>
            {/* Title */}
            <div style={{
              height: '20px',
              width: '60%',
              backgroundColor: '#e2e8f0',
              borderRadius: '4px',
              marginBottom: '12px',
              animation: 'pulse 2s infinite'
            }} />
            {/* Content */}
            {Array.from({ length: rows }).map((_, index) => (
              <div
                key={index}
                style={{
                  height: '12px',
                  width: `${90 - index * 10}%`,
                  backgroundColor: '#f7fafc',
                  borderRadius: '4px',
                  marginBottom: '8px',
                  animation: `pulse 2s infinite ${index * 0.2}s`
                }}
              />
            ))}
          </div>
        );
      
      default:
        return (
          <div>
            {Array.from({ length: rows }).map((_, index) => (
              <div
                key={index}
                style={{
                  height: '16px',
                  width: `${100 - index * 5}%`,
                  backgroundColor: '#f7fafc',
                  borderRadius: '4px',
                  marginBottom: '12px',
                  animation: `pulse 2s infinite ${index * 0.1}s`
                }}
              />
            ))}
          </div>
        );
    }
  };

  return (
    <div>
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}
      </style>
      {renderSkeleton()}
    </div>
  );
};

/**
 * Component-specific loading states
 */
export const ComponentLoaders = {
  ExcelUpload: () => (
    <EnhancedLoader 
      page={true} 
      componentName="Excel Upload" 
      showProgress={true}
      timeout={15000}
    />
  ),
  
  DataTable: () => <SkeletonLoader type="table" rows={5} />,
  
  Form: () => <SkeletonLoader type="form" rows={4} />,
  
  CampaignCard: () => <SkeletonLoader type="card" rows={3} />,
  
  AppConfiguration: () => (
    <EnhancedLoader 
      page={true} 
      componentName="App Configuration" 
      showProgress={true}
      timeout={12000}
    />
  ),
  
  MapView: () => (
    <div style={{
      height: '400px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#6c757d'
    }}>
      <div style={{ textAlign: 'center' }}>
        <Loader />
        <div style={{ marginTop: '16px' }}>Loading Map...</div>
      </div>
    </div>
  ),
};

export default EnhancedLoader;