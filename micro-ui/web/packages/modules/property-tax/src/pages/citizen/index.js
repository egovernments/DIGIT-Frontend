import { AppContainer, PrivateRoute } from "@egovernments/digit-ui-react-components";
import React from "react";
import { Routes, Route } from "react-router-dom";
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
            <AppContainer className="ground-container">
                <Routes>
                    <Route
                        path={`${path}/home`}
                        element={<PrivateRoute element={<Home />} />}
                    />
                    <Route
                        path={`${path}/search-property`}
                        element={<PrivateRoute element={<PropertySearch initialActiveIndex={0} />} />}
                    />
                    <Route
                        path={`${path}/my-properties`}
                        element={<PrivateRoute element={<MyProperties />} />}
                    />
                    <Route
                        path={`${path}/my-applications`}
                        element={<PrivateRoute element={<MyApplications />} />}
                    />
                    <Route
                        path={`${path}/property/:propertyId`}
                        element={<PrivateRoute element={<PropertyDetails />} />}
                    />
                    <Route
                        path={`${path}/pt-mutation/apply`}
                        element={<PrivateRoute element={<TransferOwnership />} />}
                    />
                    <Route
                        path={`${path}/application-preview`}
                        element={<PrivateRoute element={<ApplicationPreview />} />}
                    />
                    <Route
                        path={`${path}/property-tax/assess`}
                        element={<PrivateRoute element={<AssessmentForm />} />}
                    />
                    <Route
                        path={`${path}/payment/:propertyId`}
                        element={<PrivateRoute element={<PaymentCollection />} />}
                    />
                    <Route
                        path={`${path}/pt-acknowledgment`}
                        element={<PrivateRoute element={<PTAcknowledgmentEmployee />} />}
                    />
                    <Route
                        path={`${path}/payment-acknowledgement`}
                        element={<PrivateRoute element={<PaymentAcknowledgement />} />}
                    />
                    <Route
                        path={`${path}/faq`}
                        element={<PrivateRoute element={<PTFAQ />} />}
                    />
                    <Route
                        path={`${path}/pt-how-it-works`}
                        element={<PrivateRoute element={<PTHowItWorks />} />}
                    />
                    <Route
                        path={`${path}/assessment-form`}
                        element={<PrivateRoute element={<PropertyAssessmentForm userType="citizen" />} />}
                    />
                    <Route
                        path={`${path}/my-payments`}
                        element={<PrivateRoute element={<PTMyPayments />} />}
                    />
                    <Route
                        path={`${path}/my-bills`}
                        element={<PrivateRoute element={<PTMyBills />} />}
                    />
                    <Route
                        path={`${path}/inbox`}
                        element={<PrivateRoute element={<PropertyTaxInbox />} />}
                    />
                    <Route
                        path={`${path}/search-application`}
                        element={<PrivateRoute element={<PropertySearch initialActiveIndex={1} />} />}
                    />
                </Routes>
            </AppContainer>
        </span>
    );
};

export default App;
