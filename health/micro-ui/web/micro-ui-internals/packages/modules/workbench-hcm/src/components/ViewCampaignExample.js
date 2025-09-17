import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ViewCampaignTabs from './ViewCampaignTabs';

const ViewCampaignExample = () => {
  const { t } = useTranslation();
  
  // Example state for campaign parameters
  const [campaignConfig, setCampaignConfig] = useState({
    projectId: 'PROJ-2024-001',
    boundaryType: 'WARD',
    boundaryCode: 'WARD_001',
    loading: false
  });

  // Predefined example configurations
  const exampleConfigs = [
    {
      name: 'Full Campaign View',
      config: {
        projectId: 'PROJ-2024-001',
        boundaryType: 'WARD',
        boundaryCode: 'WARD_001',
        loading: false
      }
    },
    {
      name: 'LGA Level View',
      config: {
        projectId: 'PROJ-2024-002',
        boundaryType: 'LGA',
        boundaryCode: 'LGA_LAGOS_ISLAND',
        loading: false
      }
    },
    {
      name: 'Settlement Level View',
      config: {
        projectId: 'PROJ-2024-003',
        boundaryType: 'SETTLEMENT',
        boundaryCode: 'SETTLEMENT_VICTORIA_ISLAND',
        loading: false
      }
    },
    {
      name: 'Project Only (No Boundary)',
      config: {
        projectId: 'PROJ-2024-004',
        boundaryType: '',
        boundaryCode: '',
        loading: false
      }
    }
  ];

  const handleConfigChange = (field, value) => {
    setCampaignConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const applyExampleConfig = (config) => {
    setCampaignConfig(config);
  };

  const simulateLoading = () => {
    setCampaignConfig(prev => ({ ...prev, loading: true }));
    setTimeout(() => {
      setCampaignConfig(prev => ({ ...prev, loading: false }));
    }, 3000); // Simulate 3 second loading
  };

  return (
    <div style={{ 
      width: '100%', 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: '#f5f5f5'
    }}>
      {/* Configuration Panel */}
      <div style={{
        padding: '20px',
        backgroundColor: '#fff',
        borderBottom: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: '0 0 16px 0', color: '#374151' }}>
          📊 View Campaign - Example Usage
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '16px',
          marginBottom: '16px'
        }}>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '4px', 
              fontWeight: '500',
              color: '#374151',
              fontSize: '14px'
            }}>
              Project ID:
            </label>
            <input
              type="text"
              value={campaignConfig.projectId}
              onChange={(e) => handleConfigChange('projectId', e.target.value)}
              placeholder="Enter project ID"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
          
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '4px', 
              fontWeight: '500',
              color: '#374151',
              fontSize: '14px'
            }}>
              Boundary Type:
            </label>
            <select
              value={campaignConfig.boundaryType}
              onChange={(e) => handleConfigChange('boundaryType', e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="">No Boundary Filter</option>
              <option value="WARD">Ward</option>
              <option value="LGA">LGA</option>
              <option value="SETTLEMENT">Settlement</option>
            </select>
          </div>
          
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '4px', 
              fontWeight: '500',
              color: '#374151',
              fontSize: '14px'
            }}>
              Boundary Code:
            </label>
            <input
              type="text"
              value={campaignConfig.boundaryCode}
              onChange={(e) => handleConfigChange('boundaryCode', e.target.value)}
              placeholder="Enter boundary code"
              disabled={!campaignConfig.boundaryType}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                backgroundColor: !campaignConfig.boundaryType ? '#f9fafb' : 'white',
                cursor: !campaignConfig.boundaryType ? 'not-allowed' : 'text'
              }}
            />
          </div>
        </div>

        {/* Example Configurations */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '500',
            color: '#374151',
            fontSize: '14px'
          }}>
            Quick Examples:
          </label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {exampleConfigs.map((example, index) => (
              <button
                key={index}
                onClick={() => applyExampleConfig(example.config)}
                style={{
                  padding: '6px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  backgroundColor: '#fff',
                  color: '#374151',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f3f4f6';
                  e.target.style.borderColor = '#9ca3af';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#fff';
                  e.target.style.borderColor = '#d1d5db';
                }}
              >
                {example.name}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={simulateLoading}
            disabled={campaignConfig.loading}
            style={{
              padding: '8px 16px',
              backgroundColor: campaignConfig.loading ? '#9ca3af' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: campaignConfig.loading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            {campaignConfig.loading ? '🔄 Loading...' : '🔄 Simulate Loading'}
          </button>
          
          <div style={{
            padding: '8px 12px',
            backgroundColor: '#f0f9ff',
            border: '1px solid #0ea5e9',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#0369a1'
          }}>
            💡 The tabs below will fetch data based on these parameters
          </div>
        </div>
      </div>

      {/* Campaign Tabs */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <ViewCampaignTabs
          projectId={campaignConfig.projectId}
          boundaryType={campaignConfig.boundaryType}
          boundaryCode={campaignConfig.boundaryCode}
          loading={campaignConfig.loading}
          defaultTab="delivery"
        />
      </div>

      {/* Info Panel */}
      <div style={{
        padding: '12px 20px',
        backgroundColor: '#fffbeb',
        borderTop: '1px solid #fed7aa',
        fontSize: '12px',
        color: '#92400e'
      }}>
        <strong>📝 Usage Notes:</strong> Each tab uses the new useSimpleElasticsearch hook to fetch data from different indices. 
        The components automatically handle queries based on projectId, boundaryType, and boundaryCode parameters. 
        Real-time progress tracking is built-in for large datasets.
      </div>
    </div>
  );
};

export default ViewCampaignExample;