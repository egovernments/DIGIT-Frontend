import React, { useState, useEffect, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, Card, Loader, TableMolecule, TextInput, Toast } from "@egovernments/digit-ui-components";
import { CustomSVG } from "@egovernments/digit-ui-components";
import { CheckBox } from "@egovernments/digit-ui-components";




const MyBillsTable = ({ ...props }) => {
    const { t } = useTranslation();
    const history = useHistory();
    const url = Digit.Hooks.useQueryParams();
    const [showToast, setShowToast] = useState(null);

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
    }, [, t]);

    const dummyData = [
        ["B001", "2023-12-20", 3, 25, "Boundary A", "Project Alpha"],
        ["B002", "2023-12-18", 4, 30, "Boundary B", "Project Beta"],
        ["B003", "2023-12-15", 2, 20, "Boundary C", "Project Gamma"],
        ["B004", "2023-12-12", 5, 35, "Boundary D", "Project Delta"],
        ["B005", "2023-12-10", 6, 40, "Boundary E", "Project Epsilon"],
        ["B006", "2023-12-08", 1, 10, "Boundary F", "Project Zeta"],
    ];

    // Map attendance data to rows
    const rows = useMemo(() => {
        return dummyData.map(([id, date, registers, workers, boundary, project]) => [
            { label: id, maxLength: 64 },
            { label: date, maxLength: 64 },
            registers,
            workers,
            { label: boundary, maxLength: 64 },
            { label: project, maxLength: 64 },
            <Button
                className="custom-class"
                iconFill=""
                icon="FileDownload"
                isSuffix
                label={t(`HCM_AM_DOWNLOAD_BILLS`)}
                showBottom={true}
                onOptionSelect={(value) => {
                    // if (value.code === "EDIT_ATTENDANCE") {
                    //   setOpenEditAlertPopUp(true);
                    // } else if (value.code === "APPROVE") {
                    //   setOpenApproveCommentPopUp(true);
                    // }
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
            />
        ]);
    }, []);

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
        </div>
    );
};

export default MyBillsTable;
