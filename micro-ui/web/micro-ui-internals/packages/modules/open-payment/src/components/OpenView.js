import { Loader,StatusTable,Row,Card,Header,SubmitBar,ActionBar,Toast } from '@egovernments/digit-ui-react-components';
import React,{Fragment,useState} from 'react'
import { useTranslation } from "react-i18next";
import { makePayment } from '../utils/payGov';

const OpenView = () => {
  const { t } = useTranslation();
  const [showToast,setShowToast] = useState(null)
  const queryParams = Digit.Hooks.useQueryParams();
  const requestCriteria = {
    url:"/billing-service/bill/v2/_fetchbill",
    params:queryParams,
    body:{},
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
    console.log("payment in progress")
    debugger
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
        callbackUrl: `${window.location.protocol}//${window.location.host}/${window.contextPath}/citizen/payment/success?consumerCode=${queryParams.consumerCode}&tenantId=${queryParams.tenantId}&businessService=${queryParams.businessService}`,
        additionalDetails: {
          isWhatsapp: false,
        },
      },
    };


    try {
      debugger
      const data = await Digit.PaymentService.createCitizenReciept(bill?.tenantId, filterData);
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

    debugger
  }

  if(isLoading){
    return <Loader />
  }
  return (
    <>
    <Card className={"employeeCard-override"} style={{marginTop:"2rem"}}>
      <Header className="works-header-search">{t("OP_PAYMENT_DETAILS")}</Header>
      <StatusTable style={{ paddingTop: "2rem" }}>
          <Row label={t("ES_PAYMENT_TAXHEADS")} textStyle={{ fontWeight: "bold" }} text={t("ES_PAYMENT_AMOUNT")} />
          <hr style={{ width: "40%" }} className="underline" />
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