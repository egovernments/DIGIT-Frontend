import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import useSimpleElasticsearch from '../hooks/useSimpleElasticsearch';
import ReusableTableWrapper from './ReusableTableWrapper';
import { getKibanaDetails } from '../utils/getProjectServiceUrl';

function toCamelCase(str) {
  return str
    .toLowerCase()
    .replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
}

const StockTransactionComponent = ({ 
  projectId, 
  boundaryType, 
  boundaryCode, 
  loading: externalLoading = false 
}) => {
  const { t } = useTranslation();

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
  }, [projectId, boundaryType, boundaryCode]);

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
  "Data.createdBy"
    ],
    maxRecordLimit: 100000,
    maxBatchSize: 5000,
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
       
      };
    });
  }, [data]);

  // Define table columns
  const columns = [

 { label: t("WBH_STOCK_ID"), key: "id", },
        { label: t("WBH_SENDER_ID"), key: "senderId",width: '180px'},
        { label: t("WBH_FACILITY_NAME"), key: "facilityName", width: '100px' },

            { label: t("WBH_QUANTITY_SENT"), key: "quantitySent",width: '120px' },
{ label: t("WBH_TRANSACTION_TYPE"), key: "transactionType", width: '120px'},
    { label: t("WBH_RECEIVER_ID"), key: "receiverId",  width: '180px'},
    { label: t("WBH_TRANS_FACILITY_NAME"), key: "transactingFacilityName", width: '100px'  },
    { label: t("WBH_QUANTITY_RECEIVED"), key: "quantityReceived", width: '120px' },
        { label: t("WBH_STOCK_ON_HAND"), key: "stockOnHand", width: '120px' ,},

    { label: t("WBH_QUANTITY"), key: "quantity", width: '120px' },
    { label: t("WBH_MATERIAL_NOTE_NUMBER"), key: "materialNoteNumber" },
    { label: t("WBH_BATCH_NUMBER"), key: "batchNumber", },
    { label: t("WBH_TRANSACTION_TYPE"), key: "transactionType" },
    { label: t("WBH_WAY_BILL_NUMBER"), key: "wayBillNumber" },
    // { label: t("WBH_SENDER_TYPE"), key: "senderType" },
    // { label: t("WBH_RECEIVER_TYPE"), key: "receiverType" },
    { label: t("HCM_ADMIN_CONSOLE_USER_ID"), key: "createdBy" },
    { label: t("WBH_TRANSACTION_DATE"), key: "createdTime" },
    { label: t("WBH_DISTRIBUTOR_NAME"), key: "distributorName" },


  ];

  // Custom cell renderers for specific fields
  const customCellRenderer = {
 
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

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {/* Header with summary info */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid #e5e7eb',
        background: '#f8f9fa'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, color: '#374151', fontSize: '18px' }}>
              Stock Transaction Records
            </h3>
            <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
              {boundaryType && boundaryCode 
                ? `Filtered by ${boundaryType}: ${boundaryCode}` 
                : 'All stock transaction records'}
            </p>
          </div>
          
          {metadata.totalRecords > 0 && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626' }}>
                {metadata.totalRecords.toLocaleString()}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                of {metadata.totalAvailable.toLocaleString()} total
              </div>
            </div>
          )}
        </div>

        {/* Progress indicator while loading */}
        {isLoading && (
          <div style={{ marginTop: '12px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '4px'
            }}>
              <span style={{ fontSize: '14px', color: '#374151' }}>
                Loading stock transaction data...
              </span>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>
                {progress.progress.toFixed(1)}%
              </span>
            </div>
            <div style={{
              width: '100%',
              height: '6px',
              backgroundColor: '#e5e7eb',
              borderRadius: '3px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${progress.progress}%`,
                height: '100%',
                backgroundColor: '#dc2626',
                transition: 'width 0.3s ease'
              }} />
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
              {progress.batchesCompleted}/{progress.totalBatches} batches • {progress.recordsReceived.toLocaleString()} records
            </div>
          </div>
        )}
      </div>

      {/* Error display */}
      {error && (
        <div style={{
          margin: '20px',
          padding: '16px',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          color: '#b91c1c'
        }}>
          <div style={{ fontWeight: '600', marginBottom: '4px' }}>Failed to load stock transaction data</div>
          <div style={{ fontSize: '14px' }}>{error}</div>
          <button
            onClick={refetch}
            style={{
              marginTop: '8px',
              padding: '6px 12px',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Summary cards */}
      {!isLoading && !error && tableData.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
          padding: '16px 20px',
          backgroundColor: '#fafafa',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <div style={{
            padding: '12px',
            backgroundColor: '#d4edda',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#155724' }}>
              {summaryStats.totalReceipts.toLocaleString()}
            </div>
            <div style={{ fontSize: '11px', color: '#155724' }}>Receipts</div>
            <div style={{ fontSize: '10px', color: '#6c757d', marginTop: '2px' }}>
              +{summaryStats.totalQuantityReceived.toLocaleString()} qty
            </div>
          </div>
          
          <div style={{
            padding: '12px',
            backgroundColor: '#f8d7da',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#721c24' }}>
              {summaryStats.totalIssues.toLocaleString()}
            </div>
            <div style={{ fontSize: '11px', color: '#721c24' }}>Issues</div>
            <div style={{ fontSize: '10px', color: '#6c757d', marginTop: '2px' }}>
              -{summaryStats.totalQuantityIssued.toLocaleString()} qty
            </div>
          </div>
          
          <div style={{
            padding: '12px',
            backgroundColor: '#fff3cd',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#856404' }}>
              {summaryStats.totalAdjustments.toLocaleString()}
            </div>
            <div style={{ fontSize: '11px', color: '#856404' }}>Adjustments</div>
          </div>
          
          <div style={{
            padding: '12px',
            backgroundColor: '#e1f5fe',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#01579b' }}>
              {summaryStats.uniqueProducts}
            </div>
            <div style={{ fontSize: '11px', color: '#01579b' }}>Products</div>
          </div>
          
          <div style={{
            padding: '12px',
            backgroundColor: '#f3e5f5',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#4a148c' }}>
              {summaryStats.uniqueFacilities}
            </div>
            <div style={{ fontSize: '11px', color: '#4a148c' }}>Facilities</div>
          </div>
        </div>
      )}

      {/* Table */}
      <ReusableTableWrapper
        title=""
        data={tableData}
        columns={columns}
        isLoading={isLoading}
        noDataMessage="NO_STOCK_TRANSACTION_DATA"
        customCellRenderer={customCellRenderer}
        pagination={true}
        paginationPerPage={25}
        paginationRowsPerPageOptions={[10, 25, 50, 100, 500, 1000]}
        className="stock-transaction-table"
        headerClassName="stock-transaction-header"
      />
    </div>
  );
};

export default StockTransactionComponent;