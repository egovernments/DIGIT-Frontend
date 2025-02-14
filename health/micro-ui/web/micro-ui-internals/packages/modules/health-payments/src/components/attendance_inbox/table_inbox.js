import { Button, Card, Loader, NoResultsFound, Tab } from "@egovernments/digit-ui-components";
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DataTable from "react-data-table-component";
import { CustomSVG } from "@egovernments/digit-ui-components";
import { tableCustomStyle } from "../table_inbox_custom_style";
import { defaultPaginationValues } from "../../utils/constants";
import { getCustomPaginationOptions } from "../../utils";

const CustomInboxTable = ({
  handleTabChange,
  rowsPerPage,
  isLoading,
  tableData,
  customHandleRowsPerPageChange,
  customHandlePaginationChange,
  totalCount,
  statusCount,
  selectedProject
}) => {
  const { t } = useTranslation();
  const history = useHistory();

  const [activeLink, setActiveLink] = useState({
    code: "PENDINGFORAPPROVAL",
    name: "HCM_AM_PENDING_FOR_APPROVAL",
  });

  const handlePaginationChange = (page) => {
    customHandlePaginationChange(page);
  };
  const handleRowsPerPageChange = (newPerPage, page) => {
    customHandleRowsPerPageChange(newPerPage, page);
  };

  const columns = [
    {
      name: (
        <div className="custom-inbox-table-row">
          {t("HCM_AM_ATTENDANCE_ID")}
        </div>
      ),
      selector: (row) => {
        return (
          <span className="link" >
            <Button
              label={t(`${row.id}`)}
              onClick={() =>
                history.push(
                  `/${window?.contextPath}/employee/payments/view-attendance?registerNumber=${row?.id}&boundaryCode=${row?.boundary}`
                )
              }
              title={t(`${row.id}`)}
              variation="link"
              size={"medium"}
              style={{ minWidth: "unset" }}
            />
          </span>
        );
      },
    },
    {
      name: (
        <div className="custom-inbox-table-row">
          {activeLink?.code == "PENDINGFORAPPROVAL" ? t("HCM_AM_ATTENDANCE_MARKED_BY") : t("HCM_AM_ATTENDANCE_APPROVED_BY")}
        </div>
      ),
      selector: (row) => {
        return (
          <div className="ellipsis-cell" title={activeLink?.code == "PENDINGFORAPPROVAL" ? row?.markby : row?.approvedBy
            || t("NA")}>
            {activeLink?.code == "PENDINGFORAPPROVAL" ? row?.markby : row?.approvedBy || t("NA")}
          </div>
        );
      },
    },
    {
      name: (
        <div className="custom-inbox-table-row">
          {t("HCM_AM_ATTENDANCE_BOUNDARY")}
        </div>
      ),
      selector: (row) => {
        return (
          <div className="ellipsis-cell" title={t(row?.boundary) || t("NA")}>
            {t(row.boundary) || t("NA")}
          </div>
        );
      },
    },

    {
      name: t("HCM_AM_ATTENDANCE_ATTENDEES"),
      selector: (row) => {
        return (
          <div className="ellipsis-cell" title={t(row?.status || "0")}>
            {t(row?.status || "0")}
          </div>
        );
      },
      style: {
        justifyContent: "flex-end",
      },
    },
  ];

  const handleRowClick = (row) => {
    history.push(
      `/${window?.contextPath}/employee/payments/view-attendance?registerNumber=${row?.id}&boundaryCode=${row?.boundary}`
    )
  };

  return (
    <Card style={{ gap: "1.5rem" }}>
      <div className="summary-sub-heading">{t(selectedProject?.name)}</div>
      {
        /*(!planEmployee?.data || planEmployee?.data?.length === 0) */
        !tableData ? (
          <NoResultsFound text={t(`HCM_AM_NO_DATA_FOUND`)} />
        ) : (
          <div>
            <Tab
              activeLink={activeLink?.code}
              configItemKey="code"
              configDisplayKey="name"
              itemStyle={{ width: "290px" }}
              configNavItems={[
                {
                  code: "PENDINGFORAPPROVAL",

                  name: `${`${t(`HCM_AM_PENDING_FOR_APPROVAL`)} (${statusCount?.PENDINGFORAPPROVAL})`}`,
                },
                {
                  code: "APPROVED",
                  name: `${`${t(`HCM_AM_APPROVED`)} (${statusCount?.APPROVED})`}`,
                },
              ]}
              navStyles={{}}
              onTabClick={(e) => {
                setActiveLink(e);
                handleTabChange(e);
              }}
              setActiveLink={setActiveLink}
              style={{}}
              showNav={true}
            />
            <Card style={{ maxWidth: "100%", overflow: "auto", margin: "0px", }}>

              {isLoading ? <Loader /> : tableData && tableData.length === 0 ? (
                <NoResultsFound style={{ height: "60vh" }} text={t(`HCM_AM_NO_DATA_FOUND`)} />
              ) : (
                <DataTable
                  columns={columns}
                  data={tableData}
                  progressPending={isLoading}
                  progressComponent={<Loader />}
                  pagination
                  paginationServer
                  customStyles={tableCustomStyle}
                  onRowClicked={handleRowClick}
                  pointerOnHover
                  paginationTotalRows={totalCount}
                  onChangePage={handlePaginationChange}
                  onChangeRowsPerPage={handleRowsPerPageChange}
                  paginationPerPage={rowsPerPage}
                  sortIcon={<CustomSVG.SortUp width={"16px"} height={"16px"} fill={"#0b4b66"} />}
                  paginationRowsPerPageOptions={defaultPaginationValues}
                  fixedHeader={true}
                  fixedHeaderScrollHeight={"60vh"}
                  paginationComponentOptions={getCustomPaginationOptions(t)}
                />
              )}
            </Card>
          </div>
        )
      }
    </Card>
  );
};

export default CustomInboxTable;
