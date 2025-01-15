import React, { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Header, InboxSearchComposer, Loader } from "@egovernments/digit-ui-react-components";
import { useLocation } from "react-router-dom";
import { Card, LoaderScreen, NoResultsFound } from "@egovernments/digit-ui-components";
import MyBillsSearch from "../../components/MyBillsSearch";
import MyBillsTable from "../../components/MyBillsTable";
import { defaultRowsPerPage } from "../../utils/constants";

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
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
    const [totalCount, setTotalCount] = useState(0);
    const [limitAndOffset, setLimitAndOffset] = useState({ limit: rowsPerPage, offset: (currentPage - 1) * rowsPerPage });

    const project = Digit?.SessionStorage.get("staffProjects");

    const BillSearchCri = {
        url: `/health-expense/bill/v1/_search`,
        body: {
            billCriteria: {
                tenantId: tenantId,
                referenceIds: [project?.[0]?.id],
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

    useEffect(() => {
        window.Digit.SessionStorage.del("selectedLevel");
        window.Digit.SessionStorage.del("selectedProject");
        window.Digit.SessionStorage.del("selectedBoundaryCode");
        window.Digit.SessionStorage.del("boundary");
        window.Digit.SessionStorage.del("selectedValues");
    }, []);


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
                {t("HCM_AM_MY_BILLS")}
            </Header>


            <MyBillsSearch onSubmit={onSubmit} onClear={onClear} />

            <Card>
                {isFetching ? <Loader /> : tableData.length === 0 ? <NoResultsFound text={t(`HCM_AM_NO_DATA_FOUND_FOR_BILLS`)} /> : <MyBillsTable data={tableData} totalCount={totalCount} rowsPerPage={rowsPerPage} currentPage={currentPage} handlePageChange={handlePageChange}
                    handlePerRowsChange={handlePerRowsChange} />}
            </Card>

        </React.Fragment>
    );
};

export default MyBills;
