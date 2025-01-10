import React, { Fragment, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Button, CustomSVG, InfoButton, Tag, Toast, TooltipWrapper } from "@egovernments/digit-ui-components";
import { downloadFileWithName } from "../utils";
import DataTable from "react-data-table-component";
import { tableCustomStyle } from "./custom_comp/table_inbox_custom_style";

const MyBillsTable = ({ ...props }) => {
    const { t } = useTranslation();
    const [showToast, setShowToast] = useState(null);
    const project = Digit?.SessionStorage.get("staffProjects");

    function formatTimestampToDate(timestamp) {
        // Check if the timestamp is valid
        if (!timestamp || typeof timestamp !== "number") {
            return "Invalid timestamp";
        }

        // Convert timestamp to a JavaScript Date object
        const date = new Date(timestamp);

        // Format the date to a readable format (e.g., DD/MM/YYYY)
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-indexed
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    }

    const columns = useMemo(() => {
        const baseColumns = [
            {
                name: t("HCM_AM_BILL_ID"),
                selector: (row) => {
                    console.log(row);
                    return (
                        <div className="ellipsis-cell" title={t(row?.billNumber) || t("NA")}>
                            {t(row?.billNumber) || t("NA")}
                        </div>
                    );
                },
            },
            {
                name: t("HCM_AM_BILL_DATE"),
                selector: (row) => {
                    return (
                        <div className="ellipsis-cell" >
                            {formatTimestampToDate(row.billDate) || t("NA")}
                        </div>
                    );
                },
            },

            {
                name: t("HCM_AM_NO_OF_REGISTERS"),
                selector: (row) => {
                    return (
                        <div className="ellipsis-cell" style={{ paddingRight: "4.5rem" }}>
                            {t(row?.additionalDetails?.noOfRegisters || "0")}
                        </div>
                    );
                },
                style: {
                    justifyContent: "flex-end",
                },
            },
            {
                name: t("HCM_AM_NUMBER_OF_WORKERS"),
                selector: (row) => {
                    return (
                        <div className="ellipsis-cell" style={{ paddingRight: "4.5rem" }}>
                            {t(row?.billDetails?.length) || t("0")}
                        </div>
                    );
                },
                style: {
                    justifyContent: "flex-end",
                },
            },
            {
                name: t("HCM_AM_BOUNDARY_NAME"),
                selector: (row) => {
                    return (
                        <div className="ellipsis-cell" >
                            {t(row.localityCode) || t("NA")}
                        </div>
                    );
                },
            },

            {
                name: t("HCM_AM_PROJECT_NAME"),
                selector: (row) => {
                    return (
                        <div className="ellipsis-cell" title={t(project?.[0]?.name || "0")}>
                            {t(project?.[0]?.name || `NA`)}
                        </div>
                    );
                },
            },
            {
                name: t("HCM_AM_BILL_ACTIONS"),
                selector: (row, index) => {
                    const reportDetails = row?.additionalDetails?.reportDetails;
                    const billId = row?.billNumber;
                    const isLastRow = index === props.totalCount - 1;

                    return (
                        reportDetails?.status === "COMPLETED" ? <Button
                            className="custom-class"
                            iconFill=""
                            icon="FileDownload"
                            isSuffix
                            label={t(`HCM_AM_DOWNLOAD_BILLS`)}
                            title={t(`HCM_AM_DOWNLOAD_BILLS`)}
                            showBottom={isLastRow ? false : true}
                            onOptionSelect={(value) => {
                                if (value.code === "HCM_AM_PDF") {
                                    if (reportDetails?.pdfReportId) {
                                        downloadFileWithName({ fileStoreId: reportDetails?.pdfReportId, customName: `${billId}`, type: "pdf" })
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
                            size=""
                            style={{ minWidth: "14rem" }}
                            type="actionButton"
                            variation="secondary"
                        /> :
                            <div>
                                <Tag
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
                columns={columns}
                data={props.data}
                pagination
                paginationServer
                customStyles={tableCustomStyle}
                paginationDefaultPage={props?.currentPage}
                onChangePage={handlePageChange}
                onChangeRowsPerPage={handlePerRowsChange}
                paginationTotalRows={props?.totalCount}
                paginationPerPage={props?.rowsPerPage}
                sortIcon={<CustomSVG.SortUp width={"16px"} height={"16px"} fill={"#0b4b66"} />}
                paginationRowsPerPageOptions={[5, 10, 15, 20]}
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

export default MyBillsTable;
