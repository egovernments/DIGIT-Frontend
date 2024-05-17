import { Loader } from "@digit-ui/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { useRouteMatch,useLocation } from "react-router-dom";
import CitizenPayment from "./citizen";
import { getKeyNotesConfig } from "./citizen/keynotesConfig";
import EmployeePayment from "./employee";


export const PaymentModule = ({ deltaConfig = {}, stateCode, cityCode, moduleCode = "Payment", userType,path }) => {
  // const {pathname:url} = useLocation()
  const url = `${window.contextPath}/citizen/common/`
  
  const store = { data: {} }; //Digit.Services.useStore({}, { deltaConfig, stateCode, cityCode, moduleCode, language });

  if (Object.keys(store).length === 0) {
    
    return <Loader />;
  }

  const getPaymentHome = () => {
    
    if (userType === "citizen") return <CitizenPayment {...{ stateCode, moduleCode, cityCode, path, url }} />;
    else return <EmployeePayment {...{ stateCode, cityCode, moduleCode,path }} />;
  };
  return <React.Fragment>{getPaymentHome()}</React.Fragment>;
};

export const PaymentLinks = ({ matchPath }) => {
  const { t } = useTranslation();
  return null;
};

export const paymentConfigs = {
  getBillDetailsConfigWithBusinessService: getKeyNotesConfig,
};
