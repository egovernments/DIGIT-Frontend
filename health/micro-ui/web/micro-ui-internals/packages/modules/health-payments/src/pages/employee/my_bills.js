import React, { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Header, InboxSearchComposer, Loader } from "@egovernments/digit-ui-react-components";
import { useLocation } from "react-router-dom";
import { Card, LoaderScreen, NoResultsFound } from "@egovernments/digit-ui-components";
import MyBillsSearch from "../../components/MyBillsSearch";
import MyBillsTable from "../../components/MyBillsTable";

const MyBills = () => {

    const { t } = useTranslation();
    const location = useLocation();
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const [tableData, setTableData] = useState([]);
    const [billID, setBillID] = useState(null);
    const [dateRange, setDateRange] = useState({
        startDate: '',
        endDate: '',
        title: '',
    });

    const project = Digit?.SessionStorage.get("staffProjects");

    const BillSearchCri = {
        url: `/health-expense/bill/v1/_search`,
        body: {
            billCriteria: {
                tenantId: tenantId,
                // ids: ["6eaf462a-4d9a-44c9-9ef7-e127e3fb33f1"],
                // localityCode: project?.address?.boundary,
                referenceIds: [project?.[0]?.id],
                ...(billID ? { billNumbers: [billID] } : {})
            }
        },
        config: {
            enabled: project ? true : false,
            select: (data) => {
                return data;
            },
        },
    };


    const { isLoading: isBillLoading, data: BillData, refetch: refetchBill, isFetching } = Digit.Hooks.useCustomAPIHook(BillSearchCri);

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

    function getBillSummary(data) {
        return data.map((individualEntry) => {
            const billId = individualEntry?.billNumber;
            const billDate = formatTimestampToDate(individualEntry.billDate);
            const noOfRegisters = individualEntry?.additionalDetails?.noOfRegisters || 0;
            const noOfWorkers = individualEntry?.billDetails?.length || 0;
            const boundaryCode = individualEntry?.localityCode || "NA";
            const projectName = project?.[0]?.name || "NA";
            const reportDetails = individualEntry?.additionalDetails?.reportDetails || {
                "status": "FAILED", // INITIATED, COMPLETED, FAILED
                "pdfReportId": "d5a504fb-ebb8-41be-afa0-24b4f1bd575b",
                "excelReportId": "de5f2b24-b60d-4d1f-b550-56abe1dabb2f",
                "errorMessage": "error message if status is failed"
            };

            return [billId, billDate, noOfRegisters, noOfWorkers, boundaryCode, projectName, reportDetails];

        });
    }

    useEffect(() => {
        if (BillData) {
            setTableData(getBillSummary(BillData?.bills));
        }
    }, [BillData])

    useEffect(() => {
        refetchBill();
    }, [billID, dateRange])

    const onSubmit = (billID, dateRange) => {
        setBillID(billID);
        setDateRange(dateRange);
    };

    const onClear = () => {
        setDateRange({ startDate: '', endDate: '', title: '' });
        setBillID("");
    };


    if (isBillLoading) {
        return <LoaderScreen />
    }

    return (
        <React.Fragment>
            <Header styles={{ fontSize: "32px" }}>
                {t("HCM_AM_MY_BILLS")}
            </Header>


            <MyBillsSearch onSubmit={onSubmit} onClear={onClear} />

            <Card>
                {isFetching ? <Loader /> : tableData.length === 0 ? <NoResultsFound text={t(`HCM_AM_NO_DATA_FOUND_FOR_BILLS`)} /> : <MyBillsTable data={tableData} />}
            </Card>

        </React.Fragment>
    );
};

export default MyBills;
