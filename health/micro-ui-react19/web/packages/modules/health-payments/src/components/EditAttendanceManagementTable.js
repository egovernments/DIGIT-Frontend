import React, { useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Loader, Button, TextInput, Toast, Tag, CustomSVG } from "@egovernments/digit-ui-components";
import DataTable from "react-data-table-component";
import { editAttendeetableCustomStyle } from "./table_inbox_custom_style";
import { defaultPaginationValuesForEditAttendee, defaultRowsPerPageForEditAttendee } from "../utils/constants";
import { getCustomPaginationOptions } from "../utils";
import AlertPopUp from "./alertPopUp";
import { disableTimeWithSession } from "../utils/time_conversion";

/**
 * Component: EditAttendanceManagementTable
 * ------------------------------------------------
 * Displays a paginated, editable list of attendees for a given attendance register.
 * Allows disabling attendees (de-enrollment) and handles confirmation, pagination, and toast notifications.
 */
const EditAttendanceManagementTable = ({ ...props }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const url = Digit.Hooks.useQueryParams();
  const tenantId = Digit.ULBService.getCurrentTenantId();

  /** -----------------------------
   *  Local State Management
   * -----------------------------
   */
  const [showToast, setShowToast] = useState(null); // Toast message state
  const [currentPage, setCurrentPage] = useState(1); // Active pagination page
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPageForEditAttendee); // Rows per page
  const [selectedRowId, setSelectedRowId] = useState(null); // Selected attendee ID for disable action
  const [openAlertPopUp, setOpenAlertPopUp] = useState(false); // Confirmation popup state

  /** -----------------------------
   *  Mutation Hook
   * -----------------------------
   * Digit custom hook to disable (de-enroll) an attendee from the register.
   */
  const { mutate: updateMapping } = Digit.Hooks.payments.useDeleteAttendeeFromRegister(tenantId);

  /** -----------------------------
   *  Pagination Logic
   * -----------------------------
   * Slices the full dataset to only show the current page items.
   */
  const paginatedData = props.data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  // Handles page number change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handles rows per page change
  const handlePerRowsChange = (currentRowsPerPage) => {
    setRowsPerPage(currentRowsPerPage);
    setCurrentPage(1);
  };

  /** -----------------------------
   *  Table Columns Definition
   * -----------------------------
   * Defines how each column of the table will render its content.
   */
  let columns = [
    // Column 1: Frontline Worker Name
    {
      name: (
        <div
          style={{
            borderRight: "2px solid #787878",
            width: "100%",
            textAlign: "start",
          }}
        >
          {t(`HCM_AM_FRONTLINE_WORKER`)}
        </div>
      ),
      selector: (row) => <span className="ellipsis-cell">{String(row?.[1] ? row?.[1] : t("ES_COMMON_NA"))}</span>,
    },

    // Column 2: Worker ID
    {
      name: (
        <div
          style={{
            borderRight: "2px solid #787878",
            width: "100%",
            textAlign: "start",
          }}
        >
          {t("HCM_AM_WORKER_ID")}
        </div>
      ),
      selector: (row) => (
        <div className="ellipsis-cell" title={row?.[2] || t("NA")}>
          {row?.[2] || t("NA")}
        </div>
      ),
    },

    // Column 3: Role
    {
      name: (
        <div
          style={{
            borderRight: "2px solid #787878",
            width: "100%",
            textAlign: "start",
          }}
        >
          {t("HCM_AM_ROLE")}
        </div>
      ),
      selector: (row) => (
        <div className="ellipsis-cell" title={t(row?.[3]) || t("NA")}>
          {t(row?.[3]) || t("NA")}
        </div>
      ),
    },

    // Column 4: Tag
    {
      name: (
        <div
          style={{
            borderRight: "2px solid #787878",
            width: "100%",
            textAlign: "start",
          }}
        >
          {t("HCM_AM_TAG_LABEL")}
        </div>
      ),
      selector: (row) => (
        <div className="ellipsis-cell" title={t(row?.[4]) || t("NA")}>
          {t(row?.[4]) || t("NA")}
        </div>
      ),
    },
  ];

  /** -----------------------------
   *  Action Column (Edit Mode Only)
   * -----------------------------
   * Adds a column to disable attendees when editAction is true.
   */
  if (props.editAction) {
    columns.push({
      name: t("HCM_AM_ACTION"),
      selector: (row) => (
        <div className="ellipsis-cell" title={t(row?.[5] || "0")}>
          {/* Show 'Disabled' tag if attendee already disabled */}
          {row?.[5] == false ? (
            <Tag label={t("HCM_AM_VIEW_REGISTER_DISABLED_TAG")} type="error" stroke={false} />
          ) : (
            // Show 'Disable User' button for active attendees
            <Button
              className="custom-class"
              icon="Edit"
              label={t(`HCM_AM_VIEW_REGISTER_DISABLE_USER`)}
              onClick={() => {
                setSelectedRowId(row?.[0]);
                setOpenAlertPopUp(true);
              }}
              variation="secondary"
              title={t(`HCM_AM_VIEW_REGISTER_DISABLE_USER`)}
            />
          )}
        </div>
      ),
      style: {
        justifyContent: "flex-start",
      },
    });
  } else {
    columns.push(
      // Column 5: Status
      {
        name: (
          <div
            style={{
              borderRight: "2px solid #787878",
              width: "100%",
              textAlign: "start",
            }}
          >
            {t("HCM_AM_STATUS_LABEL")}
          </div>
        ),
        selector: (row) => (
          <div className="ellipsis-cell" title={row?.[5] == false ? t("HCM_AM_VIEW_REGISTER_DISABLED_TAG") : t("HCM_AM_VIEW_REGISTER_ACTIVE")}>
            {row?.[5] == false ? t("HCM_AM_VIEW_REGISTER_DISABLED_TAG") : t("HCM_AM_VIEW_REGISTER_ACTIVE")}
          </div>
        ),
      }
    );
  }

  /** -----------------------------
   *  Disable (De-enroll) Attendee
   * -----------------------------
   * Called when a user confirms the disable action.
   * Triggers mutation API to de-enroll the selected attendee.
   */
  const handleDaysWorkedChange = async (value) => {
    const attendee = {
      registerId: props.registerNumber,
      individualId: value,
      enrollmentDate: null,
      // Generate de-enrollment time based on session type
      denrollmentDate: disableTimeWithSession(props.sessionType, new Date(Date.now()).getTime()),
      tenantId: String(tenantId),
    };

    // Trigger API call using Digit mutation hook
    await updateMapping(
      { attendees: [attendee] },
      {
        onError: async (error) => {
          // Show error toast
          setShowToast({
            key: "error",
            label: t(`HCM_AM_ERROR_MESSAGE`),
            transitionTime: 3000,
          });
        },
        onSuccess: async (responseData) => {
          // Show success toast and refresh parent data
          setShowToast({
            key: "success",
            label: t(`HCM_AM_ATTENDEE_DE_ENROLL_SUCCESS_MESSAGE`),
            transitionTime: 3000,
          });
          props.disableUser("");
        },
      }
    );
  };

  /** -----------------------------
   *  Render Section
   * -----------------------------
   */
  return (
    <>
      {/* Main Data Table */}
      <DataTable
        className="search-component-table"
        columns={columns}
        data={paginatedData}
        progressPending={false}
        progressComponent={<Loader />}
        pagination
        paginationServer
        customStyles={editAttendeetableCustomStyle(false)}
        paginationDefaultPage={currentPage}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handlePerRowsChange}
        paginationTotalRows={props?.data.length}
        paginationPerPage={defaultRowsPerPageForEditAttendee}
        sortIcon={<CustomSVG.SortUp width={"16px"} height={"16px"} fill={"#0b4b66"} />}
        paginationRowsPerPageOptions={defaultPaginationValuesForEditAttendee}
        fixedHeader={true}
        fixedHeaderScrollHeight={props.height ? props.height : "70vh"}
        paginationComponentOptions={getCustomPaginationOptions(t)}
      />

      {/* Toast Notification */}
      {showToast && (
        <Toast
          style={{ zIndex: 10001 }}
          label={showToast.label}
          type={showToast.key}
          transitionTime={showToast.transitionTime}
          onClose={() => setShowToast(null)}
        />
      )}

      {/* Confirmation Alert Pop-Up */}
      {openAlertPopUp && (
        <AlertPopUp
          onClose={() => {
            setOpenAlertPopUp(false);
          }}
          alertHeading={t(`HCM_AM_WARNING`)}
          alertMessage={t(`HCM_AM_NOT_RE_ENABLED_DESCRIPTION`)}
          submitLabel={t(`HCM_AM_YES_DISABLE_USER`)}
          cancelLabel={t(`HCM_AM_CANCEL`)}
          onPrimaryAction={() => {
            setOpenAlertPopUp(false);
            if (selectedRowId) {
              handleDaysWorkedChange(selectedRowId); // Perform de-enrollment
            }
          }}
        />
      )}
    </>
  );
};

export default EditAttendanceManagementTable;
