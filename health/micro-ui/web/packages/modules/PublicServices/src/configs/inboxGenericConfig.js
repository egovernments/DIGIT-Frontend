import React from "react";
import { useParams } from "react-router-dom";

export const InboxConfig = (t, services = []) => {
    const { module } = useParams();
    const prefix = `${module?.toUpperCase()}`;

    // Build links array - always include search, conditionally include apply
    const linksArray = [];

    // Add apply link only if there's exactly one business service
    if (services?.length === 1) {
        const service = services[0];
        linksArray.push({
            text: `${service?.businessService?.replaceAll("_", ' ')}`,
            url: `/employee/publicservices/${module}/${service?.businessService}/Apply?serviceCode=${service?.serviceCode}&selectedModule=true&module=${module}&service=${service?.businessService}`,
            roles: [],
        });
    }

    linksArray.push({
        text: `${prefix}_SEARCH`,
        url: `/employee/publicservices/${module}/search?selectedModule=true&module=${module}`,
        roles: [],
    });

    return ({
        headerLabel: `${prefix}_INBOX_HEADER`,
        type: "inbox",
        apiDetails: {
            serviceName: "/inbox/v2/_search",
            requestParam: {},
            requestBody: {
                inbox: {
                    processSearchCriteria: {
                        businessService: [],
                        moduleName: "public-services",
                    },
                    moduleSearchCriteria: {
                        sortOrder: "ASC",
                        module: "public-services",
                    }
                }
            },
            minParametersForSearchForm: 0,
            minParametersForFilterForm: 0,
            masterName: "commonUiConfig",
            moduleName: "InboxGenericConfig",
            tableFormJsonPath: "requestBody.inbox",
            filterFormJsonPath: "requestBody.inbox.moduleSearchCriteria",
            searchFormJsonPath: "requestBody.inbox.moduleSearchCriteria",
        },
        sections: {
            search: {
                uiConfig: {
                    headerStyle: {},
                    formClassName: "custom-digit--search-field-wrapper-classname",
                    primaryLabel: "ES_COMMON_SEARCH",
                    secondaryLabel: "ES_COMMON_CLEAR_SEARCH",
                    minReqFields: 1,
                    defaultValues: {
                        applicationNumber: "",
                        status: "",
                        todate: "",
                        fromdate: "",
                        businessService: "",
                    },
                    fields: [
                        {
                            inline: true,
                            label: `${prefix}_APPLICATION_NUMBER`,
                            isMandatory: false,
                            type: "text",
                            disable: false,
                            populators: { name: "applicationNumber", error: "Error!" },
                        },
                        {
                            label: `${prefix}_BUSINESS_SERVICE`,
                            isMandatory: true,
                            key: "businessService",
                            type: "dropdown",
                            disable: false,
                            preProcess: {
                                updateDependent: ["populators.options"]
                            },
                            populators: {
                                name: "businessService",
                                optionsKey: "name",
                                error: t("BUSSINESS_SERVICE_REQUIRED"),
                                options: []
                            }
                        },
                    ],
                },
                label: "",
                show: true,
            },
            links: {
                uiConfig: {
                    links: linksArray,
                    label: `${prefix}_HEADING`,
                    logoIcon: {
                        component: "PropertyHouse",
                        customClass: "inbox-search-icon--services"
                    }
                },
                children: {},
                show: true,
            },
            filter: {
                uiConfig: {
                    type: "filter",
                    headerStyle: null,
                    primaryLabel: t(`${prefix}_FILTER`),
                    secondaryLabel: "",
                    minReqFields: 1,
                    defaultValues: {
                        state: "",
                        ward: [],
                        locality: [],
                        assignee: {
                            code: `${prefix}_ASSIGNED_TO_ALL`,
                            name: `${prefix}_ASSIGNED_TO_ALL`,
                        }
                    },
                    fields: [
                        {
                            label: "",
                            type: "radio",
                            isMandatory: false,
                            disable: false,
                            populators: {
                                name: "assignee",
                                options: [
                                    {
                                        code: `${prefix}_ASSIGNED_TO_ME`,
                                        name: `${prefix}_ASSIGNED_TO_ME`,
                                    },
                                    {
                                        code: `${prefix}_ASSIGNED_TO_ALL`,
                                        name: `${prefix}_ASSIGNED_TO_ALL`,
                                    },
                                ],
                                optionsKey: "name",
                            },
                        },
                        //commenting out ward for now will add once we do boundary management with studio
                        // {
                        //     label: `${prefix}_COMMON_WARD`,
                        //     type: "locationdropdown",
                        //     isMandatory: false,
                        //     disable: false,
                        //     populators: {
                        //         name: "ward",
                        //         type: "ward",
                        //         optionsKey: "i18nKey",
                        //         // defaultText: "COMMON_SELECT_WARD",
                        //         // selectedText: "COMMON_SELECTED",
                        //         allowMultiSelect: true
                        //     }
                        // },
                        {
                            label: `${prefix}_COMMON_WORKFLOW_STATES`,
                            type: "workflowstatesfilter",
                            labelClassName: "checkbox-status-filter-label",
                            isMandatory: false,
                            disable: false,
                            populators: {
                                name: "state",
                                labelPrefix: `${prefix}_`,
                                businessService: "NEWTL",
                            },
                        },
                    ],
                },
                label: `ES_COMMON_FILTERS`,
                show: true,
            },
            searchResult: {
                uiConfig: {
                    columns: [
                        {
                            label: "Application Number",
                            jsonPath: "businessObject.applicationNumber",
                            additionalCustomization: true,
                        },
                        {
                            label: "Business Service",
                            jsonPath: "businessObject.businessService",
                        },
                        {
                            label: "Status",
                            jsonPath: "ProcessInstance.state.state",
                            additionalCustomization: true,
                        },
                        {
                            label: "SLA",
                            jsonPath: "businessObject.serviceSla",
                            additionalCustomization: true,
                        }
                    ],
                    tableProps: {
                        tableClassName: "custom-classname-resultsdatatable"
                    },
                    actionProps: {
                        actions: [
                            {
                                label: "Action1",
                                variation: "secondary",
                                icon: "Edit",
                            },
                            {
                                label: "Action2",
                                variation: "primary",
                                icon: "CheckCircle",
                            },
                        ],
                    },
                    enableColumnSort: true,
                    resultsJsonPath: "items",
                    defaultSortAsc: true,
                },
                children: {},
                show: true,
            },
        },
    })
};