import React, { useState, useMemo } from 'react';
import BoundaryFilterComponent from './BoundaryFilterComponent';
import ReusableTableWrapper from './ReusableTableWrapper';

/**
 * Example component demonstrating how to use BoundaryFilterComponent
 * with ReusableTableWrapper
 */
const BoundaryFilterExample = () => {
  const [activeFilters, setActiveFilters] = useState({});

  // Sample data with boundaryHierarchy - replace this with your actual data
  const sampleData = [
    {
      id: 1,
      name: 'John Doe',
      role: 'Health Worker',
      boundaryHierarchy: {
        country: 'NIGERIA',
        state: 'ONDO',
        lga: 'AKOKO NORTH WEST', 
        ward: 'AJOWA/IGASI/GEDEGEDE',
        healthFacility: 'OLURO PALACE (AJOWA/IGASI/GEDEGEDE)'
      }
    },
    {
      id: 2,
      name: 'Jane Smith',
      role: 'Supervisor',
      boundaryHierarchy: {
        country: 'NIGERIA',
        state: 'ONDO', 
        lga: 'AKOKO NORTH EAST',
        ward: 'IKARE I',
        healthFacility: 'IKARE GENERAL HOSPITAL'
      }
    },
    {
      id: 3,
      name: 'Bob Johnson',
      role: 'Field Worker',
      boundaryHierarchy: {
        country: 'NIGERIA',
        state: 'LAGOS',
        lga: 'LAGOS ISLAND',
        ward: 'ISALE EKO',
        healthFacility: 'LAGOS UNIVERSITY TEACHING HOSPITAL'
      }
    },
    {
      id: 4,
      name: 'Alice Brown',
      role: 'Registrar',
      boundaryHierarchy: {
        country: 'NIGERIA',
        state: 'ONDO',
        lga: 'AKOKO NORTH WEST',
        ward: 'OKEAGBE/AKUNU',
        healthFacility: 'OKEAGBE PRIMARY HEALTH CENTER'
      }
    },
    {
      id: 5,
      name: 'David Wilson',
      role: 'Admin',
      boundaryHierarchy: {
        country: 'NIGERIA',
        state: 'LAGOS',
        lga: 'SURULERE',
        ward: 'COKER/AGUDA',
        healthFacility: 'RANDLE GENERAL HOSPITAL'
      }
    }
  ];

  // Apply filters to data
  const filteredData = useMemo(() => {
    if (!activeFilters || Object.keys(activeFilters).length === 0) {
      return sampleData;
    }

    return sampleData.filter(item => {
      const boundary = item.boundaryHierarchy;
      if (!boundary) return false;

      // Check each active filter
      for (const [filterType, filterValue] of Object.entries(activeFilters)) {
        if (filterValue && boundary[filterType] !== filterValue) {
          return false;
        }
      }
      
      return true;
    });
  }, [activeFilters]);

  // Handle filter changes
  const handleFiltersChange = (activeFilters, allFilters) => {
    setActiveFilters(activeFilters);
    console.log('Active filters:', activeFilters);
    console.log('All filters:', allFilters);
  };

  // Table columns
  const columns = [
    { key: 'id', label: 'ID', sortable: true, width: '80px' },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    { 
      key: 'boundaryHierarchy.country', 
      label: 'Country', 
      sortable: true,
      width: '120px'
    },
    { 
      key: 'boundaryHierarchy.state', 
      label: 'State', 
      sortable: true,
      width: '120px' 
    },
    { 
      key: 'boundaryHierarchy.lga', 
      label: 'LGA', 
      sortable: true,
      width: '150px'
    },
    { 
      key: 'boundaryHierarchy.ward', 
      label: 'Ward', 
      sortable: true,
      width: '180px'
    },
    { 
      key: 'boundaryHierarchy.healthFacility', 
      label: 'Health Facility', 
      sortable: true,
      width: '250px'
    }
  ];

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {/* Boundary Filter Component */}
      <BoundaryFilterComponent
        data={sampleData}
        onFiltersChange={handleFiltersChange}
        showClearAll={true}
        customLabels={{
          lga: 'Local Government Area',
          healthFacility: 'Health Facility'
        }}
      />

      {/* Summary info */}
      {Object.keys(activeFilters).length > 0 && (
        <div style={{
          padding: '12px 20px',
          backgroundColor: '#eff6ff',
          borderBottom: '1px solid #e5e7eb',
          fontSize: '14px',
          color: '#1e40af'
        }}>
          <strong>Applied Filters:</strong> {
            Object.entries(activeFilters)
              .map(([key, value]) => `${key}: ${value}`)
              .join(' • ')
          } | Showing {filteredData.length} of {sampleData.length} records
        </div>
      )}

      {/* Data Table */}
      <ReusableTableWrapper
        title=""
        data={filteredData}
        columns={columns}
        pagination={true}
        paginationPerPage={10}
        enableExcelDownload={true}
        excelFileName="boundary_filtered_data"
        excelButtonText="Download Filtered Data"
        noDataMessage={
          Object.keys(activeFilters).length > 0 
            ? "No records match the selected filters"
            : "No data available"
        }
      />
    </div>
  );
};

export default BoundaryFilterExample;