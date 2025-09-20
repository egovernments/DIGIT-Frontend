import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@egovernments/digit-ui-components";
import LGABoundariesMap from "./LGABoundariesMap";
import WardBoundariesMap from "./WardBoundariesMap";
import SettlementBoundariesMap from "./SettlementBoundariesMap";

/**
 * Pure Map View Component - Similar to BoundariesMapWrapper but without the table view
 * Designed specifically for use with withMapView HOC to avoid nested tables
 * 
 * Features:
 * - Multi-boundary support (LGA, Ward, Settlement)
 * - Built-in filtering and search
 * - Individual point markers (no clustering)
 * - Multiple base layers
 * - No table view (pure map)
 */
const MapViewComponent = ({ 
  visits = [], 
  totalCount = 0,
  showConnectingLines = false,
  customPopupContent = null,
  customMarkerStyle = null,
  mapContainerId = "map",
  showBaseLayer = true,
  showBoundaryControls = true,
  defaultBoundaryType = "WARD",
  showFilters = true,
  showSearch = true,
  containerHeight = '100%'
}) => {
  const { t } = useTranslation();
  const [boundaryType, setBoundaryType] = useState(defaultBoundaryType);
  const [showBaseLayers, setShowBaseLayers] = useState(showBaseLayer);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});

  const handleBoundaryTypeChange = (type) => {
    setBoundaryType(type);
    // Reset filters when changing boundary type
    setSearchTerm('');
    setFilters({});
  };
  
  // Filter utility functions
  const formatValue = (value, key) => {
    if (value === null || value === undefined) return 'N/A';
    
    if (key === 'lat' || key === 'lng') {
      return typeof value === 'number' ? value.toFixed(6) : value;
    }
    
    if (key === 'time' || key.includes('date') || key.includes('Date')) {
      try {
        return new Date(value).toLocaleDateString() + ' ' + new Date(value).toLocaleTimeString();
      } catch (e) {
        return value;
      }
    }
    
    return String(value);
  };
  
  // Apply filters to visits data
  const filteredVisits = useMemo(() => {
    let filtered = [...visits];
    
    // Apply search term
    if (searchTerm && showSearch) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(visit => {
        return Object.values(visit).some(value => {
          const stringValue = formatValue(value, '').toLowerCase();
          return stringValue.includes(searchLower);
        });
      });
    }
    
    // Apply column filters
    if (showFilters) {
      for (const [filterCol, filterValue] of Object.entries(filters)) {
        if (filterValue && filterValue !== 'all') {
          filtered = filtered.filter(visit => {
            const visitValue = formatValue(visit[filterCol], filterCol);
            return visitValue === filterValue;
          });
        }
      }
    }
    
    return filtered;
  }, [visits, searchTerm, filters, showSearch, showFilters]);
  
  // Get unique values for filter dropdowns
  const getUniqueValues = (columnName) => {
    const uniqueValues = [...new Set(
      visits.map(visit => formatValue(visit[columnName], columnName))
        .filter(value => value && value !== 'N/A')
    )].sort();
    return uniqueValues.slice(0, 50);
  };
  
  // Get available filter columns
  const getFilterColumns = () => {
    if (visits.length === 0) return [];
    
    const sampleVisit = visits[0];
    const priorityColumns = ['status', 'name', 'type', 'category', 'wardname', 'lganame', 'statename'];
    const allColumns = Object.keys(sampleVisit);
    
    return priorityColumns.filter(col => {
      const hasColumn = allColumns.includes(col);
      const hasValues = hasColumn && getUniqueValues(col).length > 1;
      return hasValues;
    });
  };
  
  const filterColumns = getFilterColumns();

  // Determine which map component to render based on boundary type
  const MapComponent = useMemo(() => {
    switch(boundaryType) {
      case "LGA":
        return LGABoundariesMap;
      case "SETTLEMENT":
        return SettlementBoundariesMap;
      case "WARD":
      default:
        return WardBoundariesMap;
    }
  }, [boundaryType]);

  return (
    <div style={{ height: containerHeight, display: 'flex', flexDirection: 'column' }}>
      {/* Header Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 16px',
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #dee2e6',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h4 style={{ margin: 0, color: '#495057', fontSize: '16px', fontWeight: '600' }}>
            {boundaryType === "LGA" ? "LGA Boundaries" : 
             boundaryType === "WARD" ? "Ward Boundaries" : 
             "Settlement Boundaries"}
            {filteredVisits.length !== visits.length && (
              <span style={{
                marginLeft: '8px',
                fontSize: '13px',
                color: '#059669',
                fontWeight: '500',
                background: '#ecfdf5',
                padding: '2px 8px',
                borderRadius: '12px',
                border: '1px solid #d1fae5'
              }}>
                {filteredVisits.length} filtered
              </span>
            )}
          </h4>
          <span style={{ 
            fontSize: '13px', 
            color: '#6c757d',
            fontStyle: 'italic'
          }}>
            Showing {filteredVisits.length} of {visits.length} records
          </span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Boundary Type Controls */}
          {showBoundaryControls && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {[
                { value: "LGA", label: "LGA", color: "#2E7D32" },
                { value: "WARD", label: "Ward", color: "#7B1FA2" },
                { value: "SETTLEMENT", label: "Settlement", color: "#D84315" }
              ].map(({ value, label, color }) => (
                <label 
                  key={value}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    backgroundColor: boundaryType === value ? color + '15' : 'transparent',
                    border: boundaryType === value ? `2px solid ${color}` : '1px solid #dee2e6',
                    transition: 'all 0.2s'
                  }}
                >
                  <input
                    type="radio"
                    name="boundaryType"
                    value={value}
                    checked={boundaryType === value}
                    onChange={() => handleBoundaryTypeChange(value)}
                    style={{ 
                      margin: 0,
                      accentColor: color 
                    }}
                  />
                  <span style={{ 
                    fontWeight: boundaryType === value ? '600' : '400',
                    color: boundaryType === value ? color : '#495057'
                  }}>
                    {label}
                  </span>
                </label>
              ))}
            </div>
          )}
          
          {/* Base Layer Toggle */}
          <Button
            type="button"
            variation="secondary"
            label={showBaseLayers ? "Hide Layers" : "Show Layers"}
            onClick={() => setShowBaseLayers(!showBaseLayers)}
            style={{ fontSize: '13px' }}
          />
        </div>
      </div>

      {/* Filters Row */}
      {(showSearch || (showFilters && filterColumns.length > 0)) && (
        <div style={{
          display: 'flex',
          gap: '12px',
          padding: '12px 16px',
          backgroundColor: '#fff',
          borderBottom: '1px solid #e5e7eb',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          {/* Search Input */}
          {showSearch && (
            <div style={{ flex: '1', minWidth: '200px', maxWidth: '300px' }}>
              <input
                type="text"
                placeholder="Search in all fields..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>
          )}
          
          {/* Filter Dropdowns */}
          {showFilters && filterColumns.map(column => (
            <div key={column} style={{ minWidth: '150px' }}>
              <select
                value={filters[column] || 'all'}
                onChange={(e) => setFilters({...filters, [column]: e.target.value})}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: filters[column] && filters[column] !== 'all' ? '#fef3c7' : 'white',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="all">{column.charAt(0).toUpperCase() + column.slice(1)}: All</option>
                {getUniqueValues(column).map(value => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </div>
          ))}
          
          {/* Clear Filters */}
          {(searchTerm || Object.values(filters).some(v => v && v !== 'all')) && (
            <Button
              type="button"
              variation="secondary"
              label="Clear Filters"
              onClick={() => {
                setSearchTerm('');
                setFilters({});
              }}
              style={{ fontSize: '13px' }}
            />
          )}
          
          {/* Filter Summary */}
          {(searchTerm || Object.values(filters).some(v => v && v !== 'all')) && (
            <div style={{
              marginLeft: 'auto',
              fontSize: '13px',
              color: '#6b7280',
              fontStyle: 'italic'
            }}>
              {filteredVisits.length} of {visits.length} records shown
            </div>
          )}
        </div>
      )}

      {/* Map Container */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <MapComponent
          visits={filteredVisits}
          showConnectingLines={showConnectingLines}
          customPopupContent={customPopupContent}
          customMarkerStyle={customMarkerStyle}
          mapContainerId={mapContainerId}
          showBaseLayer={showBaseLayers}
        />
        
       
      </div>
    </div>
  );
};

export default MapViewComponent;