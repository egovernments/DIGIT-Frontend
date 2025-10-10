import React, { useMemo ,Fragment} from 'react';
import { useTranslation } from 'react-i18next';
import useSimpleElasticsearchWithProxy from '../hooks/useSimpleElasticsearchWithProxy';
import ReusableTableWrapper from './ReusableTableWrapper';
import withBoundaryFilter from './withBoundaryFilter';
import withGenericFilter from './withGenericFilter';
import withDateRangeFilter from './withDateRangeFilter';
import withMapView from './withMapView';
import ElasticsearchDataHeader from './ElasticsearchDataHeader';
import { getKibanaDetails } from '../utils/getProjectServiceUrl';
import { discoverBoundaryFields } from '../utils/boundaryFilterUtils';

function toCamelCase(str) {
  return str
    .toLowerCase()
    .replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
}

/**
 * HOC Composition Order (bottom to top):
 * 1. ReusableTableWrapper (base table)
 * 2. withMapView (adds map/table toggle)
 * 3. withGenericFilter (adds generic field filters)
 * 4. withBoundaryFilter (adds boundary filters) 
 * 5. withDateRangeFilter (adds date range filtering)
 */

// Function to create MapViewTable with dynamic mapId
const createMapViewTable = (mapId) => {
  const mapContainerId = mapId ? `${mapId}-map-container` : 'household-map-container';
  const storageKey = mapId ? `${mapId}-householdComponentMapView` : 'householdComponentMapView';
  
  return withMapView(ReusableTableWrapper, {
    showMapToggle: true,
    defaultView: 'table',
    mapContainerId: mapContainerId,
    persistViewMode: true,
    storageKey: storageKey,
  
  // Custom coordinate extraction for household data
  getLatitude: (row) => {
    // Try multiple field patterns for latitude
    return row.latitude || row.lat || (Array.isArray(row.geoPoint) ? row.geoPoint[1] : row.geoPoint?.lat);
  },
  
  getLongitude: (row) => {
    // Try multiple field patterns for longitude  
    return row.longitude || row.lng || (Array.isArray(row.geoPoint) ? row.geoPoint[0] : row.geoPoint?.lon);
  },
  
  // MapViewComponent provides comprehensive popup content through boundary maps
  // Custom popup content for individual data
  getMapPopupContent: (individual, index, originalData) => {
    const data = originalData[individual._originalIndex] || individual;
    return `
      <div style="padding: 16px; min-width: 250px; font-family: 'Inter', sans-serif;">
        <h4 style="margin: 0 0 12px 0; color: #1f2937; font-size: 16px; font-weight: 700; border-bottom: 2px solid #3b82f6; padding-bottom: 8px;">
          Household Details
        </h4>
        <div style="font-size: 14px; line-height: 1.6; color: #374151;">
          ${data.name ? `<div style="margin-bottom: 6px;"><strong>Name:</strong> ${data.name}</div>` : ''}
          ${data.individualId ? `<div style="margin-bottom: 6px;"><strong>ID:</strong> ${data.individualId}</div>` : ''}
          ${data.assessmentQ1 ? `<div style="margin-bottom: 6px;"><strong>Assessment:</strong> ${data.assessmentQ1}</div>` : ''}
          ${data.age !== undefined ? `<div style="margin-bottom: 6px;"><strong>Age:</strong> ${data.age}</div>` : ''}
          ${data.memberCount ? `<div style="margin-bottom: 6px;"><strong>Member Count:</strong> ${data.memberCount}</div>` : ''}
          ${data.registrationDate ? `<div style="margin-bottom: 6px;"><strong>Registered:</strong> ${data.registrationDate}</div>` : ''}
          ${data.status ? `<div style="margin-bottom: 6px;"><strong>Status:</strong> <span style="padding: 2px 6px; background: ${getStatusBgColor(data.status)}; color: ${getStatusTextColor(data.status)}; border-radius: 4px; font-size: 12px;">${data.status}</span></div>` : ''}
          ${data.administrativeArea ? `<div style="margin-bottom: 6px;"><strong>Area:</strong> ${data.administrativeArea}</div>` : ''}
        </div>
        <div style="margin-top: 12px; padding-top: 8px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
          <strong>📍 Coordinates:</strong> ${individual.lat?.toFixed(4) || 'N/A'}, ${individual.lng?.toFixed(4) || 'N/A'}
        </div>
      </div>
    `;
  },
  
  // Map features
  showConnectingLines: mapId ? true:false,
  showBaseLayer: false,
  showBoundaryControls: true,
  defaultBoundaryType: 'WARD',
  showFilters: true,
  showSearch: true
  });
};

