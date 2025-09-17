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


const UsersComponent = ({ 
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

    // Add user-specific filters
    // conditions.push({
    //   "term": {
    //     "Data.entityType.keyword": "USER"
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
    indexName: getKibanaDetails('projectStaffIndex') || 'project-staff-index-v1',
    query: elasticsearchQuery,
    sourceFields: [
    "Data.id",
    "Data.userId",
    "Data.userName",
    "Data.nameOfUser",
    "Data.role",
    "Data.projectType",
    "Data.projectTypeId",
    "Data.localityCode",
    "Data.boundaryHierarchy",
    "Data.isDeleted",
    "Data.createdBy",
    "Data.createdTime",
    "Data.projectId"
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
      
      return {

         employeeId: source.employeeId || source.id || `EMP-${index + 1}`,
         employeeName: source.employeeName || source.nameOfUser || "NA",
         userName: source.userName || "NA",
         userId: source.userId || "NA",
         role: (source?.role && t(source.role)) || "NA",
              projectType: source.projectType || "NA",
              localityCode: (source?.localityCode&&t(source.localityCode)) || "NA",
              status: (source.status !== undefined ? source.status : source.isDeleted) === false ? "ACTIVE" : "INACTIVE",
              country: source.country || source.boundaryHierarchy?.country || "NA",
              state: source.state || source.boundaryHierarchy?.state || "NA",
              lga: source.lga || source.boundaryHierarchy?.lga || "NA",
              ward: source.ward || source.boundaryHierarchy?.ward || "NA",
              healthFacility: source.healthFacility || source.boundaryHierarchy?.healthFacility || "NA",
              createdTime: source.createdTime ? (typeof source.createdTime === 'number' ? Digit.DateUtils.ConvertEpochToDate(source.createdTime) : source.createdTime) : "NA",
              createdBy: source.createdBy || "NA"
      };
    });
  }, [data]);

  // Define table columns
  const columns = [



     { label: t("EMPLOYEE_ID"), key: "employeeId" ,sortable: true},
    { label: t("EMPLOYEE_NAME"), key: "employeeName",sortable: true },
    { label: t("USER_NAME"), key: "userName" ,sortable: true},
    { label: t("ROLE"), key: "role" ,sortable: true},
    // { label: t("PROJECT_TYPE"), key: "projectType" },
    // { label: t("STATE"), key: "state" },
    // { label: t("LGA"), key: "lga" },
    // { label: t("WARD"), key: "ward" },
    // { label: t("HEALTH_FACILITY"), key: "healthFacility" },
    { label: t("LOCALITY_CODE"), key: "localityCode" ,sortable: true},
    { label: t("CREATED_TIME"), key: "createdTime" ,sortable: true},
    { label: t("STATUS"), key: "status" ,sortable: true},
    { label: t("VIEW_MAP"), key: "viewMap"},

  ];

  // Custom cell renderers for specific fields
  const customCellRenderer = {
    isActive: (row) => (
      <span style={{
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '500',
        backgroundColor: row.isActive === 'Active' ? '#d4edda' : row.isActive === 'Inactive' ? '#f8d7da' : '#e2e3e5',
        color: row.isActive === 'Active' ? '#155724' : row.isActive === 'Inactive' ? '#721c24' : '#383d41'
      }}>
        {row.isActive}
      </span>
    ),
    userType: (row) => (
      <span style={{
        padding: '4px 8px',
        borderRadius: '8px',
        fontSize: '12px',
        fontWeight: '500',
        backgroundColor: getUserTypeColor(row.userType).background,
        color: getUserTypeColor(row.userType).text
      }}>
        {row.userType}
      </span>
    ),
    mobileNumber: (row) => (
      <span style={{ 
        fontFamily: 'monospace',
        fontSize: '14px'
      }}>
        {row.mobileNumber !== 'N/A' ? row.mobileNumber : '-'}
      </span>
    ),
    email: (row) => (
      <span style={{ 
        fontSize: '14px',
        wordBreak: 'break-all'
      }}>
        {row.email !== 'N/A' ? row.email : '-'}
      </span>
    ),
    roles: (row) => (
      <div style={{ maxWidth: '200px' }}>
        {row.roles !== 'N/A' ? (
          <span style={{ 
            fontSize: '12px',
            background: '#f1f3f4',
            padding: '2px 6px',
            borderRadius: '4px',
            display: 'inline-block'
          }}>
            {row.roles}
          </span>
        ) : '-'}
      </div>
    )
  };

  // Helper function for user type colors
  const getUserTypeColor = (userType) => {
    switch (userType?.toUpperCase()) {
      case 'SUPERVISOR':
        return { background: '#e1f5fe', text: '#01579b' };
      case 'REGISTRAR':
        return { background: '#f3e5f5', text: '#4a148c' };
      case 'DISTRIBUTOR':
        return { background: '#fff3e0', text: '#e65100' };
      case 'FIELD_WORKER':
        return { background: '#e8f5e8', text: '#2e7d32' };
      case 'ADMIN':
        return { background: '#ffebee', text: '#c62828' };
      default:
        return { background: '#f5f5f5', text: '#424242' };
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
              👥 User Records
            </h3>
            <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
              {boundaryType && boundaryCode 
                ? `Filtered by ${boundaryType}: ${boundaryCode}` 
                : 'All user records'}
              {projectId && ` for Project: ${projectId}`}
            </p>
          </div>
          
          {metadata.totalRecords > 0 && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#7c3aed' }}>
                {metadata.totalRecords.toLocaleString()}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                of {metadata.totalAvailable.toLocaleString()} total
              </div>
              <div style={{ fontSize: '12px', color: '#059669', marginTop: '2px' }}>
                {tableData.filter(user => user.isActive === 'Active').length} active users
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
                Loading user data...
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
                backgroundColor: '#7c3aed',
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
          <div style={{ fontWeight: '600', marginBottom: '4px' }}>Failed to load user data</div>
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
          display: 'flex',
          gap: '12px',
          padding: '16px 20px',
          backgroundColor: '#fafafa',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <div style={{
            flex: 1,
            padding: '12px',
            backgroundColor: '#e8f5e8',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#2e7d32' }}>
              {tableData.filter(user => user.isActive === 'Active').length}
            </div>
            <div style={{ fontSize: '12px', color: '#555' }}>Active Users</div>
          </div>
          <div style={{
            flex: 1,
            padding: '12px',
            backgroundColor: '#ffebee',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#c62828' }}>
              {tableData.filter(user => user.isActive === 'Inactive').length}
            </div>
            <div style={{ fontSize: '12px', color: '#555' }}>Inactive Users</div>
          </div>
          <div style={{
            flex: 1,
            padding: '12px',
            backgroundColor: '#e1f5fe',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#01579b' }}>
              {new Set(tableData.map(user => user.userType).filter(type => type !== 'N/A')).size}
            </div>
            <div style={{ fontSize: '12px', color: '#555' }}>User Types</div>
          </div>
        </div>
      )}

      {/* Table */}
      <ReusableTableWrapper
        title=""
        data={tableData}
        columns={columns}
        isLoading={isLoading}
        noDataMessage="NO_USER_DATA"
        customCellRenderer={customCellRenderer}
        pagination={true}
        paginationPerPage={25}
        paginationRowsPerPageOptions={[10, 25, 50, 100, 500, 1000]}
        className="users-table"
        headerClassName="users-header"
         enableExcelDownload = {true}
  excelFileName = "staff_data"
  excelButtonText = "Download Excel"
      />
    </div>
  );
};

export default UsersComponent;