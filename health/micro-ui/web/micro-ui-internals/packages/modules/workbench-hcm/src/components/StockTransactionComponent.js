import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import useSimpleElasticsearch from '../hooks/useSimpleElasticsearch';
import ReusableTableWrapper from './ReusableTableWrapper';
import withBoundaryFilter from './withBoundaryFilter';
import withGenericFilter from './withGenericFilter';
import withDateRangeFilter from './withDateRangeFilter';
import ElasticsearchDataHeader from './ElasticsearchDataHeader';
import { getKibanaDetails } from '../utils/getProjectServiceUrl';
import { discoverBoundaryFields } from '../utils/boundaryFilterUtils';

function toCamelCase(str) {
  return str
    .toLowerCase()
    .replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
}

/**
 * HOC Composition Order for Stock Transaction Component (bottom to top):
 * 1. ReusableTableWrapper (base table)
 * 2. withGenericFilter (adds generic field filters)
 * 3. withBoundaryFilter (adds boundary filters with required state selection)
 */

// Function to create filtered table
const createStockFilteredTable = () => {
  // Step 1: Apply generic filters to the base table
  const GenericFilteredStockTable = withGenericFilter(ReusableTableWrapper, {
    showFilters: true,
    showStats: false,
    showClearAll: true,
    autoApplyFilters: true,
    persistFilters: true,
    filterPosition: 'top',
    storageKey: 'stockGenericFilters',
    filterFields: ['transactionType', 'facilityName', 'transactingFacilityName'],
    customLabels: {
      transactionType: 'WBH_STOCK_TRANSACTION_TYPE',
      facilityName: 'WBH_STOCK_SENDING_FACILITY',
      transactingFacilityName: 'WBH_STOCK_RECEIVING_FACILITY'
    },
    filterStyle: {
      backgroundColor: '#f0fdf4',
      padding: '16px',
      borderRadius: '8px',
      marginBottom: '8px',
      border: '1px solid #bbf7d0'
    },
    statsStyle: {
      backgroundColor: '#dcfce7',
      color: '#166534',
      fontSize: '14px',
      fontWeight: '500'
    },
    onFiltersChange: (activeFilters, allFilters) => {
      console.log('Stock generic filters changed:', activeFilters);
    },
    onDataFiltered: (filteredData, filters) => {
      console.log(`Stock generic filtered: ${filteredData.length} records with filters:`, filters);
    }
  });
  
  const FullFilteredStockTable = withBoundaryFilter(GenericFilteredStockTable, {
    showFilters: false,
    showStats: false,
    showClearAll: true,
    autoApplyFilters: true,
    persistFilters: true,
    filterPosition: 'top',
    storageKey: 'stockBoundaryFilters',
    requiredFilters: ['state'],
    customLabels: {
      state: 'WBH_BOUNDARY_STATE',
      lga: 'WBH_BOUNDARY_LOCAL_GOVERNMENT_AREA',
      ward: 'WBH_BOUNDARY_WARD',
      healthFacility: 'WBH_BOUNDARY_HEALTH_FACILITY',
      warehouseId: 'WBH_BOUNDARY_WAREHOUSE',
      facilityCode: 'WBH_BOUNDARY_FACILITY_CODE'
    },
    filterStyle: {
      backgroundColor: '#fef9e7',
      border: '2px solid #f59e0b',
      borderRadius: '8px',
      padding: '16px 20px',
      marginBottom: '12px'
    },
    statsStyle: {
      backgroundColor: '#fffbeb',
      color: '#92400e',
      fontSize: '14px',
      fontWeight: '600',
      borderBottom: '2px solid #fbbf24'
    },
    onFiltersChange: (activeFilters, allFilters) => {
      console.log('Stock boundary filters changed:', activeFilters);
      const missingRequired = ['state'].filter(field => !activeFilters[field]);
      if (missingRequired.length > 0) {
        console.warn('Missing required filters for stock data:', missingRequired);
      }
    },
    onDataFiltered: (filteredData, filters) => {
      console.log(`Stock boundary filtered: ${filteredData.length} records with filters:`, filters);
    }
  });
  
  return FullFilteredStockTable;
};

