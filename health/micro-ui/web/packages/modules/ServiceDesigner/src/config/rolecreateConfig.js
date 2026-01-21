const generateMdmsRolePayload = (tenantId, id, category, stateData, data, isNew) => {
    const existingdata = data[0]; 
    let payload = {};
    if (!isNew) {
        payload = {
            Mdms: {
                ...existingdata,
                data: {
                    ...existingdata.data,
                    "code": stateData.name,
                    "description": stateData.desc,
                    "additionalDetails": {
                        "access": {
                            "editor": stateData.editor,
                            "viewer": stateData.viewer,
                            "creater": stateData.creater
                        }
                    }
                },
            }
        }
    }
    else {
        payload = {
            Mdms: {
                tenantId,
                schemaCode: "studio.roles",
                data: {
                    "code": stateData.name,
                    id,
                    category,
                    "description": stateData.desc,
                    "active": true,
                    "additionalDetails": {
                        "access": {
                            "editor": stateData.editor,
                            "viewer": stateData.viewer,
                            "creater": stateData.creater
                        }
                    }
                },
                isActive: true,
            },
            RequestInfo: {
                apiId: "asset-services",
                authToken: Digit.UserService.getUser()?.accessToken || "",
                userInfo: Digit.UserService.getUser()?.info || {},
            },
        };
    }

    return payload;
};

export default generateMdmsRolePayload;