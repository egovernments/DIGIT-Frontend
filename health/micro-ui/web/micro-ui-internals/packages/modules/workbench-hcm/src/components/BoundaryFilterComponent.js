import React, { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@egovernments/digit-ui-components';
import { discoverBoundaryFields, extractBoundaryOptions } from '../utils/boundaryFilterUtils';

/**
 * Reusable boundary filter component that creates dropdown filters
 * based on boundaryHierarchy data from table data
 */
const BoundaryFilterComponent = ({
  // Data props
  data = [],
  
  // Event handlers
  onFiltersChange = null,
  
  // Configuration
  showClearAll = true,
  
  // Styling
  containerStyle = {},
  filterRowStyle = {},
  selectStyle = {},
  clearButtonStyle = {},
  
  // Custom labels (optional)
  customLabels = {},
  
  // Filter order (optional - to control the order of dropdowns, null for auto-discovery)
  filterOrder = null
}) => {
  const { t } = useTranslation();

  // Dynamically discover boundary fields from data
  const discoveredFields = useMemo(() => {
    return discoverBoundaryFields(data);
  }, [data]);

  // Use provided filterOrder or discovered fields
  const fieldsToShow = useMemo(() => {
    return filterOrder || discoveredFields;
  }, [filterOrder, discoveredFields]);

  // Initialize state dynamically based on discovered fields
  const [selectedFilters, setSelectedFilters] = useState(() => {
    const initialState = {};
    fieldsToShow.forEach(field => {
      initialState[field] = '';
    });
    return initialState;
  });

  // Update selectedFilters when fieldsToShow changes
  useEffect(() => {
    setSelectedFilters(prevFilters => {
      const newFilters = {};
      fieldsToShow.forEach(field => {
        newFilters[field] = prevFilters[field] || '';
      });
      return newFilters;
    });
  }, [fieldsToShow]);

  // Extract unique boundary values from data (only fields with multiple values)
  const boundaryOptions = useMemo(() => {
    return extractBoundaryOptions(data, fieldsToShow);
  }, [data, fieldsToShow]);

  // Get stats about available options
  const filterStats = useMemo(() => {
    const stats = {};
    Object.keys(boundaryOptions).forEach(field => {
      stats[field] = boundaryOptions[field]?.length || 0;
    });
    return stats;
  }, [boundaryOptions]);

  // Handle filter change
  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      ...selectedFilters,
      [filterType]: value
    };
    
    setSelectedFilters(newFilters);

    // Notify parent component about filter changes
    if (onFiltersChange) {
      const activeFilters = Object.keys(newFilters)
        .filter(key => newFilters[key])
        .reduce((obj, key) => {
          obj[key] = newFilters[key];
          return obj;
        }, {});
      
      onFiltersChange(activeFilters, newFilters);
    }
  };

  // Clear all filters
  const handleClearAll = () => {
    const clearedFilters = {};
    fieldsToShow.forEach(field => {
      clearedFilters[field] = '';
    });
    
    setSelectedFilters(clearedFilters);
    
    if (onFiltersChange) {
      onFiltersChange({}, clearedFilters);
    }
  };

  // Get count of active filters
  const activeFilterCount = Object.values(selectedFilters).filter(value => value).length;

  // Generate labels with proper formatting
  const getFieldLabel = (fieldName) => {
    // Check custom labels first
    if (customLabels[fieldName]) {
      const label = customLabels[fieldName];
      // If the label looks like a localization key (starts with WBH_), translate it
      if (typeof label === 'string' && label.startsWith('WBH_')) {
        return t(label);
      }
      return label;
    }
    
    // Generate human-readable label from field name
    return fieldName
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
      .trim();
  };

  // Default styles
  const defaultContainerStyle = {
    padding: '16px 20px',
    backgroundColor: '#f8f9fa',
    borderBottom: '1px solid #e5e7eb',
    ...containerStyle
  };

  const defaultFilterRowStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
    alignItems: 'end',
    ...filterRowStyle
  };

  const defaultSelectStyle = {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    backgroundColor: 'white',
    fontSize: '14px',
    color: '#374151',
    cursor: 'pointer',
    outline: 'none',
    ...selectStyle
  };

  const defaultClearButtonStyle = {
    padding: '8px 16px',
    backgroundColor: '#6b7280',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    ...clearButtonStyle
  };

  return (
    <div style={defaultContainerStyle}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '16px' 
      }}>
        <div>
          <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#374151' }}>
            {t('Boundary Filters')}
          </h4>
          <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
            {activeFilterCount > 0 ? (
              <span>{activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active</span>
            ) : (
              <span>Filter data by administrative boundaries</span>
            )}
          </div>
        </div>
        
        {showClearAll && activeFilterCount > 0 && (
          <Button
            type="button"
            variation="secondary"
            label={t('Clear All')}
            onClick={handleClearAll}
            style={{
              fontSize: '13px'
            }}
          />
        )}
      </div>

      {/* Filter Dropdowns - Only show fields with multiple values */}
      <div style={defaultFilterRowStyle}>
        {Object.keys(boundaryOptions).map(filterType => {
          const options = boundaryOptions[filterType] || [];
          const hasOptions = options.length > 0;
          const fieldLabel = getFieldLabel(filterType);
          
          return (
            <div key={filterType}>
              <label style={{ 
                display: 'block',
                fontSize: '12px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '4px'
              }}>
                {t(fieldLabel)}
                <span style={{ color: '#9ca3af', marginLeft: '4px' }}>
                  ({options.length})
                </span>
              </label>
              
              <select
                value={selectedFilters[filterType] || ''}
                onChange={(e) => handleFilterChange(filterType, e.target.value)}
                disabled={!hasOptions}
                style={{
                  ...defaultSelectStyle,
                  opacity: hasOptions ? 1 : 0.6,
                  cursor: hasOptions ? 'pointer' : 'not-allowed',
                  borderColor: selectedFilters[filterType] ? '#3b82f6' : '#d1d5db'
                }}
              >
                <option value="">
                  {hasOptions ? `All ${fieldLabel}` : `No ${fieldLabel} data`}
                </option>
                {options.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>

      {/* Debug Info (only show in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          marginTop: '12px',
          padding: '8px',
          backgroundColor: '#f3f4f6',
          borderRadius: '4px',
          fontSize: '11px',
          color: '#6b7280'
        }}>
          <strong>Debug Info:</strong> 
          Found {data.length} records • 
          Discovered fields: [{discoveredFields.join(', ')}] • 
          Showing filters: [{Object.keys(boundaryOptions).join(', ')}] • 
          Active filters: {JSON.stringify(Object.keys(selectedFilters).filter(k => selectedFilters[k]))} • 
          Options: {Object.keys(boundaryOptions).map(k => `${k}:${boundaryOptions[k].length}`).join(', ')}
        </div>
      )}
    </div>
  );
};

export default BoundaryFilterComponent;