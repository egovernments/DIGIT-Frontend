import React, { Fragment, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Button, CustomSVG, Tag, Toast } from "@egovernments/digit-ui-components";
import { downloadFileWithName, formatTimestampToDate, getCustomPaginationOptions } from "../utils";
import DataTable from "react-data-table-component";
import { tableCustomStyle } from "./table_inbox_custom_style";
import { defaultPaginationValues } from "../utils/constants";

/**
 * @function MyBillsTable
 * @param {Object} props - Component props
 * @param {Array} props.data - Array of objects containing bill data
 * @param {Function} props.handlePageChange - Function to handle page change
 * @param {Function} props.handlePerRowsChange - Function to handle per row change
 * @param {Number} props.currentPage - Current page number
 * @param {Number} props.rowsPerPage - Number of rows per page
 * @param {Number} props.totalCount - Total count of bills
 * @returns {React.ReactElement} Returns the component
 */

const MyBillsTable = ({ ...props }) => {
  const { t } = useTranslation();
  const [showToast, setShowToast] = useState(null);
  const project = Digit?.SessionStorage.get("staffProjects");

  const columns = useMemo(() => {
    const baseColumns = [
      {
        name: <div style={{ borderRight: "2px solid #787878", width: "100%", textAlign: "start" }}>{t("HCM_AM_BILL_ID")}</div>,
        selector: (row) => {
          return (
            <div
              className="ellipsis-cell"
              style={{
                whiteSpace: "normal", // allow wrapping
                wordBreak: "break-word", // break long words if needed
                textAlign: "start",
              }}
              title={t(row?.billNumber) || t("NA")}
            >
              {t(row?.billNumber) || t("NA")}
            </div>
          );
        },
        style: {
          display: "flex",
          alignItems: "flex-start",
          paddingTop: "15px",
        },
      },

      {
        name: <div style={{ borderRight: "2px solid #787878", width: "100%", textAlign: "start" }}>{t("HCM_AM_BILL_TYPE_COLOUMN")}</div>,
        selector: (row) => {
          return (
            <div className="ellipsis-cell" style={{ alignItems: "flex-start" }}>
              {t(`HCM_AM_${row?.additionalDetails?.billingType}` || "NA") || t("NA")}
            </div>
          );
        },
        style: {
          display: "flex",
          alignItems: "flex-start",
          paddingTop: "15px",
        },
      },

      {
        name: <div style={{ borderRight: "2px solid #787878", width: "100%", textAlign: "start" }}>{t("HCM_AM_BILL_DATE")}</div>,
        selector: (row) => {
          return <div className="ellipsis-cell">{formatTimestampToDate(row.billDate) || t("NA")}</div>;
        },
        style: {
          display: "flex",
          alignItems: "flex-start",
          paddingTop: "15px",
        },
      },

      {
        name: <div style={{ borderRight: "2px solid #787878", width: "100%", textAlign: "start" }}>{t("HCM_AM_BILL_PERIOD_DATE")}</div>,
        selector: (row) => {
          return (
            <div
              className="ellipsis-cell"
              style={{
                whiteSpace: "normal", // allow wrapping
                wordBreak: "break-word", // break long words if needed
                textAlign: "start",
              }}
            >
              {`${formatTimestampToDate(row.fromPeriod)} - ${formatTimestampToDate(row.toPeriod)}` || t("NA")}
            </div>
          );
        },
        style: {
          display: "flex",
          alignItems: "flex-start",
          paddingTop: "15px",
        },
      },
      // INFO:: no of registers commented
      // {
      //   name: <div style={{ borderRight: "2px solid #787878", width: "100%", textAlign: "start" }}>{t("HCM_AM_NO_OF_REGISTERS")}</div>,
      //   selector: (row) => {
      //     return (
      //       <div className="ellipsis-cell" style={{ paddingRight: "1rem" }}>
      //         {t(row?.additionalDetails?.noOfRegisters || "0")}
      //       </div>
      //     );
      //   },
      //   style: {
      //     justifyContent: "flex-end",
      //   },
      // },
      {
        name: <div style={{ borderRight: "2px solid #787878", width: "100%", textAlign: "start" }}>{t("HCM_AM_NUMBER_OF_WORKERS")}</div>,
        selector: (row) => {
          return (
            <div className="ellipsis-cell" style={{ paddingRight: "1rem" }}>
              {t(row?.billDetails?.length) || t("0")}
            </div>
          );
        },

        style: {
          justifyContent: "flex-end",
          paddingTop: "15px",
          alignItems: "flex-start",
        },
      },
      {
        name: <div style={{ borderRight: "2px solid #787878", width: "100%", textAlign: "start" }}>{t("HCM_AM_BOUNDARY_NAME")}</div>,
        selector: (row) => {
          return <div className="ellipsis-cell">{t(row.localityCode) || t("NA")}</div>;
        },
        style: {
          display: "flex",
          alignItems: "flex-start",
          paddingTop: "15px",
        },
      },

      {
        name: <div style={{ borderRight: "2px solid #787878", width: "100%", textAlign: "start" }}>{t("HCM_AM_PROJECT_NAME")}</div>,
        selector: (row) => {
          return (
            <div
              className="ellipsis-cell"
              style={{
                whiteSpace: "normal", // allow wrapping
                wordBreak: "break-word", // break long words if needed
                textAlign: "start",
              }}
              title={t(project?.[0]?.name || "0")}
            >
              {t(project?.[0]?.name || `NA`)}
            </div>
          );
        },
        style: {
          display: "flex",
          alignItems: "flex-start",
          paddingTop: "15px",
        },
      },
      {
        name: t("HCM_AM_BILL_ACTIONS"),
        selector: (row, index) => {
          const reportDetails = row?.additionalDetails?.reportDetails;
          const billId = row?.billNumber;
          const isLastRow = index === props.totalCount - 1;

          return reportDetails?.status === "COMPLETED" ? (
            <Button
              className="custom-class"
              iconFill=""
              size="medium"
              icon="FileDownload"
              isSuffix
              label={t(`HCM_AM_DOWNLOAD_BILLS`)}
              title={t(`HCM_AM_DOWNLOAD_BILLS`)}
              showBottom={isLastRow && props.data.length !== 1 ? false : true}
              onOptionSelect={(value) => {
                if (value.code === "HCM_AM_PDF") {
                  if (reportDetails?.pdfReportId) {
                    downloadFileWithName({ fileStoreId: reportDetails?.pdfReportId, customName: `${billId}`, type: "pdf" });
                  } else {
                    setShowToast({ key: "error", label: t(`HCM_AM_PDF_GENERATION_FAILED`), transitionTime: 3000 });
                  }
                } else if (value.code === "HCM_AM_EXCEL") {
                  if (reportDetails?.excelReportId) {
                    downloadFileWithName({ fileStoreId: reportDetails?.excelReportId, customName: `${billId}`, type: "excel" });
                  } else {
                    setShowToast({ key: "error", label: t(`HCM_AM_EXCEL_GENERATION_FAILED`), transitionTime: 3000 });
                  }
                }
              }}
              options={[
                {
                  code: "HCM_AM_EXCEL",
                  name: t(`HCM_AM_EXCEL`),
                },
                {
                  code: "HCM_AM_PDF",
                  name: t(`HCM_AM_PDF`),
                },
              ]}
              optionsKey="name"
              style={{ minWidth: "13rem" }}
              type="actionButton"
              variation="secondary"
            />
          ) : (
            <div>
              <Tag
                {...(reportDetails?.status !== "FAILED" && { icon: "Info" })}
                label={reportDetails?.status === "FAILED" ? t("HCM_AM_FAILED_REPORT_GENERATION") : t("HCM_AM_PROGRESS_REPORT_GENERATION")}
                labelStyle={{}}
                showIcon={true}
                style={{}}
                {...(reportDetails?.status === "FAILED" && { type: "error" })}
              />
            </div>
          );
        },
        width: "300px",
        style: {
          display: "flex",
          alignItems: "flex-start",
          paddingTop: "15px",
        },
      },
    ];

    return baseColumns;
  }, [props.data, t]);

  const handlePageChange = (page, totalRows) => {
    props?.handlePageChange(page, totalRows);
  };

  const handlePerRowsChange = async (currentRowsPerPage, currentPage) => {
    props?.handlePerRowsChange(currentRowsPerPage, currentPage);
  };

  return (
    <>
      <DataTable
        className="search-component-table"
        columns={columns}
        data={props.data}
        pagination
        paginationServer
        customStyles={tableCustomStyle(false)}
        paginationDefaultPage={props?.currentPage}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handlePerRowsChange}
        paginationTotalRows={props?.totalCount}
        paginationPerPage={props?.rowsPerPage}
        sortIcon={<CustomSVG.SortUp width={"16px"} height={"16px"} fill={"#0b4b66"} />}
        paginationRowsPerPageOptions={defaultPaginationValues}
        fixedHeader={true}
        fixedHeaderScrollHeight={"70vh"}
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
    </>
  );
};

export default MyBillsTable;
