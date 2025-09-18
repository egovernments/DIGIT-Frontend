import React, { useMemo, useState, useEffect,Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  extractFieldOptions, 
  generateFieldLabel,
  getGenericFieldStats 
} from '../utils/genericFilterUtils';

/**
 * Generic filter component that creates dropdown filters for any specified fields
 * @param {Array} data - Array of data objects to filter
 * @param {Array} filterFields - Array of field paths to create filters for
 * @param {Function} onFiltersChange - Callback when filters change
 * @param {Object} customLabels - Custom labels for fields
 * @param {Object} containerStyle - Custom container styling
 * @param {boolean} showClearAll - Whether to show clear all button
 * @param {boolean} showStats - Whether to show filter statistics
 */
const GenericFilterComponent = ({
  // Data props
  data = [],
  filterFields = [],
  
  // Event handlers
  onFiltersChange = null,
  
  // Configuration
  showClearAll = true,
  showStats = true,
  
  // Styling
  containerStyle = {},
  filterRowStyle = {},
  selectStyle = {},
  clearButtonStyle = {},
  
  // Custom labels (optional)
  customLabels = {},
  
  // Initial filters
  initialFilters = {}
}) => {
  const { t } = useTranslation();

  // State to store selected filter values
  const [selectedFilters, setSelectedFilters] = useState(() => {
    const initial = {};
    filterFields.forEach(field => {
      initial[field] = initialFilters[field] || '';
    });
    return initial;
  });

  // Extract unique field values from data (only fields with multiple values)
  const fieldOptions = useMemo(() => {
    return extractFieldOptions(data, filterFields);
  }, [data, filterFields]);

  // Get stats about available options
  const filterStats = useMemo(() => {
    return getGenericFieldStats(data, filterFields);
  }, [data, filterFields]);

  // Update selectedFilters when filterFields changes
  useEffect(() => {
    setSelectedFilters(prevFilters => {
      const newFilters = {};
      filterFields.forEach(field => {
        newFilters[field] = prevFilters[field] || '';
      });
      return newFilters;
    });
  }, [filterFields]);

  // Handle filter change
  const handleFilterChange = (fieldPath, value) => {
    const newFilters = {
      ...selectedFilters,
      [fieldPath]: value
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
    filterFields.forEach(field => {
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
  const getFieldLabel = (fieldPath) => {
    // Check custom labels first
    if (customLabels[fieldPath]) {
      return customLabels[fieldPath];
    }
    
    // Generate human-readable label from field path
    return generateFieldLabel(fieldPath);
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

  // Don't render if no filterable fields available
  const availableFields = Object.keys(fieldOptions);
  if (availableFields.length === 0) {
    return null;
  }

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
            {t('Generic Filters')}
          </h4>
          <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
            {activeFilterCount > 0 ? (
              <span>{activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active</span>
            ) : (
              <span>Filter data by field values</span>
            )}
          </div>
        </div>
        
        {showClearAll && activeFilterCount > 0 && (
          <button
            onClick={handleClearAll}
            style={defaultClearButtonStyle}
            onMouseOver={(e) => e.target.style.backgroundColor = '#4b5563'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#6b7280'}
          >
            {t('Clear All')}
          </button>
        )}
      </div>

      {/* Filter Dropdowns */}
      <div style={defaultFilterRowStyle}>
        {availableFields.map(fieldPath => {
          const options = fieldOptions[fieldPath] || [];
          const hasOptions = options.length > 0;
          const fieldLabel = getFieldLabel(fieldPath);
          const stats = filterStats.fieldStats[fieldPath] || {};
          
          return (
            <div key={fieldPath}>
              <label style={{ 
                display: 'block',
                fontSize: '12px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '4px'
              }}>
                {t(fieldLabel)}
                <span style={{ color: '#9ca3af', marginLeft: '4px' }}>
                  ({options.length}{stats.coveragePercentage ? ` • ${stats.coveragePercentage}%` : ''})
                </span>
              </label>
              
              <select
                value={selectedFilters[fieldPath] || ''}
                onChange={(e) => handleFilterChange(fieldPath, e.target.value)}
                disabled={!hasOptions}
                style={{
                  ...defaultSelectStyle,
                  opacity: hasOptions ? 1 : 0.6,
                  cursor: hasOptions ? 'pointer' : 'not-allowed',
                  borderColor: selectedFilters[fieldPath] ? '#3b82f6' : '#d1d5db'
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

      {/* Statistics */}
      {showStats && (
        <div style={{
          marginTop: '12px',
          padding: '8px 12px',
          backgroundColor: '#f3f4f6',
          borderRadius: '4px',
          fontSize: '12px',
          color: '#6b7280'
        }}>
          <strong>Filter Stats:</strong>{' '}
          {availableFields.map(field => {
            const stats = filterStats.fieldStats[field];
            const label = getFieldLabel(field);
            return stats ? `${label}: ${stats.uniqueValues} options (${stats.coveragePercentage}%)` : '';
          }).filter(Boolean).join(' • ')}
        </div>
      )}

      {/* Debug Info (only show in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          marginTop: '8px',
          padding: '8px',
          backgroundColor: '#f3f4f6',
          borderRadius: '4px',
          fontSize: '11px',
          color: '#6b7280'
        }}>
          <strong>Debug Info:</strong> 
          Found {data.length} records • 
          Requested fields: [{filterFields.join(', ')}] • 
          Available filters: [{availableFields.join(', ')}] • 
          Active filters: {JSON.stringify(Object.keys(selectedFilters).filter(k => selectedFilters[k]))}
        </div>
      )}
    </div>
  );
};

export default GenericFilterComponent;