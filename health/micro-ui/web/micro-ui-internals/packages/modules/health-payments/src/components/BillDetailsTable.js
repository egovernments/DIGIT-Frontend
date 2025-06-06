import React, { Fragment, useState, useMemo } from "react";
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
    const columns = useMemo(() => {
        const baseColumns = [
            {
                name: (
                    <div style={{ borderRight: "2px solid #787878", width: "100%", textAlign: "start" }}>
                        {t("HCM_AM_WORKER_ID_NO.")}
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
                            {props?.status === "NOT_VERIFIED"?(
                                <div style={{ display: "flex", alignItems: "center" }}>
                                {props?.editBill?
                               ( <Button
                                style={{ minWidth: "auto" }}
                                variation="secondary"
                                size="small"
                                icon="Edit"
                                onClick={() => {
                                    setShowEditField(true);
                                    setEditFieldName(t("HCM_AM_WORKER_NAME"));
                                    // renderEditField("name");
                                }}
                                />):null
                                }
                                <div>
                 
                                <TooltipWrapper
                                arrow={true}
    content={<>
    <div style={{ maxWidth: "600px", whiteSpace: "normal", wordWrap: "break-word" }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt</div></>}
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
            {props?.status === "NOT_VERIFIED"?(
                                <div style={{ display: "flex", alignItems: "center" }}>
                                {props?.editBill?
                               ( <Button
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
                                <div>
                 
                                <TooltipWrapper
                                arrow={true}
    content={<>
    <div style={{ maxWidth: "600px", whiteSpace: "normal", wordWrap: "break-word" }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt</div></>}
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
            {t(row?.operator) || t("ES_COMMON_NA")}
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
                    return (
                        <div className="ellipsis-cell" style={{ paddingRight: "1rem" }}>
                            {t(row?.noOfDays) || t("0")}
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
                            {t(row?.totalAmount) || t("NA")}
                        </div>
                    );
                },
                style: {
                            justifyContent: "flex-end",
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
                data={props?.data}
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
                selectableRows={props?.selectableRows}
                fixedHeaderScrollHeight={"70vh"}
                paginationComponentOptions={getCustomPaginationOptions(t)}
            />
            {showEditField && (
                <EditWorkerDetailsPopUp
                    onClose={() => setShowEditField(false)} //TODO: ADD LOGIC TO CLEAR SAVED FIELDS NAMES
                    editFieldName={editFieldName}
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
