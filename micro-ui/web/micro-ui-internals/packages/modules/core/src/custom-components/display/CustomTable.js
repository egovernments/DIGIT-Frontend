import React from 'react';
import { Table } from '@egovernments/digit-ui-components';

const CustomTable = (props) => {
  const {
    t,
    data,
    columns,
    className,
    style,
    loading,
    emptyMessage,
    ...rest
  } = props;

  // Transform legacy column format to new format if needed
  const transformedColumns = columns?.map(col => ({
    key: col.key || col.Header?.toLowerCase()?.replace(/\s+/g, '_'),
    header: col.Header || col.header,
    accessor: col.accessor || col.key,
    Cell: col.Cell,
    sortable: col.sortable !== false,
    ...col
  })) || [];

  return (
    <div className={`custom-table-wrapper ${className || ''}`} style={style}>
      <Table
        data={data || []}
        columns={transformedColumns}
        loading={loading}
        emptyMessage={emptyMessage || (t ? t('NO_DATA') : 'No data available')}
        {...rest}
      />
    </div>
  );
};

export default CustomTable;