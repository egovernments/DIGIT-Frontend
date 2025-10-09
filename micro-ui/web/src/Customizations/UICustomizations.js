import { Link } from "react-router-dom";
import _ from "lodash";

//create functions here based on module name set in mdms(eg->SearchProjectConfig)
//how to call these -> Digit?.Customizations?.[masterName]?.[moduleName]
// these functions will act as middlewares
var Digit = window.Digit || {};



const businessServiceMap = {

    "muster roll": "MR"
};

const inboxModuleNameMap = {
    "muster-roll-approval": "muster-roll-service",
};

export const UICustomizations = {
    businessServiceMap,
    updatePayload: (applicationDetails, data, action, businessService) => {

        if (businessService === businessServiceMap.estimate) {
            const workflow = {
                comment: data.comments,
                documents: data?.documents?.map((document) => {
                    return {
                        documentType: action?.action + " DOC",
                        fileName: document?.[1]?.file?.name,
                        fileStoreId: document?.[1]?.fileStoreId?.fileStoreId,
                        documentUid: document?.[1]?.fileStoreId?.fileStoreId,
                        tenantId: document?.[1]?.fileStoreId?.tenantId,
                    };
                }),
                assignees: data?.assignees?.uuid ? [data?.assignees?.uuid] : null,
                action: action.action,
            };
            //filtering out the data
            Object.keys(workflow).forEach((key, index) => {
                if (!workflow[key] || workflow[key]?.length === 0) delete workflow[key];
            });

            return {
                estimate: applicationDetails,
                workflow,
            };
        }
        if (businessService === businessServiceMap.contract) {
            const workflow = {
                comment: data?.comments,
                documents: data?.documents?.map((document) => {
                    return {
                        documentType: action?.action + " DOC",
                        fileName: document?.[1]?.file?.name,
                        fileStoreId: document?.[1]?.fileStoreId?.fileStoreId,
                        documentUid: document?.[1]?.fileStoreId?.fileStoreId,
                        tenantId: document?.[1]?.fileStoreId?.tenantId,
                    };
                }),
                assignees: data?.assignees?.uuid ? [data?.assignees?.uuid] : null,
                action: action.action,
            };
            //filtering out the data
            Object.keys(workflow).forEach((key, index) => {
                if (!workflow[key] || workflow[key]?.length === 0) delete workflow[key];
            });

            return {
                contract: applicationDetails,
                workflow,
            };
        }
        if (businessService === businessServiceMap?.["muster roll"]) {
            const workflow = {
                comment: data?.comments,
                documents: data?.documents?.map((document) => {
                    return {
                        documentType: action?.action + " DOC",
                        fileName: document?.[1]?.file?.name,
                        fileStoreId: document?.[1]?.fileStoreId?.fileStoreId,
                        documentUid: document?.[1]?.fileStoreId?.fileStoreId,
                        tenantId: document?.[1]?.fileStoreId?.tenantId,
                    };
                }),
                assignees: data?.assignees?.uuid ? [data?.assignees?.uuid] : null,
                action: action.action,
            };
            //filtering out the data
            Object.keys(workflow).forEach((key, index) => {
                if (!workflow[key] || workflow[key]?.length === 0) delete workflow[key];
            });

            return {
                musterRoll: applicationDetails,
                workflow,
            };
        }
        if (businessService === businessServiceMap?.["works.purchase"]) {
            const workflow = {
                comment: data.comments,
                documents: data?.documents?.map((document) => {
                    return {
                        documentType: action?.action + " DOC",
                        fileName: document?.[1]?.file?.name,
                        fileStoreId: document?.[1]?.fileStoreId?.fileStoreId,
                        documentUid: document?.[1]?.fileStoreId?.fileStoreId,
                        tenantId: document?.[1]?.fileStoreId?.tenantId,
                    };
                }),
                assignees: data?.assignees?.uuid ? [data?.assignees?.uuid] : null,
                action: action.action,
            };
            //filtering out the data
            Object.keys(workflow).forEach((key, index) => {
                if (!workflow[key] || workflow[key]?.length === 0) delete workflow[key];
            });

            const additionalFieldsToSet = {
                projectId: applicationDetails.additionalDetails.projectId,
                invoiceDate: applicationDetails.billDate,
                invoiceNumber: applicationDetails.referenceId.split('_')?.[1],
                contractNumber: applicationDetails.referenceId.split('_')?.[0],
                documents: applicationDetails.additionalDetails.documents
            }
            return {
                bill: { ...applicationDetails, ...additionalFieldsToSet },
                workflow,
            };
        }
    },
    enableModalSubmit: (businessService, action, setModalSubmit, data) => {
        if (businessService === businessServiceMap?.["muster roll"] && action.action === "APPROVE") {
            setModalSubmit(data?.acceptTerms)
        }
    },
    enableHrmsSearch: (businessService, action) => {
        if (businessService === businessServiceMap.estimate) {
            return action.action.includes("TECHNICALSANCTION") || action.action.includes("VERIFYANDFORWARD");
        }
        if (businessService === businessServiceMap.contract) {
            return action.action.includes("VERIFY_AND_FORWARD");
        }
        if (businessService === businessServiceMap?.["muster roll"]) {
            return action.action.includes("VERIFY");
        }
        if (businessService === businessServiceMap?.["works.purchase"]) {
            return action.action.includes("VERIFY_AND_FORWARD")
        }
        return false;
    },
    getBusinessService: (moduleCode) => {
        if (moduleCode?.includes("estimate")) {
            return businessServiceMap?.estimate;
        } else if (moduleCode?.includes("contract")) {
            return businessServiceMap?.contract;
        } else if (moduleCode?.includes("muster roll")) {
            return businessServiceMap?.["muster roll"];
        }
        else if (moduleCode?.includes("works.purchase")) {
            return businessServiceMap?.["works.purchase"];
        }
        else if (moduleCode?.includes("works.wages")) {
            return businessServiceMap?.["works.wages"];
        }
        else if (moduleCode?.includes("works.supervision")) {
            return businessServiceMap?.["works.supervision"];
        }
        else {
            return businessServiceMap;
        }
    },
    getInboxModuleName: (moduleCode) => {
        if (moduleCode?.includes("estimate")) {
            return inboxModuleNameMap?.estimate;
        } else if (moduleCode?.includes("contract")) {
            return inboxModuleNameMap?.contracts;
        } else if (moduleCode?.includes("attendence")) {
            return inboxModuleNameMap?.attendencemgmt;
        } else {
            return inboxModuleNameMap;
        }
    },
}