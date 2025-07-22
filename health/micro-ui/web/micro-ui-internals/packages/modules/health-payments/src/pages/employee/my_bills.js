import React, { useMemo, useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Header, InboxSearchComposer, Loader } from "@egovernments/digit-ui-react-components";
import { useLocation } from "react-router-dom";
import { Card, LoaderScreen, NoResultsFound, Toast } from "@egovernments/digit-ui-components";
import MyBillsSearch from "../../components/MyBillsSearch";
import MyBillsTable from "../../components/MyBillsTable";
import { defaultRowsPerPage } from "../../utils/constants";
import { set } from "lodash";

const MyBills = (props) => {

    const { t } = useTranslation();
    const location = useLocation();
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const [showToast, setShowToast] = useState(null);
    const [isUpdateLoading, setIsUpdateLoading] = useState(null);

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
    const [selectedCount, setSelectedCount] = useState(0);
    // const [totalAmount, setTotalAmount] = useState(0);


    const project = Digit?.SessionStorage.get("staffProjects");

    const BillSearchCri = {
        url: props?.isSelectableRows ? `/${expenseContextPath}/bill/v1/search/_calculated` : `/${expenseContextPath}/bill/v1/_search`,
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

    const updateBillDetailMutation = Digit.Hooks.useCustomAPIMutationHook({
        url: `/${expenseContextPath}/v1/bill/details/status/_update`,
    });



    const handlePageChange = (page, totalRows) => {
        setCurrentPage(page);
        setLimitAndOffset({ ...limitAndOffset, offset: (page - 1) * rowsPerPage });
    };

    const handlePerRowsChange = (currentRowsPerPage, currentPage) => {
        setRowsPerPage(currentRowsPerPage);
        setCurrentPage(1);
        setLimitAndOffset({ limit: currentRowsPerPage, offset: (currentPage - 1) * rowsPerPage });
    }
    const getTotalAmount = (selectedBills) => {
        if (!selectedBills || selectedBills.length === 0) return 0;
        return selectedBills.reduce((total, bill) => total + (bill?.totalAmount || 0), 0);
    }

    // const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    
    // useEffect(async () => {
    //     if (BillData) {

    //         const updateBillData = async () => {                                                      
    //             await sleep(5000);
    //             console.log("timer done for calculated");
    //             // BillData.bills.forEach(async (bill) => {
    //             //     console.log("Bill ID:", bill.id);  
    //                 // if (props?.isSelectableRows && bill?.id) {
    //                     if (bill?.id) {
    //                     try {
    //                         if (bill.businessService != "PAYMENTS.BILL") {
    //                             updateBillDetailMutation.mutateAsync(
    //                                             {
    //                                                 body: {
    //                                                     bill: {
    //                                                         ...bill,
    //                                                     },
    //                                                     workflow: {
    //                                                         action: "CREATE",
    //                                                     }
    //                                                 },
    //                                             },
    //                                             {
    //                                                 onSuccess: (data) => {
    //                                                     console.log("Bill detail workflow updated successfully:", data);
    //                                                     setShowToast({
    //                                                         key: "success",
    //                                                         label: t(`HCM_AM_BILL_UPDATE_SUCCESS`), //TODO UPDATE TOAST MSG
    //                                                         transitionTime: 2000,
    //                                                     });
    //                                                     // setIsUpdateLoading(false);
    //                                                     // refetchBill(); // refetch bills after update
    //                                                 },
    //                                                 onError: (error) => {
    //                                                     console.log("Error updating bill detail workflow:", error);
    //                                                     setIsUpdateLoading(false);
    //                                                     setShowToast({
    //                                                         key: "error",
    //                                                         label: error?.response?.data?.Errors?.[0]?.message || t("HCM_AM_BILL_DETAILS_UPDATE_ERROR"),//TODO UPDATE TOAST MSG
    //                                                         transitionTime: 2000,
    //                                                     });
    //                                                 }
    //                                             }
    //                                         )
    //                         }
    //                     } catch (error) {
    //                         console.error("Error in bill or billDetails update:", error);
    //                         setIsUpdateLoading(false);
    //                         setShowToast({ key: "error", label: t(`HCM_AM_BILL_UPDATE_ERROR`), transitionTime: 3000 });
    //                     }

    //                 }
    //             // })
    //             setIsUpdateLoading(false);
    //             refetchBill(); // refetch bills after update;
    //         };
    //         if (props?.isSelectableRows) {
    //             setIsUpdateLoading(true);
    //             BillData.bills.forEach(async (bill) => {
    //                 console.log("Bill ID:", bill.id);  
    //                 await updateBillData();
    //             })
    //             setIsUpdateLoading(false);
    //         }

    //         setTableData(BillData.bills);
    //         setTotalCount(BillData?.pagination?.totalCount);
    //     }
    // }, [BillData])

    // useEffect(() => {
    //     refetchBill();
    // }, [billID, dateRange, limitAndOffset])
const didUpdateOnce = useRef(false); // Prevent infinite update loop
useEffect(() => {
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const updateBillData = async (bill) => {
        if (bill?.id && bill.businessService !== "PAYMENTS.BILL") {
            try {
                await updateBillDetailMutation.mutateAsync(
                    {
                        body: {
                            bill: { ...bill },
                            workflow: {
                                action: "CREATE",
                            },
                        },
                    },
                    {
                        onSuccess: (data) => {
                            console.log("Bill detail workflow updated successfully:", data);
                            setShowToast({
                                key: "success",
                                label: t(`HCM_AM_BILL_UPDATE_SUCCESS`),
                                transitionTime: 2000,
                            });
                        },
                        onError: (error) => {
                            setShowToast({
                                key: "error",
                                label:
                                    error?.response?.data?.Errors?.[0]?.message ||
                                    t("HCM_AM_BILL_DETAILS_UPDATE_ERROR"),
                                transitionTime: 2000,
                            });
                        },
                    }
                );
            } catch (error) {
                console.error("Error updating bill:", error);
                setShowToast({
                    key: "error",
                    label: t(`HCM_AM_BILL_UPDATE_ERROR`),
                    transitionTime: 3000,
                });
            }
        }
    };

    const processBills = async () => {
        if (!BillData || !props?.isSelectableRows || didUpdateOnce.current) return;

        didUpdateOnce.current = true;
        setIsUpdateLoading(true);

        const updatableBills = BillData.bills.filter(
            (bill) => bill.businessService !== "PAYMENTS.BILL"
        );

        if (updatableBills.length === 0) {
            setIsUpdateLoading(false); // Nothing to update
            return;
        }


        await sleep(5000);

        for (const bill of BillData.bills) {
            await updateBillData(bill);
        }

        setIsUpdateLoading(false);
        refetchBill(); //  Refetch to get the updated backend state
    };

    if (BillData) {
        setTableData(BillData.bills);
        setTotalCount(BillData?.pagination?.totalCount);
        processBills(); // will not re-run due to didUpdateOnce
    }
}, [BillData]);

   // Only fetch on filter change
useEffect(() => {
    refetchBill();
    didUpdateOnce.current = false; // Reset so updates can run on fresh data
}, [billID, dateRange, limitAndOffset]);

    const onSubmit = (billID, dateRange) => {
        setBillID(billID);
        setDateRange(dateRange);
    };

    const onClear = () => {
        setDateRange({ startDate: '', endDate: '', title: '' });
        setBillID("");
    };


    if (isBillLoading || updateBillDetailMutation.isLoading || isUpdateLoading) {
        return <LoaderScreen />
    }
    const totalAmount = getTotalAmount(props?.selectedBills);
    return (
        <React.Fragment>
            <Header styles={{ fontSize: "32px" }}>
                {t("HCM_AM_MY_BILLS")}
            </Header>


            <MyBillsSearch onSubmit={onSubmit} onClear={onClear} />

            <Card>
                {isFetching ? (<Loader />) : tableData.length === 0 ? (<NoResultsFound text={t(`HCM_AM_NO_DATA_FOUND_FOR_BILLS`)} />)
                    :
                    (
                        <React.Fragment>
                            {selectedCount > 0 && (
                                <div style={{ margin: '1rem 0', fontWeight: 'bold', color: '#0B4B66' }}>
                                    {selectedCount} {t("HCM_AM_BILLS_SELECTED")} | {t("PDF_STATIC_LABEL_BILL_TOTAL_AMOUNT_TO_PROCESS")} {totalAmount}
                                </div>
                            )}
                            <MyBillsTable
                                data={tableData}
                                totalCount={totalCount}
                                onSelectionChange={props?.onSelectionChange}
                                onSelectedCountChange={setSelectedCount}
                                isSelectableRows={props?.isSelectableRows}
                                rowsPerPage={rowsPerPage}
                                currentPage={currentPage}
                                handlePageChange={handlePageChange}
                                handlePerRowsChange={handlePerRowsChange} />
                        </React.Fragment>
                    )}
            </Card>
            {showToast && (
                <Toast
                    style={{ zIndex: 10001 }}
                    label={showToast.label}
                    type={showToast.key}
                    transitionTime={showToast.transitionTime}
                    onClose={() => setShowToast(null)}
                />
            )}

        </React.Fragment>
    );
};

export default MyBills;
