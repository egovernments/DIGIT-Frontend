import React, { useMemo, useState, useEffect,Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Dropdown, TextInput } from '@egovernments/digit-ui-components';
import { SVG } from '@egovernments/digit-ui-react-components';
import { 
  extractFieldOptions, 
  generateFieldLabel,
  getGenericFieldStats 
} from '../utils/genericFilterUtils';

/**
 * Generic filter component that creates dropdown filters for any specified fields and text search
 * @param {Array} data - Array of data objects to filter
 * @param {Array} filterFields - Array of field paths to create filters for
 * @param {Function} onFiltersChange - Callback when filters change
 * @param {Object} customLabels - Custom labels for fields
 * @param {Object} containerStyle - Custom container styling
 * @param {boolean} showClearAll - Whether to show clear all button
 * @param {boolean} showStats - Whether to show filter statistics
 * @param {boolean} showTextSearch - Whether to show text search input
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
  showTextSearch = true,
  
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

  // State for text search
  const [searchText, setSearchText] = useState(initialFilters.searchText || '');

  // State for filter visibility (collapsed by default)
  const [isExpanded, setIsExpanded] = useState(false);

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
    notifyFiltersChange(newFilters, searchText);
  };

  // Handle text search change
  const handleSearchChange = (value) => {
    setSearchText(value);
    notifyFiltersChange(selectedFilters, value);
  };

  // Unified function to notify parent about filter changes
  const notifyFiltersChange = (filters, search) => {
    if (onFiltersChange) {
      const activeFilters = Object.keys(filters)
        .filter(key => filters[key])
        .reduce((obj, key) => {
          obj[key] = filters[key];
          return obj;
        }, {});
      
      // Add search text to active filters if present
      if (search && search.trim()) {
        activeFilters.searchText = search.trim();
      }
      
      // Include search in all filters for consistency
      const allFilters = { ...filters };
      if (search) {
        allFilters.searchText = search;
      }
      
      onFiltersChange(activeFilters, allFilters);
    }
  };

  // Clear all filters
  const handleClearAll = () => {
    const clearedFilters = {};
    filterFields.forEach(field => {
      clearedFilters[field] = '';
    });
    
    setSelectedFilters(clearedFilters);
    setSearchText('');
    
    if (onFiltersChange) {
      onFiltersChange({}, clearedFilters);
    }
  };

  // Get count of active filters (including text search)
  const activeFilterCount = Object.values(selectedFilters).filter(value => value).length + (searchText.trim() ? 1 : 0);

  // Generate labels with proper formatting
  const getFieldLabel = (fieldPath) => {
    // Check custom labels first
    if (customLabels[fieldPath]) {
      const label = customLabels[fieldPath];
      // If the label looks like a localization key (starts with WBH_), translate it
      if (typeof label === 'string' && label.startsWith('WBH_')) {
        return t(label);
      }
      return label;
    }
    
    // Generate human-readable label from field path
    return generateFieldLabel(fieldPath);
  };

  // Generate a summary of active filters for compact display
  const getFilterSummary = () => {
    const activeParts = [];
    
    // Add search text if present
    if (searchText.trim()) {
      activeParts.push(`Search: "${searchText.trim()}"`);
    }
    
    // Add field filters
    Object.entries(selectedFilters).forEach(([fieldPath, value]) => {
      if (value) {
        const label = getFieldLabel(fieldPath);
        activeParts.push(`${label}: ${value}`);
      }
    });
    
    if (activeParts.length === 0) {
      return t('WBH_FILTER_NO_FILTERS_APPLIED');
    }
    
    return activeParts.join(' • ');
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
      {/* Compact Header - Always Visible */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        cursor: 'pointer',
        padding: '8px 0'
      }}
      onClick={() => setIsExpanded(!isExpanded)}
      >
        <div style={{ flex: 1 }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px'
          }}>
            <div style={{ 
              transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
              display: 'flex',
              alignItems: 'center'
            }}>
              <SVG.ArrowForward width="16" height="16" />
            </div>
            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#374151', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <SVG.FilterAlt width="16" height="16" />
              {t('WBH_FILTERS')} 
              {activeFilterCount > 0 && (
                <span style={{
                  marginLeft: '8px',
                  fontSize: '12px',
                  color: '#059669',
                  fontWeight: '500',
                  background: '#ecfdf5',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  border: '1px solid #d1fae5'
                }}>
                  {activeFilterCount} {t(activeFilterCount === 1 ? 'WBH_FILTER_FILTER_APPLIED' : 'WBH_FILTER_FILTERS_APPLIED')}
                </span>
              )}
            </h4>
          </div>
          <div style={{ 
            fontSize: '12px', 
            color: '#6b7280', 
            marginTop: '2px',
            marginLeft: '32px'
          }}>
            {getFilterSummary()}
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {showClearAll && activeFilterCount > 0 && (
            <Button
              type="button"
              variation="secondary"
              label={
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <SVG.Close width="14" height="14" />
                  {t('WBH_FILTER_CLEAR')}
                </div>
              }
              onClick={(e) => {
                e.stopPropagation();
                handleClearAll();
              }}
              style={{
                fontSize: '12px',
                padding: '4px 8px'
              }}
            />
          )}
          <Button
            type="button"
            variation="primary"
            label={
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {isExpanded ? <SVG.VisibilityOff width="14" height="14" /> : <SVG.Visibility width="14" height="14" />}
                {isExpanded ? t('WBH_FILTER_HIDE') : t('WBH_FILTER_SHOW')}
              </div>
            }
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            style={{
              fontSize: '12px',
              padding: '4px 12px'
            }}
          />
        </div>
      </div>

      {/* Expanded Filter Controls */}
      {isExpanded && (
        <div style={{ 
          marginTop: '16px',
          padding: '16px',
          backgroundColor: '#f9fafb',
          borderRadius: '6px',
          border: '1px solid #e5e7eb'
        }}>
          {/* Text Search */}
          {showTextSearch && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '4px'
              }}>
                <SVG.Search width="16" height="16" />
                {t('WBH_FILTER_SEARCH_ALL_FIELDS')}
              </label>
              <TextInput
                type="text"
                placeholder={t('WBH_FILTER_ENTER_SEARCH_TERM')}
                value={searchText}
                onChange={(e) => handleSearchChange(e.target.value)}
                style={{
                  width: '100%'
                }}
              />
            </div>
          )}

          {/* Filter Dropdowns */}
          {availableFields.length > 0 && (
            <>
              <div style={{
                fontSize: '12px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                {t('WBH_FILTER_BY_FIELDS')}
              </div>
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
                      
                      <Dropdown
                        variant="select-dropdown"
                        t={t}
                        option={[
                          { code: '', name: hasOptions ? `All ${fieldLabel}` : `No ${fieldLabel} data` },
                          ...options.map(option => ({ code: option, name: option }))
                        ]}
                        selected={selectedFilters[fieldPath] ? { code: selectedFilters[fieldPath], name: selectedFilters[fieldPath] } : { code: '', name: hasOptions ? `All ${fieldLabel}` : `No ${fieldLabel} data` }}
                        select={(value) => handleFilterChange(fieldPath, value.code)}
                        disable={!hasOptions}
                        optionKey="code"
                        placeholder={`Select ${fieldLabel}`}
                        style={{
                          width: '100%',
                          opacity: hasOptions ? 1 : 0.6
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div style={{
            marginTop: '16px',
            paddingTop: '12px',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              {activeFilterCount > 0 ? (
                <span>{activeFilterCount} {t(activeFilterCount === 1 ? 'WBH_FILTER_FILTER_APPLIED' : 'WBH_FILTER_FILTERS_APPLIED')}</span>
              ) : (
                <span>{t('WBH_FILTER_NO_FILTERS_APPLIED')}</span>
              )}
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              {showClearAll && activeFilterCount > 0 && (
                <Button
                  type="button"
                  variation="secondary"
                  label={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <SVG.Close width="14" height="14" />
                      {t('WBH_FILTER_CLEAR_ALL')}
                    </div>
                  }
                  onClick={handleClearAll}
                  style={{
                    fontSize: '12px'
                  }}
                />
              )}
              <Button
                type="button"
                variation="primary"
                label={
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <SVG.Check width="14" height="14" />
                    {t('WBH_FILTER_APPLY_HIDE')}
                  </div>
                }
                onClick={() => setIsExpanded(false)}
                style={{
                  fontSize: '12px'
                }}
              />
            </div>
          </div>

          {/* Statistics */}
          {showStats && availableFields.length > 0 && (
            <div style={{
              marginTop: '12px',
              padding: '8px 12px',
              backgroundColor: '#f3f4f6',
              borderRadius: '4px',
              fontSize: '11px',
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
              fontSize: '10px',
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
      )}
    </div>
  );
};

export default GenericFilterComponent;