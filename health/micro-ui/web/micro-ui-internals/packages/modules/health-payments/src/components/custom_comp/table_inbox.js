import { Button, Card, Chip, Header, Loader, PopUp, Toast, CardText, NoResultsFound, Tab } from "@egovernments/digit-ui-components";
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DataTable from "react-data-table-component";
import { useQueryClient } from "react-query";
import { CustomSVG } from "@egovernments/digit-ui-components";
import { tableCustomStyle } from "./table_inbox_custom_style";

const CustomInboxTable = ({
  handleTabChange,
  rowsPerPage,
  isLoading,
  tableData,
  customHandleRowsPerPageChange,
  customHandlePaginationChange,
  totalCount,
  statusCount,
}) => {
  const { t } = useTranslation();
  const [activeLink, setActiveLink] = useState({
    code: "HCM_AM_PENDING_FOR_APPROVAL",
    name: "HCM_AM_PENDING_FOR_APPROVAL",
  });

  // const [tableDatak, setTableDatak] = useState([]);

  // useEffect(() => {
  //   setTableDatak(tableData)

  // }, [tableData]);

  const handlePaginationChange = (page) => {
    customHandlePaginationChange(page);
  };
  const handleRowsPerPageChange = (newPerPage, page) => {
    customHandleRowsPerPageChange(newPerPage, page);
  };

  const columns = [
    {
      name: t("HCM_AM_ATTENDANCE_ID"),
      selector: (row) => {
        return (
          <span className="link" style={{ fontSize: "14px" }}>
            <Link to={`/${window?.contextPath}/employee/payments/view-attendance?registerNumber=${row?.id}&boundaryCode=${row?.boundary}`}>
              {String(row?.id ? row?.id : t("ES_COMMON_NA"))}
            </Link>
          </span>
        );
      },
    },
    // {
    //   name: t("HCM_AM_ATTENDANCE_NAME"),
    //   selector: (row) => {
    //     return (
    //       <div style={{ fontSize: "14px" }} className="ellipsis-cell" title={row?.name || t("NA")}>
    //         {row?.name || t("NA")}
    //       </div>
    //     );
    //   },
    // },

    {
      name: t("HCM_AM_ATTENDANCE_MARKED_BY"),
      selector: (row) => {
        return (
          <div style={{ fontSize: "14px" }} className="ellipsis-cell" title={row?.markby || t("NA")}>
            {row?.markby || t("NA")}
          </div>
        );
      },
    },
    {
      name: t("HCM_AM_ATTENDANCE_BOUNDARY"),
      selector: (row) => {
        return (
          <div style={{ fontSize: "14px" }} className="ellipsis-cell" title={t(row?.boundary) || t("NA")}>
            {t(row.boundary) || t("NA")}
          </div>
        );
      },
    },

    {
      name: t("HCM_AM_ATTENDANCE_ATTENDEES"),
      selector: (row) => {
        return (
          <div style={{ fontSize: "14px" }} className="ellipsis-cell" title={t(row?.status || "0")}>
            {t(row?.status || "0")}
          </div>
        );
      },
    },
  ];

  return (
    <React.Fragment>
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
                      code: "HCM_AM_PENDING_FOR_APPROVAL",

                      name: `${`${t(`HCM_AM_PENDING_FOR_APPROVAL`)} (${statusCount?.PENDINGFORAPPROVAL})`}`,
                    },
                    {
                      code: "HCM_AM_APPROVED",
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
                 <Card style={{ maxWidth: "100%", overflow: "auto", margin: "0px", padding: "0px" }}>
               
                 {tableData && tableData.length === 0 ? (
                  <NoResultsFound text={t(`HCM_AM_NO_DATA_FOUND`)} />
                ) : (
                  <DataTable
                    columns={columns}
                    data={tableData}
                    progressPending={isLoading}
                    progressComponent={<Loader />}
                    pagination
                    paginationServer
                    customStyles={tableCustomStyle}
                    paginationTotalRows={totalCount}
                    onChangePage={handlePaginationChange}
                    onChangeRowsPerPage={handleRowsPerPageChange}
                    paginationPerPage={rowsPerPage}
                    sortIcon={<CustomSVG.SortUp width={"16px"} height={"16px"} fill={"#0b4b66"} />}
                    paginationRowsPerPageOptions={[5, 10, 15, 20]}
                  />
                )}
                 </Card>

              </div>
              
            )
              
          
        
      }
    </React.Fragment>
  );
};

export default CustomInboxTable;
