import React, { Fragment, useState, } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Loader, TextInput, Toast } from "@egovernments/digit-ui-components";
import { CustomSVG } from "@egovernments/digit-ui-components";
import DataTable from "react-data-table-component";
import { tableCustomStyle } from "./table_inbox_custom_style";
import { defaultPaginationValues, defaultRowsPerPage } from "../utils/constants";

/**
 * A React component for displaying a paginated table of frontline workers
 * with editable columns for days worked and their roles.
 *
 * @param {object} props The props object contains the data to be displayed,
 * the onEditAttendanceChange function to be called when the user updates
 * the attendance records, the editAttendance boolean to indicate whether
 * the table should be editable or not, and the duration of the event to validate max date.
 *
 * @returns {ReactElement} The JSX element for the table.
 */
const AttendanceManagementTable = ({ ...props }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const url = Digit.Hooks.useQueryParams();
  const [showToast, setShowToast] = useState(null);
  // Local state for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  // Sliced data based on pagination
  const paginatedData = props.data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handlePageChange = (page, totalRows) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = (currentRowsPerPage, currentPage) => {
    setRowsPerPage(currentRowsPerPage);
    setCurrentPage(1);
  }

  const columns = [
    {
      name: (
        <div style={{ borderRight: "2px solid #787878", width: "100%", textAlign: "start" }}>
          {t(`HCM_AM_FRONTLINE_WORKER`)}
        </div>
      ),
      selector: (row) => {
        return (
          <span className="ellipsis-cell" style={{ fontSize: "14px" }}>
            {String(row?.[1] ? row?.[1] : t("ES_COMMON_NA"))}
          </span>
        );
      },
    },

    {
      name: (
        <div style={{ borderRight: "2px solid #787878", width: "100%", textAlign: "start" }}>
          {t("HCM_AM_WORKER_ID")}
        </div>
      ),
      selector: (row) => {
        return (
          <div style={{ fontSize: "14px" }} className="ellipsis-cell" title={row?.[2] || t("NA")}>
            {row?.[2] || t("NA")}
          </div>
        );
      },
    },
    {
      name: (
        <div style={{ borderRight: "2px solid #787878", width: "100%", textAlign: "start" }}>
          {t("HCM_AM_ROLE")}
        </div>
      ),
      selector: (row) => {
        return (
          <div style={{ fontSize: "14px" }} className="ellipsis-cell" title={t(row?.[3]) || t("NA")}>
            {t(row?.[3]) || t("NA")}
          </div>
        );
      },
    },

    {
      name: t("HCM_AM_NO_OF_DAYS_WORKED"),
      selector: (row) => {
        return props.editAttendance ? (
          <div >
            <TextInput
              type="numeric"
              value={row?.[4]}
              onChange={(e) => {
                handleDaysWorkedChange(row?.[2], e);
              }}
              populators={{ disableTextField: false }}
              style={{ width: "100%" }}
            />
          </div>
        ) : (
          <div className="ellipsis-cell" title={t(row?.[4] || "0")}>
            {t(row?.[4] || "0")}
          </div>
        );
      },
      style: {
        justifyContent: props.editAttendance ? "flex-start" : "flex-end",
      },
    },
  ];

  const handleDaysWorkedChange = (workerId, value) => {

    if (value?.target) {
      value = value?.target?.value;
    }

    // Remove leading zeros from the value
    value = value === 0 ? value : String(value).replace(/^0+/, "");

    // Find the worker whose attendance is being updated
    const worker = props.data.find((worker) => worker[2] === workerId);

    if (!worker) return; // If worker is not found, exit early

    const previousValue = worker[4]; // Previous value for daysWorked


    // Check if both current value and previous value are 0
    if (value === 0 && previousValue === 0) {
      setShowToast({ key: "error", label: t("HCM_AM_ATTENDANCE_CAN_NOT_BE_LESS_THAN_ZERO"), transitionTime: 3000 });
      return;
    }

    if (value > props.duration) {
      setShowToast({ key: "error", label: t("HCM_AM_ATTENDANCE_CAN_NOT_EXCEED_EVENT_DURATION_ERROR"), transitionTime: 3000 });
      return;
    }

    // Clear the toast if the input is valid
    setShowToast(null);

    // Update the data directly using the parent's setState
    const updatedData = props.data.map((worker) => {
      if (worker[2] === workerId) {
        return [worker[0], worker[1], worker[2], worker[3], value || 0]; // Update the daysWorked value
      }
      return worker; // Keep other rows unchanged
    });
    props.setAttendanceSummary(updatedData);
  };

  return (
    <>
      <DataTable
        columns={columns}
        data={paginatedData}
        progressPending={false}
        progressComponent={<Loader />}
        pagination
        paginationServer
        customStyles={tableCustomStyle}
        paginationDefaultPage={currentPage}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handlePerRowsChange}
        paginationTotalRows={props?.data.length}
        paginationPerPage={rowsPerPage}
        sortIcon={<CustomSVG.SortUp width={"16px"} height={"16px"} fill={"#0b4b66"} />}
        paginationRowsPerPageOptions={defaultPaginationValues}
        fixedHeader={true}
        fixedHeaderScrollHeight={"70vh"}
      />
      {showToast && (
        <Toast
          style={{ zIndex: 10001 }}
          label={showToast.label}
          type={showToast.key}
          // error={showToast.key === "error"}
          transitionTime={showToast.transitionTime}
          onClose={() => setShowToast(null)}
        />
      )}
    </>
  );
};

export default AttendanceManagementTable;
