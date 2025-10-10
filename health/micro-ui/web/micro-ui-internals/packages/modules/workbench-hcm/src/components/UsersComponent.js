import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@egovernments/digit-ui-components";
import { SVG } from '@egovernments/digit-ui-react-components';
import useSimpleElasticsearchWithProxy from '../hooks/useSimpleElasticsearchWithProxy';
import ReusableTableWrapper from './ReusableTableWrapper';
import withBoundaryFilter from './withBoundaryFilter';
import withGenericFilter from './withGenericFilter';
import ElasticsearchDataHeader from './ElasticsearchDataHeader';
import { getKibanaDetails } from '../utils/getProjectServiceUrl';
import { discoverBoundaryFields } from '../utils/boundaryFilterUtils';
import DeliveryComponent from './DeliveryComponent';
import RegistrationComponent from './RegistrationComponent';

function toCamelCase(str) {
  return str
    .toLowerCase()
    .replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
}

/**
 * HOC Composition Order for Users Component (bottom to top):
 * 1. ReusableTableWrapper (base table)
 * 2. withGenericFilter (adds generic field filters)
 * 3. withBoundaryFilter (adds boundary filters)
 */

// Deliveries Popup Component
const DeliveriesPopup = ({ isOpen, onClose, rowData, userComponentProps }) => {
  const { t } = useTranslation();
  const [activeView, setActiveView] = useState('deliveries'); // 'deliveries' or 'registration'

  if (!isOpen) return null;

  const toggleView = (view) => {
    setActiveView(view);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '24px',
        maxWidth: '85vw',
        width: '85vw',
        maxHeight: '85vh',
        overflow: 'auto',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          borderBottom: '1px solid #e5e7eb',
          paddingBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h3 style={{ margin: 0, color: '#1f2937', fontSize: '18px', fontWeight: '600' }}>
              {activeView === 'deliveries' ? t('WBH_USER_DELIVERIES_OF') : t('WBH_USER_REGISTRATIONS_OF')} {rowData?.employeeName || rowData?.userName || 'User'}
            </h3>
            
            {/* Toggle Buttons */}
            <div style={{
              display: 'flex',
              backgroundColor: '#f3f4f6',
              borderRadius: '8px',
              padding: '4px'
            }}>
              <button
                onClick={() => toggleView('deliveries')}
                style={{
                  padding: '8px 16px',
                  backgroundColor: activeView === 'deliveries' ? '#3b82f6' : 'transparent',
                  color: activeView === 'deliveries' ? 'white' : '#6b7280',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                🚚 Deliveries
              </button>
              <button
                onClick={() => toggleView('registration')}
                style={{
                  padding: '8px 16px',
                  backgroundColor: activeView === 'registration' ? '#3b82f6' : 'transparent',
                  color: activeView === 'registration' ? 'white' : '#6b7280',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                📋 Registrations
              </button>
            </div>
          </div>
          
          <Button
            type="button"
            variation="secondary"
            label={<SVG.Close width="16" height="16" />}
            onClick={onClose}
            style={{
              minWidth: '32px',
              height: '32px',
              padding: '0'
            }}
          />
        </div>

        {/* Content */}
        <div style={{ minHeight: '200px' }}>
          <div style={{
            padding: '20px',
            textAlign: 'center',
            color: '#6b7280',
            fontSize: '14px'
          }}>
            {activeView === 'deliveries' ? (
              <DeliveryComponent 
                mapId="delivery-user-popup" 
                userName={rowData?.userName} 
                projectId={userComponentProps?.projectId} 
                boundaryType={userComponentProps?.boundaryType} 
                boundaryCode={userComponentProps?.boundaryCode} 
                loading={userComponentProps?.loading} 
              />
            ) : (
              <RegistrationComponent 
                mapId="registration-user-popup" 
                userName={rowData?.userName} 
                projectId={userComponentProps?.projectId} 
                boundaryType={userComponentProps?.boundaryType} 
                boundaryCode={userComponentProps?.boundaryCode} 
                loading={userComponentProps?.loading} 
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '20px',
          paddingTop: '16px',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>
            Showing {activeView === 'deliveries' ? 'delivery tasks' : 'household registrations'} for {rowData?.employeeName || rowData?.userName}
          </div>
          <Button
            type="button"
            variation="primary"
            label="Close"
            onClick={onClose}
          />
        </div>
      </div>
    </div>
  );
};

// Function to create filtered table
const createUsersFilteredTable = () => {
  // Step 1: Apply generic filters to the base table
  const GenericFilteredUsersTable = withGenericFilter(ReusableTableWrapper, {
    showFilters: true,
    showStats: false,
    showClearAll: true,
    autoApplyFilters: true,
    persistFilters: true,
    filterPosition: 'top',
    storageKey: 'usersGenericFilters',
    filterFields: ['role', 'status', 'employeeName', 'userName'],
    customLabels: {
      role: 'WBH_USER_FILTER_ROLE',
      status: 'WBH_USER_FILTER_STATUS',
      employeeName: 'WBH_USER_FILTER_EMPLOYEE_NAME',
      userName: 'WBH_USER_FILTER_USERNAME'
    },
    filterStyle: {
      backgroundColor: '#fef3c7',
      padding: '16px',
      borderRadius: '8px',
      marginBottom: '8px',
      border: '1px solid #fbbf24'
    },
    statsStyle: {
      backgroundColor: '#fef3c7',
      color: '#92400e',
      fontSize: '14px',
      fontWeight: '500'
    },
    onFiltersChange: (activeFilters, allFilters) => {
      console.log('Users generic filters changed:', activeFilters);
    },
    onDataFiltered: (filteredData, filters) => {
      console.log(`Users generic filtered: ${filteredData.length} records with filters:`, filters);
    }
  });
  
  const FullFilteredUsersTable = withBoundaryFilter(GenericFilteredUsersTable, {
    showFilters: false,
    showStats: false,
    showClearAll: true,
    autoApplyFilters: true,
    persistFilters: true,
    filterPosition: 'top',
    storageKey: 'usersBoundaryFilters',
    customLabels: {
      country: 'WBH_BOUNDARY_COUNTRY',
      state: 'WBH_BOUNDARY_STATE',
      lga: 'WBH_BOUNDARY_LGA',
      ward: 'WBH_BOUNDARY_WARD',
      healthFacility: 'WBH_BOUNDARY_HEALTH_FACILITY'
    },
    filterStyle: {
      backgroundColor: '#f0f9ff',
      padding: '16px',
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
      console.log('Users boundary filters changed:', activeFilters);
    },
    onDataFiltered: (filteredData, filters) => {
      console.log(`Users boundary filtered: ${filteredData.length} records with filters:`, filters);
    }
  });
  
  return FullFilteredUsersTable;
};

const UsersComponent = ({ 
  projectId, 
  boundaryType, 
  boundaryCode, 
  loading: externalLoading = false 
}) => {
  const { t } = useTranslation();
  
  // Create the filtered table component
  const FullFilteredUsersTable = useMemo(() => {
    return createUsersFilteredTable();
  }, []);
  
  // State for deliveries popup
  const [isDeliveriesPopupOpen, setIsDeliveriesPopupOpen] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState(null);

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
  } = useSimpleElasticsearchWithProxy({
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

  // Functions to handle popup
  const handleViewDeliveries = (rowData) => {
    const userComponentProps = {
      projectId,
      boundaryType,
      boundaryCode,
      loading: externalLoading
    };
    
    setSelectedUserData({ rowData, userComponentProps });
    setIsDeliveriesPopupOpen(true);
  };

  const handleCloseDeliveriesPopup = () => {
    setIsDeliveriesPopupOpen(false);
    setSelectedUserData(null);
  };

  // Define table columns with dynamic boundary columns
  const columns = useMemo(() => {
    const baseColumns = [
      { label: t('WBH_USER_VIEW_DELIVERIES'), key: "viewDeliveries", sortable: false, width: "140px" },
      { label: t('WBH_USER_EMPLOYEE_ID'), key: "employeeId", sortable: true },
      { label: t('WBH_USER_EMPLOYEE_NAME'), key: "employeeName", sortable: true },
      { label: t('WBH_USER_USER_NAME'), key: "userName", sortable: true },
      { label: t('WBH_USER_ROLE'), key: "role", sortable: true }
    ];

    // Add dynamic boundary hierarchy columns (limited for users view)
    const boundaryColumns = boundaryFields.slice(0, 3).map(field => ({
      key: `boundaryHierarchy.${field}`,
      label: t(getFieldLabel(field)),
      sortable: true,
      width: '140px'
    }));

    const endColumns = [
      { label: t('WBH_USER_LOCALITY_CODE'), key: "localityCode", sortable: true },
      { label: t('WBH_USER_STATUS'), key: "status", sortable: true },
      { label: t('WBH_USER_CREATED_TIME'), key: "createdTime", sortable: true }
    ];

    return [...baseColumns, ...boundaryColumns, ...endColumns];
  }, [boundaryFields, t]);

  // Custom cell renderers for specific fields
  const customCellRenderer = useMemo(() => {
    const renderers = {
    viewDeliveries: (row) => (
      <Button
        type="button"
        variation="primary"
        label={
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <SVG.Visibility width="14" height="14" />
            {t('WBH_USER_VIEW')}
          </div>
        }
        onClick={() => handleViewDeliveries(row)}
        style={{
          fontSize: '13px',
          padding: '6px 12px',
          minWidth: '100px'
        }}
      />
    ),
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
  }, [boundaryFields, handleViewDeliveries]);

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
        // summaryCards={summaryCards}
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



      {/* Table with Generic + Boundary Filtering */}
      <FullFilteredUsersTable
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
        enableExcelDownload={false}
        excelFileName="staff_data"
        excelButtonText="Download Excel"
      />

      {/* Deliveries Popup */}
      <DeliveriesPopup 
        isOpen={isDeliveriesPopupOpen}
        onClose={handleCloseDeliveriesPopup}
        rowData={selectedUserData?.rowData}
        userComponentProps={selectedUserData?.userComponentProps}
      />
    </div>
  );
};

export default UsersComponent;