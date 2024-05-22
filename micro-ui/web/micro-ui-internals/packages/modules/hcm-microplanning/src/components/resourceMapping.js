import { PaginationFirst, PaginationLast, PaginationNext, PaginationPrevious } from "@egovernments/digit-ui-svg-components";
import React, { useState, useEffect } from "react";

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
    if (!schema || !schema["schema"] || !schema.schema["Properties"]) return setToast({ state: "error", message: t("ERROR_VALIDATION_SCHEMA_ABSENT") });
    
    const columns = Object.keys(schema.schema["Properties"]);
    if (columns) setTemplateColumns([...hierarchy,...columns]);
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
    const [selectedOption, setSelectedOption] = useState("");
    useEffect(() => {
      const obj = resourceMapping.find((item) => item["mappedTo"] == id);
      if (obj) setSelectedOption(obj["mappedFrom"]);
      else setSelectedOption("");
    }, [id, resourceMapping]);

    const handleSelectChange = (event) => {
      const newValue = event.target.value;
      setSelectedOption(newValue);
      setResourceMapping((previous) => {
        const revisedData = previous.filter((item) => !(item["mappedTo"] === id || item["mappedFrom"] === newValue));
        return [...revisedData, { mappedTo: id, mappedFrom: newValue }];
      });
    };
    return (
      <select value={selectedOption} onChange={handleSelectChange}>
        <option value="" disabled>
          {t("SELECT_OPTION")}
        </option>
        {userColumns.map((key) => {
          return (
            <option key={key} value={key}>
              {key}
            </option>
          );
        })}
      </select>
    );
  };

  return (
    <div className="spatial-data-property-mapping">
      <table>
        <thead>
          <tr>
            <th>{t("COLUMNS_IN_TEMPLATE")}</th>
            <th>{t("COLUMNS_IN_USER_UPLOAD")}</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((entry, index) => (
            <tr key={index}>
              <td>
                <p>{t(entry)}</p>
              </td>
              <td>{<DropDownUserColumnSelect key={entry} id={entry} />}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination-toolbar">
        <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
          {[5, 10, 15, 20].map((value) => (
            <option key={value} value={value}>
              {t("ROWS")} {value}
            </option>
          ))}
        </select>
        <span>
          {currentPage * itemsPerPage + 1}-
          {(currentPage + 1) * itemsPerPage > templateColumns.length ? templateColumns.length : (currentPage + 1) * itemsPerPage} of{" "}
          {templateColumns.length}
        </span>
        <div className="navigation">
          <button onClick={() => handlePageClick(0)} disabled={currentPage === 0}>
            {PaginationFirst && <PaginationFirst width="24" height="24" fill={"rgb(0,0,0)"} />}
          </button>
          <button onClick={() => handlePageClick(currentPage - 1)} disabled={currentPage === 0}>
            {PaginationPrevious && <PaginationPrevious width="24" height="24" fill={"rgb(0,0,0)"} />}
          </button>
          <button onClick={() => handlePageClick(currentPage + 1)} disabled={currentPage === totalPages - 1}>
            {PaginationNext && <PaginationNext width="24" height="24" fill={"rgb(0,0,0)"} />}
          </button>
          <button onClick={() => handlePageClick(totalPages - 1)} disabled={currentPage === totalPages - 1}>
            {PaginationLast && <PaginationLast width="24" height="24" fill={"rgb(0,0,0)"} />}
          </button>
        </div>
      </div>
    </div>
  );
};
