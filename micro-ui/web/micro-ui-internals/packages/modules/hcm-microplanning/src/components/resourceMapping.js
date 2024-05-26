import { Dropdown } from "@egovernments/digit-ui-components";
import { Table } from "@egovernments/digit-ui-react-components";
import { PaginationFirst, PaginationLast, PaginationNext, PaginationPrevious } from "@egovernments/digit-ui-svg-components";
import React, { useState, useEffect, useMemo, useRef } from "react";

export const SpatialDataPropertyMapping = ({ uploadedData, resourceMapping, setResourceMapping, schema, setToast, hierarchy, t }) => {
  // If no data is uploaded, display a message
  if (!uploadedData) return <div className="spatial-data-property-mapping"> {t("NO_DATA_TO_DO_MAPPING")}</div>;

  const itemRefs = useRef([]);
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    // Scroll to the expanded item's child element after the state has updated and the DOM has re-rendered
    if (expandedIndex !== null && itemRefs.current[expandedIndex]) {
      // Use a timeout to ensure the DOM has updated
      setTimeout(() => {
        try {
          const childElement = itemRefs.current[expandedIndex].children[0]; // Assuming child content is the second child
          if (childElement) {
            childElement.scrollIntoView({ behavior: "smooth" });
          }
        } catch (error) {}
      }, 0);
    }
    return () => {};
  }, [expandedIndex]);

  // State variables
  const [userColumns, setUserColumns] = useState([]);
  const [templateColumns, setTemplateColumns] = useState([]);

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
  const DropDownUserColumnSelect = ({ id, index }) => {
    const [selectedOption, setSelectedOption] = useState("");
    useEffect(() => {
      const obj = resourceMapping.find((item) => item["mappedTo"] == id);
      if (obj) setSelectedOption({ code: obj["mappedFrom"] });
      else setSelectedOption();
    }, [id, resourceMapping]);

    const handleSelectChange = (event) => {
      const newValue = event.code;
      setSelectedOption(event);
      setResourceMapping((previous) => {
        const revisedData = previous.filter((item) => !(item["mappedTo"] === id || item["mappedFrom"] === newValue));
        return [...revisedData, { mappedTo: id, mappedFrom: newValue }];
      });
    };

    const toggleExpand = (index) => {
      setExpandedIndex(index === expandedIndex ? null : index);
    };

    return (
      <div ref={el => { itemRefs.current[index] = el; }} onClick={() => toggleExpand(index)}>
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
      </div>
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
        Cell: ({ cell: { value }, row: { index } }) => <DropDownUserColumnSelect key={value} id={value} index={index} />,
      },
    ],
    [userColumns, setResourceMapping, resourceMapping, t, itemRefs]
  );
  const data = useMemo(() => templateColumns.map((item) => ({ COLUMNS_IN_TEMPLATE: t(item), COLUMNS_IN_USER_UPLOAD: item })), [templateColumns]);
  return (
    <div className="spatial-data-property-mapping">
      <Table
        customTableWrapperClassName=""
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
