import { Loader } from "@digit-ui/digit-ui-react-components";
import React from "react";
import { useRouteMatch } from "react-router-dom";
import EmployeeApp from "./pages/employee/";
import MeasurementCard from "./components/MeasurementCard";
import MeasureTable from "./components/MeasureTable";
import MeasureCard from "./components/MeasureCard";
import MeasureRow from "./components/MeasureRow";
import ViewOnlyCard from "./components/ViewOnlyCard";

const MeasurementModule = ({ stateCode, userType, tenants }) => {
    const { path, url } = useRouteMatch();
    const language = Digit.StoreData.getCurrentLanguage();
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const moduleCode = ["measurement", "common-masters", "workflow", tenantId];
    const { isLoading, data: store } = Digit.Services.useStore({
        stateCode,
        moduleCode,
        language,
    });


    if (isLoading) {
        return <Loader />;
    }


    return <EmployeeApp path={path} stateCode={stateCode} />;
};


const componentsToRegister = {
    MeasurementCard,
    MeasurementModule,
    MeasureCard,
    MeasureTable,
    MeasureRow,
    ViewOnlyCard,
};

export const initMeasurementComponents = () => {
    Object.entries(componentsToRegister).forEach(([key, value]) => {
        Digit.ComponentRegistryService.setComponent(key, value);
    });
};