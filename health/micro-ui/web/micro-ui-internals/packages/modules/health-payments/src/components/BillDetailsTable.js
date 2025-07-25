import React, { Fragment, useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Button, CustomSVG, Tag, Toast, Tooltip, TooltipWrapper } from "@egovernments/digit-ui-components";
import { InfoOutline } from "@egovernments/digit-ui-svg-components";

import { downloadFileWithName, formatTimestampToDate, getCustomPaginationOptions } from "../utils";
import DataTable from "react-data-table-component";
import { tableCustomStyle } from "./table_inbox_custom_style";
import { defaultPaginationValues } from "../utils/constants";
import { useHistory } from "react-router-dom";
import EditWorkerDetailsPopUp from "./editWorkerDetailsPopUp ";


const BillDetailsTable = ({ ...props }) => {
    const { t } = useTranslation();
    const history = useHistory();
    const [showToast, setShowToast] = useState(null);
    const project = Digit?.SessionStorage.get("staffProjects");
    const selectedProject = Digit?.SessionStorage.get("selectedProject");
    const [showEditField, setShowEditField] = useState(false);
    const [editFieldName, setEditFieldName] = useState(null);
    const [fieldKey, setFieldKey] = useState(null);
    const [editingRowIndex, setEditingRowIndex] = useState(null);
    const [initialFieldValue, setInitialFieldValue] = useState("");
    const [tableData, setTableData] = useState(props?.data || []);

    useEffect(() => {
        setTableData(props?.data || []);
    }, [props?.data]);

    const columns = useMemo(() => {
        const baseColumns = [
            {
                name: (
                    <div style={{ borderRight: "2px solid #787878", width: "100%", textAlign: "start" }}>
                        {t("HCM_AM_WORKER_ID")}
                    </div>
                ),
                selector: (row) => {
                    return (
                        <div className="ellipsis-cell" title={t(row?.billNumber) || t("NA")}>
                            {t(row?.userId) || t("NA")}
                        </div>
                    );
                },
            },
            {
                name: (
                    <div style={{ borderRight: "2px solid #787878", width: "100%", textAlign: "start" }}>
                        {t("HCM_AM_WORKER_NAME")}
                    </div>
                ),
                selector: (row) => {
                    const showErrorName =
                        (row?.status === "VERIFICATION_FAILED" || row?.status === "PENDING_EDIT") &&
                        (["NAME_MISMATCH", "MTN_USERINFO_MISSING_NAME", "MTN_USERINFO_FETCH_FAILED"].includes(row?.additionalDetails?.reasonForFailure));

                    return (
                        <div
                            className="ellipsis-cell"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                minWidth: 0,
                                maxWidth: "100%",
                            }}
                        >
                            {/* Name with ellipsis */}
                            <span
                                className="ellipsis-cell"
                                style={{
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    maxWidth: "160px", // control how much space name can take
                                    display: "inline-block",
                                    marginRight: "4px",
                                }}
                                title={row?.givenName ? row?.givenName : t("NA")}
                            >
                                {row?.givenName ? row?.givenName : t("NA")}
                            </span>

                            {/* Edit Button - Compact */}
                            {props?.editBill && row?.status === "PENDING_EDIT" &&
                                (
                                    <Button
                                        style={{
                                            minWidth: "auto",
                                            padding: "0px 4px",
                                            fontSize: "11px",
                                            height: "20px",
                                            lineHeight: "16px",
                                            marginRight: "4px",
                                        }}
                                        variation="secondary"
                                        size="small"
                                        icon="Edit"
                                        onClick={() => {
                                            setShowEditField(true);
                                            setFieldKey("givenName");
                                            setInitialFieldValue(row?.givenName || "");
                                            setEditingRowIndex(row?.id);
                                            setEditFieldName(t("HCM_AM_WORKER_NAME"));
                                        }}
                                    />
                                )}

                            {/* Error Icon with Tooltip */}
                            {showErrorName && (
                                <TooltipWrapper
                                    arrow
                                    content={
                                        <div
                                            style={{
                                                maxWidth: "600px",
                                                whiteSpace: "normal",
                                                wordWrap: "break-word",
                                            }}
                                        >
                                            {t(row?.additionalDetails?.reasonForFailure)}
                                        </div>
                                    }
                                    enterDelay={100}
                                    header={t("HCM_AM_DATA_ERROR")}
                                    leaveDelay={0}
                                    placement="right"
                                >
                                    <span style={{ display: "inline-block" }}>
                                        <Button
                                            style={{
                                                minWidth: "auto",
                                                color: "#B91900",
                                                paddingLeft: "0.25rem",
                                                cursor: "default",
                                                backgroundColor: "transparent"
                                            }}
                                            variation="tertiary"
                                            size="medium"
                                            icon="Error"
                                            iconFill="#B91900"
                                        />
                                    </span>
                                </TooltipWrapper>
                            )}
                        </div>
                    );
                },
                //             selector: (row) => {
                //                 return (
                //                 <div style={{ display: "flex", alignItems: "center",minWidth: 0  }}>
                //                     <span className="ellipsis-cell" style={{ marginRight: "8px",        overflow: "hidden",
                //     textOverflow: "ellipsis",
                //     minWidth: 0,  }}
                //                         title={
                //                             row?.givenName
                //                             ? t(`${row?.givenName}`)
                //                             : t("NA")
                //                         }>
                //                         {
                //                             row?.givenName
                //                             ? t(`${row?.givenName}`)
                //                             : t("NA")
                //                         }
                //                         </span>
                //                         {/* {row?.status === "VERIFICATION_FAILED" && row?.additionalDetails?.reasonForFailure === "NAME_MISMATCH"?
                //                         (
                //                             <div style={{ display: "flex", alignItems: "center" }}> */}
                //                             {props?.editBill && row?.status === "PENDING_EDIT"? (
                //                            <Button
                //                             style={{ minWidth: "auto" }}
                //                             variation="secondary"
                //                             size="small"
                //                             icon="Edit"
                //                             onClick={() => {
                //                                 setShowEditField(true);
                //                                 setFieldKey("givenName");
                //                                 setInitialFieldValue(row?.givenName || "");
                //                                 setEditingRowIndex(row?.id); // pass index of the row being edited
                //                                 setEditFieldName(t("HCM_AM_WORKER_NAME"));
                //                                 // renderEditField("name");
                //                             }}
                //                             />):null
                //                             }
                //                     {
                //                     (row?.status === "VERIFICATION_FAILED" || row?.status === "PENDING_EDIT") && 
                //                     row?.additionalDetails?.reasonForFailure === "NAME_MISMATCH"?(
                //                             <div style={{ display: "flex", alignItems: "center" }}>
                //                             <div>

                //                             <TooltipWrapper
                //                             arrow={true}
                // content={<>
                // <div style={{ maxWidth: "600px", whiteSpace: "normal", wordWrap: "break-word" }}>
                //     {t(row?.additionalDetails?.reasonForFailure)}</div></>}
                //                             enterDelay={100}
                //                             header="Data Error"
                //                             leaveDelay={0}
                //                             placement="right"
                //                             >
                //                             <span style={{ display: "inline-block" }}>

                //                             <Button
                //                             style={{ minWidth: "auto", color:"#B91900", paddingLeft: "0.5rem", cursor: "default" }}
                //                             variation="teritiary"
                //                             size="medium"
                //                             icon="Error"
                //                             iconFill="#B91900"/>
                //                             </span>
                //                            </TooltipWrapper>
                //                            </div>                                
                //                             </div>
                //                         ):(
                //                                 []
                //                             )}
                //                 </div>
                //                 );
                //             },
                allowOverflow: true,
            },
            {
                name: (
                    <div style={{ borderRight: "2px solid #787878", width: "100%", textAlign: "start" }}>
                        {t(`HCM_AM_MOBILE_NUMBER`)}
                    </div>
                ),
                selector: (row) => {
                    const showErrorMobileNumber =
                        (row?.status === "VERIFICATION_FAILED" || row?.status === "PENDING_EDIT") &&
                        (["MTN_ACCOUNT_VALIDATION_FAILED", "MTN_ACCOUNT_INACTIVE", "MTN_USERINFO_FETCH_FAILED"].includes(row?.additionalDetails?.reasonForFailure));
                    return (
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            minWidth: 0,
                            maxWidth: "100%",
                        }}>
                            <span className="ellipsis-cell"
                                style={{
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    maxWidth: "160px",
                                    display: "inline-block",
                                    marginRight: "4px",
                                }}>
                                {t(row?.mobileNumber) || t("ES_COMMON_NA")}
                            </span>
                            {props?.editBill && row?.status === "PENDING_EDIT" ? (
                                <Button
                                    style={{
                                        minWidth: "auto",
                                        padding: "0px 4px",
                                        fontSize: "11px",
                                        height: "20px",
                                        lineHeight: "16px",
                                        marginRight: "4px",
                                    }}
                                    variation="secondary"
                                    size="small"
                                    icon="Edit"
                                    onClick={() => {
                                            setFieldKey("mobileNumber");
                                            setInitialFieldValue(row?.mobileNumber || "");
                                            setEditingRowIndex(row?.id);
                                            setShowEditField(true);
                                            setEditFieldName(t("HCM_AM_MOBILE_NUMBER"));
                                    }}
                                />) : null
                            }
                            {
                                showErrorMobileNumber ?
                                    (
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            <div>

                                                <TooltipWrapper
                                                    arrow={true}
                                                    content={<>
                                                        <div
                                                            style={{
                                                                maxWidth: "600px",
                                                                whiteSpace: "normal",
                                                                wordWrap: "break-word",
                                                            }}>
                                                            {t(row?.additionalDetails?.reasonForFailure)}</div></>}
                                                    enterDelay={100}
                                                    header = {t("HCM_AM_DATA_ERROR")}
                                                    leaveDelay={0}
                                                    placement="right"
                                                >
                                                    <span style={{ display: "inline-block" }}>

                                                        <Button
                                                            style={{
                                                                minWidth: "auto",
                                                                color: "#B91900",
                                                                paddingLeft: "0.25rem",
                                                                cursor: "default",
                                                                backgroundColor: "transparent"
                                                            }}
                                                            variation="teritiary"
                                                            size="medium"
                                                            icon="Error"
                                                            iconFill="#B91900" />
                                                    </span>
                                                </TooltipWrapper>
                                            </div>
                                        </div>
                                    ) : (
                                        []
                                    )}
                        </div>
                    );
                },
                allowOverflow: true,
            },
            {
                name: (
                    <div style={{ borderRight: "2px solid #787878", width: "100%", textAlign: "start" }}>
                        {t(`HCM_AM_MNO_NAME`)}
                    </div>
                ),
                selector: (row) => {
                    return (
                        <span className="ellipsis-cell" style={{ fontSize: "14px" }}>
                            {t(row?.operator) || t("MTN")}
                        </span>
                    );
                },
                style: {
                    justifyContent: "start",
                },
            },
            {
                name: (
                    <div style={{ borderRight: "2px solid #787878", width: "100%", textAlign: "start" }}>
                        {t("HCM_AM_NUMBER_OF_DAYS")}
                    </div>
                ),
                selector: (row) => {
                    const totalAmount = parseInt(row?.totalAmount) || 0;
                    const wage = parseInt(row?.wage) || 0;
                    const days = wage > 0 ? (totalAmount / wage) : 0; //TODO : ADD LOGIC TO CALCULATE DAYS FROM MUSTERROLL

                    console.log("days", days);
                    return (
                        <div className="ellipsis-cell" style={{ paddingRight: "1rem" }}>
                            {(days)}
                        </div>
                    );
                },
                style: {
                    justifyContent: "flex-end",
                },
            },
            {
                name: (
                    <div style={{ borderRight: "2px solid #787878", width: "100%", textAlign: "start" }}>
                        {t("HCM_AM_WAGE")}
                    </div>
                ),
                selector: (row) => {
                    return (
                        <div className="ellipsis-cell" style={{ paddingRight: "1rem" }}>
                            {t(row?.wage) || t("NA")}
                        </div>
                    );
                },
                style: {
                            justifyContent: "flex-end",
                        },
            },
            {
                name: (
                    <div style={{ borderRight: "2px solid #787878", width: "100%", textAlign: "start" }}>
                        {t("HCM_AM_TOTAL_AMOUNT")}
                    </div>
                ),
                selector: (row) => {
                    return (
                        <div className="ellipsis-cell" style={{ paddingRight: "1rem" }}>
                            {row?.totalAmount ? `${row.totalAmount} USD` : t("NA")}
                        </div>
                    );
                },
                style: {
                            justifyContent: "flex-end",
                        },
            },


        ];

        return baseColumns;
    }, [tableData, t, props?.isSelectionDisabledTransfer, props?.isSelectionDisabledVerify]);

    const handlePageChange = (page, totalRows) => {
        props?.handlePageChange(page, totalRows);
    };

    const handlePerRowsChange = async (currentRowsPerPage, currentPage) => {
        props?.handlePerRowsChange(currentRowsPerPage, currentPage);
    };

    const handleFieldUpdate = (key, newValue) => {
        console.log("inside handleFieldUpdate", key, newValue, editingRowIndex);
        const updatedData = tableData.map((row) =>
            row.id === editingRowIndex
                ? { ...row, [key]: newValue } // update and optionally mark as verified
                : row
        );
        setTableData(updatedData);
        setShowEditField(false);
        setEditFieldName(null);
        setEditingRowIndex(null);
    };
    const handleSelectedRowsChange = ({ selectedRows }) => {
        props?.onSelectionChange(selectedRows);
    };
    console.log("iselectionVerify",  props?.isSelectionDisabledVerify)
    return (
        <>
            <DataTable
                className="search-component-table"
                columns={columns}
                data={tableData}
                pagination
                paginationServer
                customStyles={tableCustomStyle(false)}
                paginationDefaultPage={props?.currentPage}
                onChangePage={handlePageChange}
                onChangeRowsPerPage={handlePerRowsChange}
                clearSelectedRows={props?.clearSelectedRows}
                paginationTotalRows={props?.totalCount}
                paginationPerPage={props?.rowsPerPage}
                sortIcon={<CustomSVG.SortUp width={"16px"} height={"16px"} fill={"#0b4b66"} />}
                paginationRowsPerPageOptions={defaultPaginationValues}
                fixedHeader={true}
                selectableRows={props?.selectableRows}
                selectableRowDisabled={(row) =>
                    (props?.status === "VERIFIED" && props?.isSelectionDisabledTransfer) ||
                    (props?.status === "PAYMENT_FAILED" && props?.isSelectionDisabledTransfer) ||
                    (props?.status === "NOT_VERIFIED" && props?.isSelectionDisabledVerify) || //TODO
                    (row?.status === 'PENDING_EDIT' && !props?.editBill) ||
                    (row?.status === 'EDITED' && props?.editBill)
                }
                conditionalRowStyles={[
                    {
                        when: (row) =>
                            (props?.status === "VERIFIED" && props?.isSelectionDisabledTransfer) ||
                            (props?.status === "PAYMENT_FAILED" && props?.isSelectionDisabledTransfer) ||
                            (props?.status === "NOT_VERIFIED" && props?.isSelectionDisabledVerify) ||//TODO
                            (row?.status === 'PENDING_EDIT' && !props?.editBill),
                        // || (row?.status === 'EDITED' && props?.editBill),
                        style: {
                            backgroundColor: "#f0f0f0",
                            color: "#999",
                            // cursor: "not-allowed",
                            opacity: 0.6,
                        },
                    },
                ]}
                onSelectedRowsChange={handleSelectedRowsChange}
                fixedHeaderScrollHeight={"70vh"}
                paginationComponentOptions={getCustomPaginationOptions(t)}
            />
            {showEditField && (
                <EditWorkerDetailsPopUp
                    onClose={() => setShowEditField(false)} //TODO: ADD LOGIC TO CLEAR SAVED FIELDS NAMES
                    editFieldName={editFieldName}
                    onSubmit={handleFieldUpdate}
                    fieldKey={fieldKey}
                    initialValue={initialFieldValue}
                />
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
        </>
    );
};

export default BillDetailsTable;
