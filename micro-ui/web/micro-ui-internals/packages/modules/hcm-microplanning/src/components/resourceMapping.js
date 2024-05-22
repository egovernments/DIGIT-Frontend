import { Dropdown } from "@egovernments/digit-ui-components";
import { Table } from "@egovernments/digit-ui-react-components";
import { PaginationFirst, PaginationLast, PaginationNext, PaginationPrevious } from "@egovernments/digit-ui-svg-components";
import React, { useState, useEffect, useMemo } from "react";

export const SpatialDataPropertyMapping = ({ uploadedData, resourceMapping, setResourceMapping, schema, setToast, hierarchy, t }) => {
  // If no data is uploaded, display a message
  if (!uploadedData) return <div className="spatial-data-property-mapping"> No Data To Map</div>;

  // State variables
  const [userColumns, setUserColumns] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [templateColumns, setTemplateColumns] = useState([]);

  // Calculate total pages for pagination
  const totalPages = Math.ceil(templateColumns.length / itemsPerPage);

  // Slice data for pagination
  const paginatedData = templateColumns.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  // Handle page click in pagination
  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(0);
  };

  // Fetch template columns when schema changes
  useEffect(() => {
    if (!schema || !schema["schema"] || !schema.schema["Properties"])
      return setToast({ state: "error", message: t("ERROR_VALIDATION_SCHEMA_ABSENT") });

    const columns = Object.keys(schema.schema["Properties"]);
    if (columns) setTemplateColumns([...hierarchy, ...columns]);
  }, [schema]);

  // Update user columns when uploaded data changes
  useEffect(() => {
    let userUploadedColumns = new Set();
    uploadedData?.["features"]?.forEach((item) => {
      Object.keys(item["properties"]).forEach((key) => userUploadedColumns.add(key));
    });
    setUserColumns((preUserColumns) => [...preUserColumns, ...userUploadedColumns]);
  }, [uploadedData]);

  // Dropdown component for selecting user columns
  const DropDownUserColumnSelect = ({ id }) => {
    console.log(userColumns)
    const [selectedOption, setSelectedOption] = useState("");
    useEffect(() => {
      const obj = resourceMapping.find((item) => item["mappedTo"] == id);
      if (obj) setSelectedOption({ code: obj["mappedFrom"] });
      else setSelectedOption({});
    }, [id, resourceMapping]);

    const handleSelectChange = (event) => {
      console.log(event);
      const newValue = event.code;
      setSelectedOption(event);
      setResourceMapping((previous) => {
        const revisedData = previous.filter((item) => !(item["mappedTo"] === id || item["mappedFrom"] === newValue));
        return [...revisedData, { mappedTo: id, mappedFrom: newValue }];
      });
    };
    return (
      <Dropdown
        variant="select-dropdown"
        t={t}
        isMandatory={false}
        option={userColumns?.map((item) => ({ code: item }))}
        selected={selectedOption}
        optionKey="code"
        select={handleSelectChange}
        style={{ width: "100%", backgroundColor: "rgb(0,0,0,0)" }}
      />
      // <div></div>
    );
  };

  const tableColumns = useMemo(
    () => [
      {
        Header: t("COLUMNS_IN_TEMPLATE"),
        accessor: "COLUMNS_IN_TEMPLATE",
      },
      {
        Header: t("COLUMNS_IN_USER_UPLOAD"),
        accessor: "COLUMNS_IN_USER_UPLOAD",
        Cell: ({ cell: { value } }) => <DropDownUserColumnSelect key={value} id={value} />,
      },
    ],
    [userColumns]
  );
  const data = useMemo(()=>templateColumns.map(item=>({COLUMNS_IN_TEMPLATE:item,COLUMNS_IN_USER_UPLOAD:item})),[templateColumns])
  return (
    <div className="spatial-data-property-mapping">
      <Table
        customTableWrapperClassName="table-waper"
        t={t}
        disableSort={true}
        autoSort={false}
        manualPagination={false}
        isPaginationRequired={true}
        data={data}
        columns={tableColumns}
        getCellProps={(cellInfo) => {
          return { style: {} };
        }}
        getHeaderProps={(cellInfo) => {
          return { style: {} };
        }}
      />
    </div>
  );
};
