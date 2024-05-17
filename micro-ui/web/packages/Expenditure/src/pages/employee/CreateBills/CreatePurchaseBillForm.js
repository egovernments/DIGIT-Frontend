import { FormComposer, Header, Toast, WorkflowModal } from "@digit-ui/digit-ui-react-components";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import _ from "lodash";
import { useHistory } from "react-router-dom";
import { createBillPayload } from "../../../utils/createBillUtils";
import { updateBillPayload } from "../../../utils/updateBillPayload";
import getModalConfig from "./config";

const navConfig =  [
    {
        name:"PB_Details",
        code:"COMMON_PB_DETAILS",
    }
];

const CreatePurchaseBillForm = ({
    createPurchaseBillConfig, 
    sessionFormData, 
    setSessionFormData, 
    clearSessionFormData, 
    contract,  
    preProcessData,
    isModify,
    docConfigData,
    bill
}) => {
    const {t} = useTranslation();
    const [toast, setToast] = useState({show : false, label : "", error : false});
    const history = useHistory();
    const tenantId = Digit.ULBService.getCurrentTenantId();

    const [showModal, setShowModal] = useState(false);
    const rolesForThisAction = "BILL_VERIFIER" //hardcoded for now
    const [approvers, setApprovers] = useState([]);
    const [selectedApprover, setSelectedApprover] = useState({});
    const [inputFormData,setInputFormData] = useState({})
    const [config, setConfig] = useState({});

    createPurchaseBillConfig = useMemo(
        () => Digit.Utils.preProcessMDMSConfig(t, createPurchaseBillConfig, {
            updateDependent : [
              {
                  key : 'invoiceDetails_vendor',
                  value : [preProcessData?.nameOfVendor]
              },
              {
                key : 'basicDetails_purchaseBillNumber',
                value : [!isModify ? "none" : "flex"]
              },
              {
                key : 'billDetails_billDate',
                value : [new Date().toISOString().split("T")[0]]
              },
              {
                key : 'invoiceDetails_invoiceDate',
                value : [new Date().toISOString().split("T")[0]]
              },
            ]
          }),
      [preProcessData?.nameOfVendor]);

    const onFormValueChange = (setValue, formData, formState, reset, setError, clearErrors, trigger, getValues) => {
        if (!_.isEqual(sessionFormData, formData)) {
            const difference = _.pickBy(sessionFormData, (v, k) => !_.isEqual(formData[k], v));

            if(formData.invoiceDetails_vendor) {
                setValue("invoiceDetails_vendorId", formData.invoiceDetails_vendor?.orgNumber);
            }

            if(formData.invoiceDetails_materialCost) {
                let gstAmount = formData.invoiceDetails_gst ? formData.invoiceDetails_gst : 0;
                setValue("billDetails_billAmt", parseInt(formData.invoiceDetails_materialCost)+parseInt(gstAmount));
            }

            if(formData.billDetails_billAmt) {
                let gstAmount = formData.invoiceDetails_gst ? formData.invoiceDetails_gst : 0;
                let value = parseFloat(formData.invoiceDetails_materialCost)+ parseFloat(gstAmount);
                if(value > contract?.totalContractedAmount){
                    setValue("billDetails_billAmt", Digit.Utils.dss.formatterWithoutRound(value, "number"));
                    setError("billDetails_billAmt",{ type: "custom" }, { shouldFocus: true })
                }
                else{
                    setValue("billDetails_billAmt", Digit.Utils.dss.formatterWithoutRound(value, "number"));
                    clearErrors("billDetails_billAmt")
                }
            }

            if(difference?.billDetails_billAmt){
                let billAmount = parseFloat(Digit.Utils.dss.convertFormatterToNumber(formData?.billDetails_billAmt));
                formData?.deductionDetails && formData?.deductionDetails?.forEach((data, index)=>{
                  if(data?.name?.calculationType === "percentage") {
                    const amount = billAmount ? (billAmount * (parseFloat(data?.name?.value)/100)).toFixed(1) : 0
                    setValue(`deductionDetails.${index}.amount`, amount);
                  }
                })
            }

            setSessionFormData({ ...sessionFormData, ...formData });
        }
    }

    const handleToastClose = () => {
        setToast({show : false, label : "", error : false});
    }

    //remove Toast after 3s
    useEffect(()=>{
        if(toast?.show) {
        setTimeout(()=>{
            handleToastClose();
        },3000);
        }
    },[toast?.show]);

    const { mutate: CreatePurchaseBillMutation } = Digit.Hooks.bills.useCreatePurchaseBill();
    const { mutate: UpdatePurchaseBillMutation } = Digit.Hooks.bills.useUpdatePurchaseBill();

    const { isLoading: approverLoading, isError, error, data: employeeDatav1 } = Digit.Hooks.hrms.useHRMSSearch({ roles: rolesForThisAction, isActive: true }, Digit.ULBService.getCurrentTenantId(), null, null, { enabled:true });


    employeeDatav1?.Employees.map(emp => emp.nameOfEmp = emp?.user?.name || "NA")

    useEffect(() => {
        setApprovers(employeeDatav1?.Employees?.length > 0 ? employeeDatav1?.Employees.filter(emp => emp?.nameOfEmp !== "NA") : [])
    }, [employeeDatav1])
    useEffect(() => {

        setConfig(
            getModalConfig({
                t,
                approvers,
                selectedApprover,
                setSelectedApprover,
                approverLoading,
                isModify
                // designation,
                // selectedDesignation,
                // setSelectedDesignation,
                // department,
                // selectedDept,
                // setSelectedDept,
            })
        )

    }, [approvers])


    const onModalSubmit = async (_data) => {
        _data = Digit.Utils.trimStringsInObject(_data)
        //here make complete data in combination with _data and inputFormData and create payload accordingly
        //also test edit flow with this change
        
        const workflowDetails = {
            assignees:selectedApprover.uuid ? [selectedApprover.uuid]: [],
            comment:_data.comments ? _data.comments : ""
        }
        const payload = createBillPayload(inputFormData, contract, docConfigData,workflowDetails);
        
        if(isModify){
            const updatedBillObject = updateBillPayload(bill,payload)
            const updatedPayload = {bill:updatedBillObject,workflow:{
                "action": "RE-SUBMIT",
                "assignees": workflowDetails.assignees,
                "comment":workflowDetails.comment
              }}
            await UpdatePurchaseBillMutation(updatedPayload, {
                onError: async (error, variables) => {
                    
                    sendDataToResponsePage("billNumber", tenantId, false, "EXPENDITURE_PB_MODIFIED_FORWARDED", false);
                },
                onSuccess: async (responseData, variables) => {
                    
                    sendDataToResponsePage(responseData?.bills?.[0]?.billNumber, tenantId, true, "EXPENDITURE_PB_MODIFIED_FORWARDED", true);
                },
            });
        }else{

            await CreatePurchaseBillMutation(payload, {
                onError: async (error, variables) => {
                    sendDataToResponsePage("billNumber", tenantId, false, "EXPENDITURE_PB_CREATED_FORWARDED", false);
                },
                onSuccess: async (responseData, variables) => {
                sendDataToResponsePage(responseData?.bills?.[0]?.billNumber, tenantId, true, "EXPENDITURE_PB_CREATED_FORWARDED", true);
                },
            });
        }
    }

    const onFormSubmit = async(data) => {
        data = Digit.Utils.trimStringsInObject(data)
        setInputFormData((prevState) => data)

        if(data?.totalBillAmount <= 0)
        setToast({show : true, label : t("EXPENDITURE_VALUE_CANNOT_BE_ZERO"), error : true})
        else
        setShowModal(true);
        //transform formdata to Payload
        
    }

    const sendDataToResponsePage = (billNumber, tenantId, isSuccess, message, showID) => {
        history.push({
          pathname: `/${window?.contextPath}/employee/expenditure/create-purchase-bill-response`,
          search: `?billNumber=${billNumber}&tenantId=${tenantId}&isSuccess=${isSuccess}`,
          state : {
            message : message,
            showID : showID
          }
        }); 
      }
    
    useEffect(() => {
        return () => {
            if (!window.location.href.includes("create-purchase-bill") && Object.keys(sessionFormData) != 0) {
                clearSessionFormData();
            }
        };
    });

    return (
        <React.Fragment>
                {showModal && <WorkflowModal
                    closeModal={() => setShowModal(false)}
                    onSubmit={onModalSubmit}
                    config={config}
                />
                }

                {
                    createPurchaseBillConfig && 
                    (<FormComposer
                        label={isModify ? "COMMON_MODIFY_PB" : "ACTION_TEST_CREATE_PB"}
                        config={createPurchaseBillConfig?.form?.map((config) => {
                        return {
                            ...config,
                            body: config?.body.filter((a) => !a.hideInEmployee),
                        };
                        })}
                        onSubmit={onFormSubmit}
                        submitInForm={false}
                        fieldStyle={{ marginRight: 0 }}
                        inline={false}
                        className="form-no-margin"
                        defaultValues={sessionFormData}
                        showWrapperContainers={false}
                        isDescriptionBold={false}
                        noBreakLine={true}
                        showNavs={createPurchaseBillConfig?.metaData?.showNavs}
                        showFormInNav={true}
                        showMultipleCardsWithoutNavs={false}
                        showMultipleCardsInNavs={false}
                        horizontalNavConfig={navConfig}
                        onFormValueChange={onFormValueChange}
                        cardClassName = "mukta-header-card"
                    />)
                }
               {toast?.show && <Toast error={toast?.error} label={toast?.label} isDleteBtn={true} onClose={handleToastClose} />}
        </React.Fragment>
    )
}

export default CreatePurchaseBillForm;