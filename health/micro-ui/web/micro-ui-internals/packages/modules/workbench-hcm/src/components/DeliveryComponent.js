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

const DeliveryComponent = ({ 
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
  "Data.userId"
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
        syncedTime: source.syncedTime ? new Date(source.syncedTime).toLocaleString() : 'N/A',
        administrativeArea: source.additionalDetails?.administrativeArea || 'N/A',
        deliveryStatus: source.status || 'N/A',
        latitude: geoPoint[1] || geoPoint.lat || 'N/A',
        longitude: geoPoint[0] || geoPoint.lon || 'N/A',
        createdTime: source.auditDetails?.createdTime 
          ? new Date(source.auditDetails.createdTime).toLocaleString() 
          : 'N/A',
        lastModifiedTime: source.auditDetails?.lastModifiedTime 
          ? new Date(source.auditDetails.lastModifiedTime).toLocaleString() 
          : 'N/A'
      };
    });
  }, [data]);

  // Define table columns
  const columns = [
    { key: 'deliveredBy', label: t('DELIVERED_BY'), sortable: true },
    { key: 'quantity', label: t('QUANTITY'), sortable: true },
    { key: 'memberCount', label: t('MEMBER_COUNT'), sortable: true },
    { key: 'deliveryStatus', label: t('DELIVERY_STATUS'), sortable: true },
    { key: 'deliveryDate', label: t('DELIVERY_DATE'), sortable: true },
    { key: 'latitude', label: t('LATITUDE'), sortable: false },
    { key: 'longitude', label: t('LONGITUDE'), sortable: false },
    { key: 'productName', label: t('PRODUCT_NAME'), sortable: true },
    { key: 'administrativeArea', label: t('ADMINISTRATIVE_AREA'), sortable: true },
    { key: 'syncedTime', label: t('SYNCED_TIME'), sortable: true }

  ];

  // Custom cell renderers for specific fields
  const customCellRenderer = {
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
               Delivery Records
            </h3>
            <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
              {boundaryType && boundaryCode 
                ? `Filtered by ${boundaryType}: ${t(boundaryCode)}` 
                : 'All delivery records'}
              {/* {projectId && ` for Project: ${projectId}`} */}
            </p>
          </div>
          
          {metadata.totalRecords > 0 && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669' }}>
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
                Loading delivery data...
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
                backgroundColor: '#059669',
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
          <div style={{ fontWeight: '600', marginBottom: '4px' }}>Failed to load delivery data</div>
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

      {/* Table */}
      <ReusableTableWrapper
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
        enableExcelDownload = {true}
  excelFileName = "delivery_data"
  excelButtonText = "Download Excel"

      />
    </div>
  );
};

export default DeliveryComponent;