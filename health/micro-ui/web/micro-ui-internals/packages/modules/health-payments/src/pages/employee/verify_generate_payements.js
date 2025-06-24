import React, { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Header, InboxSearchComposer, Loader } from "@egovernments/digit-ui-react-components";
import { useLocation } from "react-router-dom";
import { Card, LoaderScreen, NoResultsFound } from "@egovernments/digit-ui-components";
import MyBillsTable from "../../components/MyBillsTable";
import { defaultRowsPerPage } from "../../utils/constants";
import VerifyBillsSearch from "../../components/VerifyBillsSearch";
import VerifyAndGeneratePaymentsTable from "../../components/VerifyAndGeneratePaymentsTable";
// import { useSelector } from "react-redux";
const VerifyAndGeneratePayments = ({editBills = false}) => {

    const { t } = useTranslation();
    const location = useLocation();
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const selectedBillIds = location.state?.selectedBillIds || [];
    // const selectedBills = useSelector((state) => state.payments.selectedBills);
const [isTableActionLoading, setIsTableActionLoading] = useState(false);

    console.log("selectedBillIds", selectedBillIds);
    // context path variables
    const expenseContextPath = window?.globalConfigs?.getConfig("EXPENSE_CONTEXT_PATH") || "health-expense";

    // State Variables
    const [tableData, setTableData] = useState([]);
    const [billID, setBillID] = useState(null);//to search by bill number
    const [billStatus, setBillStatus] = useState(null);
    const [taskStatus, setTaskStatus] = useState(null);
    const [inProgressBills, setInProgressBills] = useState({});
    const [transferPollTimers, setTransferPollTimers] = useState({});
    // const [isEditBill, setIsEditBill] = useState(false);
    //TODO: SET isEditBill based on the ROLE
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
                ...(billID ? { billNumbers: [billID] } : {billNumbers: selectedBillIds}),
                status: billStatus? billStatus : null,
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

    const taskStatusAPI = Digit.Hooks.useCustomAPIMutationHook({
    url: `/health-expense/v1/task/_status`,
});

const pollTaskUntilDone = async (billId) => {
    console.log("Polling...", billId);

    const POLLING_INTERVAL = 5 * 60 * 1000; // 5 minutes

    try {
        const statusResponse = await taskStatusAPI.mutateAsync({
            body: {
                task: { billId: billId, type: "Transfer" },
            },
        });

        const status = statusResponse?.task?.status;
        const type = statusResponse?.task?.type;

         if (status === "IN_PROGRESS" && type === "Transfer") {
            setTransferPollTimers(prev => {
                if (prev[billId]) clearTimeout(prev[billId]);
                const timer = setTimeout(() => pollTaskUntilDone(billId), POLLING_INTERVAL);
                return { ...prev, [billId]: timer };
            });
        }else  {
            setInProgressBills(prev => ({ ...prev, [billId]: false }));
            setTransferPollTimers(prev => {
                if (prev[billId]) clearTimeout(prev[billId]);
                const newTimers = { ...prev };
                delete newTimers[billId];
                return newTimers;
            });
            refetchBill();
        } 
    } catch (err) {
        console.error("Polling failed for billId", billId, err);
    }
};
    
    
    
    const handlePageChange = (page, totalRows) => {
        setCurrentPage(page);
        setLimitAndOffset({ ...limitAndOffset, offset: (page - 1) * rowsPerPage });
    };

    const handlePerRowsChange = (currentRowsPerPage, currentPage) => {
        setRowsPerPage(currentRowsPerPage);
        setCurrentPage(1);
        setLimitAndOffset({ limit: currentRowsPerPage, offset: (currentPage - 1) * rowsPerPage });
    }
    const handleTaskDone = () => {
    refetchBill(); // trigger bill search once DONE
    };


    useEffect(() => {
        if (BillData) {
            setTableData(BillData.bills);
            setTotalCount(BillData?.pagination?.totalCount);
             BillData.bills.forEach(async (bill) => {
                const billId = bill?.id;

            try {
                const res = await taskStatusAPI.mutateAsync({
                    body: {
                        task:{
                        billId: billId,
                        type:"Transfer", // Assuming the type is Transfer, adjust as necessary
                    }
                },
                });
                console.log("Task status response for billId:", billId, res);

                if (res?.task?.status === "IN_PROGRESS") {
                    setInProgressBills(prev => ({ ...prev, [billId]: true }));
                    if (res?.task?.type === "Transfer") {
                        console.log("Polling started for billId:", billId);
                        pollTaskUntilDone(billId);
                    }
                } else {
                    console.log("inside else 2")
                    setInProgressBills(prev => ({ ...prev, [billId]: false }));
                }
            } catch (e) {
                console.warn("Task status check failed for", billId, e);
            }
        });
    
            
        }
    }, [BillData])

    useEffect(() => {
    return () => {
        Object.values(transferPollTimers).forEach(clearTimeout);
    };
}, []);

    useEffect(() => {
        refetchBill();
    }, [billID, billStatus, limitAndOffset])

    const onSubmit = (billID, billStatus) => {
        setBillID(billID);
        setBillStatus(billStatus);
    };

    const onClear = () => {
        setBillID("");
        setBillStatus("");
    };


    if (isBillLoading) {
        return <LoaderScreen />
    }
    if (isTableActionLoading ) {
        return <LoaderScreen />
    }
    return (
        <React.Fragment>
            <Header styles={{ fontSize: "32px" }}>
                {t("HCM_AM_VERIFY_AND_GENERATE_PAYMENTS")}
            </Header>


            <VerifyBillsSearch onSubmit={onSubmit} onClear={onClear} />

            <Card>
                {isFetching ? (
                    <Loader />
                ) : tableData.length === 0 ? (
                    <NoResultsFound text={t(`HCM_AM_NO_DATA_FOUND_FOR_BILLS`)} />
                ) : (
                    <VerifyAndGeneratePaymentsTable
                    editBill={editBills}
                    data={tableData}
                    totalCount={tableData.length}
                    selectableRows={false}
                    rowsPerPage={rowsPerPage}
                    currentPage={currentPage}
                    taskStatus = {taskStatus}
                    setTaskStatus={setTaskStatus}
                    onTaskDone={handleTaskDone}
                    handlePageChange={handlePageChange}
                    handlePerRowsChange={handlePerRowsChange}
                    isLoading={isTableActionLoading}
                    setIsLoading={setIsTableActionLoading}
                    inProgressBills={inProgressBills}
                    setInProgressBills={setInProgressBills}
                    />
                )}
            </Card>

        </React.Fragment>
    );
};

export default VerifyAndGeneratePayments;
