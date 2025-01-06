import React, { useState, useEffect, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, Card, InfoButton, Loader, TableMolecule, TextInput, Toast } from "@egovernments/digit-ui-components";
import { CustomSVG } from "@egovernments/digit-ui-components";
import { CheckBox } from "@egovernments/digit-ui-components";

/* Use this util function to download the file from any s3 links */
export const downloadExcelFromLink = async (link, openIn = "_blank") => {
    try {
        const response = await fetch(link, {
            responseType: "arraybuffer",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // MIME type for Excel
            },
            method: "GET",
            mode: "cors",
        }).then((res) => res.blob());

        if (window.mSewaApp && window.mSewaApp.isMsewaApp() && window.mSewaApp.downloadBase64File) {
            var reader = new FileReader();
            reader.readAsDataURL(response);
            reader.onloadend = function () {
                var base64data = reader.result;
                const fileName = decodeURIComponent(
                    link.split("?")[0].split("/").pop().slice(13) || "file.xlsx"
                );
                window.mSewaApp.downloadBase64File(base64data, fileName);
            };
        } else {
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            const url = window.URL.createObjectURL(response);
            a.href = url;
            const fileName = decodeURIComponent(
                link.split("?")[0].split("/").pop().slice(13) || "file.xlsx"
            );
            a.download = fileName.endsWith(".xlsx") ? fileName : `${fileName}.xlsx`;
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }
    } catch (error) {
        console.error("Error downloading the Excel file:", error);
    }
};


const MyBillsTable = ({ ...props }) => {
    const { t } = useTranslation();
    const history = useHistory();
    const url = Digit.Hooks.useQueryParams();
    const [showToast, setShowToast] = useState(null);

    const getFileUrl = async (fileStoreId) => {
        try {
            const response = await Digit.UploadServices.Filefetch([fileStoreId], Digit.ULBService.getStateId());
            if (response?.data?.fileStoreIds?.length > 0) {
                const url = response.data.fileStoreIds[0]?.url;
                if (url.includes(".jpg") || url.includes(".png")) {
                    const arr = url.split(",");
                    const [original, large, medium, small] = arr;
                    return original;
                }
                return response.data.fileStoreIds[0]?.url;
            }
        } catch (err) {
        }
    };

    const downloadDocument = async (filestoreId, filetype) => {
        if (!filestoreId || !filestoreId.length) {
            alert("No Document exists!");
            return;
        }

        const fileUrl = await getFileUrl(filestoreId);
        if (fileUrl && filetype === "PDF") {
            Digit.Utils.downloadPDFFromLink(fileUrl);
        } else if (fileUrl) {
            downloadExcelFromLink(fileUrl)
        }
    };

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
        return props.data.map(([billId, billDate, noOfRegisters, noOfWorkers, boundaryCode, projectName, reportDetails]) => [
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
                showBottom={true}
                onOptionSelect={(value) => {
                    if (value.code === "HCM_AM_PDF") {
                        downloadDocument(pdfID, "PDF")
                    } else if (value.code === "HCM_AM_EXCEL") {
                        downloadDocument(excelID, "EXCEL")
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
                // style={{ minWidth: "15rem" }}
                title=""
                type="actionButton"
                variation="secondary"
            /> :
                <InfoButton
                    className="dm-workbench-download-template-btn"
                    infobuttontype={reportDetails.status === "FAILED" ? "error" : "info"}
                    icon={"Info"}
                    label={reportDetails.status === "FAILED" ? t("HCM_AM_FAILED_BILL") : t("HCM_AM_PROGRESS_BILL")}
                    style={{ opacity: 1, width: "16rem", border: "none" }}
                    onClick={() => {
                        setShowToast({
                            key: reportDetails.status === "FAILED" ? "error" : "info", label: reportDetails?.status === "INITIATED"
                                ? t("HCM_AM_BILL_GENERATION_IN_PROGRESS_MESSAGE")
                                : (reportDetails?.errorMessage
                                    ? t(reportDetails?.errorMessage)
                                    : t("HCM_AM_BILL_GENERATION_FAILED_MESSAGE")), transitionTime: 3000
                        });
                    }}
                />
        ]);
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

    console.log(props.data, "PPPPPPPPPPPPPPPPPPPPPPP");


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
