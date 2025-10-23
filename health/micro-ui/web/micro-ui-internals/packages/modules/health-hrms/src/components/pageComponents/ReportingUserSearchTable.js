
import React, { useState, useMemo } from "react";
import { Loader, CustomSVG } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import DataTable from "react-data-table-component";
import { editAttendeetableCustomStyle } from "../../utils/utlis";

const ReportingUserSearchTable = ({
  data = [],
  totalCount = 0,
  rowsPerPage = 5,
  onSelect,
  onPageChange,
  loading = false,
  offset = 0,
}) => {
  const { t } = useTranslation();
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Compute current page (DataTable pages start at 1)
  const currentPage = Math.floor(offset / rowsPerPage) + 1;

  const handlePageChange = (page) => {
    const newOffset = (page - 1) * rowsPerPage;
    onPageChange?.({ offset: newOffset, limit: rowsPerPage });
  };

  const handlePerRowsChange = (newPerPage, page) => {
    const newOffset = (page - 1) * newPerPage;
    onPageChange?.({ offset: newOffset, limit: newPerPage });
  };

  const handleSelect = (user) => {
    setSelectedUserId(user.userUuid);
    onSelect?.(user);
  };

  // Columns configuration
  const columns = useMemo(
    () => [
      {
        name: t("CORE_COMMON_NAME"),
        selector: (row) => row?.name?.givenName || "-",
        sortable: true,
        cell: (row) => (
          <div style={{ padding: "8px", cursor: "pointer" }} onClick={() => handleSelect(row)}>
            {row?.name?.givenName || "-"}
          </div>
        ),
      },
      {
        name: t("CORE_COMMON_PROFILE_MOBILE_NUMBER"),
        selector: (row) => row?.mobileNumber || "-",
        sortable: true,
        cell: (row) => (
          <div style={{ padding: "8px", cursor: "pointer" }} onClick={() => handleSelect(row)}>
            {row?.mobileNumber || "-"}
          </div>
        ),
      },
    ],
    [t]
  );

  // Row highlight styles
  const conditionalRowStyles = [
    {
      when: (row) => row.userUuid === selectedUserId,
      style: {
        backgroundColor: "#e0e0e0 !important",
        "&:hover": {
          backgroundColor: "#d5d5d5 !important",
        },
      },
    },
  ];

  return (
    <div>
      {loading ? (
        <Loader variant="PageLoader" className="digit-center-loader" />
      ) : (
        <DataTable
          className="search-component-table"
          columns={columns}
          data={data}
          progressPending={loading}
          progressComponent={<Loader />}
          pagination
          paginationServer
          customStyles={editAttendeetableCustomStyle(false)}
          onRowClicked={handleSelect}
          pointerOnHover
          paginationDefaultPage={currentPage}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handlePerRowsChange}
          paginationTotalRows={totalCount}
          paginationPerPage={rowsPerPage}
          sortIcon={<CustomSVG.SortUp width={"16px"} height={"16px"} fill={"#0b4b66"} />}
          paginationRowsPerPageOptions={[5]}
          fixedHeader
          fixedHeaderScrollHeight="70vh"
          conditionalRowStyles={conditionalRowStyles}
          noDataComponent={
            <div style={{ textAlign: "center", padding: "10px" }}>
              {t("COMMON_NO_DATA")}
            </div>
          }
        />
      )}
    </div>
  );
};

export default ReportingUserSearchTable;
