import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { PrivateRoute, BreadCrumb, AppContainer } from "@egovernments/digit-ui-react-components";
import { Switch, useLocation } from "react-router-dom";
import CreateBill from "./CreateBill";
import ViewSupervisionbill from "./Bills/ViewSupervisionbill";
import SearchBillWMS from "./Bills/SearchBillWMS";
import SearchPaymentInstruction from "./Bills/SearchPaymentInstruction";
import InboxPaymentInstruction from "./Bills/InboxPaymentInstruction";
import CreatePA from "./Bills/CreatePA";
const ExpenditureBreadCrumbs = ({ location }) => {
    const { t } = useTranslation();

    const search = useLocation().search;
    const fromScreen = new URLSearchParams(search).get("from") || null;
    const crumbs = [
      {
        path: `/${window?.contextPath}/employee`,
        content: t("WORKS_MUKTA"),
        show: true,
      },
      {
        path: `/${window.contextPath}/employee/expenditure/billinbox`,
        content: fromScreen ? `${t(fromScreen)} / ${t("WORKS_BILLING_MGMT")}` : t("WORKS_BILLING_MGMT"),
        show: location.pathname.includes("/expenditure/billinbox") ? true : false,
        isBack: fromScreen && true,
      },
      {
        path: `/${window.contextPath}/employee/expenditure/view-bills/menu`,
        content: fromScreen ? `${t(fromScreen)} / ${t("EXP_VIEW_BILLS_MENU")}` : t("EXP_VIEW_BILLS_MENU"),
        show: location.pathname.includes("/expenditure/view-bills/menu") ? true : false,
        isBack: fromScreen && true,
      },
      {
        path: `/${window.contextPath}/employee/expenditure/view-bills/bills`,
        content: fromScreen ? `${t(fromScreen)} / ${t("EXP_VIEW_BILL")}` : t("EXP_VIEW_BILL"),
        show: location.pathname.includes("/expenditure/view-bills/bills") ? true : false,
        isBack: fromScreen && true,
      },
      {
        path: `/${window.contextPath}/employee/expenditure/create-purchase-bill`,
        content: fromScreen ? `${t(fromScreen)} / ${t("EXP_CREATE_BILL")}` : t("EXP_CREATE_BILL"),
        show: location.pathname.includes("/expenditure/create-purchase-bill") ? true : false,
        isBack: fromScreen && true,
      },
      {
        path: `/${window.contextPath}/employee/expenditure/inbox`,
        content: fromScreen ? `${t(fromScreen)} / ${t("WORKS_BILLING_MGMT")}` : t("WORKS_BILLING_MGMT"),
        show: location.pathname.includes("/expenditure/inbox") ? true : false,
        isBack: fromScreen && true,
      },
      {
        // path: `/${window.contextPath}/employee/expenditure/search-bill`,
        content: fromScreen ? `${t(fromScreen)} / ${t("EXP_SEARCH_BILL")}` : t("EXP_SEARCH_BILL"),
        show: location.pathname.includes("/expenditure/search-bill") ? true : false,
        isBack: fromScreen && true,
      },
      {
        // path: `/${window.contextPath}/employee/expenditure/search-payment-instruction`,
        content: fromScreen ? `${t(fromScreen)} / ${t("EXP_SEARCH_PAYMENT_INS")}` : t("EXP_SEARCH_PAYMENT_INS"),
        show: location.pathname.includes("/expenditure/search-payment-instruction") ? true : false,
        isBack: fromScreen && true,
      },
      // {
      //   // path: `/${window.contextPath}/employee/expenditure/search-payment-instruction`,
      //   content: fromScreen ? `${t(fromScreen)} / ${t("EXP_VIEW_PI")}` : t("EXP_VIEW_PI"),
      //   show: location.pathname.includes("/expenditure/view-payment-instruction") ? true : false,
      //   isBack: fromScreen && true,
      // },
      {
        // path: `/${window.contextPath}/employee/expenditure/search-payment-instruction`,
        content: fromScreen ? `${t(fromScreen)} / ${t("EXP_PAYMENT_DETAILS_BREAD")}` : t("EXP_PAYMENT_DETAILS_BREAD"),
        show: location.pathname.includes("/expenditure/view-payment") ? true : false,
        isBack: fromScreen && true,
      },
      {
        // path: `/${window.contextPath}/employee/expenditure/wage-bill-details`,
        content: fromScreen ? `${t(fromScreen)} / ${t("EXP_VIEW_BILL")}` : t("EXP_VIEW_BILL"),
        show: location.pathname.includes("/expenditure/wage-bill-details") ? true : false,
        isBack: fromScreen && true,
      },
      {
        // path: `/${window.contextPath}/employee/expenditure/supervision-bill-details`,
        content: fromScreen ? `${t(fromScreen)} / ${t("BILLS_SUPERVISION")}` : t("BILLS_SUPERVISION"),
        show: location.pathname.includes("/expenditure/supervision-bill-details") ? true : false,
        isBack: fromScreen && true,
      },
      {
        // path: `/${window.contextPath}/employee/expenditure/purchase-bill-details`,
        content: fromScreen ? `${t(fromScreen)} / ${t("EXP_VIEW_PURCHASE_BILL")}` : t("EXP_VIEW_PURCHASE_BILL"),
        show: location.pathname.includes("/expenditure/purchase-bill-details") ? true : false,
        isBack: fromScreen && true,
      },
      {
        path: `/${window.contextPath}/employee/expenditure/download-bill`,
        content: fromScreen ? `${t(fromScreen)} / ${t("ES_COMMON_DOWNLOADS")}` : t("ES_COMMON_DOWNLOADS"),
        show: location.pathname.includes("/expenditure/download-bill") ? true : false,
        isBack: fromScreen && true,
      },
      {
        path: `/${window.contextPath}/employee/expenditure/create-pa`,
        content: fromScreen ? `${t(fromScreen)} / ${t("EXP_CREATE_PA")}` : t("EXP_CREATE_PA"),
        show: location.pathname.includes("/expenditure/create-pa") ? true : false,
        isBack: fromScreen && true,
      }
    ];
    return <BreadCrumb crumbs={crumbs} spanStyle={{ maxWidth: "min-content" }} />;
}

