import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import useSimpleElasticsearch from '../hooks/useSimpleElasticsearch';
import ReusableTableWrapper from './ReusableTableWrapper';
import withBoundaryFilter from './withBoundaryFilter';
import ElasticsearchDataHeader from './ElasticsearchDataHeader';
import { getKibanaDetails } from '../utils/getProjectServiceUrl';
import { discoverBoundaryFields } from '../utils/boundaryFilterUtils';

function toCamelCase(str) {
  return str
    .toLowerCase()
    .replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
}

// Create MinimalFilteredTable for users data - clean and simple
const MinimalFilteredTable = withBoundaryFilter(ReusableTableWrapper, {
  showFilters: true,
  showStats: false, // Hide stats for cleaner look
  showClearAll: false, // Hide clear all button
  autoApplyFilters: true,
  persistFilters: false, // Don't persist filters
  filterPosition: 'top',
  customLabels: {
    state: 'State',
    lga: 'LGA',
    ward: 'Ward',
    healthFacility: 'Health Facility'
  },
  filterStyle: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    padding: '12px 16px',
    marginBottom: '8px'
  },
  onFiltersChange: (activeFilters) => {
    console.log('Users minimal filters changed:', activeFilters);
  }
});


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
            
              healthFacility: source.healthFacility || source.boundaryHierarchy?.healthFacility || "NA",
              createdTime: source.createdTime ? (typeof source.createdTime === 'number' ? Digit.DateUtils.ConvertEpochToDate(source.createdTime) : source.createdTime) : "NA",
              createdBy: source.createdBy || "NA",
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
      { label: t("EMPLOYEE_ID"), key: "employeeId", sortable: true },
      { label: t("EMPLOYEE_NAME"), key: "employeeName", sortable: true },
      { label: t("USER_NAME"), key: "userName", sortable: true },
      { label: t("ROLE"), key: "role", sortable: true }
    ];

    // Add dynamic boundary hierarchy columns (limited for users view)
    const boundaryColumns = boundaryFields.slice(0, 3).map(field => ({
      key: `boundaryHierarchy.${field}`,
      label: t(getFieldLabel(field)),
      sortable: true,
      width: '140px'
    }));

    const endColumns = [
      { label: t("LOCALITY_CODE"), key: "localityCode", sortable: true },
      { label: t("STATUS"), key: "status", sortable: true },
      { label: t("CREATED_TIME"), key: "createdTime", sortable: true }
    ];

    return [...baseColumns, ...boundaryColumns, ...endColumns];
  }, [boundaryFields, t]);

  // Custom cell renderers for specific fields
  const customCellRenderer = useMemo(() => {
    const renderers = {
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

  // Calculate active users count
  const activeUsersCount = useMemo(() => {
    return tableData ? tableData.filter(user => user.isActive === 'Active').length : 0;
  }, [tableData]);

  // Prepare summary cards data
  const summaryCards = useMemo(() => {
    if (!metadata.totalRecords || metadata.totalRecords === 0) return [];
    
    return [
      {
        key: 'totalUsers',
        value: metadata.totalRecords.toLocaleString(),
        label: 'Total Users',
        subtitle: `of ${metadata.totalAvailable.toLocaleString()} total`,
        valueColor: '#7c3aed'
      },
      {
        key: 'activeUsers',
        value: activeUsersCount.toLocaleString(),
        label: 'Active Users',
        subtitle: `${Math.round((activeUsersCount / tableData.length) * 100)}% active`,
        valueColor: '#059669'
      }
    ];
  }, [metadata, activeUsersCount, tableData]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ElasticsearchDataHeader
        loading={isLoading}
        error={error}
        onRetry={refetch}
        data={tableData}
        metadata={metadata}
        progress={progress}
        title="User Records"
        errorMessage="Failed to load user data"
        summaryCards={summaryCards}
        headerStyle={{
          background: '#f8f9fa'
        }}
      />

      {/* Additional context info */}
      {!isLoading && !error && (
        <div style={{ padding: '12px 20px', fontSize: '14px', color: '#6b7280', borderBottom: '1px solid #e5e7eb' }}>
          {boundaryType && boundaryCode 
            ? `Filtered by ${boundaryType}: ${t(boundaryCode)}` 
            : 'All user records'}
        </div>
      )}



      {/* Table with Minimal Boundary Filtering */}
      <MinimalFilteredTable
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