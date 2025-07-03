import React, { Fragment, useState,useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Button, CustomSVG, Tag, Toast, Tooltip, TooltipWrapper } from "@egovernments/digit-ui-components";
import { InfoOutline } from "@egovernments/digit-ui-svg-components";

import { downloadFileWithName, formatTimestampToDate, getCustomPaginationOptions } from "../utils";
import DataTable from "react-data-table-component";
import { tableCustomStyle } from "./table_inbox_custom_style";
import { defaultPaginationValues } from "../utils/constants";
import { useHistory } from "react-router-dom";
import EditWorkerDetailsPopUp from "./editWorkerDetailsPopUp ";

/**
 * @function VerifyAndGeneratePaymentsTable
 * @param {Object} props - Component props
 * @param {Array} props.data - Array of objects containing bill data
 * @param {Function} props.handlePageChange - Function to handle page change
 * @param {Function} props.handlePerRowsChange - Function to handle per row change
 * @param {Number} props.currentPage - Current page number
 * @param {Number} props.rowsPerPage - Number of rows per page
 * @param {Number} props.totalCount - Total count of bills
 * @returns {React.ReactElement} Returns the component
 */

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

    // const { isLoading: isBillLoading, data: BillData, refetch: refetchBill, isFetching } = Digit.Hooks.useCustomAPIHook(BillSearchCri);

    // const renderEditField = (field)=>(
    // <div className="label-pair">
    //   <EditWorkerDetailsPopUp/>
    // </div>
    // );
    const billDetails = [
        {
            "id": "123456",
            "name":"Worker 1",
            "role":"Distrubutor",
            "billDate": 1698307200000,
            "noOfDays": 5,
            "wage": "30",
            "totalAmount": "150",
        },
        {
            "id": "123456",
            "name":"Worker 1",
            "role":"Distrubutor",
            "billDate": 1698307200000,
            "noOfDays": 5,
            "wage": "30",
            "totalAmount": "150",
        },
        {
            "id": "123456",
            "name":"Worker 1",
            "role":"Distrubutor",
            "billDate": 1698307200000,
            "noOfDays": 5,
            "wage": "30",
            "totalAmount": "150",
        },
        {
            "id": "123456",
            "name":"Worker 1",
            "role":"Distrubutor",
            "billDate": 1698307200000,
            "noOfDays": 5,
            "wage": "30",
            "totalAmount": "150",
        },
        {
            "id": "123456",
            "name":"Worker 1",
            "role":"Distrubutor",
            "billDate": 1698307200000,
            "noOfDays": 5,
            "wage": "30",
            "totalAmount": "150",
        },
        {
            "id": "123456",
            "name":"Worker 1",
            "role":"Distrubutor",
            "billDate": 1698307200000,
            "noOfDays": 5,
            "wage": "30",
            "totalAmount": "150",
        },
        {
            "id": "123456",
            "name":"Worker 1",
            "role":"Distrubutor",
            "billDate": 1698307200000,
            "noOfDays": 5,
            "wage": "30",
            "totalAmount": "150",
        },
        {
            "id": "123456",
            "name":"Worker 1",
            "role":"Distrubutor",
            "billDate": 1698307200000,
            "noOfDays": 5,
            "wage": "30",
            "totalAmount": "150",
        },
        {
            "id": "123456",
            "name":"Worker 1",
            "role":"Distrubutor",
            "billDate": 1698307200000,
            "noOfDays": 5,
            "wage": "30",
            "totalAmount": "150",
        },
        {
            "id": "123456",
            "name":"Worker 1",
            "role":"Distrubutor",
            "billDate": 1698307200000,
            "noOfDays": 5,
            "wage": "30",
            "totalAmount": "150",
        },
        {
            "id": "123456",
            "name":"Worker 1",
            "role":"Distrubutor",
            "billDate": 1698307200000,
            "noOfDays": 5,
            "wage": "30",
            "totalAmount": "150",
        },
        {
            "id": "123456",
            "name":"Worker 1",
            "role":"Distrubutor",
            "billDate": 1698307200000,
            "noOfDays": 5,
            "wage": "30",
            "totalAmount": "150",
        }
    ]


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
                    return (
                    <div style={{ display: "flex", alignItems: "center",minWidth: 0  }}>
                        <span className="ellipsis-cell" style={{ marginRight: "8px",        overflow: "hidden",
        textOverflow: "ellipsis",
        minWidth: 0,  }}
                            title={
                                row?.givenName
                                ? t(`${row?.givenName}`)
                                : t("NA")
                            }>
                            {
                                row?.givenName
                                ? t(`${row?.givenName}`)
                                : t("NA")
                            }
                            </span>
                            {/* {row?.status === "VERIFICATION_FAILED" && row?.additionalDetails?.reasonForFailure === "NAME_MISMATCH"?
                            (
                                <div style={{ display: "flex", alignItems: "center" }}> */}
                                {props?.editBill && row?.status === "PENDING_EDIT"? (
                               <Button
                                style={{ minWidth: "auto" }}
                                variation="secondary"
                                size="small"
                                icon="Edit"
                                onClick={() => {
                                    setShowEditField(true);
                                    setFieldKey("givenName");
                                    setInitialFieldValue(row?.givenName || "");
                                    setEditingRowIndex(row?.id); // pass index of the row being edited
                                    setEditFieldName(t("HCM_AM_WORKER_NAME"));
                                    // renderEditField("name");
                                }}
                                />):null
                                }
                        {
                        (row?.status === "VERIFICATION_FAILED" || row?.status === "PENDING_EDIT") && 
                        row?.additionalDetails?.reasonForFailure === "NAME_MISMATCH"?(
                                <div style={{ display: "flex", alignItems: "center" }}>
                                <div>
                 
                                <TooltipWrapper
                                arrow={true}
    content={<>
    <div style={{ maxWidth: "600px", whiteSpace: "normal", wordWrap: "break-word" }}>
        {t(row?.additionalDetails?.reasonForFailure)}</div></>}
                                enterDelay={100}
                                header="Data Error"
                                leaveDelay={0}
                                placement="right"
                                >
                                <span style={{ display: "inline-block" }}>
                                   
                                <Button
                                style={{ minWidth: "auto", color:"#B91900", paddingLeft: "0.5rem", cursor: "default" }}
                                variation="teritiary"
                                size="medium"
                                icon="Error"
                                iconFill="#B91900"/>
                                </span>
                               </TooltipWrapper>
                               </div>                                
                                </div>
                            ):(
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
          {t(`HCM_AM_MOBILE_NUMBER`)}
        </div>
      ),
      selector: (row) => {
        return (
            <div style={{ display: "flex", alignItems: "center", minWidth: 0 }}>
          <span className="ellipsis-cell" style={{ marginRight: "8px",        overflow: "hidden",
        textOverflow: "ellipsis",
        minWidth: 0, }}>
            {t(row?.mobileNumber) || t("ES_COMMON_NA")} </span>
            {/* {row?.status === "PENDING_EDIT" && row?.additionalDetails?.reasonForFailure === "MOB_MISMATCH"?( */}
                                {/* <div style={{ display: "flex", alignItems: "center" }}> */}
                                {props?.editBill && row?.status === "PENDING_EDIT" && 
                        row?.additionalDetails?.reasonForFailure === "MOB_MISMATCH"? (
                                <Button
                                style={{ minWidth: "auto" }}
                                variation="secondary"
                                size="small"
                                icon="Edit"
                                onClick={() => {
                                    setShowEditField(true);
                                    setEditFieldName(t("HCM_AM_MOBILE_NUMBER"));
                                }}
                                />):null
                                }
                                {
                                (row?.status === "VERIFICATION_FAILED" || row?.status === "PENDING_EDIT") && 
                        row?.additionalDetails?.reasonForFailure === "MOB_MISMATCH"?( //TODO : SET REASON FOR FAILURE
                                <div style={{ display: "flex", alignItems: "center" }}>
                                <div>
                 
                                <TooltipWrapper
                                arrow={true}
    content={<>
    <div style={{ maxWidth: "600px", whiteSpace: "normal", wordWrap: "break-word" }}>
        {t(row?.additionalDetails?.reasonForFailure)}</div></>}
                                enterDelay={100}
                                header="Data Error"
                                leaveDelay={0}
                                placement="right"
                                >
                                <span style={{ display: "inline-block" }}>
                                   
                                <Button
                                style={{ minWidth: "auto", color:"#B91900", paddingLeft: "0.5rem", cursor: "default" }}
                                variation="teritiary"
                                size="medium"
                                icon="Error"
                                iconFill="#B91900"/>
                                </span>
                               </TooltipWrapper>
                               </div>                                
                                </div>
                            ):(
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
          {t(`HCM_AM_MNO`)}
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
    }, [tableData, t, props?.isSelectionDisabled]);

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
                (props?.status === "VERIFIED" && props?.isSelectionDisabled) ||
                (row?.status === 'PENDING_EDIT' && !props?.editBill) ||
                (row?.status === 'EDITED' && props?.editBill)
                }
            conditionalRowStyles={[
                {
                when: (row) =>
                    (props?.status === "VERIFIED" && props?.isSelectionDisabled) ||
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
