import { Loader,StatusTable,Row,Card,Header,SubmitBar,ActionBar,Toast } from '@egovernments/digit-ui-react-components';
import React,{Fragment,useEffect,useState} from 'react'
import { useTranslation } from "react-i18next";
import { makePayment } from '../utils/payGov';
import  { CustomisedHooks } from "../hooks";
import $ from "jquery";
import { useLocation } from 'react-router-dom';

const OpenViewComp = () => {
  const { t } = useTranslation();
  const [showToast,setShowToast] = useState(null)
  const queryParams = Digit.Hooks.useQueryParams();
  const mutation = CustomisedHooks?.Hooks?.openpayment?.useCreatePayment();
  const { state } = useLocation();

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
  const { data: individualData, isLoading: isIndividualLoading } = Digit.Hooks.useCustomAPIHook(individualRequestCriteria);

  // Build address string from individual data
  const getIndividualAddress = () => {
    if (!individualData?.address?.[0]) return null;
    const addr = individualData.address[0];
    const parts = [
      addr.addressLine1,
      addr.addressLine2,
      addr.city,
      addr.pincode ? `- ${addr.pincode}` : null
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : null;
  };

  const arrears =
    bill?.billDetails
      ?.sort((a, b) => b.fromPeriod - a.fromPeriod)
      ?.reduce((total, current, index) => (index === 0 ? total : total + current.amount), 0) || 0;

  if(isLoading || isIndividualLoading){
    return <Loader />
  }
  return (
    <>
      <Header className="works-header-search">{t("OP_PAYMENT_DETAILS")}</Header>
      <StatusTable>
          <Row label={t("OP_CONSUMER_NAME")}  text={bill?.payerName || t("ES_COMMON_NA")} />
          <Row label={t("OP_CONSUMER_EMAIL")}  text={individualData?.email || t("ES_COMMON_NA")} />
          {/* <Row label={t("OP_CONSUMER_ADDRESS")}  text={getIndividualAddress() || individualData?.correspondenceAddress || t("ES_COMMON_NA")} /> */}
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
    </>
  )
}

export default OpenViewComp