import React from "react";

const ProjectChildrenComponent = (props) =>{
    
    const requestCriteria3 = {
        url: "/project/v1/_search",
        params: {
            tenantId : "mz",
            offset: 0,
            limit: 10,
        },
        body: {
            ProjectResource: {
                projectId: props.projectId
            },
            apiOperation: "SEARCH"
        }
    };

    const { data: projectChildren } = Digit.Hooks.useCustomAPIHook(requestCriteria3);

    
    return (
        null
    )
}

export default ProjectChildrenComponent;