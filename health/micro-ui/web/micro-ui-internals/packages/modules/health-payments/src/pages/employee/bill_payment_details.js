import React, { useState, useEffect, useRef, use, Fragment } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Loader, Header, LoaderWithGap } from "@egovernments/digit-ui-react-components";
import { Divider, Button, PopUp,InfoCard, Card, ActionBar, Link, ViewCardFieldPair, Toast, LoaderScreen, LoaderComponent,Tab,NoResultsFound, TooltipWrapper } from "@egovernments/digit-ui-components";
import AttendanceManagementTable from "../../components/attendanceManagementTable";
import AlertPopUp from "../../components/alertPopUp";
import SendForEditPopUp from "../../components/sendForEditPopUp";
import _, { set } from "lodash";
import { defaultRowsPerPage, ScreenTypeEnum } from "../../utils/constants";
import { formatTimestampToDate } from "../../utils";
import CommentPopUp from "../../components/commentPopUp";
import BillDetailsTable from "../../components/BillDetailsTable";
/**
 * @function BillPaymentDetails
 * @description This component is used to view attendance.
 * @param {boolean} editBillDetails - Whether bill is editable or not.
 * @returns {ReactFragment} A React Fragment containing the attendance details.
 */
const BillPaymentDetails = ({ editBillDetails = false }) => {
  const location = useLocation();
  const billID = location.state?.billID;
  console.log("billID", billID);
  const { t } = useTranslation();
  const history = useHistory();
  const [infoDescription, setInfoDescription] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [tableData, setTableData] = useState([]);
  const [billData, setBillData] = useState(null);
  const [paginatedData, setPaginatedData] = useState([]);
  const [openSendForEditPopUp, setOpenSendForEditPopUp] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showToast, setShowToast] = useState(null);

  const [showGeneratePaymentAction, setShowGeneratePaymentAction] = useState(false);
  const [limitAndOffset, setLimitAndOffset] = useState({
          limit: rowsPerPage,
          offset: (currentPage - 1) * rowsPerPage,
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
  const [activeLink, setActiveLink] = useState({
  code: editBillDetails ? "PENDING_FOR_EDIT" : "NOT_VERIFIED",
  name: editBillDetails
    ? `${t("HCM_AM_PENDING_FOR_EDIT")} `
    : `${t("HCM_AM_NOT_VERIFIED")} `,
});
  const billDetails = [
        {
            "id": "123456",
            "name":"Worker 1",
            "role":"Distrubutor",
            "billDate": 1698307200000,
            "noOfDays": 5,
            "wage": "30",
            "status":"NOT_VERIFIED",
            "totalAmount": "150",
        },
        {
            "id": "223456",
            "name":"Worker 1",
            "role":"Distrubutor",
            "billDate": 1698307200000,
            "noOfDays": 5,
            "wage": "30",
            "status":"VERIFIED",
            "totalAmount": "150",
        },
        {
            "id": "323456",
            "name":"Worker 1",
            "role":"Distrubutor",
            "billDate": 1698307200000,
            "noOfDays": 5,
            "wage": "30",
            "status":"PAYMENT_GENERATED",
            "totalAmount": "150",
        },
        {
            "id": "222456",
            "name":"Worker 1",
            "role":"Distrubutor",
            "billDate": 1698307200000,
            "noOfDays": 5,
            "wage": "30",
            "status":"VERIFIED",
            "totalAmount": "150",
        }
    ]

  const individualContextPath = window?.globalConfigs?.getConfig("INDIVIDUAL_CONTEXT_PATH") || "health-individual";
  const expenseContextPath = window?.globalConfigs?.getConfig("EXPENSE_CONTEXT_PATH") || "health-expense";
  const mdms_context_path = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";

  const tenantId = Digit.ULBService.getCurrentTenantId();

  const [individualIds, setIndividualIds] = useState([]);


  const project = Digit?.SessionStorage.get("staffProjects");
  const selectedProject = Digit?.SessionStorage.get("selectedProject");


  const BillSearchCri = {
        url: `/${expenseContextPath}/bill/v1/_search`,
        body: {
            billCriteria: {
                tenantId: tenantId,
                referenceIds: project?.map(p => p?.id) || [], 
                ...(billID ? { billNumbers: [billID] } : {}),
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
 
  const fetchIndividualIds = (billData) => {
    console.log("here ???0990")
    const billDetails = billData?.billDetails || [];
    if (Array.isArray(billDetails)) {
      const ids = billDetails.map((billDetail) => billDetail?.payee?.identifier).filter(Boolean);
      setIndividualIds(ids);
      console.log("Individual IDs:", ids);
    }
  }
 
 
  const reqMdmsCriteria = {
      url: `/${mdms_context_path}/v1/_search`,
      body: {
        MdmsCriteria: {
          tenantId: tenantId,
          moduleDetails: [
            {
                "moduleName": "HCM",
                "masterDetails": [
                    {
                        "name": "WORKER_RATES"
                    }
                ]
            }
        ]
              }
      },
      config:{
        enabled: billData ? true : false,
        select: (mdmsData) => {
                return mdmsData.MdmsRes.HCM.WORKER_RATES.filter((item)=>item.campaignId === billData?.referenceId)?.[0]
            },
      }
    };
  const { isLoading1, data: workerRatesData, isFetching1 } = Digit.Hooks.useCustomAPIHook(reqMdmsCriteria);
  console.log("workerRatesData", workerRatesData);

  const allIndividualReqCriteria = {
    url: `/${individualContextPath}/v1/_search`,
    params: {
      tenantId: tenantId,
      limit: individualIds?.length,
      offset: 0,
    },
    body: {
      Individual: {
        id: individualIds
      }
    },
    config: {
      enabled: individualIds.length > 0 ? true : false,
      select: (data) => {
        return data;
      },
    },
    changeQueryName: "allIndividuals"
  };

  const { isLoading: isAllIndividualsLoading, data: AllIndividualsData,refetch: refetchAllIndividuals } = Digit.Hooks.useCustomAPIHook(allIndividualReqCriteria);
  function addIndividualDetailsToBillDetails(billDetails, individualsData, workerRatesData) {
    return billDetails.map((billDetail) => {
      const individual = individualsData?.Individual?.find(
        (ind) => ind.id === billDetail?.payee?.identifier
      );
       const rateObj = workerRatesData?.rates?.find(
      (rate) => rate?.skillCode === individual?.userDetails?.roles?.[0]?.code
    );

    const rateBreakup = rateObj?.rateBreakup || {};
    const wage =
      (rateBreakup.FOOD || 0) +
      (rateBreakup.TRAVEL || 0) +
      (rateBreakup.PER_DAY || 0);
      return {
        ...billDetail,
        givenName: individual?.name?.givenName,
        mobileNumber: individual?.mobileNumber,
        userId: individual?.userDetails?.username,
        wage: wage+" "+workerRatesData?.currency,
      };
    });
  }

   const updateIndividualMutation = Digit.Hooks.useCustomAPIMutationHook({
        url: `/individual/v1/bulk/_update`
    });

const triggerIndividualBulkUpdate = async(individualsData, selectedRows, bill) => {
  console.log("triggerIndividualBulkUpdate called with:", individualsData, selectedRows, bill);
  const selectedIds = selectedRows.map(row => row?.payee?.identifier);
  const updatedIndividualsList = individualsData?.Individual?.filter(individual =>
      selectedIds.includes(individual.id)
    ).map(individual => {
      const matchingRow = selectedRows.find(row => row?.payee?.identifier === individual.id);

      return {
        ...individual,
        name: {
          ...individual.name,
          givenName: matchingRow?.givenName || individual.name?.givenName,
        },
        mobileNumber: matchingRow?.mobileNumber || individual.mobileNumber,
      };
});

  try {
        await updateIndividualMutation.mutateAsync(
            {
                body: { 
                  Individuals: updatedIndividualsList
                 },
            },
            {
                onSuccess: async () => {
                await updateBillDetailWorkflow(bill, selectedRows, "EDIT");
                setShowToast({
                        key: "success",
                        label: t("HCM_AM_BILL_DETAIL_UPDATE_SUCCESS"),//TODO UPDATE TOAST MSG
                        transitionTime: 6000,
                    });

              }
            });
            refetchBill();
             history.push(`/${window.contextPath}/employee/payments/edit-bill-success`, {
              state: "success",
              info: t("HCM_AM_BILL_ID"),
              fileName: BillData?.bills?.[0]?.billNumber || t("NA"),
              description: t(`HCM_AM_BILL_DETAIL_UPDATE_SUCCESS_DESCRIPTION`),
              message: t(`HCM_AM_BILL_DETAIL_UPDATE_SUCCESS`),
              isShowButton: false,
              back: t(`GO_BACK_TO_HOME`),
              backlink: `/${window.contextPath}/employee`
            });
          }
          catch (error) {
            console.error("Error updating individuals:", error);
            setShowToast({
                        key: "error",
                        label: t(error?.response?.data?.Errors?.[0]?.message || "HCM_AM_BILL_DETAIL_UPDATE_ERROR"),//TODO UPDATE TOAST MSG
                        transitionTime: 3000,
                    });

            }
          
  
}
    const updateBillDetailMutation = Digit.Hooks.useCustomAPIMutationHook({
       url: `/${expenseContextPath}/v1/bill/details/status/_update`,
    });
    const updateBillDetailWorkflow = async(bill,selectedRows, wfState) => {
      try{
        await updateBillDetailMutation.mutateAsync(
          {
            body: {
                bill:{
                  ...bill,
                  billDetails: selectedRows,
                },                
                workflow: {
                    action: wfState,
                },
            },
        },
        {
            onSuccess: async () => {
                refetchBill();
                setShowToast({
                    key: "success",
                    label: t(`HCM_AM_SELECTED_BILL_DETAILS_${wfState}_SUCCESS`), //TODO UPDATE TOAST MSG
                    transitionTime: 2000,
                });             
            },
            onError: (error) => {
              console.log("12Error updating bill detail workflow:", error);
                    setShowToast({
                        key: "error",
                        label: error?.response?.data?.Errors?.[0]?.message || t("HCM_AM_BILL_DETAILS_SENT_FOR_EDIT_ERROR"),//TODO UPDATE TOAST MSG
                        transitionTime: 2000,
                    });
                },
        }, 
          )
        }catch (error) {
            console.log("Error updating bill detail workflow:", error);
            setShowToast({
                key: "error",
                label: t("HCM_AM_BILL_DETAILS_SENT_FOR_EDIT_ERROR"), //TODO UPDATE TOAST MSG
                transitionTime: 3000,
            }); 
        }
            }

useEffect(() => {
  if (BillData) {
    const bill = BillData.bills?.[0] || null;
    setBillData(bill);
    fetchIndividualIds(bill); // this will trigger the individual fetch later
  }
}, [BillData]);

// useEffect(() => {
//   if (billData && activeLink?.code) {
//     filterDataByStatus(billData, activeLink.code); // now this runs with correct tab code
//   }
// }, [billData, activeLink]);
  const getPaginatedData = (data, currentPage, rowsPerPage) => {
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  return data.slice(startIndex, endIndex);
};
  useEffect(() => {
    const slicedData = getPaginatedData(tableData, currentPage, rowsPerPage);
    setPaginatedData(slicedData);
  }, [tableData, currentPage, rowsPerPage]);
   
useEffect(() => {
  if (billData && AllIndividualsData && workerRatesData) {
    const enriched = addIndividualDetailsToBillDetails(
      billData?.billDetails,
      AllIndividualsData,
      workerRatesData
    );
   const statusMap = {
        VERIFICATION_FAILED: ["VERIFICATION_FAILED",], //send for edit action
        VERIFIED: ["VERIFIED","PAYMENT_FAILED"], //generate payment action
        PAYMENT_GENERATED: ["PAID"],
        NOT_VERIFIED: ["PENDING_VERIFICATION","PENDING_EDIT","EDITED"], //verify action
        PENDING_FOR_EDIT: ["PENDING_EDIT"], //EDIT action
        EDITED: ["EDITED"]
    };
    const filtered = enriched.filter((item) =>
      statusMap[activeLink.code]?.includes(item.status)
    );
    console.log("Filtered Data:", filtered);
    setTableData(filtered || []);
  }
}, [AllIndividualsData, billData, workerRatesData, activeLink]);
 
  const renderLabelPair = (heading, text,style) => (
    <div className="label-pair">
      <span className="view-label-heading">{t(heading)}</span>
      <span className="view-label-text" style={style}>{text} </span>
    </div>
  );


  

  if ( isBillLoading || isAllIndividualsLoading || isFetching) {
    console.log("Loading bill data or individual data...");
    return <LoaderScreen />
  }
  
console.log("Rendering buttons for:", activeLink?.code);
console.log("mob num:", tableData);

  return (
    <React.Fragment>
      <div style={{ marginBottom: "2.5rem" }}>
        <Header styles={{ marginBottom: "1rem" }} className="pop-inbox-header">
          {editBillDetails ? t('HCM_AM_EDIT_BILL') : t('HCM_AM_VERIFY_BILL_AND_GENERATE_PAYMENT')}
        </Header>
        <Card type="primary" className="bottom-gap-card-payment">
          {isBillLoading || isFetching ? (
    <Loader />
  ) : (
    <>
          {renderLabelPair('HCM_AM_BILL_NUMBER',billData?.billNumber || t("NA"), { color: "#C84C0E" } )}
          {renderLabelPair('HCM_AM_BILL_DATE', billData?.billDate ? formatTimestampToDate(billData.billDate) : t("NA"))}
          {renderLabelPair('HCM_AM_NUMBER_OF_REGISTERS', billData?.additionalDetails.noOfRegisters || t("NA"))}
          {renderLabelPair('HCM_AM_NUMBER_OF_WORKERS', billData?.billDetails.length || t("NA"))}
          {renderLabelPair('HCM_AM_BOUNDARY_CODE', billData?.localityCode || t("NA"))}
          {/* TODO : add Tag conditionally for status */}
          {/* {renderLabelPair('HCM_AM_STATUS', billData?.status || t("NA"))}  */}
          {renderLabelPair(
  'HCM_AM_STATUS',
  <span
    style={{
      backgroundColor:
        billData?.status === "FULLY_VERIFIED" || billData?.status === "FULLY_PAID"
          ? "#00703C" // Green
          : billData?.status === "PARTIALLY_VERIFIED" || billData?.status === "PARTIALLY_PAID" 
          ? "#9E5F00" // Yellow
          : "#B91900", // Red fallback
      color: "#fff",
      padding: "0.25rem 0.5rem",
      borderRadius: "4px",
      fontWeight: "bold",
      display: "inline-block",
      minWidth: "100px",
      textAlign: "center",
    }}
  >
    {t(billData?.status || "NA")}
  </span>
)}
          {
            <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
                {billData?.status === "PARTIALLY_VERIFIED" && (
                  <InfoCard
                    variant="error"
                    style={{ margin: "0rem", width: "100%", maxWidth: "unset", height: "90px" }}
                    label={t(`HCM_AM_ERROR`)}
                    text={t("few details are missing lorem ipsum dolor sit amet")}
                  />
                )}
</div>
          }
          </>
  )}
        </Card>
         
        {
          (
                                    <Tab
                                        activeLink={activeLink?.code}
                                        configItemKey="code"
                                        configDisplayKey="name"
                                        itemStyle={{ width: "400px" }}
                                        configNavItems={!editBillDetails?[
                                            {
                                                code: "NOT_VERIFIED",
                                                name: `${`${t(`HCM_AM_NOT_VERIFIED`)} `}`,
                                            },
                                            {
                                                code: "VERIFICATION_FAILED",
                                                name: `${`${t(`HCM_AM_VERIFICATION_FAILED`)} `}`,
                                            },
                                            {
                                              code: "VERIFIED",
                                              name: `${`${t(`HCM_AM_VERIFIED`)} `}`,
                                            },
                                            {
                                                code: "PAYMENT_GENERATED",
                                                name: `${`${t(`HCM_AM_PAYMENT_GENERATED`)} `}`,
                                            },
                                        ]:
                                      [
                                            {
                                                code: "PENDING_FOR_EDIT",
                                                name: `${`${t(`HCM_AM_PENDING_FOR_EDIT`)} `}`,
                                            },
                                            {
                                                code: "EDITED",
                                                name: `${`${t(`HCM_AM_EDITED`)} `}`,
                                            }
                                        ]}
                                        navStyles={{}}
                                        onTabClick={(e) => {
                                            setLimitAndOffset((prev) => {
                                                return {
                                                    limit: prev.limit,
                                                    offset: 0,
                                                };
                                            });
                                            setCurrentPage(1);
                                            setActiveLink(e);
                                            // filterDataByStatus(billData,e?.code);
                                            //TODO: uncomment this line later
                                        }}
                                        setActiveLink={setActiveLink}
                                        showNav={true}
                                        style={{}}
                                    />
                                )
        }
        <Card style={{ width: "100%", }}>
          {isBillLoading || isFetching ? (
    <Loader />
  ) : tableData.length === 0 ? (
                      <NoResultsFound text={t(`HCM_AM_NO_DATA_FOUND_FOR_BILLS`)} />
                  ) : (
    <Fragment>
                <BillDetailsTable 
                style={{ width: "100%", }}
                data={paginatedData} totalCount={tableData.length} selectableRows={true} 
                status={activeLink?.code} editBill={editBillDetails}
                onSelectionChange={setSelectedRows}
                selectedBills={selectedRows}
                rowsPerPage={rowsPerPage} currentPage={currentPage} handlePageChange={handlePageChange}
                    handlePerRowsChange={handlePerRowsChange} 
                    />
                    </Fragment>
  )}
            </Card>
        
      </div>
      {showToast && (
                      <Toast
                          style={{ zIndex: 10001 }}
                          label={showToast.label}
                          type={showToast.key}
                          // error={showToast.key === "error"}
                          transitionTime={showToast.transitionTime}
                          onClose={() => setShowToast(null)}
                      />
                  )}

     
 {openSendForEditPopUp && <SendForEditPopUp
        isEditTrue={editBillDetails}
        onClose={() => {
          setOpenSendForEditPopUp(false);
        }}
        onSubmit={(comment) => {
          // setComment(comment);
          setOpenSendForEditPopUp(false);
          // setOpenApproveAlertPopUp(true);
        }}
      />}
      {/* action bar for bill generation*/}
      {/* {showGenerateBillAction && BillData?.bills?.length === 0 && */}
      {activeLink?.code !== "PAYMENT_GENERATED" && (
        <ActionBar
        actionFields={
          !editBillDetails && activeLink?.code === 'NOT_VERIFIED' ?
          [          
            // <Button
            //   className="custom-class"
            //   icon="ArrowBack"
            //   label={t(`HCM_AM_SEND_FOR_EDIT`)}
            //   menuStyles={{
            //     bottom: "40px",
            //   }}
            //   onClick={() => {
            //     // setOpenSendForEditPopUp(true);
            //     updateBillDetailWorkflow(billData, selectedRows, "SEND_BACK_FOR_EDIT");
            //   }}  
            //   optionsKey="name"
            //   size=""
            //   style={{ minWidth: "14rem" }}
            //   title=""
            //   type="button"
            //   variation="secondary"
            //   isDisabled={billData?.status === "PENDING_VERIFICATION" || selectedRows.length === 0}
            // />,
                <Button
              className="custom-class"
              iconFill=""
              label={t(`HCM_AM_VERIFY`)}
              menuStyles={{
                bottom: "40px",
              }}             
              optionsKey="name"
              size=""
              style={{ minWidth: "14rem" }}
              title=""
              type="button"
              variation="primary"
              isDisabled={selectedRows.length === 0}

            />
            ]:
            !editBillDetails && activeLink?.code === 'VERIFICATION_FAILED' ?
          [          
            <Button
              className="custom-class"
              icon="ArrowBack"
              label={t(`HCM_AM_SEND_FOR_EDIT`)}
              menuStyles={{
                bottom: "40px",
              }}
              onClick={() => {
                // setOpenSendForEditPopUp(true);
                updateBillDetailWorkflow(billData, selectedRows, "SEND_BACK_FOR_EDIT");
              }}  
              optionsKey="name"
              size=""
              style={{ minWidth: "14rem" }}
              title=""
              type="button"
              // variation="secondary"
              variation="primary"
              isDisabled={billData?.status === "PENDING_VERIFICATION" || selectedRows.length === 0}
            />
            // ,
            //     <Button
            //   className="custom-class"
            //   iconFill=""
            //   label={t(`HCM_AM_VERIFY`)}
            //   menuStyles={{
            //     bottom: "40px",
            //   }}             
            //   optionsKey="name"
            //   size=""
            //   style={{ minWidth: "14rem" }}
            //   title=""
            //   type="button"
            //   variation="primary"
            //   isDisabled={selectedRows.length === 0}

            // />
            ]:
             editBillDetails && activeLink?.code === 'PENDING_FOR_EDIT' ?
          [          
            <Button
              className="custom-class"
              icon="Arrow"
              label={t(`HCM_AM_SAVE_CHANGES_AND_FORWARD`)}
              menuStyles={{
                bottom: "40px",
              }}
              onClick={() => {
                triggerIndividualBulkUpdate(AllIndividualsData,selectedRows, billData);
                // setOpenSendForEditPopUp(true);
              }}  
              optionsKey="name"
              size=""
              style={{ minWidth: "14rem" }}
              title=""
              type="button"
              variation="primary"
              isDisabled={selectedRows.length === 0}

            />
            ]
          : !editBillDetails && activeLink?.code === 'VERIFIED'  ? [
            <Button
              label={t(`HCM_AM_GENERATE_PAYMENT`)}
              title={t(`HCM_AM_GENERATE_PAYMENT`)}
              // onClick={() => {
              //   setUpdateDisabled(true);
              //   triggerMusterRollUpdate();
              // }}
              style={{ minWidth: "14rem" }}
              type="button"
              variation="primary"
              isDisabled={selectedRows.length === 0}
              // isDisabled={updateMutation.isLoading || updateDisabled || !isSubmitEnabled}
            />
            ]
            :[]
        }
        className=""
        maxActionFieldsAllowed={5}
        setactionFieldsToRight
        sortActionFields
        style={{}}
      />
      )}
      {/* } */}
      {/* {showToast && (
        <Toast
          style={{ zIndex: 10001 }}
          label={showToast.label}
          type={showToast.key}
          // error={showToast.key === "error"}
          transitionTime={showToast.transitionTime}
          onClose={() => setShowToast(null)}
        />
      )} */}
                  <div style={{ display: "flex", flexDirection: "row", gap: "24px", 
                    // marginBottom: showGenerateBillAction && BillData?.bills?.length === 0 && !isBillLoading && !isFetchingBill && billGenerationStatus == null ? "2.5rem" : "0px" 
                    }}>
            
                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "24px" }}>                    
                    <div style={{ width: "100%", display: "flex", flexDirection: "row", height: "74vh", minHeight: "60vh" }}>
                        
                        
                            <div>
                               
                            </div>
                        {/* </Card>} */}
                    </div>
                </div>
            </div>
    </React.Fragment>
  );
};
export default BillPaymentDetails;