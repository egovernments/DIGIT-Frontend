import React, { useMemo ,Fragment} from 'react';
import { useTranslation } from 'react-i18next';
import useSimpleElasticsearch from '../hooks/useSimpleElasticsearch';
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
  const mapContainerId = mapId ? `${mapId}-map-container` : 'delivery-map-container';
  const storageKey = mapId ? `${mapId}-deliveryComponentMapView` : 'deliveryComponentMapView';
  
  return withMapView(ReusableTableWrapper, {
    showMapToggle: true,
    defaultView: 'table',
    mapContainerId: mapContainerId,
    persistViewMode: true,
    storageKey: storageKey,
  
  // Custom coordinate extraction for delivery data
  getLatitude: (row) => {
    // Try multiple field patterns for latitude
    return row.latitude || row.lat || (Array.isArray(row.geoPoint) ? row.geoPoint[1] : row.geoPoint?.lat);
  },
  
  getLongitude: (row) => {
    // Try multiple field patterns for longitude  
    return row.longitude || row.lng || (Array.isArray(row.geoPoint) ? row.geoPoint[0] : row.geoPoint?.lon);
  },
  
  // MapViewComponent provides comprehensive popup content through boundary maps
  // Custom popup content can enhance the default display
  getMapPopupContent: (visit, index, originalData) => {
    const data = originalData[visit._originalIndex] || visit;
    return `
      <div style="padding: 16px; min-width: 250px; font-family: 'Inter', sans-serif;">
        <h4 style="margin: 0 0 12px 0; color: #1f2937; font-size: 16px; font-weight: 700; border-bottom: 2px solid #f59e0b; padding-bottom: 8px;">
          Delivery Details
        </h4>
        <div style="font-size: 14px; line-height: 1.6; color: #374151;">
          ${data.deliveredBy ? `<div style="margin-bottom: 6px;"><strong > Delivered By:</strong> ${data.deliveredBy}</div>` : ''}
          ${data.productName ? `<div style="margin-bottom: 6px;"><strong > Product:</strong> ${data.productName}</div>` : ''}
          ${data.quantity ? `<div style="margin-bottom: 6px;"><strong > Quantity:</strong> ${data.quantity.toLocaleString()}</div>` : ''}
          ${data.memberCount ? `<div style="margin-bottom: 6px;"><strong > Members:</strong> ${data.memberCount}</div>` : ''}
          ${data.deliveryStatus ? `<div style="margin-bottom: 6px;"><strong > Status:</strong> <span style="padding: 2px 6px; background: ${getStatusBgColor(data.deliveryStatus)}; color: ${getStatusTextColor(data.deliveryStatus)}; border-radius: 4px; font-size: 12px;">${data.deliveryStatus}</span></div>` : ''}
          ${data.deliveryDate ? `<div style="margin-bottom: 6px;"><strong > Date:</strong> ${data.deliveryDate}</div>` : ''}
          ${data.administrativeArea ? `<div style="margin-bottom: 6px;"><strong > Area:</strong> ${data.administrativeArea}</div>` : ''}
        </div>
        <div style="margin-top: 12px; padding-top: 8px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
          <strong>📍 Coordinates:</strong> ${visit.lat.toFixed(4)}, ${visit.lng.toFixed(4)}
        </div>
      </div>
    `;
  },
  
  // Map features (MapViewComponent handles advanced map features automatically)
  showConnectingLines: mapId ? true:false,
  showBaseLayer: true,
  showBoundaryControls: true,
  defaultBoundaryType: 'WARD',
  showFilters: true,
  showSearch: true
  });
};

// Helper functions for popup styling
function getStatusBgColor(status) {
  switch (status?.toUpperCase()) {
    case 'ADMINISTRATION_SUCCESS': return '#d4edda';
    case 'PENDING': return '#fff3cd';
    case 'FAILED': return '#f8d7da';
    case 'IN_PROGRESS': return '#d1ecf1';
    default: return '#e2e3e5';
  }
}

function getStatusTextColor(status) {
  switch (status?.toUpperCase()) {
    case 'ADMINISTRATION_SUCCESS': return '#155724';
    case 'PENDING': return '#856404';
    case 'FAILED': return '#721c24';
    case 'IN_PROGRESS': return '#0c5460';
    default: return '#383d41';
  }
}

