import { Button, Card, Chip, Header, Loader, PopUp, Toast, CardText, NoResultsFound, Tab, LoaderScreen, LoaderComponent } from "@egovernments/digit-ui-components";
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DataTable from "react-data-table-component";
import { useQueryClient } from "react-query";
import { CustomSVG } from "@egovernments/digit-ui-components";
import { tableCustomStyle } from "../custom_comp/table_inbox_custom_style";

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
            name: t("HCM_AM_ATTENDANCE_ID"),
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
            name: t("HCM_AM_ATTENDANCE_BOUNDARY"),
            selector: (row) => {
                return (
                    <div className="ellipsis-cell" title={t(row?.boundary) || t("NA")}>
                        {t(row.boundary) || t("NA")}
                    </div>
                );
            },
        },
        {
            name: props.status === "APPROVED" ? t("HCM_AM_ATTENDANCE_APPROVED_BY") : t("HCM_AM_ATTENDANCE_MARKED_BY"),
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

    return (
        <React.Fragment>
            {
                props.isFetching || props.tableData.length === 0 ? <div style={{ height: "29vh" }}> {props.isFetching ? <Loader /> : <NoResultsFound text={t(`HCM_AM_NO_DATA_FOUND`)} />} </div> : <DataTable
                    columns={columns}
                    data={props.tableData}
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
                    fixedHeaderScrollHeight={"30vh"}
                />
            }
        </React.Fragment>
    );
};

export default BillInboxTable;
