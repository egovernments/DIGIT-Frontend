import React from "react";
import { useTranslation } from "react-i18next";
import MeasurementHistory from "./MBHistoryTable";


const ContractDetailsCard = ({ contract, isUpdate }) => {
    // isUpdate = true;
    // get MBNumber from the url
    const searchparams = new URLSearchParams(location.search);
    const mbNumber = searchparams.get("mbNumber");

    const { t } = useTranslation();

    // extract details from contract 
    const {
        contractNumber,
        additionalDetails: {
            projectId: projectID,
            startDate: projectSencDate,
            projectName: projectName,
            projectDesc: projectDesc,
            locality: projectLoc,
            ward: projectWard,
        },
    } = contract;
    const headerLocale = Digit.Utils.locale.getTransformedLocale(Digit.ULBService.getCurrentTenantId())
    const Pward = projectWard ? t(`${headerLocale}_ADMIN_${projectWard}`) : "";
    // const city = projectLoc ? t(`${Digit.Utils.locale.getTransformedLocale(projectLoc)}`) : "";
    const city = projectLoc ? t(`${headerLocale}_ADMIN_${projectLoc}`) : "";

    // Create an object for key-value pairs
    const keyValuePairs = {
       "MB_WORK_ORDER_NUMBER": contractNumber,
        "MB_PROJECT_ID": projectID,
        "MB_PROJECT_DATE": "NA", // did not find the value yet
        "MB_PROJECT_NAME": projectName,
        "MB_PROJECT_DESC": projectDesc,
        "MB_LOCATION": `${Pward ? Pward + ", " : ""}${city}`
    };

    return (
        <div>
            <div className="contract-details-card contract-card">
                {Object.entries(keyValuePairs).map(([key, value]) => (
                    <div key={key} className="key-value-container">
                        <span className="contract-card-label">{t(key)}</span>
                        <span>{value}</span>
                    </div>
                ))}
            </div>

            {isUpdate && <MeasurementHistory contractNumber={contractNumber} measurementNumber={mbNumber}></MeasurementHistory>}
        </div>
    );
};

export default ContractDetailsCard;