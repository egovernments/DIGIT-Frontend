import React from "react";

const ProjectBeneficiaryComponent = (props) => {
    
    const requestCriteria2 = {
        url: "/project/resource/v1/_search",
        changeQueryName:props.projectId,
        params: {
            tenantId : "mz",
            offset: 0,
            limit: 10,
        },
        body: {
            ProjectResource: {
                projectId: props.projectId
            },
            // apiOperation: "SEARCH"
        }
    };

    const { data: productResource } = Digit.Hooks.useCustomAPIHook(requestCriteria2);

    return (
        null
    )
}

export default ProjectBeneficiaryComponent