import React, { useState } from 'react';
import DeliveryComponent from './DeliveryComponent';
import UsersComponent from './UsersComponent';
import StockTransactionComponent from './StockTransactionComponent';

/**
 * Demo component showcasing different boundary filter HOC variants
 * applied to different components with different use cases
 */
const BoundaryFilterVariantsDemo = () => {
  const [selectedComponent, setSelectedComponent] = useState('delivery');

  const variants = {
    delivery: {
      title: '🚚 Delivery Component',
      subtitle: 'FullFeaturedFiltered Variant',
      component: DeliveryComponent,
      description: 'Complete filtering experience with all features enabled',
      features: [
        '✅ All filter controls visible',
        '✅ Statistics bar with real-time updates',
        '✅ Clear all filters button',
        '✅ Filter persistence in localStorage',
        '✅ Professional blue theme styling',
        '✅ Excel download with filtered data',
        '✅ Auto-discovery of boundary fields',
        '✅ Dynamic table columns'
      ],
      configuration: {
        showFilters: true,
        showStats: true,
        showClearAll: true,
        persistFilters: true,
        filterPosition: 'top',
        storageKey: 'deliveryComponentFilters'
      }
    },
    users: {
      title: '👥 Users Component', 
      subtitle: 'MinimalFiltered Variant',
      component: UsersComponent,
      description: 'Clean and simple filtering without visual clutter',
      features: [
        '✅ Filter controls visible',
        '❌ Statistics bar hidden for clean look',
        '❌ Clear all button hidden',
        '❌ No filter persistence',
        '✅ Clean white border styling',
        '✅ Limited boundary columns (first 3)',
        '✅ Auto-discovery of boundary fields',
        '✅ Dynamic table columns'
      ],
      configuration: {
        showFilters: true,
        showStats: false,
        showClearAll: false,
        persistFilters: false,
        filterPosition: 'top'
      }
    },
    stock: {
      title: '📦 Stock Transaction Component',
      subtitle: 'RequiredFiltered Variant', 
      component: StockTransactionComponent,
      description: 'Requires specific filter selection for meaningful data analysis',
      features: [
        '✅ All filter controls visible',
        '✅ Statistics bar with custom styling',
        '✅ Clear all filters button',
        '✅ Filter persistence enabled',
        '⚠️ Requires "State" selection for filtering',
        '✅ Warning colors (yellow/orange theme)',
        '✅ Limited boundary columns (first 2)',
        '✅ Console warnings for missing required filters'
      ],
      configuration: {
        showFilters: true,
        showStats: true,
        showClearAll: true,
        persistFilters: true,
        requiredFilters: ['state'],
        storageKey: 'stockTransactionFilters'
      }
    }
  };

  const currentVariant = variants[selectedComponent];

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: 'bold', 
          color: '#1f2937',
          marginBottom: '8px'
        }}>
          🎨 Boundary Filter HOC Variants Demo
        </h1>
        <p style={{ 
          fontSize: '16px', 
          color: '#6b7280',
          maxWidth: '800px',
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          Demonstrates three different configurations of the boundary filter HOC, each optimized 
          for different use cases and user experience requirements.
        </p>
      </div>

      {/* Variant Selector */}
      <div style={{
        backgroundColor: '#f9fafb',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '30px'
      }}>
        <h2 style={{ 
          fontSize: '18px', 
          fontWeight: '600', 
          color: '#374151',
          marginBottom: '16px',
          textAlign: 'center'
        }}>
          Select Component Variant
        </h2>
        
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          {Object.entries(variants).map(([key, variant]) => (
            <button
              key={key}
              onClick={() => setSelectedComponent(key)}
              style={{
                padding: '12px 24px',
                backgroundColor: selectedComponent === key ? '#3b82f6' : 'white',
                color: selectedComponent === key ? 'white' : '#374151',
                border: '2px solid #3b82f6',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
                transition: 'all 0.2s',
                minWidth: '160px',
                textAlign: 'center'
              }}
              onMouseOver={(e) => {
                if (selectedComponent !== key) {
                  e.target.style.backgroundColor = '#eff6ff';
                }
              }}
              onMouseOut={(e) => {
                if (selectedComponent !== key) {
                  e.target.style.backgroundColor = 'white';
                }
              }}
            >
              <div>{variant.title}</div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>
                {variant.subtitle}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Current Variant Info */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {/* Features */}
        <div style={{
          backgroundColor: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '8px',
          padding: '20px'
        }}>
          <h3 style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            color: '#0c4a6e',
            marginBottom: '12px'
          }}>
            🎯 {currentVariant.title} Features
          </h3>
          <p style={{ 
            fontSize: '14px', 
            color: '#0369a1',
            marginBottom: '12px',
            lineHeight: '1.5'
          }}>
            {currentVariant.description}
          </p>
          <ul style={{ 
            fontSize: '13px', 
            color: '#0369a1',
            marginLeft: '0',
            paddingLeft: '0',
            listStyle: 'none'
          }}>
            {currentVariant.features.map((feature, index) => (
              <li key={index} style={{ marginBottom: '4px' }}>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Configuration */}
        <div style={{
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '8px',
          padding: '20px'
        }}>
          <h3 style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            color: '#14532d',
            marginBottom: '12px'
          }}>
            ⚙️ HOC Configuration
          </h3>
          <pre style={{
            backgroundColor: '#dcfce7',
            padding: '12px',
            borderRadius: '4px',
            fontSize: '12px',
            color: '#166534',
            overflowX: 'auto',
            lineHeight: '1.4'
          }}>
{JSON.stringify(currentVariant.configuration, null, 2)}
          </pre>
        </div>
      </div>

      {/* Key Differences Table */}
      <div style={{
        backgroundColor: '#fffbeb',
        border: '1px solid #fed7aa',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '30px'
      }}>
        <h3 style={{ 
          fontSize: '16px', 
          fontWeight: '600', 
          color: '#92400e',
          marginBottom: '16px',
          textAlign: 'center'
        }}>
          📊 Variant Comparison
        </h3>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            fontSize: '13px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#fef3c7' }}>
                <th style={{ padding: '8px', border: '1px solid #f59e0b', color: '#92400e' }}>Feature</th>
                <th style={{ padding: '8px', border: '1px solid #f59e0b', color: '#92400e' }}>FullFeatured</th>
                <th style={{ padding: '8px', border: '1px solid #f59e0b', color: '#92400e' }}>Minimal</th>
                <th style={{ padding: '8px', border: '1px solid #f59e0b', color: '#92400e' }}>Required</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Statistics Bar', '✅ Shown', '❌ Hidden', '✅ Custom Style'],
                ['Clear All Button', '✅ Shown', '❌ Hidden', '✅ Shown'],
                ['Filter Persistence', '✅ Enabled', '❌ Disabled', '✅ Enabled'],
                ['Required Filters', '❌ None', '❌ None', '⚠️ State Required'],
                ['Styling Theme', '💙 Blue', '⚪ Clean White', '🟡 Warning Yellow'],
                ['Boundary Columns', '✅ All Fields', '⚠️ First 3 Only', '⚠️ First 2 Only'],
                ['Use Case', '📊 Analytics', '👤 User Lists', '📦 Inventory']
              ].map(([feature, full, mini, req], index) => (
                <tr key={index} style={{ 
                  backgroundColor: index % 2 === 0 ? '#fffbeb' : '#fef3c7' 
                }}>
                  <td style={{ 
                    padding: '6px 8px', 
                    border: '1px solid #f59e0b',
                    fontWeight: '500',
                    color: '#92400e'
                  }}>
                    {feature}
                  </td>
                  <td style={{ padding: '6px 8px', border: '1px solid #f59e0b', color: '#78350f' }}>
                    {full}
                  </td>
                  <td style={{ padding: '6px 8px', border: '1px solid #f59e0b', color: '#78350f' }}>
                    {mini}
                  </td>
                  <td style={{ padding: '6px 8px', border: '1px solid #f59e0b', color: '#78350f' }}>
                    {req}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Component Display */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '2px solid #e5e7eb',
        borderRadius: '12px',
        padding: '0',
        overflow: 'hidden'
      }}>
        {/* Component Header */}
        <div style={{
          backgroundColor: '#f8fafc',
          padding: '16px 24px',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: '600', 
            color: '#1e293b',
            margin: '0'
          }}>
            {currentVariant.title} - {currentVariant.subtitle}
          </h2>
          <p style={{ 
            fontSize: '14px', 
            color: '#64748b',
            margin: '4px 0 0 0'
          }}>
            {currentVariant.description}
          </p>
        </div>

        {/* Component Content */}
        <div style={{ padding: '0' }}>
          {React.createElement(currentVariant.component, {
            projectId: 'demo-project-id',
            boundaryType: 'state',
            boundaryCode: 'ONDO'
          })}
        </div>
      </div>

      {/* Usage Instructions */}
      <div style={{
        backgroundColor: '#f1f5f9',
        border: '1px solid #cbd5e1',
        borderRadius: '8px',
        padding: '20px',
        marginTop: '30px'
      }}>
        <h3 style={{ 
          fontSize: '16px', 
          fontWeight: '600', 
          color: '#334155',
          marginBottom: '12px'
        }}>
          💡 How to Use These Variants
        </h3>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '16px'
        }}>
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>
              📊 FullFeatured - Best for Analytics
            </h4>
            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>
              Use when users need complete filtering control with statistics and data persistence. 
              Perfect for dashboards and detailed data analysis.
            </p>
          </div>
          
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>
              👤 Minimal - Best for Simple Lists
            </h4>
            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>
              Use for clean, distraction-free filtering. Great for user management, 
              simple listings, and when screen space is limited.
            </p>
          </div>
          
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>
              📦 Required - Best for Data Quality
            </h4>
            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>
              Use when certain filters are essential for meaningful results. 
              Perfect for inventory, transactions, and compliance reporting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoundaryFilterVariantsDemo;