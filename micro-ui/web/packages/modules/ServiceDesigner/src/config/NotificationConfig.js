const generateNotifPayload = (tenantId, type, category, stateData, data, isNew) => {
    const existingdata = data[0];
    let payload = {};
    if (isNew) {
        payload = {
            Mdms: {
                ...existingdata,
                data: {
                    ...existingdata.data,
                    "title": stateData.title,
                    "subject": stateData.subject,
                    "workflow": stateData.workflow,
                    "messageBody": stateData.messageBody,
                },
            }
        }
    }
    else {
        payload = {
            Mdms: {
                tenantId,
                schemaCode: "studio.notification",
                data: {
                    "title": stateData.title,
                    "subject": stateData.subject,
                    "workflow": stateData.workflow,
                    "variables": [
                        "use_name",
                        "app_no"
                    ],
                    "messageBody": stateData.messageBody,
                    "additionalDetails": {
                        "type": type,
                        "category": category
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

export default generateNotifPayload;