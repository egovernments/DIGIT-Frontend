import React, { useState, useEffect, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, Card, InfoButton, Loader, TableMolecule, TextInput, Toast, TooltipWrapper } from "@egovernments/digit-ui-components";
import { CustomSVG } from "@egovernments/digit-ui-components";
import { CheckBox } from "@egovernments/digit-ui-components";
import axios from "axios";

export const downloadExcelWithName = ({ fileStoreId = null, customName = null }) => {
    const downloadExcel = (blob, fileName) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName + ".xlsx";
        document.body.append(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(link.href), 7000);
    };

    if (fileStoreId) {
        axios
            .get("/filestore/v1/files/id", {
                responseType: "arraybuffer",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    "auth-token": Digit.UserService.getUser()?.["access_token"],
                },
                params: {
                    tenantId: Digit.ULBService.getCurrentTenantId(),
                    fileStoreId: fileStoreId,
                },
            })
            .then(async (res) => {
                downloadExcel(
                    new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
                    customName ? customName : "download"
                );
            });
    }
};

export const downloadPDFWithName = ({ fileStoreId = null, customName = null }) => {
    const downloadExcel = (blob, fileName) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName + ".pdf";
        document.body.append(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(link.href), 7000);
    };

    if (fileStoreId) {
        axios
            .get("/filestore/v1/files/id", {
                responseType: "arraybuffer",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    "auth-token": Digit.UserService.getUser()?.["access_token"],
                },
                params: {
                    tenantId: Digit.ULBService.getCurrentTenantId(),
                    fileStoreId: fileStoreId,
                },
            })
            .then(async (res) => {
                downloadExcel(
                    new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
                    customName ? customName : "download"
                );
            });
    }
};

const MyBillsTable = ({ ...props }) => {
    const { t } = useTranslation();
    const history = useHistory();
    const url = Digit.Hooks.useQueryParams();
    const [showToast, setShowToast] = useState(null);
    const tenantId = Digit.ULBService.getCurrentTenantId();


    const columns = useMemo(() => {
        const baseColumns = [
            {
                label: t(`HCM_AM_BILL_ID`),
                type: "text",
            },
            {
                label: t("HCM_AM_BILL_DATE"),
                type: "text",
            },
            {
                label: t("HCM_AM_NO_OF_REGISTERS"),
                type: "serialno",
            },
            {
                label: t("HCM_AM_NUMBER_OF_WORKERS"),
                type: "serialno",
            },
            {
                label: t("HCM_AM_BOUNDARY_NAME"),
                type: "text",
            },
            {
                label: t("HCM_AM_PROJECT_NAME"),
                type: "text",
            },
            {
                label: t("HCM_AM_BILL_ACTIONS"),
                type: "custom",
            },
        ];

        return baseColumns;
    }, [props.data, t]);

    // Map attendance data to rows
    // [billId, billDate, noOfRegisters, noOfWorkers, boundaryCode, projectName, pdfID, excelID]
    const rows = useMemo(() => {
        return props.data.map(([billId, billDate, noOfRegisters, noOfWorkers, boundaryCode, projectName, reportDetails], index) => {

            const isLastRow = index === props.data.length - 1;

            return [
                { label: billId, maxLength: 64 },
                { label: billDate, maxLength: 64 },
                noOfRegisters,
                noOfWorkers,
                { label: boundaryCode, maxLength: 64 },
                { label: projectName, maxLength: 64 },
                reportDetails?.status === "COMPLETED" ? <Button
                    className="custom-class"
                    iconFill=""
                    icon="FileDownload"
                    isSuffix
                    label={t(`HCM_AM_DOWNLOAD_BILLS`)}
                    showBottom={isLastRow ? false : true}
                    onOptionSelect={(value) => {
                        if (value.code === "HCM_AM_PDF") {
                            if (reportDetails?.pdfReportId) {
                                downloadPDFWithName({ fileStoreId: reportDetails?.pdfReportId, customName: `${billId}` })
                            } else {
                                setShowToast({ key: "error", label: t(`HCM_AM_PDF_GENERATION_FAILED`), transitionTime: 3000 });
                            }
                        } else if (value.code === "HCM_AM_EXCEL") {
                            if (reportDetails?.excelReportId) {
                                downloadExcelWithName({ fileStoreId: reportDetails?.excelReportId, customName: `${billId}` });
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
                    style={{ minWidth: "15rem" }}
                    type="actionButton"
                    variation="secondary"
                /> :
                    <TooltipWrapper placement="top" content={reportDetails.status === "FAILED" ? t("HCM_AM_FAILED_REPORT_GENERATION") : t("HCM_AM_PROGRESS_REPORT_GENERATION")} >
                        <InfoButton
                            className="dm-workbench-download-template-btn"
                            infobuttontype={reportDetails.status === "FAILED" ? "error" : "info"}
                            icon={"Info"}
                            label={reportDetails.status === "FAILED" ? t("HCM_AM_FAILED_REPORT_GENERATION") : t("HCM_AM_PROGRESS_REPORT_GENERATION")}
                            style={{ opacity: 1, width: "16rem", border: "none" }}
                        // onClick={() => {
                        //     setShowToast({
                        //         key: reportDetails?.status === "FAILED" ? "error" : "info", label: reportDetails?.status === "INITIATED"
                        //             ? t("HCM_AM_BILL_GENERATION_IN_PROGRESS_MESSAGE")
                        //             : (reportDetails?.errorMessage
                        //                 ? t(reportDetails?.errorMessage)
                        //                 : t("HCM_AM_BILL_GENERATION_FAILED_MESSAGE")), transitionTime: 3000
                        //     });
                        // }}
                        />
                    </TooltipWrapper>

            ];
        }
        );
    }, [props.data]);

    const handlePageChange = (page, totalRows) => {
        props?.handlePageChange(page, totalRows);
    };

    const handleRowSelect = (event) => {
        props?.onRowSelect(event);
    };

    const handlePerRowsChange = async (currentRowsPerPage, currentPage) => {
        props?.handlePerRowsChange(currentRowsPerPage, currentPage);
    };

    return (
        <div className="component-table-wrapper">
            <TableMolecule
                actionButtonLabel=""
                actions={[]}
                className=""
                footerProps={{
                    addStickyFooter: false,
                    footerContent: null,
                    hideFooter: false,
                    isStickyFooter: false,
                    scrollableStickyFooterContent: true,
                    stickyFooterContent: null,
                }}
                frozenColumns={0}
                headerData={columns}
                onFilter={function noRefCheck() { }}
                pagination={{
                    initialRowsPerPage: 5,
                    rowsPerPageOptions: [5, 10, 15, 20],
                }}
                rows={rows}
                selection={{
                    addCheckbox: false,
                    checkboxLabel: "",
                    initialSelectedRows: [],
                    onSelectedRowsChange: function noRefCheck() { },
                    showSelectedState: false,
                }}
                sorting={{
                    customSortFunction: function noRefCheck() { },
                    initialSortOrder: "",
                    isTableSortable: false,
                }}
                styles={{
                    extraStyles: {},
                    withAlternateBg: false,
                    withBorder: true,
                    withColumnDivider: false,
                    withHeaderDivider: true,
                    withRowDivider: true,
                }}
                tableDetails={{
                    tableDescription: "",
                    tableTitle: "",
                }}
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
        </div>
    );
};

export default MyBillsTable;
