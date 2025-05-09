import React, { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Header, InboxSearchComposer, Loader } from "@egovernments/digit-ui-react-components";
import { useLocation } from "react-router-dom";
import { Card, LoaderScreen, NoResultsFound } from "@egovernments/digit-ui-components";
import MyBillsTable from "../../components/MyBillsTable";
import { defaultRowsPerPage } from "../../utils/constants";
import VerifyBillsSearch from "../../components/VerifyBillsSearch";
import VerifyAndGeneratePaymentsTable from "../../components/VerifyAndGeneratePaymentsTable";

const VerifyAndGeneratePayments = () => {

    const { t } = useTranslation();
    const location = useLocation();
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const selectedBills = location.state?.selectedBills || [];
    console.log("selectedBills", selectedBills);
    // context path variables
    const expenseContextPath = window?.globalConfigs?.getConfig("EXPENSE_CONTEXT_PATH") || "health-expense";

    // State Variables
    const [tableData, setTableData] = useState([]);
    const [billID, setBillID] = useState(null);
    const [dateRange, setDateRange] = useState({
        startDate: '',
        endDate: '',
        title: '',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
    const [totalCount, setTotalCount] = useState(0);
    const [limitAndOffset, setLimitAndOffset] = useState({ limit: rowsPerPage, offset: (currentPage - 1) * rowsPerPage });

    const project = Digit?.SessionStorage.get("staffProjects");

    const BillSearchCri = {
        url: `/${expenseContextPath}/bill/v1/_search`,
        body: {
            billCriteria: {
                tenantId: tenantId,
                referenceIds: project?.map(p => p?.id) || [], 
                ...(billID ? { billNumbers: [billID] } : {}),
                ...(dateRange.startDate && dateRange.endDate ? { fromDate: new Date(dateRange.startDate).getTime(), toDate: new Date(dateRange.endDate).getTime() } : {}),
                pagination: {
                    limit: limitAndOffset.limit,
                    offset: limitAndOffset.offset
                }
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

    const handlePageChange = (page, totalRows) => {
        setCurrentPage(page);
        setLimitAndOffset({ ...limitAndOffset, offset: (page - 1) * rowsPerPage });
    };

    const handlePerRowsChange = (currentRowsPerPage, currentPage) => {
        setRowsPerPage(currentRowsPerPage);
        setCurrentPage(1);
        setLimitAndOffset({ limit: currentRowsPerPage, offset: (currentPage - 1) * rowsPerPage });
    }

    useEffect(() => {
        if (BillData) {
            setTableData(BillData.bills);
            setTotalCount(BillData?.pagination?.totalCount);
        }
    }, [BillData])

    useEffect(() => {
        refetchBill();
    }, [billID, dateRange, limitAndOffset])

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
                {t("HCM_AM_VERIFY_AND_GENERATE_PAYMENTS")}
            </Header>


            <VerifyBillsSearch onSubmit={onSubmit} onClear={onClear} />

            <Card>
                {<VerifyAndGeneratePaymentsTable data={tableData} totalCount={totalCount} selectableRows={false} rowsPerPage={rowsPerPage} currentPage={currentPage} handlePageChange={handlePageChange}
                    handlePerRowsChange={handlePerRowsChange} />}
            </Card>

        </React.Fragment>
    );
};

export default VerifyAndGeneratePayments;
