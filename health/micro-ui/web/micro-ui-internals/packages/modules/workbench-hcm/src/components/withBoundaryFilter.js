import React, { useState, useMemo, useEffect ,Fragment} from 'react';
import BoundaryFilterComponent from './BoundaryFilterComponent';
import { applyBoundaryFilters, getBoundaryStats } from '../utils/boundaryFilterUtils';

/**
 * Higher-Order Component that adds boundary filtering capability to any component
 * Automatically filters data based on boundaryHierarchy and passes filtered data to wrapped component
 * 
 * @param {React.Component} WrappedComponent - Component to wrap with boundary filtering
 * @param {Object} options - Configuration options for the HOC
 */
const withBoundaryFilter = (WrappedComponent, options = {}) => {
  const {
    // Configuration options
    showFilters = true,
    showStats = true,
    showClearAll = true,
    autoApplyFilters = true,
    persistFilters = false,
    storageKey = 'boundaryFilters',
    
    // Custom labels
    customLabels = {},
    
    // Filter configuration
    filterOrder = null, // null for auto-discovery, array for custom order
    requiredFilters = [],
    
    // Styling
    filterPosition = 'top', // 'top', 'bottom', 'none'
    filterStyle = {},
    statsStyle = {},
    
    // Callbacks
    onFiltersChange = null,
    onDataFiltered = null
  } = options;

  return function BoundaryFilteredComponent(props) {
    // Extract data from props
    const originalData = props.data || [];
    
    // State for filters
    const [activeFilters, setActiveFilters] = useState(() => {
      // Load persisted filters if enabled
      if (persistFilters && typeof window !== 'undefined') {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          try {
            return JSON.parse(saved);
          } catch (e) {
            console.error('Failed to load persisted filters:', e);
          }
        }
      }
      return {};
    });

    // State for filter visibility (allows toggling)
    const [filtersVisible, setFiltersVisible] = useState(showFilters);

    // Apply filters to data
    const filteredData = useMemo(() => {
      if (!autoApplyFilters || !activeFilters || Object.keys(activeFilters).length === 0) {
        return originalData;
      }
      return applyBoundaryFilters(originalData, activeFilters);
    }, [originalData, activeFilters, autoApplyFilters]);

    // Get statistics
    const stats = useMemo(() => {
      return {
        original: getBoundaryStats(originalData),
        filtered: getBoundaryStats(filteredData)
      };
    }, [originalData, filteredData]);

    // Handle filter changes
    const handleFiltersChange = (newActiveFilters, allFilters) => {
      // Check required filters
      if (requiredFilters.length > 0) {
        const missingRequired = requiredFilters.filter(
          field => !newActiveFilters[field]
        );
        
        if (missingRequired.length > 0) {
          console.warn('Missing required filters:', missingRequired);
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
        const filtered = applyBoundaryFilters(originalData, newActiveFilters);
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
      activeFilters: activeFilters,
      filterCount: Object.keys(activeFilters).length,
      // Add statistics
      dataStats: stats,
      // Add filter control methods
      clearFilters: () => handleFiltersChange({}, {}),
      setFilter: (filterType, value) => {
        const newFilters = { ...activeFilters, [filterType]: value };
        handleFiltersChange(
          Object.keys(newFilters).filter(k => newFilters[k]).reduce((obj, key) => {
            obj[key] = newFilters[key];
            return obj;
          }, {}),
          newFilters
        );
      },
      removeFilter: (filterType) => {
        const newFilters = { ...activeFilters };
        delete newFilters[filterType];
        handleFiltersChange(newFilters, { ...activeFilters, [filterType]: '' });
      },
      toggleFilters: () => setFiltersVisible(!filtersVisible)
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
                <strong>Filtered Results:</strong> {' '}
                {filteredData.length} of {originalData.length} records
                {' • '}
                <span style={{ fontSize: '12px' }}>
                  {Object.entries(activeFilters).map(([key, value]) => 
                    `${key}: ${value}`
                  ).join(' • ')}
                </span>
              </>
            ) : (
              <>
                <strong>All Records:</strong> {originalData.length} total
                {stats.original.recordsWithBoundary > 0 && (
                  <span style={{ fontSize: '12px', marginLeft: '8px' }}>
                    ({stats.original.recordsWithBoundary} with boundary data - {stats.original.coveragePercentage}% coverage)
                  </span>
                )}
              </>
            )}
          </div>
          
          {filterPosition !== 'none' && (
            <button
              onClick={() => setFiltersVisible(!filtersVisible)}
              style={{
                padding: '4px 12px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              {filtersVisible ? 'Hide Filters' : 'Show Filters'}
            </button>
          )}
        </div>
      </div>
    ) : null;

    // Filter component
    const FilterComponent = (filterPosition !== 'none' && filtersVisible) ? (
      <BoundaryFilterComponent
        data={originalData}
        onFiltersChange={handleFiltersChange}
        showClearAll={showClearAll}
        customLabels={customLabels}
        filterOrder={filterOrder}
        containerStyle={filterStyle}
        initialFilters={activeFilters}
      />
    ) : null;

    // Render based on filter position
    if (filterPosition === 'bottom') {
      return (
        <div style={{ width: '100%', height: '100%' }}>
          {StatsComponent}
          <WrappedComponent {...enhancedProps} />
          {FilterComponent}
        </div>
      );
    } else if (filterPosition === 'none') {
      // Just pass filtered data without showing filters
      return <WrappedComponent {...enhancedProps} />;
    } else {
      // Default: filters on top
      return (
        <div style={{ width: '100%', height: '100%' }}>
          {FilterComponent}
          {StatsComponent}
          <WrappedComponent {...enhancedProps} />
        </div>
      );
    }
  };
};

/**
 * Hook version of withBoundaryFilter for functional components
 * Provides filtering logic without the UI components
 */
export const useBoundaryFilter = (data, initialFilters = {}) => {
  const [activeFilters, setActiveFilters] = useState(initialFilters);

  const filteredData = useMemo(() => {
    if (!activeFilters || Object.keys(activeFilters).length === 0) {
      return data;
    }
    return applyBoundaryFilters(data, activeFilters);
  }, [data, activeFilters]);

  const stats = useMemo(() => {
    return {
      original: getBoundaryStats(data),
      filtered: getBoundaryStats(filteredData)
    };
  }, [data, filteredData]);

  const updateFilter = (filterType, value) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      if (value) {
        newFilters[filterType] = value;
      } else {
        delete newFilters[filterType];
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

export default withBoundaryFilter;