import React, { useState, useEffect } from 'react'
import { useTranslation } from "react-i18next";
import { Header, Toast,SubmitBar,ActionBar } from '@egovernments/digit-ui-react-components';
import ApplicationDetails from '../../../../../templates/ApplicationDetails';

const ViewPaymentInstruction = () => {
  const { t } = useTranslation();
  const businessService = Digit?.Customizations?.["commonUiConfig"]?.getBusinessService("works.wages");
  const { tenantId, piNumber } = Digit.Hooks.useQueryParams();
  const [showDataError, setShowDataError] = useState(null)
  const [toast,setShowToast] = useState(null)
  const [showActionBar,setShowActionBar] = useState(true)
  const payload = {
    "searchCriteria": {
      tenantId,
      piNumber
  },
  "pagination": {
      "limit": "10",
      "offset": "0",
      "sortBy": "",
      "order": "ASC"
  } 
  }
  const {isLoading, data, isError, isSuccess, error,refetch} = Digit.Hooks.paymentInstruction.useViewPaymentInstruction({tenantId, data: payload, config: { cacheTime:0 }})

  const { mutate: updatePIMutation } = Digit.Hooks.paymentInstruction.useUpdatePI();

  const piStatus = data?.[0]?.applicationData?.piStatus
  
  const closeToast = () => {
    setTimeout(() => {
      setShowToast(null)
    }, 6000);
  }

  const handleUpdatePI = async () => {
    const piDetails = data?.[0]?.applicationData
    // console.log("pi update");
    const payloadForUpdate = {
      tenantId,
    }
    
    //retry
    if(piDetails?.piStatus==="FAILED") {
      payloadForUpdate.referenceId = piDetails?.muktaReferenceId
    }
    //revised
    else{
      payloadForUpdate.parentPI = piDetails?.jitBillNo
    }
    //in case of retry (Failed status) send referenceId
    // in case of Partial status, send piNumber to generate revised pi
    await updatePIMutation(payloadForUpdate, {
      onError: async (error, variables) => {
          setShowToast({
            error:true,
            label:`${t("EXP_RETRY_PI_ERR_MESSAGE")} : ${error?.response.data.Errors[0].description}`
          })
          closeToast()
          refetch()
        },
      onSuccess: async (responseData, variables) => {
          setShowToast({
            error:false,
            label:`${t("EXP_RETRY_PI_MESSAGE")} : ${responseData?.paymentInstruction?.jitBillNo}`
          })
          closeToast()
          refetch()
      },
  });

  }

  useEffect(() => {
    if(isError) {
      setShowDataError(true)
    }
  }, [error])

  return (
    <React.Fragment>
      <Header className="works-header-view">{t("EXP_PAYMENT_INS")}</Header>
      {
        showDataError === null && (
          <ApplicationDetails
            applicationDetails={data?.[0]?.applicationDetails}
            isLoading={isLoading}
            applicationData={data?.[0]?.applicationData}
            moduleCode="AttendenceMgmt"
            showTimeLine={false}
            businessService={businessService}
            tenantId={tenantId}
          />
        )
      }
      {
        showDataError === null && (
          <ApplicationDetails
            applicationDetails={data?.[1]?.applicationDetails}
            isLoading={isLoading}
            applicationData={data?.[1]?.applicationData}
            moduleCode="AttendenceMgmt"
            showTimeLine={false}
            businessService={businessService}
            tenantId={tenantId}
          />
        )
      }
      {
        showDataError && <Toast error={true} label={t("COMMON_ERROR_FETCHING_PI_DETAILS")} isDleteBtn={true} onClose={() => setShowDataError(false)} />
      }
      { (piStatus==="FAILED" || piStatus==="PARTIAL") && showActionBar && 
        <ActionBar> 
          <SubmitBar label={piStatus==="FAILED" ?t("EXP_RETRY_PI"):t("EXP_GENERATE_REVISED_PI")} onSubmit={handleUpdatePI} />
        </ActionBar>
      }
      {
        toast && <Toast error={toast?.error} label={toast?.label} isDleteBtn={true} onClose={() => setShowToast(null)} />
      }
    </React.Fragment>
  )
}

export default ViewPaymentInstruction;