// Helper functions for popup styling
function getStatusBgColor(status) {
  switch (status?.toUpperCase()) {
    case 'ACTIVE': return '#d4edda';
    case 'INACTIVE': return '#f8d7da';
    case 'PENDING': return '#fff3cd';
    case 'VERIFIED': return '#d1ecf1';
    default: return '#e2e3e5';
  }
}

function getStatusTextColor(status) {
  switch (status?.toUpperCase()) {
    case 'ACTIVE': return '#155724';
    case 'INACTIVE': return '#721c24';
    case 'PENDING': return '#856404';
    case 'VERIFIED': return '#0c5460';
    default: return '#383d41';
  }
}

// Function to create full filtered table stack with dynamic mapId
const createFullFilteredTable = (mapId) => {
  const MapViewTable = createMapViewTable(mapId);
  const genericStorageKey = mapId ? `${mapId}-householdGenericFilters` : 'householdGenericFilters';
  const boundaryStorageKey = mapId ? `${mapId}-householdBoundaryFilters` : 'householdBoundaryFilters';

  // Step 2: Apply generic filters to the map-enabled table
  const GenericFilteredTable = withGenericFilter(MapViewTable, {
    showFilters: true,
    showStats: false,
    showClearAll: true,
    autoApplyFilters: true,
    persistFilters: true,
    filterPosition: 'top',
    storageKey: genericStorageKey,
    filterFields: ['userName', 'role', 'boundaryHierarchy.ward', 'boundaryHierarchy.healthFacility'], // Household-specific fields
    customLabels: {
      userName: 'WBH_HOUSEHOLD_FILTER_USERNAME',
      role: 'WBH_HOUSEHOLD_FILTER_ROLE',
      ward: 'WBH_INDIVIDUAL_FILTER_WARD',
      healthFacility: 'WBH_INDIVIDUAL_FILTER_HEALTH_FACILITY'
    },
    filterStyle: {
      backgroundColor: '#f0fdf4',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '10px',
      border: '1px solid #bbf7d0'
    },
    statsStyle: {
      backgroundColor: '#dcfce7',
      color: '#166534',
      fontSize: '14px',
      fontWeight: '500'
    },
    onFiltersChange: (activeFilters, allFilters) => {
      console.log('Household generic filters changed:', activeFilters);
    },
    onDataFiltered: (filteredData, filters) => {
      console.log(`Generic filtered: ${filteredData.length} records with filters:`, filters);
    }
  });

  // Step 3: Apply boundary filters on top (will appear at top)
  const FullFeaturedFilteredTable = withBoundaryFilter(GenericFilteredTable, {
    showFilters: false,
    showStats: false,
    showClearAll: true,
    autoApplyFilters: true,
    persistFilters: true,
    filterPosition: 'top',
    storageKey: boundaryStorageKey,
    customLabels: {
      country: 'WBH_BOUNDARY_COUNTRY',
      state: 'WBH_BOUNDARY_STATE',
      lga: 'WBH_BOUNDARY_LOCAL_GOVERNMENT_AREA',
      ward: 'WBH_BOUNDARY_WARD',
      healthFacility: 'WBH_BOUNDARY_HEALTH_FACILITY'
    },
    filterOrder: null, // Auto-discover from data
    requiredFilters: [],
    filterStyle: {
      backgroundColor: '#f0f9ff',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '8px',
      border: '1px solid #bae6fd'
    },
    statsStyle: {
      backgroundColor: '#dbeafe',
      color: '#1e40af',
      fontSize: '14px',
      fontWeight: '500'
    },
    onFiltersChange: (activeFilters, allFilters) => {
      console.log('Household boundary filters changed:', activeFilters);
    },
    onDataFiltered: (filteredData, filters) => {
      console.log(`Boundary filtered: ${filteredData.length} records with filters:`, filters);
    }
  });

  return FullFeaturedFilteredTable;
};

