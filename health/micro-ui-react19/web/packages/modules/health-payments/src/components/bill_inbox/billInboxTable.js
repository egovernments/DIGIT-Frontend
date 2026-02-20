import {
  Button,
  Card,
  Chip,
  Header,
  Loader,
  PopUp,
  Toast,
  CardText,
  NoResultsFound,
  Tab,
  LoaderScreen,
  LoaderComponent,
} from "@egovernments/digit-ui-components";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DataTable from "react-data-table-component";
import { useQueryClient } from "@tanstack/react-query";
import { CustomSVG } from "@egovernments/digit-ui-components";
import { tableCustomStyle } from "../table_inbox_custom_style";
import { defaultPaginationValues } from "../../utils/constants";
import { getCustomPaginationOptions } from "../../utils";
import CommentPopUp from "../commentPopUp";

/**
 * BillInboxTable component is used to render the table for the employee's payment inbox.
 * The table is paginated and it fetches data based on the pagination.
 * The component also handles the page change and rows per page change.
 * @param {object} props The props object contains the data and the pagination information.
 * @returns {JSX.Element} The JSX element for the table.
 */
const BillInboxTable = ({ ...props }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [commentLogs, setCommentLogs] = useState(false);
  const [showToast, setShowToast] = useState(null);
  const [data, setData] = useState(null);
  // context path variables
  const musterRollContextPath = window?.globalConfigs?.getConfig("MUSTER_ROLL_CONTEXT_PATH") || "health-muster-roll";

  const searchMutation = Digit.Hooks.useCustomAPIMutationHook({
    url: `/${musterRollContextPath}/v1/_search`,
  });

  const triggerMusterRollSearch = async (attendanceId) => {
    try {
      await searchMutation.mutateAsync(
        {
          params: {
            tenantId: tenantId,
            registerId: attendanceId,
            billingPeriodId: props?.selectedPeriod?.id,
          },
        },
        {
          onSuccess: (data) => {
            setData(data?.musterRolls?.[0]);
          },
          onError: (error) => {
            setShowToast({ key: "error", label: t(error?.response?.data?.Errors?.[0]?.message), transitionTime: 3000 });
          },
        }
      );
    } catch (error) {
      setShowToast({ key: "error", label: t(error?.response?.data?.Errors?.[0]?.message), transitionTime: 3000 });
    }
  };

  const handlePageChange = (page, totalRows) => {
    props?.handlePageChange(page, totalRows);
  };

  const handlePerRowsChange = async (currentRowsPerPage, currentPage) => {
    props?.handlePerRowsChange(currentRowsPerPage, currentPage);
  };

  const onCommentLogClose = () => {
    setCommentLogs(false);
  };

  const columns = [
    {
      name: <div className="custom-inbox-table-row">{t("HCM_AM_ATTENDANCE_ID")}</div>,
      selector: (row) => {
        return (
          <Button
            label={t(`${row.id}`)}
            onClick={
              props?.selectedPeriod?.id === "AGGREGATE"
                ? () => {}
                : () =>
                    navigate(
                      `/${window?.contextPath}/employee/payments/view-attendance?registerNumber=${row?.id}&boundaryCode=${row?.boundary}`,
                      {
                        state: { fromCampaignSupervisor: true },
                      }
                    )
            }
            title={t(`${row.id}`)}
            variation={props?.selectedPeriod?.id === "AGGREGATE" ? "teritiary" : "link"}
            size={"medium"}
            style={{ minWidth: "unset" }}
          />
        );
      },
    },
    {
      name: <div className="custom-inbox-table-row">{t("HCM_AM_ATTENDANCE_BOUNDARY")}</div>,
      selector: (row) => {
        return (
          <div className="ellipsis-cell" title={t(row?.boundary) || t("NA")}>
            {t(row.boundary) || t("NA")}
          </div>
        );
      },
    },
    {
      name: (
        <div className="custom-inbox-table-row">
          {props.status === "APPROVED" ? t("HCM_AM_ATTENDANCE_APPROVED_BY") : t("HCM_AM_ATTENDANCE_MARKED_BY")}
        </div>
      ),
      selector: (row) => {
        return (
          <div className="ellipsis-cell" title={row?.markby || t("NA")}>
            {props.status === "APPROVED" ? row?.approvedBy : row?.markedBy || t("NA")}
          </div>
        );
      },
    },

    {
      name:
        props.status === "APPROVED" ? (
          <div className="custom-inbox-table-row">{t("HCM_AM_ATTENDANCE_ATTENDEES")}</div>
        ) : (
          t("HCM_AM_ATTENDANCE_ATTENDEES")
        ),
      selector: (row) => {
        return (
          <div className="ellipsis-cell" title={t(row?.status || "0")}>
            {t(row?.noOfAttendees || "0")}
          </div>
        );
      },
      style: {
        justifyContent: "flex-end",
      },
    },
  ];

  if (props.status === "APPROVED") {
    columns.push({
      name: t("HCM_AM_COMMENT_LOGS"),
      selector: (row) => (
        <Button
          label={t("HCM_AM_VIEW_COMMENT_LOGS")}
          onClick={() => {
            triggerMusterRollSearch(row?.registerId);
          }}
          variation="link"
          size={"medium"}
        />
      ),
    });
  }

  const handleRowClick = (row) => {
    navigate(`/${window?.contextPath}/employee/payments/view-attendance?registerNumber=${row?.id}&boundaryCode=${row?.boundary}`, {
      state: { fromCampaignSupervisor: true },
    });
  };

  useEffect(() => {
    if (data) {
      setCommentLogs(true);
    }
  }, [data]);

  return (
    <React.Fragment>
      {props.isFetching || props.tableData.length === 0 ? (
        <div style={{ height: props.infoDescription ? "36.8vh" : "49.6vh", backgroundColor: "transparent" }}>
          {" "}
          {props.isFetching ? (
            <Loader className={"digit-center-loader"} />
          ) : (
            <NoResultsFound style={{ height: "38vh", backgroundColor: "transparent" }} text={t(`HCM_AM_NO_DATA_FOUND`)} />
          )}{" "}
        </div>
      ) : (
        <DataTable
          columns={columns}
          className="search-component-table"
          data={props.tableData}
          pagination
          paginationServer
          customStyles={tableCustomStyle(true)}
          paginationDefaultPage={props?.currentPage}
          onRowClicked={props?.selectedPeriod?.id === "AGGREGATE" ? () => {} : handleRowClick}
          pointerOnHover
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handlePerRowsChange}
          paginationTotalRows={props?.totalCount}
          paginationPerPage={props?.rowsPerPage}
          sortIcon={<CustomSVG.SortUp width={"16px"} height={"16px"} fill={"#0b4b66"} />}
          paginationRowsPerPageOptions={defaultPaginationValues}
          fixedHeader={true}
          fixedHeaderScrollHeight={props.infoDescription ? "32vh" : "47vh"}
          paginationComponentOptions={getCustomPaginationOptions(t)}
        />
      )}
      {commentLogs && (
        <CommentPopUp onClose={onCommentLogClose} businessId={data?.musterRollNumber} heading={`${t("HCM_AM_STATUS_LOG_FOR_LABEL")}`} />
      )}
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
    </React.Fragment>
  );
};

export default BillInboxTable;
