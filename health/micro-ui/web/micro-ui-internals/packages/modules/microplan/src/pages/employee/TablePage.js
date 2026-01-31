import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { tableCustomStyle } from '../../components/tableCustomStyle';
// import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const SimpleCheckbox = () => {
  // State to keep track of whether the checkbox is checked or not
  const [isChecked, setIsChecked] = useState(false);

  // Function to handle checkbox change
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked); // Toggle the checked state
  };

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange} // Toggle the checkbox on change
        />
        {isChecked ? 'Checked' : 'Unchecked'} {/* Text to indicate checkbox state */}
      </label>
    </div>
  );
};



const columns = [
	{
		name: 'First Name',
		selector: row => row.first_name,
		sortable: true,
	},
	{
		name: 'Last Name',
		selector: row => row.last_name,
		sortable: true,
	},
	{
		name: 'Email',
		selector: row => row.email,
		sortable: true,
	},
  {
    name: 'Comment Logs',
    cell: row => <a onClick={()=>{console.log(row)}} href="#">View Logs</a>,
  },
];

const TableNew = () => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [totalRows, setTotalRows] = useState(0);
	const [perPage, setPerPage] = useState(10);
	const { t } = useTranslation();

	const fetchUsers = async page => {
		setLoading(true);

		const response = await axios.get(`https://reqres.in/api/users?page=${page}&per_page=${perPage}&delay=1`);

		setData(response.data.data);
		setTotalRows(response.data.total);
		setLoading(false);
	};

	const handlePageChange = page => {
		fetchUsers(page);
	};

  const handleRowSelect = (arg) => {
    
  }

	const handlePerRowsChange = async (newPerPage, page) => {
		setLoading(true);

		const response = await axios.get(`https://reqres.in/api/users?page=${page}&per_page=${newPerPage}&delay=1`);

		setData(response.data.data);
		setPerPage(newPerPage);
		setLoading(false);
	};

	useEffect(() => {
		fetchUsers(1);
		
	}, []);

	return (
		<DataTable
			title="Users"
			columns={columns}
			data={data}
			progressPending={loading}
			pagination
			paginationServer
			paginationTotalRows={totalRows}
			selectableRows
      selectableRowsHighlight
			onChangeRowsPerPage={handlePerRowsChange}
			onChangePage={handlePageChange}
      noContextMenu
      onSelectedRowsChange={handleRowSelect}
	  customStyles={tableCustomStyle}
      // selectableRowsComponent={SimpleCheckbox}
	  paginationComponentOptions={{ rowsPerPageText:t("ROWS_PER_PAGE") }}
		/>
	);
};

export default TableNew