// Function to create full filtered table stack with dynamic mapId
const createFullFilteredTable = (mapId) => {
  const MapViewTable = createMapViewTable(mapId);
  const genericStorageKey = mapId ? `${mapId}-deliveryGenericFilters` : 'deliveryGenericFilters';
  const boundaryStorageKey = mapId ? `${mapId}-deliveryBoundaryFilters` : 'deliveryBoundaryFilters';

  // Step 2: Apply generic filters to the map-enabled table
  const GenericFilteredTable = withGenericFilter(MapViewTable, {
    showFilters: true,
    showStats: false,
    showClearAll: true,
    autoApplyFilters: true,
    persistFilters: true,
    filterPosition: 'top',
    storageKey: genericStorageKey,
    filterFields: ['deliveredBy', 'boundaryHierarchy.ward', 'boundaryHierarchy.healthFacility'], // Generic fields to filter
    customLabels: {
      deliveredBy: 'Delivered By',
      quantity: 'Quantity',
      ward: 'Ward',
      healthFacility: 'Health Facility'
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
      console.log('Delivery generic filters changed:', activeFilters);
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
      country: 'Country',
      state: 'State',
      lga: 'Local Government Area',
      ward: 'Ward',
      healthFacility: 'Health Facility'
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
      console.log('Delivery boundary filters changed:', activeFilters);
    },
    onDataFiltered: (filteredData, filters) => {
      console.log(`Boundary filtered: ${filteredData.length} records with filters:`, filters);
    }
  });

  return FullFeaturedFilteredTable;
};

