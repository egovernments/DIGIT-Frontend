import { Button, Card, Chip, Header, Loader, PopUp, Toast, CardText, NoResultsFound, Tab, LoaderScreen, LoaderComponent } from "@egovernments/digit-ui-components";
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DataTable from "react-data-table-component";
import { useQueryClient } from "react-query";
import { CustomSVG } from "@egovernments/digit-ui-components";
import { tableCustomStyle } from "../table_inbox_custom_style";
import { defaultPaginationValues } from "../../utils/constants";
import { getCustomPaginationOptions } from "../../utils";

/**
 * BillInboxTable component is used to render the table for the employee's payment inbox.
 * The table is paginated and it fetches data based on the pagination.
 * The component also handles the page change and rows per page change.
 * @param {object} props The props object contains the data and the pagination information.
 * @returns {JSX.Element} The JSX element for the table.
 */
const BillInboxTable = ({
    ...props
}) => {
    const { t } = useTranslation();
    const history = useHistory();

    const handlePageChange = (page, totalRows) => {
        props?.handlePageChange(page, totalRows);
    };

    const handlePerRowsChange = async (currentRowsPerPage, currentPage) => {
        props?.handlePerRowsChange(currentRowsPerPage, currentPage);
    };

    const columns = [
        {
            name: (
                <div className="custom-inbox-table-row">
                    {t("HCM_AM_ATTENDANCE_ID")}
                </div>
            ),
            selector: (row) => {
                return (
                    <Button
                        label={t(`${row.id}`)}
                        onClick={() =>
                            history.push(
                                `/${window?.contextPath}/employee/payments/view-attendance?registerNumber=${row?.id}&boundaryCode=${row?.boundary}`, { fromCampaignSupervisor: true }
                            )
                        }
                        title={t(`${row.id}`)}
                        variation="link"
                        size={"medium"}
                        style={{ minWidth: "unset" }}
                    />
                );
            },
        },
        {
            name: (
                <div className="custom-inbox-table-row">
                    {t("HCM_AM_ATTENDANCE_BOUNDARY")}
                </div>
            ),
            selector: (row) => {
                return (
                    <div className="ellipsis-cell" title={t(row?.boundary) || t("NA")}>
                        {t(row.boundary) || t("NA")}
                    </div>
                );
            },
        },
        {
            name: (
                <div className="custom-inbox-table-row">
                    {props.status === "APPROVED" ? t("HCM_AM_ATTENDANCE_APPROVED_BY") : t("HCM_AM_ATTENDANCE_MARKED_BY")}
                </div>
            ),
            selector: (row) => {
                return (
                    <div className="ellipsis-cell" title={row?.markby || t("NA")}>
                        {props.status === "APPROVED" ? row?.approvedBy : row?.markedBy || t("NA")}
                    </div>
                );
            },
        },

        {
            name: t("HCM_AM_ATTENDANCE_ATTENDEES"),
            selector: (row) => {
                return (
                    <div className="ellipsis-cell" title={t(row?.status || "0")}>
                        {t(row?.noOfAttendees || "0")}
                    </div>
                );
            },
            style: {
                justifyContent: "flex-end",
            },
        },
    ];

    const handleRowClick = (row) => {
        history.push(
            `/${window?.contextPath}/employee/payments/view-attendance?registerNumber=${row?.id}&boundaryCode=${row?.boundary}`, { fromCampaignSupervisor: true }
        )
    };

    return (
        <React.Fragment>
            {
                props.isFetching || props.tableData.length === 0 ? <div style={{ height: props.infoDescription ? "38vh" : "52vh" }}> {props.isFetching ? <Loader /> : <NoResultsFound text={t(`HCM_AM_NO_DATA_FOUND`)} />} </div> : <DataTable
                    columns={columns}
                    data={props.tableData}
                    pagination
                    paginationServer
                    customStyles={tableCustomStyle(true)}
                    paginationDefaultPage={props?.currentPage}
                    onRowClicked={handleRowClick}
                    pointerOnHover
                    onChangePage={handlePageChange}
                    onChangeRowsPerPage={handlePerRowsChange}
                    paginationTotalRows={props?.totalCount}
                    paginationPerPage={props?.rowsPerPage}
                    sortIcon={<CustomSVG.SortUp width={"16px"} height={"16px"} fill={"#0b4b66"} />}
                    paginationRowsPerPageOptions={defaultPaginationValues}
                    fixedHeader={true}
                    fixedHeaderScrollHeight={props.infoDescription ? "32vh" : "47vh"}
                    paginationComponentOptions={getCustomPaginationOptions(t)}
                />
            }
        </React.Fragment>
    );
};

export default BillInboxTable;
