import React, { Fragment, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Button, CustomSVG, Tag, Toast } from "@egovernments/digit-ui-components";
import { downloadFileWithName, formatTimestampToDate, getCustomPaginationOptions } from "../utils";
import DataTable from "react-data-table-component";
import { tableCustomStyle } from "./table_inbox_custom_style";
import { defaultPaginationValues } from "../utils/constants";
import { useHistory } from "react-router-dom";

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

    // const { isLoading: isBillLoading, data: BillData, refetch: refetchBill, isFetching } = Digit.Hooks.useCustomAPIHook(BillSearchCri);


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
                        <div className="ellipsis-cell" title={t(row?.billNumber) || t("NA")}
                        style={{ color: "#C84C0E", textDecoration: "underline" }}>
                            {t(row?.id) || t("NA")}
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
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <span className="ellipsis-cell" style={{ marginRight: "8px" }}
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
                                // onClick={() => {
                                //     history.push(`/digit-ui/employee/health/payments/edit/${row?.id}`);
                                // }}
                                />):({})
}
                                <div style={{color: "#B91900" }}>
                                <Button
                                style={{ minWidth: "auto", color:"#B91900", paddingLeft: "0.5rem", cursor: "arrow" }}
                                variation="teritiary"
                                size="medium"
                                icon="Error"
                                iconFill="#B91900"
                                // isDisabled={true}
                                // onClick={() => {
                                //     history.push(`/digit-ui/employee/health/payments/edit/${row?.id}`);
                                // }}
                                />
                                </div>
                                </div>
                            ):(
                                    []
                                )}
                    </div>
                    );
                },
            },    
            {
      name: (
        <div style={{ borderRight: "2px solid #787878", width: "100%", textAlign: "start" }}>
          {t(`HCM_AM_MOBILE_NUMBER`)}
        </div>
      ),
      selector: (row) => {
        return (
          <span className="ellipsis-cell" style={{ fontSize: "14px" }}>
            {t(row?.mobileNumber) || t("ES_COMMON_NA")}
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
