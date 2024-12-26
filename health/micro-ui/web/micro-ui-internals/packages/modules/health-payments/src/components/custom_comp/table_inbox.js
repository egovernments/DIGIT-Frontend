import { Button, Card, Chip, Header, Loader, PopUp, Toast, CardText, NoResultsFound, Tab } from "@egovernments/digit-ui-components";
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DataTable from "react-data-table-component";
import { useQueryClient } from "react-query";
import { CustomSVG } from "@egovernments/digit-ui-components";
import { tableCustomStyle } from "./table_inbox_custom_style";

const CustomInboxTable = ({ rowsPerPage, isLoading, tableData, customHandleRowsPerPageChange, customHandlePaginationChange, totalCount }) => {
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
      name: t("ATTENDANCE_ID"),
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
    {
      name: t("ATTENDANCE_BOUNDARY"),
      selector: (row) => {
        return (
          <div style={{ fontSize: "14px" }} className="ellipsis-cell" title={row?.boundary || t("NA")}>
            {row.boundary || t("NA")}
          </div>
        );
      },
    },
    {
      name: t("ATTENDANCE_NAME"),
      selector: (row) => {
        return (
          <div style={{ fontSize: "14px" }} className="ellipsis-cell" title={row?.name || t("NA")}>
            {row?.name || t("NA")}
          </div>
        );
      },
    },
    {
      name: t("ATTENDANCE_STATUS"),
      selector: (row) => {
        return (
          <div style={{ fontSize: "14px" }} className="ellipsis-cell" title={t(row?.status || "NA")}>
            {t(row?.status || "NA")}
          </div>
        );
      },
    },
  ];

  return (
    <React.Fragment>
      {
        <Card style={{ maxWidth: "100%", overflow: "auto", }}>
          {
            /*(!planEmployee?.data || planEmployee?.data?.length === 0) */
            !tableData ? <NoResultsFound text={t(`HCM_AM_NO_DATA_FOUND`)} /> :
              (
                <div>
                  <Tab
                    activeLink={activeLink?.code}
                    configItemKey="code"
                    configDisplayKey="name"
                    itemStyle={{ width: "290px" }}
                    configNavItems={[
                      {
                        code: "HCM_AM_PENDING_FOR_APPROVAL",
                        name: "HCM_AM_PENDING_FOR_APPROVAL",
                      },
                      {
                        code: "HCM_AM_APPROVED",
                        name: "HCM_AM_APPROVED",
                      },
                    ]}
                    navStyles={{}}
                    onTabClick={(e) => {
                      setActiveLink(e);
                    }}
                    setActiveLink={setActiveLink}
                    style={{}}
                    showNav={true}
                  />
                  {tableData && tableData.length === 0 ? <NoResultsFound text={t(`HCM_AM_NO_DATA_FOUND`)} /> :

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
                  }
                </div>)
          }
        </Card>
      }
    </React.Fragment>
  );
};

export default CustomInboxTable;
