import React from 'react';
import ReusableTableWrapper from './ReusableTableWrapper';

const ExampleTableWithExcel = () => {
  // Sample data
  const sampleData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active', age: 30 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive', age: 25 },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'active', age: 35 },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', status: 'active', age: 28 },
  ];

  // Table columns configuration
  const columns = [
    { 
      key: 'id', 
      label: 'ID', 
      sortable: true,
      width: '80px'
    },
    { 
      key: 'name', 
      label: 'Full Name', 
      sortable: true 
    },
    { 
      key: 'email', 
      label: 'Email Address', 
      sortable: true 
    },
    { 
      key: 'status', 
      label: 'Status', 
      sortable: true,
      width: '120px'
    },
    { 
      key: 'age', 
      label: 'Age', 
      sortable: true,
      width: '80px'
    }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <ReusableTableWrapper
        title="Sample Users Table"
        data={sampleData}
        columns={columns}
        pagination={true}
        paginationPerPage={10}
        // Excel download props
        enableExcelDownload={true}
        excelFileName="users_data"
        excelButtonText="Download Users Excel"
      />
    </div>
  );
};

export default ExampleTableWithExcel;