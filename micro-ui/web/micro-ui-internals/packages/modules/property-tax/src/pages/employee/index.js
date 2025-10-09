import { AppContainer, PrivateRoute } from "@egovernments/digit-ui-react-components";
import { BreadCrumb } from "@egovernments/digit-ui-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Switch } from "react-router-dom";
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
        <Switch>
            <AppContainer className="ground-container">
                <React.Fragment>
                    <PTBreadCrumb location={location} />
                </React.Fragment>
                <PrivateRoute path={`${path}/home`} component={() => <PropertyTaxHome />} />
                <PrivateRoute path={`${path}/inbox`} component={() => <PropertyTaxInbox />} />
                <PrivateRoute path={`${path}/search-property`} component={() => <PropertySearch initialActiveIndex={0} />} />
                <PrivateRoute path={`${path}/search-application`} component={() => <PropertySearch initialActiveIndex={1} />} />
                <PrivateRoute path={`${path}/property-tax/assess`} component={AssessmentForm} />
                <PrivateRoute path={`${path}/assessment-form`} component={() => <PropertyAssessmentForm />} />
                <PrivateRoute path={`${path}/pt-acknowledgment`} component={() => <PTAcknowledgmentEmployee />} />
                <PrivateRoute path={`${path}/pt-mutation/apply`} component={TransferOwnership} />
                <PrivateRoute path={`${path}/application-preview`} component={ApplicationPreview} />
                <PrivateRoute path={`${path}/property/:propertyId`} component={PropertyDetails} />
                <PrivateRoute path={`${path}/payment/:propertyId`} component={PaymentCollection} />
                <PrivateRoute path={`${path}/payment-acknowledgement`} component={PaymentAcknowledgement} />
            </AppContainer>
        </Switch>
    );
};

export default App;