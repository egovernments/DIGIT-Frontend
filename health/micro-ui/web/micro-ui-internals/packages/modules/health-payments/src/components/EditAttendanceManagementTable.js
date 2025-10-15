import React, { Fragment, useState, } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Loader, Button, TextInput, Toast, Tag } from "@egovernments/digit-ui-components";
import { CustomSVG } from "@egovernments/digit-ui-components";
import DataTable, { TableProps } from "react-data-table-component";
import { tableCustomStyle, editAttendeetableCustomStyle } from "./table_inbox_custom_style";
import { defaultPaginationValues, defaultRowsPerPage, defaultPaginationValuesForEditAttendee, defaultRowsPerPageForEditAttendee } from "../utils/constants";
import { getCustomPaginationOptions } from "../utils";
import AttendeeService from "../services/attendance/attendee_service/attendeeService";

import AlertPopUp from "./alertPopUp";


/**
 * A React component for displaying a paginated table of frontline workers
 * with editable columns for disabling the user from register.
 *
 * @param {object} props The props object contains the data to be displayed,
 * the onEditAttendanceChange function to be called when the user updates
 * the attendance records, the editAttendance boolean to indicate whether
 * the table should be editable or not, and the duration of the event to validate max date.
 *
 * @returns {ReactElement} The JSX element for the table.
 */





const EditAttendanceManagementTable = ({ ...props }) => {

  const { t } = useTranslation();
  const history = useHistory();
  const url = Digit.Hooks.useQueryParams();
  const [showToast, setShowToast] = useState(null);
  // Local state for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPageForEditAttendee);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [toast, setToast] = useState({ show: false, label: "", type: "" });

  const [selectedRowId, setSelectedRowId] = useState(null);

  const [openAlertPopUp, setOpenAlertPopUp] = useState(false);

  const { mutate: updateMapping } = Digit.Hooks.payments.useDeleteAttendeeFromRegister(tenantId);

  // Sliced data based on pagination
  const paginatedData = props.data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handlePageChange = (page, totalRows) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = (currentRowsPerPage, currentPage) => {
    setRowsPerPage(currentRowsPerPage);
    setCurrentPage(1);
  }

  let columns = [
    {
      name: (
        <div style={{ borderRight: "2px solid #787878", width: "100%", textAlign: "start" }}>
          {t(`HCM_AM_FRONTLINE_WORKER`)}
        </div>
      ),
      selector: (row) => {
        return (
          <span className="ellipsis-cell">
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
          <div className="ellipsis-cell" title={row?.[2] || t("NA")}>
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
          <div className="ellipsis-cell" title={t(row?.[3]) || t("NA")}>
            {t(row?.[3]) || t("NA")}
          </div>
        );
      },
    },

    {
      name: (
        <div style={{ borderRight: "2px solid #787878", width: "100%", textAlign: "start" }}>
          {t("HCM_AM_TAG_LABEL")}
        </div>
      ),
      selector: (row) => {
        return (
          <div className="ellipsis-cell" title={t(row?.[4]) || t("NA")}>
            {t(row?.[4]) || t("NA")}
          </div>
        );
      },
    },

    // {
    //   name: t("HCM_AM_ACTION"),
    //   selector: (row) => {
    //     return (
    //       <div className="ellipsis-cell" title={t(row?.[5] || "0")}>
    //         {row?.[5] == false ? <Tag label={t("HCM_AM_VIEW_REGISTER_DISABLED_TAG")} type="error" stroke={false} /> :
    //           <Button
    //             className="custom-class"
    //             icon="Edit"
    //             iconFill=""
    //             label={t(`HCM_AM_VIEW_REGISTER_DISABLE_USER`)}
    //             onClick={() => {
    //               setSelectedRowId(row?.[0]);
    //               setOpenAlertPopUp(true);
    //               // handleDaysWorkedChange(row?.[0])
    //             }}
    //             options={[]}
    //             optionsKey=""
    //             size=""
    //             style={{}}
    //             title={t(`HCM_AM_VIEW_REGISTER_DISABLE_USER`)}
    //             variation="secondary"
    //           />
    //         }
    //       </div>
    //     );
    //   },
    //   style: {
    //     justifyContent: "flex-end",
    //   },
    // },
  ];

  if (props.editAction) {
    columns.push(
      {
        name: t("HCM_AM_ACTION"),
        selector: (row) => {
          return (
            <div className="ellipsis-cell" title={t(row?.[5] || "0")}>
              {row?.[5] == false ? <Tag label={t("HCM_AM_VIEW_REGISTER_DISABLED_TAG")} type="error" stroke={false} /> :
                <Button
                  className="custom-class"
                  icon="Edit"
                  iconFill=""
                  label={t(`HCM_AM_VIEW_REGISTER_DISABLE_USER`)}
                  onClick={() => {
                    setSelectedRowId(row?.[0]);
                    setOpenAlertPopUp(true);
                    // handleDaysWorkedChange(row?.[0])
                  }}
                  options={[]}
                  optionsKey=""
                  size=""
                  style={{}}
                  title={t(`HCM_AM_VIEW_REGISTER_DISABLE_USER`)}
                  variation="secondary"
                />
              }
            </div>
          );
        },
        style: {
          justifyContent: "flex-start",
        },
      },
    )
  }

  const handleDaysWorkedChange = async (value) => {

    const attendee = {
      registerId: props.registerNumber,
      individualId: value,
      enrollmentDate: null,
      denrollmentDate: new Date(Date.now() - (1 * 60 * 1000 + 30 * 1000)).getTime(),
      tenantId: String(tenantId)
    };
    await updateMapping({ "attendees": [attendee] },
      {
        onError: async (error) => {


          setShowToast(
            { key: "error", label: t(`HCM_AM_ERROR_MESSAGE`), transitionTime: 3000 }
          );


        },
        onSuccess: async (responseData) => {

          setShowToast({ key: "success", label: t(`HCM_AM_ATTENDEE_DE_ENROLL_SUCCESS_MESSAGE`), transitionTime: 3000 });
          props.disableUser("");
        },
      }
    )


  };



  return (
    <>
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

      {openAlertPopUp && <AlertPopUp
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
            handleDaysWorkedChange(selectedRowId); // use stored row.[0]
          }
        }}
      />}
    </>
  );
};

export default EditAttendanceManagementTable;
