import React from 'react';
import { Table } from '@egovernments/digit-ui-react-components';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
const Sample = () => {
  // Mock columns definition
  const { t } = useTranslation();
  const columns = [
    { Header: 'Name', accessor: 'name' },
    { Header: 'Age', accessor: 'age' },
    { Header: 'Country', accessor: 'country' },
  ];

  const data = [
    { name: 'John', age: 28, country: 'USA' },
    { name: 'Jane', age: 22, country: 'Canada' },
    { name: 'Paul', age: 36, country: 'UK' },
  ];

  // Example of other necessary arguments
  const currentPage = 0;
  const pageSizeLimit = 2; // 2 rows per page
  const totalRecords = data.length;
  const onNextPage = () => console.log("Next page clicked");
  const onPrevPage = () => console.log("Previous page clicked");
  const onSort = (sortBy) => console.log("Sorting by", sortBy);

  return (
    <Table
            columns={columns} data={data}
            getCellProps={(cellInfo) => {
              return {
                style: {
                  padding: "20px 18px",
                  fontSize: "16px",
                  whiteSpace: "normal",
                },
              };
            }}
            t={t}
          />
  );
};

export default Sample;