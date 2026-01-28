import { Loader,StatusTable,Row,Card,Header,SubmitBar,ActionBar,Toast } from '@egovernments/digit-ui-react-components';
import React,{Fragment,useEffect,useState} from 'react'
import { useTranslation } from "react-i18next";
import { makePayment } from '../utils/payGov';
import  { CustomisedHooks } from "../hooks";
import $ from "jquery";
import { useNavigate, useLocation } from 'react-router-dom';
import { FormComposerV2 } from '@egovernments/digit-ui-components';
import { ViewConfig, CardConfig, ChequeConfig } from '../configs/OpenViewConfig';

const OpenView = () => {
  const { t } = useTranslation();
  const [showToast,setShowToast] = useState(null)
  const queryParams = Digit.Hooks.useQueryParams();
  const mutation = CustomisedHooks?.Hooks?.openpayment?.useCreatePayment();
  const navigate = useNavigate();
  const { state } = useLocation();
  const defValues = {
    "mode": {
      code: "CASH",
      name: "CASH",
    }
  };
  const [Config, setConfig] = useState(ViewConfig);
  const [currentMode, setCurrentMode] = useState("CASH");
  const [lastFetchedIfsc, setLastFetchedIfsc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requestCriteria = {
    url:"/billing-service/bill/v2/_fetchbill",
    params:queryParams,
    body:{},
    options:{
      userService:true,
      auth:true
    },
    config: {
        enabled: !!queryParams.consumerCode && !!queryParams.tenantId && !!queryParams.businessService,
        select:(data) => {
          return data?.Bill?.[0]
        }
    },
  }
  const { isLoading, data:bill, revalidate,isFetching,error } = Digit.Hooks.useCustomAPIHook(requestCriteria);

  // Fetch individual data based on mobile number from bill
  const individualRequestCriteria = {
    url: "/health-individual/v1/_search",
    params: {
      limit: 1000,
      offset: 0,
      tenantId: queryParams.tenantId
    },
    body: {
      Individual: {
        tenantId: queryParams.tenantId,
        mobileNumber: bill?.mobileNumber ? [bill.mobileNumber] : []
      }
    },
    options: {
      userService: true,
      auth: true
    },
    config: {
      enabled: !!bill?.mobileNumber && !!queryParams.tenantId,
      select: (data) => {
        return data?.Individual?.[0] || null;
      }
    },
  };
  const { data: individualData, isLoading : isIndividualLoading } = Digit.Hooks.useCustomAPIHook(individualRequestCriteria);

  const arrears =
    bill?.billDetails
      ?.sort((a, b) => b.fromPeriod - a.fromPeriod)
      ?.reduce((total, current, index) => (index === 0 ? total : total + current.amount), 0) || 0;
  
  const onSubmit = async (formData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    if(formData.transactionno!=formData.ReTransactionno){
     setShowToast({ key: true, label: t("Transaction Numbers dont match") });
     setIsSubmitting(false);
    }
    else{
    if(window.location.href.includes("employee"))
    {
      const body = {
        Payment: {
          // mobileNumber: paymentData.mobileNumber,
          // paymentDetails: [
          //   {
          //     businessService: queryParams?.businessService,
          //     billId: "7ff19cf8-7abe-48e0-b249-a1e1d2d4ec8f",
          //     totalDue: 784,
          //     totalAmountPaid: 784,
          //   },
          // ],
          // tenantId: paymentData.tenantId,
          // totalDue: paymentData.totalDue,
          // totalAmountPaid: paymentData.totalAmountPaid,
          // paymentMode: paymentData.paymentMode,
          // payerName: paymentData.payerName,
          // paidBy: paymentData.paidBy,
          mobileNumber: formData.payermob || bill?.mobileNumber,
          paymentDetails: [
            {
              businessService: queryParams.businessService,
              billId: bill?.id,
              totalDue: bill?.totalAmount,
              totalAmountPaid: bill?.totalAmount,
            },
          ],
          tenantId: queryParams.tenantId,
          totalDue: bill?.totalAmount,
          totalAmountPaid: bill?.totalAmount,
          paymentMode: formData.mode.code || "CASH",
          payerName: formData.payername || bill?.payerName,
          paidBy: formData.paidby.code || "OWNER",
          payerEmail: individualData?.email || individualData?.emailId || null,
          payerAddress: individualData?.address?.[0]?.addressLine1
            ? `${individualData.address[0].addressLine1 || ''}${individualData.address[0].addressLine2 ? ', ' + individualData.address[0].addressLine2 : ''}${individualData.address[0].city ? ', ' + individualData.address[0].city : ''}${individualData.address[0].pincode ? ' - ' + individualData.address[0].pincode : ''}`
            : individualData?.correspondenceAddress || null,
          ...( formData.mode.code === "CHEQUE" && {
            bankBranch: formData.bankb,
            bankName: formData.bankname,
            ifscCode: formData.ifsc,
            instrumentNumber: formData.chequeno,
            instrumentDate: formData.chequedata ? new Date(formData.chequedata).getTime() : null,
            transactionNumber: formData.chequeno,
           }),
          ...( formData.mode.code === "CARD" && {
            transactionNumber: formData.transactionno,
            instrumentNumber: formData.digit,
          }),
        }
      };
      mutation.mutate(
        {
          url: `/collection-services/payments/_create?tenantId=${queryParams.tenantId}`,
          body,
          headers:{ "X-Tenant-Id": queryParams.tenantId }
        },
        {
          onSuccess: (data) => {
  if (data?.Payments?.[0].paymentDetails[0].businessService && data?.Payments?.[0].paymentDetails?.[0]?.bill?.consumerCode && data?.Payments?.[0]?.tenantId) {
    navigate({
      pathname: `/${window.contextPath}/${window.location.href.includes("/citizen/") ? "citizen" : "employee"}/openpayment/success/${data?.Payments?.[0].paymentDetails[0].businessService}/${data?.Payments?.[0].paymentDetails?.[0]?.bill?.consumerCode}/${data?.Payments?.[0]?.tenantId}`,
      state: {
        isSuccess: true,
        applicationNumber: data?.Payments?.[0].paymentDetails?.[0]?.receiptNumber,
       redirectionUrl: `/${window.contextPath}/employee/publicservices/${state?.moduleName}/${state?.serviceName}/ViewScreen?applicationNumber=${data?.Payments?.[0].paymentDetails?.[0]?.bill?.consumerCode}&serviceCode=${state?.serviceCode}&selectedModule=true&from=search`
      }
    });
  } else {
    navigate({
      pathname: `/${window.contextPath}/${window.location.href.includes("/citizen/") ? "citizen" : "employee"}/openpayment/failure`,
      state: { isSuccess: false, ...state }
    });
  }
},
          onError: (error) => {
            console.error("Payment creation failed:", error.message);
            setIsSubmitting(false);
          },
        }
      );
    }
    if(!window.location.href.includes("employee")){
      const filterData = {
        Transaction: {
          tenantId: bill?.tenantId,
          txnAmount: bill.totalAmount,
          module: bill.businessService,
          billId: bill.id,
          consumerCode: bill.consumerCode,
          productInfo: "Common Payment",
          gateway: "PAYGOV",
          taxAndPayments: [
            {
              billId: bill.id,
              amountPaid: bill.totalAmount,
            },
          ],
          user: {
            name:  bill?.payerName,
            mobileNumber:  bill?.mobileNumber,
            tenantId: bill?.tenantId,
            emailId: "sriranjan.srivastava@owc.com"
          },
          // success
          // callbackUrl: `${window.location.protocol}//${window.location.host}/${window.contextPath}/citizen/openpayment/success?consumerCode=${queryParams.consumerCode}&tenantId=${queryParams.tenantId}&businessService=${queryParams.businessService}`,
          callbackUrl: `${window.location.protocol}//${window.location.host}/${window.contextPath}/citizen/openpayment/success/${queryParams.businessService}/${queryParams.consumerCode}/${queryParams.tenantId}`,
          additionalDetails: {
            isWhatsapp: false,
          },
        },
      };
  
      try {
        
        const data = await Digit.PaymentService.createCitizenReciept(bill?.tenantId, filterData);
        //dummy response
      //   const data = {
      //     "ResponseInfo": {
      //         "apiId": "Rainmaker",
      //         "ver": null,
      //         "ts": null,
      //         "resMsgId": "uief87324",
      //         "msgId": "1718644477119|en_IN",
      //         "status": "SUCCESSFUL"
      //     },
      //     "Transaction": {
      //         "tenantId": "pb.abianakhurd",
      //         "txnAmount": "160",
      //         "billId": "3b27460b-d37e-4e0d-bd51-ed32f12e90e3",
      //         "module": "WS",
      //         "consumerCode": "WS/7141/2024-25/0316",
      //         "taxAndPayments": [
      //             {
      //                 "taxAmount": null,
      //                 "amountPaid": 160,
      //                 "billId": "3b27460b-d37e-4e0d-bd51-ed32f12e90e3"
      //             }
      //         ],
      //         "productInfo": "Common Payment",
      //         "gateway": "PAYGOV",
      //         "callbackUrl": "http://localhost:3000/mgramseva-web/employee/hrms/success?consumerCode=WS/7141/2024-25/0316&tenantId=pb.abianakhurd&businessService=WS&eg_pg_txnid=PB_PG_2024_06_17_0367_81",
      //         "txnId": "PB_PG_2024_06_17_0367_81",
      //         "user": {
      //             "uuid": "e18c2f5b-6035-4360-885b-dfd28b1159f0",
      //             "name": "hj",
      //             "userName": "9379239289",
      //             "mobileNumber": "9379239289",
      //             "emailId": null,
      //             "tenantId": "pb"
      //         },
      //         "redirectUrl": "https://pilot.surepay.ndml.in/SurePayPayment/sp/processRequest?additionalField3=pb.abianakhurd&orderId=PB_PG_2024_06_17_0367_81&additionalField4=WS/7141/2024-25/0316&requestDateTime=17-06-202417:14:078&additionalField5=WSabianakhurd&successUrl=https://mgramseva-uat.psegs.in/pg-service/transaction/v1/_redirect?originalreturnurl=/mgramseva-web/employee/hrms/success?consumerCode=WS/7141/2024-25/0316&tenantId=pb.abianakhurd&businessService=WS&eg_pg_txnid=PB_PG_2024_06_17_0367_81&failUrl=https://mgramseva-uat.psegs.in/pg-service/transaction/v1/_redirect?originalreturnurl=/mgramseva-web/employee/hrms/success?consumerCode=WS/7141/2024-25/0316&tenantId=pb.abianakhurd&businessService=WS&eg_pg_txnid=PB_PG_2024_06_17_0367_81&txURL=https://pilot.surepay.ndml.in/SurePayPayment/sp/processRequest&messageType=0100&merchantId=UATPWSSG0000001429&transactionAmount=160&customerId=e18c2f5b-6035-4360-885b-dfd28b1159f0&checksum=3463857141&additionalField1=9379239289&additionalField2=111111&serviceId=WSabianakhurd&currencyCode=INR",
      //         "txnStatus": "PENDING",
      //         "txnStatusMsg": "Transaction initiated",
      //         "gatewayTxnId": null,
      //         "gatewayPaymentMode": null,
      //         "gatewayStatusCode": null,
      //         "gatewayStatusMsg": null,
      //         "receipt": null,
      //         "auditDetails": {
      //             "createdBy": "d158721b-5c25-421b-8c26-c63cf5d38825",
      //             "createdTime": 1718644478078,
      //             "lastModifiedBy": null,
      //             "lastModifiedTime": null
      //         },
      //         "additionalDetails": {
      //             "isWhatsapp": false,
      //             "taxAndPayments": [
      //                 {
      //                     "taxAmount": null,
      //                     "amountPaid": 160,
      //                     "billId": "3b27460b-d37e-4e0d-bd51-ed32f12e90e3"
      //                 }
      //             ]
      //         },
      //         "bankTransactionNo": null
      //     }
      // }
        const redirectUrl = data?.Transaction?.redirectUrl;
          // paygov
          try {
            const gatewayParam = redirectUrl
              ?.split("?")
              ?.slice(1)
              ?.join("?")
              ?.split("&")
              ?.reduce((curr, acc) => {
                var d = acc.split("=");
                curr[d[0]] = d[1];
                return curr;
              }, {});
            var newForm = $("<form>", {
              action: gatewayParam.txURL,
              method: "POST",
              target: "_top",
            });
            const orderForNDSLPaymentSite = [
              "checksum",
              "messageType",
              "merchantId",
              "serviceId",
              "orderId",
              "customerId",
              "transactionAmount",
              "currencyCode",
              "requestDateTime",
              "successUrl",
              "failUrl",
              "additionalField1",
              "additionalField2",
              "additionalField3",
              "additionalField4",
              "additionalField5",
            ];
  
            // override default date for UPYOG Custom pay
            gatewayParam["requestDateTime"] = gatewayParam["requestDateTime"]?.split(new Date().getFullYear()).join(`${new Date().getFullYear()} `);
  
            gatewayParam["successUrl"]= redirectUrl?.split("successUrl=")?.[1]?.split("eg_pg_txnid=")?.[0]+'eg_pg_txnid=' +gatewayParam?.orderId;
            gatewayParam["failUrl"]= redirectUrl?.split("failUrl=")?.[1]?.split("eg_pg_txnid=")?.[0]+'eg_pg_txnid=' +gatewayParam?.orderId;
            // gatewayParam["successUrl"]= data?.Transaction?.callbackUrl;
            // gatewayParam["failUrl"]= data?.Transaction?.callbackUrl;
  
            // var formdata = new FormData();
  
            for (var key of orderForNDSLPaymentSite) {
  
              // formdata.append(key,gatewayParam[key]);
  
              newForm.append(
                $("<input>", {
                  name: key,
                  value: gatewayParam[key],
                  // type: "hidden",
                })
              );
            }
            $(document.body).append(newForm);
            newForm.submit();
            makePayment(gatewayParam.txURL,newForm);
  
          } catch (e) {
            console.log("Error in payment redirect ", e);
            //window.location = redirectionUrl;
          }
        
       // window.location = redirectUrl;
      } catch (error) {
        let messageToShow = "CS_PAYMENT_UNKNOWN_ERROR_ON_SERVER";
        if (error.response?.data?.Errors?.[0]) {
          const { code, message } = error.response?.data?.Errors?.[0];
          messageToShow = code;
        }
        setShowToast({ key: true, label: t(messageToShow) });
        setIsSubmitting(false);
      }
    }
  }
}

  const handleFormValueChange = async (setValue, formData) => {
    const newMode = formData?.mode?.code;
    // Only update config when mode actually changes
    if (newMode && newMode !== currentMode) {
      setCurrentMode(newMode);
      if (newMode === "CHEQUE") {
        setConfig(ChequeConfig);
      } else if (newMode === "CARD") {
        setConfig(CardConfig);
      } else if (newMode === "CASH") {
        setConfig(ViewConfig);
      }
    }

    // IFSC code lookup - only when in CHEQUE mode
    if (newMode === "CHEQUE" || currentMode === "CHEQUE") {
      const ifscCode = formData?.ifsc;
      if (ifscCode && ifscCode.length === 11 && ifscCode !== lastFetchedIfsc) {
        setLastFetchedIfsc(ifscCode);
        try {
          const response = await fetch(`https://ifsc.razorpay.com/${ifscCode}`);
          if (response.ok) {
            const bankData = await response.json();
            setValue("bankname", bankData?.BANK || "");
            setValue("bankb", bankData?.BRANCH || "");
          } else {
            setValue("bankname", "");
            setValue("bankb", "");
            setShowToast({ key: true, label: t("INVALID_IFSC_CODE") });
          }
        } catch (error) {
          console.error("Error fetching bank details:", error);
          setValue("bankname", "");
          setValue("bankb", "");
        }
      } else if (lastFetchedIfsc && (!ifscCode || ifscCode.length < 11)) {
        // Clear bank details when IFSC is removed or incomplete
        setLastFetchedIfsc("");
        setValue("bankname", "");
        setValue("bankb", "");
      }
    }
  }

  const isCitizen = window.location.href.includes("/citizen/");

  if(isLoading || isIndividualLoading){
    return <Loader />
  }
  return (
    <div className={isCitizen ? "citizen-open-view" : "employee-open-view"}>
      <style>
        {isCitizen
          ? `.citizen-open-view .digit-action-bar-wrap { height: auto }
             .citizen-open-view .label-container { flex-wrap: wrap; max-width: 76%; }
             .citizen-open-view .label-container .label-styles { white-space: normal; word-wrap: break-word; }
             .citizen-open-view .digit-break-line { display: none; }`
          : `.employee-open-view .digit-action-bar-wrap { display: flex; justify-content: flex-end; }
             .employee-open-view .digit-action-bar-wrap .digit-submit-bar { width: auto; }
             .employee-open-view .employee-data-table .row { gap: 2.5rem; }`
        }
      </style>
      <FormComposerV2
        defaultValues={defValues}
        label={t("CS_COMMON_SUBMIT")}
        config={Config}
        onFormValueChange={(setValue, formData) => { handleFormValueChange(setValue, formData) }}
        onSubmit={onSubmit}
        fieldStyle={{ marginRight: 2 }}
        labelfielddirectionvertical={true}
        noBreakLine={false}
        breaklineStyle={{
          border: "0.063rem solid #d6d5d4",
          width: "100%",
          margin: "0"
        }}
        className={"open-view-form"}
      />
      {showToast && (
        <Toast
          error={showToast.key}
          label={t(showToast.label)}
          onClose={() => {
            setShowToast(null);
          }}
        />
      )}
    </div>
  )
}

export default OpenView