const StockTransactionComponentBase = ({ 
  projectId, 
  boundaryType, 
  boundaryCode, 
  loading: externalLoading = false,
  // Date range filter props
  startDate = null,
  endDate = null,
  dateRange = null
}) => {
  const { t } = useTranslation();
  
  // Create the filtered table component
  const FullFilteredStockTable = useMemo(() => {
    return createStockFilteredTable();
  }, []);

  // Build Elasticsearch query based on inputs
  const elasticsearchQuery = useMemo(() => {
    const conditions = [];

    // Add project filter if provided
   

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

    // Add stock transaction-specific filters
  

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
    indexName: getKibanaDetails('projectStockIndex') || 'od-stock-index-v1',
    query: elasticsearchQuery,
    sourceFields: [
      "Data.id",
    "Data.eventType",
  "Data.facilityId",
    "Data.facilityName",
  "Data.physicalCount",
  "Data.waybillNumber",
  "Data.transactingFacilityId",
    "Data.transactingFacilityName",
  "Data.additionalDetails.quantitySent",
  "Data.additionalDetails.quantityReceived",
  "Data.additionalDetails.materialNoteNumber",
  "Data.quantity",
  "Data.createdTime",
  "Data.userName",
  "Data.status",
  "Data.createdBy",
    "Data.boundaryHierarchy"

    ],
    maxRecordLimit: 10000, // Temporarily reduced to test regular API
    maxBatchSize: 2500,
    parallelBatches: 4,
    requiresAuth: true,
    enabled: !externalLoading && !!projectId
  });

  // Transform data for table display
  const tableData = useMemo(() => {
    return data.map((hit, index) => {
      const source = hit._source?.Data || {};
      const facilityDetails = source.facilityDetails || {};
      const facilityAddress = facilityDetails.addressDetails || {};
      
      return {
        id: source.id  || `stock-${index}`,
        senderId: source.facilityId || 'N/A',
        facilityName: source.facilityName ||  'N/A',
        quantitySent: source.additionalDetails?.quantitySent || source?.physicalCount || 0,
        receiverId: source.transactingFacilityId || 'N/A',
        transactingFacilityName: source.transactingFacilityName || 'N/A',
        quantityReceived: source.additionalDetails?.quantityReceived || 0,
        quantity: source.quantity || 0,
        materialNoteNumber: source.additionalDetails?.materialNoteNumber || 'N/A',
        batchNumber: source.batchNumber || 'N/A',
        transactionType: source.eventType || 'N/A',
        wayBillNumber: source.waybillNumber || 'N/A',
        createdBy: source.createdBy || 'N/A',
        createdTime: source.createdTime ? new Date(source.createdTime).toLocaleString() : 'N/A',
        distributorName: facilityDetails.facilityName || 'N/A',
        stockOnHand: source.physicalCount || 0,
        boundaryHierarchy: source.boundaryHierarchy || {}
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
      { label: t("WBH_STOCK_ID"), key: "id", width: '150px',sortable: true },
      { label: t("WBH_FACILITY_ID"), key: "senderId", width: '140px', sortable: true },
      { label: t("WBH_FACILITY_NAME"), key: "facilityName", width: '140px', sortable: true },
      { label: t("WBH_QUANTITY_SENT"), key: "quantitySent", width: '120px', sortable: true },
      { label: t("WBH_TRANSACTION_TYPE"), key: "transactionType", width: '120px', sortable: true },
      { label: t("WBH_RECEIVER_ID"), key: "receiverId", width: '180px', sortable: true },
      { label: t("WBH_RECEIVER_FACILITY"), key: "transactingFacilityName", width: '180px', sortable: true }
    ];

    // Add dynamic boundary hierarchy columns (first 2 for stock view)
    const boundaryColumns = boundaryFields.slice(0, 2).map(field => ({
      key: `boundaryHierarchy.${field}`,
      label: t(getFieldLabel(field)),
      sortable: true,
      width: '140px'
    }));

    const endColumns = [
      { label: t("WBH_QUANTITY_RECEIVED"), key: "quantityReceived", width: '120px', sortable: true },
      { label: t("WBH_STOCK_ON_HAND"), key: "stockOnHand", width: '120px', sortable: true },
      { label: t("WBH_QUANTITY"), key: "quantity", width: '120px', sortable: true }
    ];

    return [...baseColumns, ...boundaryColumns, ...endColumns];
  }, [boundaryFields, t]);

  // Custom cell renderers for specific fields
  const customCellRenderer = useMemo(() => {
    const renderers = {
 
    transactionType: (row) => (
      <span style={{
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '500',
        backgroundColor: getTransactionTypeColor(row.transactionType).background,
        color: getTransactionTypeColor(row.transactionType).text
      }}>
        {row.transactionType}
      </span>
    ),
    transactionReason: (row) => (
      <span style={{
        fontSize: '12px',
        padding: '2px 6px',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px',
        border: '1px solid #e9ecef'
      }}>
        {row.transactionReason}
      </span>
    ),
   
    transactionDate: (row) => (
      <span style={{ fontSize: '14px' }}>
        {row.transactionDate !== 'N/A' ? row.transactionDate : '-'}
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



  // Helper function for transaction type colors
  const getTransactionTypeColor = (transactionType) => {
    switch (transactionType?.toUpperCase()) {
      case 'RECEIVED':
        return { background: '#d4edda', text: '#155724' };
      case 'ISSUE':
        return { background: '#f8d7da', text: '#721c24' };
      case 'DISPATCHED':
        return { background: '#fff3cd', text: '#856404' };
      case 'TRANSFER':
        return { background: '#d1ecf1', text: '#0c5460' };
      case 'LOSS':
        return { background: '#f5c6cb', text: '#721c24' };
      default:
        return { background: '#e2e3e5', text: '#383d41' };
    }
  };

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const stats = {
      totalTransactions: tableData.length,
      totalReceipts: tableData.filter(item => item.transactionType === 'RECEIPT').length,
      totalIssues: tableData.filter(item => item.transactionType === 'ISSUE').length,
      totalAdjustments: tableData.filter(item => item.transactionType === 'ADJUSTMENT').length,
      totalQuantityReceived: tableData
        .filter(item => item.transactionType === 'RECEIPT')
        .reduce((sum, item) => sum + item.quantity, 0),
      totalQuantityIssued: tableData
        .filter(item => item.transactionType === 'ISSUE')
        .reduce((sum, item) => sum + item.quantity, 0),
      uniqueProducts: new Set(tableData.map(item => item.productName).filter(name => name !== 'N/A')).size,
      uniqueFacilities: new Set(tableData.map(item => item.facilityName).filter(name => name !== 'N/A')).size
    };
    return stats;
  }, [tableData]);

  const isLoading = externalLoading || loading;

  // Prepare summary cards data  
  const summaryCards = useMemo(() => {
    if (!tableData || tableData.length === 0) return [];
    
    return [
      {
        key: 'receipts',
        value: summaryStats.totalReceipts.toLocaleString(),
        label: 'Receipts',
        subtitle: `+${summaryStats.totalQuantityReceived.toLocaleString()} qty`,
        valueColor: '#155724'
      },
      {
        key: 'issues', 
        value: summaryStats.totalIssues.toLocaleString(),
        label: 'Issues',
        subtitle: `-${summaryStats.totalQuantityIssued.toLocaleString()} qty`,
        valueColor: '#721c24'
      },
      {
        key: 'adjustments',
        value: summaryStats.totalAdjustments.toLocaleString(), 
        label: 'Adjustments',
        valueColor: '#856404'
      },
      {
        key: 'products',
        value: summaryStats.uniqueProducts,
        label: 'Products',
        valueColor: '#01579b'
      },
      {
        key: 'facilities',
        value: summaryStats.uniqueFacilities,
        label: 'Facilities', 
        valueColor: '#4a148c'
      }
    ];
  }, [summaryStats, tableData]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ElasticsearchDataHeader
        loading={isLoading}
        error={error}
        onRetry={refetch}
        data={tableData}
        metadata={metadata}
        progress={progress}
        title="Stock Transaction Records"
        errorMessage="Failed to load stock transaction data"
        // summaryCards={summaryCards}
        headerStyle={{
          background: '#f8f9fa'
        }}
        summaryCardsStyle={{
          backgroundColor: '#fafafa',
          padding: '16px 20px'
        }}
      />

      {/* Additional context info */}
      {!isLoading && !error && (
        <div style={{ padding: '12px 20px', fontSize: '14px', color: '#6b7280', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
            <span>
              {boundaryType && boundaryCode 
                ? `Filtered by ${boundaryType}: ${boundaryCode}` 
                : 'All stock transaction records'}
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

      {/* Table with Generic + Boundary Filtering */}
      <FullFilteredStockTable
        title=""
        data={tableData}
        columns={columns}
        isLoading={isLoading}
        noDataMessage="NO_STOCK_TRANSACTION_DATA"
        customCellRenderer={customCellRenderer}
        pagination={true}
        paginationPerPage={25}
        enableExcelDownload={false}
        paginationRowsPerPageOptions={[10, 25, 50, 100, 500, 1000]}
        className="stock-transaction-table"
        headerClassName="stock-transaction-header"
      />
    </div>
  );
};

// Create the date range filtered stock transaction component as the default export
const StockTransactionComponent = withDateRangeFilter(StockTransactionComponentBase, {
  showDateFilter: true,
  showPresets: true,
  persistDates: true,
  storageKey: 'stockTransactionComponentDateRange',
  defaultPreset: 'last30days',
  label: 'Stock Transaction Date Range Filter',
  filterPosition: 'top',
  containerStyle: {
    backgroundColor: '#e0f2fe',
    borderBottom: '2px solid #0288d1',
    padding: '16px 20px'
  },
  onDateRangeChange: (startDate, endDate) => {
    console.log('Stock transaction component date range changed:', { startDate, endDate });
  }
});

export default StockTransactionComponent;

// Also export the base component for cases where date filtering is not needed
export { StockTransactionComponentBase };