import React, { useState, useMemo, useEffect,Fragment } from 'react';
import { Button } from '@egovernments/digit-ui-components';
import GenericFilterComponent from './GenericFilterComponent';
import { 
  applyGenericFilters, 
  getGenericFieldStats, 
  extractFieldOptions,
  validateFieldPaths 
} from '../utils/genericFilterUtils';

/**
 * Higher-Order Component that adds generic field filtering capability to any component
 * Automatically filters data based on specified field attributes and passes filtered data to wrapped component
 * 
 * @param {React.Component} WrappedComponent - Component to wrap with generic filtering
 * @param {Object} options - Configuration options for the HOC
 */
const withGenericFilter = (WrappedComponent, options = {}) => {
  const {
    // Configuration options
    showFilters = true,
    showStats = true,
    showClearAll = true,
    autoApplyFilters = true,
    persistFilters = false,
    storageKey = 'genericFilters',
    
    // Filter configuration
    filterFields = [], // Array of field paths to create filters for
    initialFilters = {},
    requiredFilters = [],
    
    // Custom labels
    customLabels = {},
    
    // Styling
    filterPosition = 'top', // 'top', 'bottom', 'none'
    filterStyle = {},
    statsStyle = {},
    
    // Validation
    validateFields = true,
    
    // Callbacks
    onFiltersChange = null,
    onDataFiltered = null,
    onFieldValidation = null
  } = options;

  return function GenericFilteredComponent(props) {
    // Extract data from props
    const originalData = props.data || [];
    
    // Validate filter fields against data structure
    const fieldValidation = useMemo(() => {
      if (!validateFields || filterFields.length === 0) {
        return { valid: filterFields, invalid: [] };
      }
      
      const validation = validateFieldPaths(originalData, filterFields);
      
      // Call validation callback if provided
      if (onFieldValidation && validation.invalid.length > 0) {
        onFieldValidation(validation);
      }
      
      return validation;
    }, [originalData, filterFields, validateFields]);

    const validFilterFields = fieldValidation.valid;

    // State for filters
    const [activeFilters, setActiveFilters] = useState(() => {
      // Load persisted filters if enabled
      if (persistFilters && typeof window !== 'undefined') {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          try {
            const parsedFilters = JSON.parse(saved);
            // Only keep filters for valid fields
            const validSavedFilters = {};
            validFilterFields.forEach(field => {
              if (parsedFilters[field]) {
                validSavedFilters[field] = parsedFilters[field];
              }
            });
            return { ...initialFilters, ...validSavedFilters };
          } catch (e) {
            console.error('Failed to load persisted generic filters:', e);
          }
        }
      }
      return initialFilters;
    });

    // State for filter visibility (allows toggling)
    const [filtersVisible, setFiltersVisible] = useState(showFilters);

    // Apply filters to data
    const filteredData = useMemo(() => {
      if (!autoApplyFilters || !activeFilters || Object.keys(activeFilters).length === 0) {
        return originalData;
      }
      return applyGenericFilters(originalData, activeFilters);
    }, [originalData, activeFilters, autoApplyFilters]);

    // Get statistics
    const stats = useMemo(() => {
      return {
        original: getGenericFieldStats(originalData, validFilterFields),
        filtered: getGenericFieldStats(filteredData, validFilterFields)
      };
    }, [originalData, filteredData, validFilterFields]);

    // Handle filter changes
    const handleFiltersChange = (newActiveFilters, allFilters) => {
      // Check required filters
      if (requiredFilters.length > 0) {
        const missingRequired = requiredFilters.filter(
          field => !newActiveFilters[field]
        );
        
        if (missingRequired.length > 0) {
          console.warn('Missing required generic filters:', missingRequired);
        }
      }

      setActiveFilters(newActiveFilters);

      // Persist filters if enabled
      if (persistFilters && typeof window !== 'undefined') {
        if (Object.keys(newActiveFilters).length > 0) {
          localStorage.setItem(storageKey, JSON.stringify(newActiveFilters));
        } else {
          localStorage.removeItem(storageKey);
        }
      }

      // Call external handler if provided
      if (onFiltersChange) {
        onFiltersChange(newActiveFilters, allFilters);
      }

      // Call data filtered handler if provided
      if (onDataFiltered) {
        const filtered = applyGenericFilters(originalData, newActiveFilters);
        onDataFiltered(filtered, newActiveFilters);
      }
    };

    // Effect to handle external filter updates
    useEffect(() => {
      if (props.externalFilters) {
        setActiveFilters(props.externalFilters);
      }
    }, [props.externalFilters]);

    // Prepare enhanced props for wrapped component
    const enhancedProps = {
      ...props,
      // Replace data with filtered data
      data: filteredData,
      // Add original data reference
      originalData: originalData,
      // Add filter information
      activeGenericFilters: activeFilters,
      genericFilterCount: Object.keys(activeFilters).length,
      // Add statistics
      genericFilterStats: stats,
      // Add field validation info
      validFilterFields: validFilterFields,
      invalidFilterFields: fieldValidation.invalid,
      // Add filter control methods
      clearGenericFilters: () => handleFiltersChange({}, {}),
      setGenericFilter: (fieldPath, value) => {
        const newFilters = { ...activeFilters, [fieldPath]: value };
        handleFiltersChange(
          Object.keys(newFilters).filter(k => newFilters[k]).reduce((obj, key) => {
            obj[key] = newFilters[key];
            return obj;
          }, {}),
          newFilters
        );
      },
      removeGenericFilter: (fieldPath) => {
        const newFilters = { ...activeFilters };
        delete newFilters[fieldPath];
        handleFiltersChange(newFilters, { ...activeFilters, [fieldPath]: '' });
      },
      toggleGenericFilters: () => setFiltersVisible(!filtersVisible)
    };

    // Stats component
    const StatsComponent = showStats ? (
      <div style={{
        padding: '12px 20px',
        backgroundColor: '#f0f9ff',
        borderBottom: '1px solid #e0e7ff',
        fontSize: '14px',
        color: '#1e40af',
        ...statsStyle
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            {Object.keys(activeFilters).length > 0 ? (
              <>
                <strong>Generic Filtered Results:</strong> {' '}
                {filteredData.length} of {originalData.length} records
                {' • '}
                <span style={{ fontSize: '12px' }}>
                  {Object.entries(activeFilters).map(([key, value]) => 
                    `${key.split('.').pop()}: ${value}`
                  ).join(' • ')}
                </span>
              </>
            ) : (
              <>
                <strong>All Records:</strong> {originalData.length} total
                {validFilterFields.length > 0 && (
                  <span style={{ fontSize: '12px', marginLeft: '8px' }}>
                    ({validFilterFields.length} filterable fields available)
                  </span>
                )}
              </>
            )}
          </div>
          
          {filterPosition !== 'none' && (
            <Button
              type="button"
              variation="secondary"
              label={filtersVisible ? 'Hide Generic Filters' : 'Show Generic Filters'}
              onClick={() => setFiltersVisible(!filtersVisible)}
              style={{
                fontSize: '12px'
              }}
            />
          )}
        </div>
      </div>
    ) : null;

    // Filter component
    const FilterComponent = (filterPosition !== 'none' && filtersVisible && validFilterFields.length > 0) ? (
      <GenericFilterComponent
        data={originalData}
        filterFields={validFilterFields}
        onFiltersChange={handleFiltersChange}
        showClearAll={showClearAll}
        customLabels={customLabels}
        containerStyle={filterStyle}
        initialFilters={activeFilters}
        showStats={showStats}
      />
    ) : null;

    // Warning component for invalid fields
    const WarningComponent = fieldValidation.invalid.length > 0 && process.env.NODE_ENV === 'development' ? (
      <div style={{
        padding: '12px 20px',
        backgroundColor: '#fef3c7',
        border: '1px solid #f59e0b',
        borderBottom: '1px solid #e0e7ff',
        fontSize: '13px',
        color: '#92400e'
      }}>
        <strong>⚠️ Generic Filter Warning:</strong> Invalid field paths: {fieldValidation.invalid.join(', ')}
      </div>
    ) : null;

    // Render based on filter position
    if (filterPosition === 'bottom') {
      return (
        <div style={{ width: '100%', height: '100%' }}>
          {WarningComponent}
          {StatsComponent}
          <WrappedComponent {...enhancedProps} />
          {FilterComponent}
        </div>
      );
    } else if (filterPosition === 'none') {
      // Just pass filtered data without showing filters
      return (
        <div style={{ width: '100%', height: '100%' }}>
          {WarningComponent}
          <WrappedComponent {...enhancedProps} />
        </div>
      );
    } else {
      // Default: filters on top
      return (
        <div style={{ width: '100%', height: '100%' }}>
          {WarningComponent}
          {FilterComponent}
          {StatsComponent}
          <WrappedComponent {...enhancedProps} />
        </div>
      );
    }
  };
};

/**
 * Hook version of withGenericFilter for functional components
 * Provides filtering logic without the UI components
 */
export const useGenericFilter = (data, filterFields = [], initialFilters = {}) => {
  const [activeFilters, setActiveFilters] = useState(initialFilters);

  const filteredData = useMemo(() => {
    if (!activeFilters || Object.keys(activeFilters).length === 0) {
      return data;
    }
    return applyGenericFilters(data, activeFilters);
  }, [data, activeFilters]);

  const stats = useMemo(() => {
    return {
      original: getGenericFieldStats(data, filterFields),
      filtered: getGenericFieldStats(filteredData, filterFields)
    };
  }, [data, filteredData, filterFields]);

  const updateFilter = (fieldPath, value) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      if (value) {
        newFilters[fieldPath] = value;
      } else {
        delete newFilters[fieldPath];
      }
      return newFilters;
    });
  };

  const clearFilters = () => {
    setActiveFilters({});
  };

  return {
    filteredData,
    activeFilters,
    setActiveFilters,
    updateFilter,
    clearFilters,
    stats
  };
};

export default withGenericFilter;