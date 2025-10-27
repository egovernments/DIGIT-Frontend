import { Loader,StatusTable,Row,Card,Header,SubmitBar,ActionBar,Toast } from '@egovernments/digit-ui-react-components';
import React,{Fragment,useState} from 'react'
import { useTranslation } from "react-i18next";
import { makePayment } from '../utils/payGov';
import $ from "jquery";

const OpenView = () => {
  const { t } = useTranslation();
  const [showToast,setShowToast] = useState(null)
  const queryParams = Digit.Hooks.useQueryParams();
  const requestCriteria = {
    url:"/billing-service/bill/v2/_fetchbill",
    params:queryParams,
    body:{},
    options:{
      userService:false,
      auth:false
    },
    config: {
        enabled: !!queryParams.consumerCode && !!queryParams.tenantId && !!queryParams.businessService,
        select:(data) => {
          return data?.Bill?.[0]
        }
    },
  }
  const { isLoading, data:bill, revalidate,isFetching,error } = Digit.Hooks.useCustomAPIHook(requestCriteria);

  const arrears =
    bill?.billDetails
      ?.sort((a, b) => b.fromPeriod - a.fromPeriod)
      ?.reduce((total, current, index) => (index === 0 ? total : total + current.amount), 0) || 0;
  
  const onSubmit = async () => {    
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
    }

  }

  if(isLoading){
    return <Loader />
  }
  return (
    <>
    <Card>
      <Header className="works-header-search">{t("OP_PAYMENT_DETAILS")}</Header>
      <StatusTable>
          <Row label={t("OP_CONSUMER_NAME")}  text={bill?.payerName || t("ES_COMMON_NA")} />
          <Row label={t("OP_CONSUMER_EMAIL")}  text={bill?.payerEmail || t("ES_COMMON_NA")} />
          <Row label={t("OP_CONSUMER_ADDRESS")}  text={bill?.payerAddress || t("ES_COMMON_NA")} />
          <Row label={t("OP_CONSUMER_PHNO")}  text={bill?.mobileNumber || t("ES_COMMON_NA")} />
          <Row label={t("ES_PAYMENT_TAXHEADS")} labelStyle={{ fontWeight: "bold" }} textStyle={{ fontWeight: "bold" }} text={t("ES_PAYMENT_AMOUNT")} />
          {/* <hr style={{ width: "40%" }} className="underline" /> */}
          {bill?.billDetails?.[0]?.billAccountDetails
            ?.sort((a, b) => a.order - b.order)
            .map((amountDetails, index) => (
              <Row
                key={index + "taxheads"}
                labelStyle={{ fontWeight: "normal" }}
                textStyle={{ textAlign: "right", maxWidth: "100px" }}
                label={t(amountDetails.taxHeadCode)}
                text={"₹ " + amountDetails.amount?.toFixed(2)}
              />
            ))}

          {arrears?.toFixed?.(2) ? (
            <Row
              labelStyle={{ fontWeight: "normal" }}
              textStyle={{ textAlign: "right", maxWidth: "100px" }}
              label={t("COMMON_ARREARS")}
              text={"₹ " + arrears?.toFixed?.(2) || Number(0).toFixed(2)}
            />
          ) : null}

          <hr style={{ width: "40%" }} className="underline" />
          <Row
            label={t("CS_PAYMENT_TOTAL_AMOUNT")}
            labelStyle={{ fontWeight: "bold" }}
            textStyle={{ fontWeight: "bold", textAlign: "right", maxWidth: "100px" }}
            text={"₹ " + Number(bill?.totalAmount).toFixed(2)}
          />
        </StatusTable>
    </Card>
    <ActionBar style={{ display: "flex", justifyContent: "flex-end", alignItems: "baseline" }}>
          {/* {displayMenu ? <Menu localeKeyPrefix={"ES_COMMON"} options={ACTIONS} t={t} onSelect={onActionSelect} /> : null} */}
          <SubmitBar disabled={Number(bill?.totalAmount) === 0} onSubmit={onSubmit} label={t("OP_PROCEED_TO_PAY")} />
    </ActionBar>
    {showToast && (
        <Toast
          error={showToast.key}
          label={t(showToast.label)}
          onClose={() => {
            setShowToast(null);
          }}
        />
      )}
    </>
  )
}

export default OpenView