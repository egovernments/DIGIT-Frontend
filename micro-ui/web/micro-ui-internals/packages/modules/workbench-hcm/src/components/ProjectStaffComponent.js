import React from "react";
import { Card, Header, Button, Loader } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";


const ProjectStaffComponent = (props) =>{
    const { t } = useTranslation();
    
    const requestCriteria = {
        url: "/project/staff/v1/_search",
        changeQueryName:props.projectId,
        params: {
            tenantId : "mz",
            offset: 0,
            limit: 10,
        },
        body: {
            ProjectStaff: {
                projectId: props.projectId
            },
            // apiOperation: "SEARCH"
        }
    };

    const { data: projectStaff } = Digit.Hooks.useCustomAPIHook(requestCriteria);

    

    const columns = [
        { label: t("MB_SNO"), key: "sno" },
        { label: t("MB_REFERENCE_NUMBER"), key: "mbref" },
        { label: t("MB_MUSTER_ROLL_ID"), key: "musterid" },
        { label: t("MB_DATE"), key: "mbDate" },
        { label: t("MB_PERIOD"), key: "period" },
        { label: t("MB_STATUS"), key: "status" },
        { label: t("MB_ONLY_AMOUNT"), key: "amount" },
      ];

    return (
        <Header>"Hello"</Header>
    )
}

export default ProjectStaffComponent;