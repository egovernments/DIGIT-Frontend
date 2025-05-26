import React, { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Header, InboxSearchComposer, Loader } from "@egovernments/digit-ui-react-components";
import { useLocation } from "react-router-dom";
import { Card, LoaderScreen, NoResultsFound } from "@egovernments/digit-ui-components";
import MyBillsSearch from "../../components/MyBillsSearch";
import MyBillsTable from "../../components/MyBillsTable";
import { defaultRowsPerPage } from "../../utils/constants";
import VerifyBillsSearch from "../../components/VerifyBillsSearch";

const FetchBills = (props) => {

    const { t } = useTranslation();
    const location = useLocation();
    const tenantId = Digit.ULBService.getCurrentTenantId();

    // context path variables
    const expenseContextPath = window?.globalConfigs?.getConfig("EXPENSE_CONTEXT_PATH") || "health-expense";

    // State Variables
    const [tableData, setTableData] = useState([]);
    const [billID, setBillID] = useState(null);
    const [billStatus, setBillStatus] = useState(null);
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
                status: billStatus, 
                // ...(dateRange.startDate && dateRange.endDate ? { fromDate: new Date(dateRange.startDate).getTime(), toDate: new Date(dateRange.endDate).getTime() } : {}),
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
    const BillData1 = {"bills":[
       
        {
            "billNumber": "123456",
            "billDate": 1698307200000,
            "additionalDetails": {
                "noOfRegisters": 5,
            },
            "localityCode": "Locality 1",
        },
        {
            "billNumber": "133456",
            "billDate": 1698307200000,
            "additionalDetails": {
                "noOfRegisters": 5,
            },
            "localityCode": "Locality 1",
        },
        {
            "billNumber": "123446",
            "billDate": 1698307200000,
            "additionalDetails": {
                "noOfRegisters": 5,
            },
            "localityCode": "Locality 1",
        },
        {
            "billNumber": "122056",
            "billDate": 1698307200000,
            "additionalDetails": {
                "noOfRegisters": 5,
            },
            "localityCode": "Locality 1",
        },
        {
            "billNumber": "123456",
            "billDate": 1698307200000,
            "additionalDetails": {
                "noOfRegisters": 5,
            },
            "localityCode": "Locality 1",
        },
        {
            "billNumber": "173456",
            "billDate": 1698307200000,
            "additionalDetails": {
                "noOfRegisters": 5,
            },
            "localityCode": "Locality 1",
        }
    ]}
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
            setTotalCount(BillData.bills.length);
        }
    }, [BillData])

    useEffect(() => {
        refetchBill();
    }, [billID, billStatus, dateRange, limitAndOffset])

    const onSubmit = (billID,billStatus, dateRange) => {
        setBillID(billID);
        setBillStatus(billStatus);
    };

    const onClear = () => {
        setBillStatus("");
        setBillID("");
    };


    if (isBillLoading) {
        return <LoaderScreen />
    }

    return (
        <React.Fragment>
            <Header styles={{ fontSize: "32px" }}>
                {t("HCM_AM_FETCH_BILLS")}
            </Header>


            <MyBillsSearch onSubmit={onSubmit} onClear={onClear} 
            // style={{
            //     marginBottom: "0.1rem",
            //     marginTop: "0.11rem"
            // }} 
            />

            <Card 
            // style={{
            //     marginBottom: "1rem",
            //     marginTop: "1rem"
            // }}
            >
                {isFetching ? <Loader />: <MyBillsTable data={tableData} onSelectionChange={props?.onSelectionChange} totalCount={totalCount} isSelectableRows={props?.isSelectableRows} rowsPerPage={rowsPerPage} currentPage={currentPage} handlePageChange={handlePageChange}
                    handlePerRowsChange={handlePerRowsChange} />}
                    
            </Card>

        </React.Fragment>
    );
};

export default FetchBills;
