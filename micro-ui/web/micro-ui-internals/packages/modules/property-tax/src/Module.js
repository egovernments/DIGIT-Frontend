import React from "react";
import { useRouteMatch } from "react-router-dom";
import { Route, Switch } from "react-router-dom";

import { default as EmployeeApp } from "./pages/employee";
import { default as CitizenApp } from "./pages/citizen";

import PTCard from "./components/PropertyTaxCard";
import PTTransfereeDetails from "./components/PTTransfereeDetails";
import PTDocumentUpload from "./components/PTDocumentUpload";
import PTTransferReview from "./components/PTTransferReview";
import PTAssessmentDetails from "./components/PTAssessmentDetails";
import PTOwnershipDetails from "./components/PTOwnershipDetails";
import PTDocumentUploadAssessmentForm from "./components/PTDocumentUploadAssessmentForm";
import PropertySummary from "./components/PropertySummary";
import Declaration from "./components/Declaration";


import PropertySearch from "./pages/employee/PropertySearch";
import PropertyTaxHome from "./pages/employee/PropertyTaxHome";
import PropertyAssessmentForm from "./pages/employee/PropertyAssessmentForm";
import PaymentCollection from "./pages/employee/PaymentCollection";
import PropertyDetails from "./pages/employee/PropertyDetails";
import TransferOwnership from "./pages/employee/TransferOwnership";
import ApplicationPreview from "./pages/employee/ApplicationPreview";
import AssessmentForm from "./pages/employee/AssessmentForm";
import PropertyTaxInbox from "./pages/employee/PropertyTaxInbox";
import PTAcknowledgmentEmployee from "./pages/employee/PTAcknowledgmentEmployee";
import PaymentAcknowledgement from "./pages/employee/PaymentAcknowledgement";

import Home from "./pages/citizen/Home";
import { MyApplications } from "./pages/citizen/MyApplications";
import { MyProperties } from "./pages/citizen/MyProperties";
import PTFAQ from "./pages/citizen/PTFAQ";
import PTHowItWorks from "./pages/citizen/PTHowItWorks";
import PTMyPayments from "./pages/citizen/PTMyPayments";
import { PTMyBills } from "./pages/citizen/PTMyBills";

import { overrideHooks, updateCustomConfigs } from "./utils";


export const PTModule = ({ stateCode, userType, tenants }) => {
  const { path, url } = useRouteMatch();

  const moduleCode = ["PT", "pt-new", "pt"];
  const language = Digit.StoreData.getCurrentLanguage();
  const { isLoading, data: store } = Digit.Services.useStore({
    stateCode,
    moduleCode,
    language,
  });

  if (isLoading) {
    return "";
  }

  return userType === "employee" ? <EmployeeApp path={path} stateCode={stateCode} userType={userType} tenants={tenants} /> : <CitizenApp path={path} stateCode={stateCode} userType={userType} tenants={tenants} />;
};

const componentsToRegister = {

  PTModule,
  PTCard,

  // Employee related
  PropertySearch,
  PropertyTaxHome,
  PropertyAssessmentForm,
  PaymentCollection,
  PropertyDetails,
  TransferOwnership,
  ApplicationPreview,
  AssessmentForm,
  PropertyTaxInbox,
  PTAcknowledgmentEmployee,
  PaymentAcknowledgement,

  //Citizen releated
  Home,
  PTMyBills,
  PTMyPayments,
  PTFAQ,
  PTHowItWorks,
  MyApplications,
  MyProperties,

  // Components
  PTTransfereeDetails,
  PTDocumentUpload,
  PTTransferReview,
  PTOwnershipDetails,
  PTAssessmentDetails,
  PTDocumentUploadAssessmentForm,
  PropertySummary,
  Declaration
};


export const initPropertyTaxComponents = () => {
  overrideHooks();
  updateCustomConfigs();
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};
