import React, { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

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
  
  // Filter order (optional - to control the order of dropdowns)
  filterOrder = ['country', 'state', 'lga', 'ward', 'healthFacility']
}) => {
  const { t } = useTranslation();

  // State to store selected filter values
  const [selectedFilters, setSelectedFilters] = useState({
    country: '',
    state: '',
    lga: '',
    ward: '',
    healthFacility: ''
  });

  // Extract unique boundary values from data
  const boundaryOptions = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        country: [],
        state: [],
        lga: [],
        ward: [],
        healthFacility: []
      };
    }

    const options = {
      country: new Set(),
      state: new Set(),
      lga: new Set(),
      ward: new Set(),
      healthFacility: new Set()
    };

    // Extract boundary values from each data row
    data.forEach(row => {
      const boundaryHierarchy = row.boundaryHierarchy;
      
      if (boundaryHierarchy && typeof boundaryHierarchy === 'object') {
        // Add values to sets (Set automatically handles uniqueness)
        if (boundaryHierarchy.country) options.country.add(boundaryHierarchy.country);
        if (boundaryHierarchy.state) options.state.add(boundaryHierarchy.state);
        if (boundaryHierarchy.lga) options.lga.add(boundaryHierarchy.lga);
        if (boundaryHierarchy.ward) options.ward.add(boundaryHierarchy.ward);
        if (boundaryHierarchy.healthFacility) options.healthFacility.add(boundaryHierarchy.healthFacility);
      }
    });

    // Convert sets to sorted arrays
    return {
      country: Array.from(options.country).sort(),
      state: Array.from(options.state).sort(),
      lga: Array.from(options.lga).sort(),
      ward: Array.from(options.ward).sort(),
      healthFacility: Array.from(options.healthFacility).sort()
    };
  }, [data]);

  // Get stats about available options
  const filterStats = useMemo(() => {
    return {
      country: boundaryOptions.country.length,
      state: boundaryOptions.state.length,
      lga: boundaryOptions.lga.length,
      ward: boundaryOptions.ward.length,
      healthFacility: boundaryOptions.healthFacility.length
    };
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
    const clearedFilters = {
      country: '',
      state: '',
      lga: '',
      ward: '',
      healthFacility: ''
    };
    
    setSelectedFilters(clearedFilters);
    
    if (onFiltersChange) {
      onFiltersChange({}, clearedFilters);
    }
  };

  // Get count of active filters
  const activeFilterCount = Object.values(selectedFilters).filter(value => value).length;

  // Default labels
  const defaultLabels = {
    country: 'Country',
    state: 'State', 
    lga: 'LGA',
    ward: 'Ward',
    healthFacility: 'Health Facility'
  };

  const labels = { ...defaultLabels, ...customLabels };

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
        {filterOrder.map(filterType => {
          const options = boundaryOptions[filterType] || [];
          const hasOptions = options.length > 0;
          
          return (
            <div key={filterType}>
              <label style={{ 
                display: 'block',
                fontSize: '12px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '4px'
              }}>
                {t(labels[filterType])}
                <span style={{ color: '#9ca3af', marginLeft: '4px' }}>
                  ({filterStats[filterType]})
                </span>
              </label>
              
              <select
                value={selectedFilters[filterType]}
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
                  {hasOptions ? `All ${labels[filterType]}` : `No ${labels[filterType]} data`}
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
          Active filters: {JSON.stringify(Object.keys(selectedFilters).filter(k => selectedFilters[k]))} • 
          Options: {Object.keys(filterStats).map(k => `${k}:${filterStats[k]}`).join(', ')}
        </div>
      )}
    </div>
  );
};

export default BoundaryFilterComponent;