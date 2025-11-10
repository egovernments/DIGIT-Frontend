import { AppContainer, PrivateRoute } from "@egovernments/digit-ui-react-components";
import { BreadCrumb } from "@egovernments/digit-ui-components";
import React from "react";
import { useTranslation } from "react-i18next";
import PropertyTaxHome from "./PropertyTaxHome";
import PropertySearch from "./PropertySearch";
import PropertyAssessmentForm from "./PropertyAssessmentForm";
import PaymentCollection from "./PaymentCollection";
import PropertyDetails from "./PropertyDetails";
import TransferOwnership from "./TransferOwnership";
import ApplicationPreview from "./ApplicationPreview";
import AssessmentForm from "./AssessmentForm";
import PropertyTaxInbox from "./PropertyTaxInbox";
import PTAcknowledgmentEmployee from "./PTAcknowledgmentEmployee";
import PaymentAcknowledgement from "./PaymentAcknowledgement";
import { Routes, Route } from "react-router-dom";

const PTBreadCrumb = ({ location }) => {
    const { t } = useTranslation();
    const crumbs = [
        {
            internalLink: `/${window?.contextPath}/employee`,
            content: t("HOME"),
            show: true,
        },
        {
            internalLink: `/${window?.contextPath}/employee/pt/inbox`,
            content: t("PT_BREADCRUMBS_INBOX"),
            show: Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop()) === "INBOX" || location.pathname.includes("/inbox"),
        },
        {
            internalLink: `/${window?.contextPath}/employee/pt/search-property`,
            content: t("PT_BREADCRUMBS_SEARCH_PROPERTY"),
            show: Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop()) === "SEARCH_PROPERTY" || location.pathname.includes("/property"),
        },
        {
            internalLink: `/${window?.contextPath}/employee/pt/search-application`,
            content: t("PT_BREADCRUMBS_SEARCH_APPLICATION"),
            show: Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop()) === "SEARCH_APPLICATION" || location.pathname.includes("/property"),
        },
        {
            internalLink: `/${window?.contextPath}/employee/pt/assessment-form`,
            content: t("PT_BREADCRUMBS_ASSESSMENT_FORM"),
            show: Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop()) === "ASSESSMENT_FORM",
        },
        {
            internalLink: `/${window?.contextPath}/employee/pt/property`,
            content: t("PT_BREADCRUMBS_PROPERTY"),
            show: location.pathname.includes("/property"),
        },
        {
            internalLink: `/${window?.contextPath}/employee/pt/pt-mutation/apply`,
            content: t("PT_MUTATION_TRANSFER_HEADER"),
            show: location.pathname.includes("/pt-mutation/apply"),
        },
        {
            internalLink: `/${window?.contextPath}/employee/pt/payment`,
            content: t("PT_PAYMENT_COLLECTION"),
            show: location.pathname.includes("/pt/payment"),
        },
    ];
    return <BreadCrumb crumbs={crumbs} />;
};

const App = ({ path, stateCode, userType, tenants }) => {
    return (
        <AppContainer className="ground-container">
            <React.Fragment>
                <PTBreadCrumb location={location} />
            </React.Fragment>
            <Routes>
                <Route path={`${path}/home`} element={<PrivateRoute element={<PropertyTaxHome />} />} />
                <Route path={`${path}/inbox`} element={<PrivateRoute element={<PropertyTaxInbox />} />} />
                <Route path={`${path}/search-property`} element={<PrivateRoute element={<PropertySearch initialActiveIndex={0} />} />} />
                <Route path={`${path}/search-application`} element={<PrivateRoute element={<PropertySearch initialActiveIndex={1} />} />} />
                <Route path={`${path}/property-tax/assess`} element={<PrivateRoute element={<AssessmentForm />} />} />
                <Route path={`${path}/assessment-form`} element={<PrivateRoute element={<PropertyAssessmentForm />} />} />
                <Route path={`${path}/pt-acknowledgment`} element={<PrivateRoute element={<PTAcknowledgmentEmployee />} />} />
                <Route path={`${path}/pt-mutation/apply`} element={<PrivateRoute element={<TransferOwnership />} />} />
                <Route path={`${path}/application-preview`} element={<PrivateRoute element={<ApplicationPreview />} />} />
                <Route path={`${path}/property/:propertyId`} element={<PrivateRoute element={<PropertyDetails />} />} />
                <Route path={`${path}/payment/:propertyId`} element={<PrivateRoute element={<PaymentCollection />} />} />
                <Route path={`${path}/payment-acknowledgement`} element={<PrivateRoute element={<PaymentAcknowledgement />} />} />
            </Routes>
        </AppContainer>
    );
};

export default App;