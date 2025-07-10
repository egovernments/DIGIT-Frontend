import React, { useMemo, useState, useEffect, useRef } from "react";
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


  const pollTaskUntilDone = async (billId, type, initialStatusResponse = null) => {
    const POLLING_INTERVAL = 1 * 60 * 1000;

    let statusResponse = initialStatusResponse;

    if (!statusResponse) {
        try {
            statusResponse = await taskStatusAPI.mutateAsync({
                body: { task: { billId, type } },
            });
        } catch (err) {
            console.error("Polling failed for", billId, err);
            setShowToast({ key: "error", label: t("HCM_AM_SOMETHING_WENT_WRONG"), transitionTime: 2000 });
            return;
        }
    }

    const status = statusResponse?.task?.status;
    const res_type = statusResponse?.task?.type;

    if (status === "IN_PROGRESS" && res_type === type) {
        setTransferPollTimers(prev => {
            if (prev[billId]) clearTimeout(prev[billId]);
            const timer = setTimeout(() => pollTaskUntilDone(billId, type), POLLING_INTERVAL);
            return { ...prev, [billId]: timer };
        });
    } else {
        // Mark as done
        setInProgressBills(prev => ({ ...prev, [billId]: false }));
        setTransferPollTimers(prev => {
            if (prev[billId]) clearTimeout(prev[billId]);
            const newTimers = { ...prev };
            delete newTimers[billId];
            return newTimers;
        });
        refetchBill();
    }
};
const userSearchCri = {
        url: `/egov-hrms/employees/_search`,
         params: {
            tenantId : tenantId,
            roles: "PAYMENT_EDITOR",
          },
        config: {
            enabled: project && !editBills ? true : false,
            select: (data) => {
                return data?.Employees || [];
            },
        },
    };

  const { isLoading: isHrmsSearchLoading, data: hrmsUsersData, refetch: refetchHrmsUsers, isHrmsSearchFetching } = Digit.Hooks.useCustomAPIHook(userSearchCri);
    
    
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
                        type:"Transfer",
                    }
                },
                });
                console.log("Task status response for billId:", billId, res);

                if (res?.task?.status === "IN_PROGRESS") {
                    setInProgressBills(prev => ({ ...prev, [billId]: true }));
                    if (res?.task?.type === "Transfer") {
                        console.log("Polling started for billId:", billId);
                        pollTaskUntilDone(billId,"Transfer",res);
                    }
                } else {
                    console.log("inside else 2")
                    setInProgressBills(prev => ({ ...prev, [billId]: false }));
                }
            } catch (e) {
                console.warn("Task status check failed for", billId, e);
                setShowToast()
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


    if (isBillLoading || isTableActionLoading || isHrmsSearchLoading || isHrmsSearchFetching) {
        return <LoaderScreen />
    }

    return (
        <React.Fragment>
            <Header styles={{ fontSize: "32px" }}>
                {!editBills ? t("HCM_AM_VERIFY_AND_GENERATE_PAYMENTS") : t("HCM_AM_EDIT_BILL")}
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
                    hrmsUsersData={hrmsUsersData}
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
