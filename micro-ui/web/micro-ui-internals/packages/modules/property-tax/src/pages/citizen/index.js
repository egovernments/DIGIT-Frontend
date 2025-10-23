import { AppContainer, PrivateRoute } from "@egovernments/digit-ui-react-components";
import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Home from "./Home";
import PropertyAssessmentForm from "../employee/PropertyAssessmentForm";
import PropertySearch from "../employee/PropertySearch";
import PaymentCollection from "../employee/PaymentCollection";
import PropertyDetails from "../employee/PropertyDetails";
import TransferOwnership from "../employee/TransferOwnership";
import ApplicationPreview from "../employee/ApplicationPreview";
import AssessmentForm from "../employee/AssessmentForm";
import PropertyTaxInbox from "../employee/PropertyTaxInbox";
import PTAcknowledgmentEmployee from "../employee/PTAcknowledgmentEmployee";
import PaymentAcknowledgement from "../employee/PaymentAcknowledgement";
import PTFAQ from "./PTFAQ";
import PTHowItWorks from "./PTHowItWorks";
import { MyApplications } from "./MyApplications";
import { MyProperties } from "./MyProperties";
import PTMyPayments from "./PTMyPayments";
import { PTMyBills } from "./PTMyBills";

const App = ({ path, stateCode, userType, tenants }) => {
    const { t } = useTranslation();
    return (
        <span className={"pt-citizen"}>
            <Switch>
                <AppContainer className="ground-container">
                    <PrivateRoute path={`${path}/home`} component={(props) => <Home  {...props} />}></PrivateRoute>
                    <PrivateRoute path={`${path}/search-property`} component={() => <PropertySearch initialActiveIndex={0} />} />
                    <PrivateRoute path={`${path}/my-properties`} exact component={MyProperties}></PrivateRoute>
                    <PrivateRoute path={`${path}/my-applications`} exact component={MyApplications}></PrivateRoute>
                    <PrivateRoute path={`${path}/property/:propertyId`} component={PropertyDetails} />
                    <PrivateRoute path={`${path}/pt-mutation/apply`} component={TransferOwnership} />
                    <PrivateRoute path={`${path}/application-preview`} component={ApplicationPreview} />
                    <PrivateRoute path={`${path}/property-tax/assess`} component={AssessmentForm} />
                    <PrivateRoute path={`${path}/payment/:propertyId`} component={PaymentCollection} />
                    <PrivateRoute path={`${path}/pt-acknowledgment`} component={() => <PTAcknowledgmentEmployee />} />
                    <PrivateRoute path={`${path}/payment-acknowledgement`} component={PaymentAcknowledgement} />
                    <PrivateRoute path={`${path}/faq`} component={PTFAQ} />
                    <PrivateRoute path={`${path}/pt-how-it-works`} component={PTHowItWorks} />
                    <PrivateRoute path={`${path}/assessment-form`} component={() => <PropertyAssessmentForm userType="citizen" />} />
                    <PrivateRoute path={`${path}/my-payments`} component={PTMyPayments}></PrivateRoute>
                    <PrivateRoute path={`${path}/my-bills`} component={PTMyBills}></PrivateRoute>
                    <PrivateRoute path={`${path}/inbox`} component={() => <PropertyTaxInbox />} />
                    <PrivateRoute path={`${path}/search-application`} component={() => <PropertySearch initialActiveIndex={1} />} />
                </AppContainer>
            </Switch>
        </span>
    );
};

export default App;