const App = ({ path }) => {
    
    const location = useLocation();
    const ViewBillsMenuComponent = Digit?.ComponentRegistryService?.getComponent("ViewBillsMenu");
    const ViewBillsComponent = Digit?.ComponentRegistryService?.getComponent("ViewBills");
    const BillInbox = Digit?.ComponentRegistryService?.getComponent("BillInbox");
    const SearchBill = Digit?.ComponentRegistryService?.getComponent("SearchBill");
    const ViewPurchaseBillComponent = Digit?.ComponentRegistryService?.getComponent("ViewPurchaseBill");
    const PurchaseBill = Digit?.ComponentRegistryService?.getComponent("PurchaseBill");
    const PurchaseBillResponse = Digit?.ComponentRegistryService?.getComponent("CreatePurchaseBillResponse");
    const ViewWageBill = Digit?.ComponentRegistryService?.getComponent("ViewWageBill");
    const DownloadBill = Digit?.ComponentRegistryService?.getComponent("DownloadBill");
    const ViewPaymentInstruction = Digit?.ComponentRegistryService?.getComponent("ViewPaymentInstruction");
    const ViewPayment = Digit?.ComponentRegistryService?.getComponent("ViewPayment");
    const PurchaseBillSession = Digit.Hooks.useSessionStorage("PURCHASE_BILL_CREATE", {});
    const [sessionFormData, clearSessionFormData] = PurchaseBillSession;
  
    //remove session form data if user navigates away from the project create screen
    useEffect(()=>{
        if (!window.location.href.includes("create-purchase-bill") && sessionFormData && Object.keys(sessionFormData) != 0) {
          clearSessionFormData();
        }
    },[location]);

    return (
      <Switch>
        <AppContainer className="ground-container">
          <React.Fragment>
            <ExpenditureBreadCrumbs location={location} />
          </React.Fragment>
          <PrivateRoute path={`${path}/create-application`} component={() => <div>Hi</div>} />
          <PrivateRoute path={`${path}/billinbox`} component={() => <BillInbox parentRoute={path} />} />
          <PrivateRoute path={`${path}/view-bills/bills`} component={ViewBillsComponent}></PrivateRoute>
          <PrivateRoute path={`${path}/view-bills/menu`} component={ViewBillsMenuComponent}></PrivateRoute>
          <PrivateRoute path={`${path}/create-pa`} component={() => <CreatePA parentRoute={path} />} />
          <PrivateRoute path={`${path}/create-bill`} component={() => <CreateBill parentRoute={path} />} />
          <PrivateRoute path={`${path}/inbox`} component={() => <BillInbox parentRoute={path} />} />
          <PrivateRoute path={`${path}/search-bill`} component={() => <SearchBillWMS parentRoute={path} />} />
          
          <PrivateRoute path={`${path}/search-bill-plain`} component={() => <SearchBill parentRoute={path} />} />
          <PrivateRoute path={`${path}/search-payment-instruction`} component={() => <SearchPaymentInstruction parentRoute={path} />} />
          <PrivateRoute path={`${path}/view-payment`} component={() => <ViewPayment parentRoute={path} />} />
          <PrivateRoute path={`${path}/view-payment-instruction`} component={() => <ViewPaymentInstruction parentRoute={path} />} />
          <PrivateRoute path={`${path}/inbox-payment-instruction`} component={() => <InboxPaymentInstruction parentRoute={path} />} />
          <PrivateRoute path={`${path}/wage-bill-details`} component={() => <ViewWageBill parentRoute={path} />} />
          <PrivateRoute path={`${path}/supervision-bill-details`} component={() => <ViewSupervisionbill parentRoute={path} />} />
          <PrivateRoute path={`${path}/purchase-bill-details`} component={() => <ViewPurchaseBillComponent parentRoute={path} />}/>
          <PrivateRoute path={`${path}/create-purchase-bill`} component={() => <PurchaseBill parentRoute={path} />} />
          <PrivateRoute path={`${path}/create-purchase-bill-response`} component={() => <PurchaseBillResponse parentRoute={path} />} />
          <PrivateRoute path={`${path}/download-bill`} component={() => <DownloadBill parentRoute={path} />} />
        </AppContainer>
      </Switch>
    );
};

export default App;