const HouseholdComponentBase = ({ 
  projectId, 
  boundaryType, 
  boundaryCode, 
  loading: externalLoading = false,
  // Date range filter props
  startDate = null,
  endDate = null,
  dateRange = null,
  // Map configuration
  mapId = null
}) => {
  const { t } = useTranslation();

  // Build Elasticsearch query based on inputs
  const elasticsearchQuery = useMemo(() => {
    const conditions = [];

    // Add project filter if provided
    // if (projectId) {
    //   conditions.push({
    //     "term": {
    //       "Data.projectId.keyword": projectId
    //     }
    //   });
    // }

    // Add boundary filters if provided
    if (boundaryType && boundaryCode) {
        conditions.push({
          "term": {
            [`Data.boundaryHierarchyCode.${toCamelCase(boundaryType)}.keyword`]: boundaryCode
          }
        })
    }

    // Add date range filter if provided
    const actualStartDate = startDate || dateRange?.startDate;
    const actualEndDate = endDate || dateRange?.endDate;
    
    if (actualStartDate || actualEndDate) {
      const dateFilter = {
        "range": {
          "Data.@timestamp": {}
        }
      };
      
      if (actualStartDate) {
        dateFilter.range["Data.@timestamp"]["gte"] = actualStartDate.getTime();
      }
      
      if (actualEndDate) {
        dateFilter.range["Data.@timestamp"]["lte"] = actualEndDate.getTime();
      }
      
      conditions.push(dateFilter);
    }

    // Return the final query
    if (conditions.length === 0) {
      return { "match_all": {} };
    } else if (conditions.length === 1) {
      return conditions[0];
    } else {
      return {
        "bool": {
          "must": conditions
        }
      };
    }
  }, [projectId, boundaryType, boundaryCode, startDate, endDate, dateRange]);

  // Debug the query
  console.log('👤 HouseholdComponent Query Debug:', {
    projectId,
    boundaryType,
    boundaryCode,
    query: elasticsearchQuery,
    indexName: getKibanaDetails('projectHouseholdIndex') || 'household-index-v1'
  });

  // Use the simple Elasticsearch hook with proxy support
  const {
    data,
    loading,
    error,
    progress,
    metadata,
    refetch,
    usingProxy
  } = useSimpleElasticsearchWithProxy({
    indexName: getKibanaDetails('projectHouseholdIndex') || 'household-index-v1',
    query: elasticsearchQuery,
    sourceFields: [
      "Data.userName",
     
      "Data.geoPoint",
      "Data.@timestamp",
      "Data.additionalDetails",
      "Data.role",
      "Data.boundaryHierarchy"
    ],
    maxRecordLimit: 10000,
    maxBatchSize: 2500,
    parallelBatches: 4,
    requiresAuth: true,
    enabled: !externalLoading && !!projectId,
    useProxy: window.ELASTIC_USE_PROXY || false
  });

  console.log('👥 Household data received:', {
    recordsReceived: data?.length || 0,
    totalAvailable: metadata?.totalAvailable || 0,
    totalRecords: metadata?.totalRecords || 0,
    isComplete: (data?.length || 0) === (metadata?.totalAvailable || 0),
    fetchedPercentage: metadata?.totalAvailable ? ((data?.length || 0) / metadata.totalAvailable * 100).toFixed(1) + '%' : 'N/A',
    usingProxy: usingProxy ? '✅ Using Proxy' : '❌ Direct Connection',
    loading: loading,
    error: error,
    indexName: getKibanaDetails('projectHouseholdIndex') || 'household-index-v1'
  });

  // Transform data for table display - based on available sourceFields
  const tableData = useMemo(() => {
    return data.map((hit, index) => {
      const source = hit._source?.Data || {};
      const geoPoint = source.geoPoint || {};
      
      return {
        id: source.id || hit._id || `household-${index}`,
        userName: source.userName || 'N/A',
        role: source.role || 'N/A',
        registrationDate: source['@timestamp'] ? new Date(source['@timestamp']).toLocaleDateString() : 'N/A',
        administrativeArea: source.additionalDetails?.administrativeArea || 'N/A',
        boundaryHierarchy: source.boundaryHierarchy || {},
        memberCount: source?.additionalDetails?.memberCount || 'NA',
        assessmentQ1: source?.additionalDetails?.assessmentQ1 || 'NA',
        latitude: geoPoint[1] || geoPoint.lat || 'N/A',
        longitude: geoPoint[0] || geoPoint.lon || 'N/A',
        timestamp: source['@timestamp'] 
          ? new Date(source['@timestamp']).toLocaleString() 
          : 'N/A'
      };
    });
  }, [data]);

  // Discover boundary fields from data
  const boundaryFields = useMemo(() => {
    return discoverBoundaryFields(tableData);
  }, [tableData]);

  // Helper function to generate field label
  const getFieldLabel = (fieldName) => {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  // Define table columns with dynamic boundary columns - based on available data
  const columns = useMemo(() => {
    const baseColumns = [
      { key: 'userName', label: t('WBH_USER_NAME'), sortable: true },
      { key: 'role', label: t('WBH_ROLE'), sortable: true },
      { key: 'registrationDate', label: t('WBH_REGISTRATION_DATE'), sortable: true }
    ];

    // Add dynamic boundary hierarchy columns
    const boundaryColumns = boundaryFields.map(field => ({
      key: `boundaryHierarchy.${field}`,
      label: t(getFieldLabel(field)),
      sortable: true,
      width: '150px'
    }));

    const endColumns = [
      { key: 'latitude', label: t('WBH_LATITUDE'), sortable: false },
      { key: 'longitude', label: t('WBH_LONGITUDE'), sortable: false },
      { key: 'memberCount', label: t('WBH_MEMBER_COUNT'), sortable: false },

      { key: 'administrativeArea', label: t('WBH_ADMINISTRATIVE_AREA'), sortable: true },
      { key: 'timestamp', label: t('WBH_TIMESTAMP'), sortable: true }
    ];

    return [...baseColumns, ...boundaryColumns, ...endColumns];
  }, [boundaryFields, t]);

  // Custom cell renderers for specific fields - based on available data
  const customCellRenderer = useMemo(() => {
    const renderers = {
      role: (row) => (
        <span style={{ 
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '500',
          backgroundColor: getRoleColor(row.role).background,
          color: getRoleColor(row.role).text
        }}>
          {row.role}
        </span>
      ),
      userName: (row) => (
        <span style={{ 
          fontWeight: '500',
          color: '#374151'
        }}>
          {row.userName}
        </span>
      ),

      registrationDate: (row) => (
        <span style={{ fontSize: '14px' }}>
          {row.registrationDate !== 'N/A' ? row.registrationDate : '-'}
        </span>
      )
    };

    // Add dynamic boundary field renderers
    boundaryFields.forEach(field => {
      renderers[`boundaryHierarchy.${field}`] = (row) => (
        <span style={{ fontSize: '13px' }}>
          {row.boundaryHierarchy?.[field] || '-'}
        </span>
      );
    });

    return renderers;
  }, [boundaryFields]);

  // Helper function for role colors
  const getRoleColor = (role) => {
    switch (role?.toUpperCase()) {
      case 'ADMIN':
        return { background: '#fef3c7', text: '#92400e' };
      case 'SUPERVISOR':
        return { background: '#ddd6fe', text: '#6d28d9' };
      case 'FIELD_WORKER':
        return { background: '#d1fae5', text: '#047857' };
      case 'DISTRIBUTOR':
        return { background: '#dbeafe', text: '#1d4ed8' };
      case 'REGISTRAR':
        return { background: '#fed7d7', text: '#c53030' };
      default:
        return { background: '#e2e3e5', text: '#383d41' };
    }
  };

  // Helper function for status colors
  const getIndividualStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return { background: '#d4edda', text: '#155724' };
      case 'INACTIVE':
        return { background: '#f8d7da', text: '#721c24' };
      case 'PENDING':
        return { background: '#fff3cd', text: '#856404' };
      case 'VERIFIED':
        return { background: '#d1ecf1', text: '#0c5460' };
      default:
        return { background: '#e2e3e5', text: '#383d41' };
    }
  };

  const isLoading = externalLoading || loading;

  // Create the filtered table component based on mapId
  const FilteredTableComponent = useMemo(() => {
    return createFullFilteredTable(mapId);
  }, [mapId]);

  // Prepare summary cards data
  const summaryCards = useMemo(() => {
    if (!metadata.totalRecords || metadata.totalRecords === 0) return [];
    
    // Calculate gender statistics
    const maleCount = tableData.filter(row => row.gender === 'MALE').length;
    const femaleCount = tableData.filter(row => row.gender === 'FEMALE').length;
    const activeCount = tableData.filter(row => row.status === 'ACTIVE').length;
    
    return [
      {
        key: 'totalRecords',
        value: metadata.totalRecords.toLocaleString(),
        label: 'Total Households',
        subtitle: `of ${metadata.totalAvailable.toLocaleString()} total`,
        valueColor: '#059669'
      },
      {
        key: 'genderStats',
        value: `${maleCount} / ${femaleCount}`,
        label: 'Male / Female',
        subtitle: 'Gender distribution',
        valueColor: '#3b82f6'
      },
      {
        key: 'activeHouseholds',
        value: activeCount.toLocaleString(),
        label: 'Active',
        subtitle: 'Currently active',
        valueColor: '#10b981'
      }
    ];
  }, [metadata, tableData]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ElasticsearchDataHeader
        loading={isLoading}
        error={error}
        onRetry={refetch}
        data={tableData}
        metadata={metadata}
        progress={progress}
        title="Household Records"
        errorMessage="Failed to load household data"
        summaryCards={summaryCards}
        headerStyle={{
          background: '#f8f9fa'
        }}
      />

      {/* Additional context info */}
      {!isLoading && !error && (
        <div style={{ padding: '12px 20px', fontSize: '14px', color: '#6b7280', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
            <span>
              {boundaryType && boundaryCode 
                ? `Filtered by ${boundaryType}: ${t(boundaryCode)}` 
                : 'All household records'}
              {projectId && ` for Project: ${projectId}`}
            </span>
            
            {/* Date range info */}
            {((startDate || dateRange?.startDate) || (endDate || dateRange?.endDate)) && (
              <span style={{ 
                padding: '4px 8px', 
                backgroundColor: '#fef3c7', 
                color: '#92400e',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: '500'
              }}>
                📅 Date: {
                  (startDate || dateRange?.startDate) && (endDate || dateRange?.endDate) 
                    ? `${(startDate || dateRange?.startDate).toLocaleDateString()} - ${(endDate || dateRange?.endDate).toLocaleDateString()}`
                    : (startDate || dateRange?.startDate)
                    ? `From ${(startDate || dateRange?.startDate).toLocaleDateString()}`
                    : `Until ${(endDate || dateRange?.endDate).toLocaleDateString()}`
                }
              </span>
            )}
          </div>
        </div>
      )}

      {/* Table with Boundary + Generic Filtering */}
      <FilteredTableComponent
        title=""
        data={tableData}
        columns={columns}
        isLoading={isLoading}
        noDataMessage="NO_INDIVIDUAL_DATA"
        customCellRenderer={customCellRenderer}
        pagination={true}
        paginationPerPage={25}
        paginationRowsPerPageOptions={[10, 25, 50, 100, 500, 1000]}
        className="household-table"
        headerClassName="household-header"
        enableExcelDownload={false}
        excelFileName="household_data_filtered"
        excelButtonText="Download Filtered Data"
      />
    </div>
  );
};

// Create the date range filtered household component as the default export
const RegistrationComponent = withDateRangeFilter(HouseholdComponentBase, {
  showDateFilter: true,
  showPresets: true,
  persistDates: true,
  storageKey: 'householdComponentDateRange',
  defaultPreset: 'last30days',
  label: 'Household Registration Date Filter',
  filterPosition: 'top',
  containerStyle: {
    backgroundColor: '#eff6ff',
    borderBottom: '2px solid #3b82f6',
    padding: '16px 20px'
  },
  onDateRangeChange: (startDate, endDate) => {
    console.log('Household component date range changed:', { startDate, endDate });
  }
});

export default RegistrationComponent;

// Also export the base component for cases where date filtering is not needed
export { HouseholdComponentBase };