const DeliveryComponentBase = ({ 
  projectId, 
  boundaryType, 
  boundaryCode, 
  loading: externalLoading = false,
  // Date range filter props
  startDate = null,
  endDate = null,
  userName=null,
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

    if(userName){
      conditions.push({
        "match": {
          "Data.userName": {
            "query": userName,
            "operator": "and"
          }
        }
      });
    }

    // Add date range filter if provided
    const actualStartDate = startDate || dateRange?.startDate;
    const actualEndDate = endDate || dateRange?.endDate;
    
    if (actualStartDate || actualEndDate) {
      const dateFilter = {
        "range": {
          "Data.createdTime": {}
        }
      };
      
      if (actualStartDate) {
        dateFilter.range["Data.createdTime"]["gte"] = actualStartDate.getTime();
      }
      
      if (actualEndDate) {
        dateFilter.range["Data.createdTime"]["lte"] = actualEndDate.getTime();
      }
      
      conditions.push(dateFilter);
    }

    // Add delivery-specific filters
    // conditions.push({
    //   "term": {
    //     "Data.entityType.keyword": "TASK"
    //   }
    // });

    // conditions.push({
    //   "term": {
    //     "Data.taskType.keyword": "DELIVERY"
    //   }
    // });

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

  // Use the simple Elasticsearch hook
  const {
    data,
    loading,
    error,
    progress,
    metadata,
    refetch
  } = useSimpleElasticsearch({
    indexName: getKibanaDetails('projectTaskIndex') || 'project-task-index-v1',
    query: elasticsearchQuery,
    sourceFields: [
  "Data.geoPoint",
  "Data.createdTime",
  "Data.syncedTime",
  "Data.productName",
  "Data.memberCount",
  "Data.additionalDetails.administrativeArea",
  "Data.quantity",
  "Data.userName",
  "Data.status",
  "Data.userId",
  "Data.boundaryHierarchy"
],
    maxRecordLimit: 10000, // Temporarily reduced to test regular API
    maxBatchSize: 2500,
    parallelBatches: 4,
    requiresAuth: true,
    enabled: !externalLoading && !!projectId
  });
console.log('🚚 Delivery data received:', {
  recordsReceived: data?.length || 0,
  totalAvailable: metadata?.totalAvailable || 0,
  totalRecords: metadata?.totalRecords || 0,
  isComplete: (data?.length || 0) === (metadata?.totalAvailable || 0),
  fetchedPercentage: metadata?.totalAvailable ? ((data?.length || 0) / metadata.totalAvailable * 100).toFixed(1) + '%' : 'N/A'
});

  // Transform data for table display
  const tableData = useMemo(() => {
    return data.map((hit, index) => {
      const source = hit._source?.Data || {};
      const address = source.addressDetails || {};
      const geoPoint = source.geoPoint || {};
      
      return {
        id: source.id || source.taskId || hit._id || `delivery-${index}`,
        taskId: source.taskId || 'N/A',
        deliveryDate: source.createdTime ? new Date(source.createdTime).toLocaleDateString() : 'N/A',
        deliveredBy: source.userName || 'N/A',
        productName: source.productName || 'N/A',
        quantity: source.quantity || 0,
        memberCount: source.memberCount || 0,
        syncedTime: source?.syncedTime ? new Date(source.syncedTime)?.toLocaleString() : 'N/A',
        administrativeArea: source.additionalDetails?.administrativeArea || 'N/A',
        deliveryStatus: source.status || 'N/A',
        boundaryHierarchy: source.boundaryHierarchy || {},
        latitude: geoPoint[1] || geoPoint.lat || 'N/A',
        longitude: geoPoint[0] || geoPoint.lon || 'N/A',
        createdTime: source.createdTime 
          ? new Date(source.createdTime).toLocaleString() 
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

  // Define table columns with dynamic boundary columns
  const columns = useMemo(() => {
    const baseColumns = [
      { key: 'deliveredBy', label: t('DELIVERED_BY'), sortable: true },
      { key: 'quantity', label: t('QUANTITY'), sortable: true },
      { key: 'memberCount', label: t('MEMBER_COUNT'), sortable: true },
      { key: 'deliveryStatus', label: t('DELIVERY_STATUS'), sortable: true },
      { key: 'deliveryDate', label: t('DELIVERY_DATE'), sortable: true },
      { key: 'productName', label: t('PRODUCT_NAME'), sortable: true }
    ];

    // Add dynamic boundary hierarchy columns
    const boundaryColumns = boundaryFields.map(field => ({
      key: `boundaryHierarchy.${field}`,
      label: t(getFieldLabel(field)),
      sortable: true,
      width: '150px'
    }));

    const endColumns = [
      { key: 'latitude', label: t('LATITUDE'), sortable: false },
      { key: 'longitude', label: t('LONGITUDE'), sortable: false },
      { key: 'administrativeArea', label: t('ADMINISTRATIVE_AREA'), sortable: true },
      { key: 'syncedTime', label: t('SYNCED_TIME'), sortable: true }
    ];

    return [...baseColumns, ...boundaryColumns, ...endColumns];
  }, [boundaryFields, t]);

  // Custom cell renderers for specific fields
  const customCellRenderer = useMemo(() => {
    const renderers = {
      quantity: (row) => (
        <span style={{ 
          fontWeight: 'bold',
          color: row.quantity > 0 ? '#28a745' : '#dc3545'
        }}>
          {row.quantity.toLocaleString()}
        </span>
      ),
      deliveryStatus: (row) => (
        <span style={{
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '500',
          backgroundColor: getStatusColor(row.deliveryStatus).background,
          color: getStatusColor(row.deliveryStatus).text
        }}>
          {row.deliveryStatus}
        </span>
      ),
      deliveryDate: (row) => (
        <span style={{ fontSize: '14px' }}>
          {row.deliveryDate !== 'N/A' ? row.deliveryDate : '-'}
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

  // Helper function for status colors
  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'ADMINISTRATION_SUCCESS':
        return { background: '#d4edda', text: '#155724' };
      case 'PENDING':
        return { background: '#fff3cd', text: '#856404' };
      case 'FAILED':
        return { background: '#f8d7da', text: '#721c24' };
      case 'IN_PROGRESS':
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
    
    return [
      {
        key: 'totalRecords',
        value: metadata.totalRecords.toLocaleString(),
        label: 'Delivery Records',
        subtitle: `of ${metadata.totalAvailable.toLocaleString()} total`,
        valueColor: '#059669'
      }
    ];
  }, [metadata]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ElasticsearchDataHeader
        loading={isLoading}
        error={error}
        onRetry={refetch}
        data={tableData}
        metadata={metadata}
        progress={progress}
        title="Delivery Records"
        errorMessage="Failed to load delivery data"
        // summaryCards={summaryCards}
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
                : 'All delivery records'}
              {/* {projectId && ` for Project: ${projectId}`} */}
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
        noDataMessage="NO_DELIVERY_DATA"
        customCellRenderer={customCellRenderer}
        pagination={true}
        paginationPerPage={25}
        paginationRowsPerPageOptions={[10, 25, 50, 100, 500, 1000]}
        className="delivery-table"
        headerClassName="delivery-header"
        enableExcelDownload={true}
        excelFileName="delivery_data_filtered"
        excelButtonText="Download Filtered Data"
      />
    </div>
  );
};

// Create the date range filtered delivery component as the default export
const DeliveryComponent = withDateRangeFilter(DeliveryComponentBase, {
  showDateFilter: true,
  showPresets: true,
  persistDates: true,
  storageKey: 'deliveryComponentDateRange',
  defaultPreset: 'last30days',
  label: 'Delivery Date Range Filter',
  filterPosition: 'top',
  containerStyle: {
    backgroundColor: '#fff3cd',
    borderBottom: '2px solid #ffc107',
    padding: '16px 20px'
  },
  onDateRangeChange: (startDate, endDate) => {
    console.log('Delivery component date range changed:', { startDate, endDate });
  }
});

export default DeliveryComponent;

// Also export the base component for cases where date filtering is not needed
export { DeliveryComponentBase };