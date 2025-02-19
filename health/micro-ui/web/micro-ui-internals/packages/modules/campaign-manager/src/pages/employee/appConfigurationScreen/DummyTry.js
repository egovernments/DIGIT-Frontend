import { FormComposerV2 } from "@egovernments/digit-ui-components";
import React, { useEffect, useMemo, useState } from "react";

const DummyTry = () => {
    const searchParams = new URLSearchParams(location.search);
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const moduleName = searchParams.get("module") || "HCM-ADMIN-CONSOLE";
    const masterName = searchParams.get("master") || "AppScreenConfigTemplateSchema";

    const mdms_context_path = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";

    const reqCriteria = useMemo(() => ({
        url: `/${mdms_context_path}/v2/_search`,
        body: {
        MdmsCriteria: {
            tenantId: tenantId,
            schemaCode: `${moduleName}.${masterName}`,
            isActive: true
        }
        }
    }), [tenantId]); // Only recreate if tenantId changes

    const { isLoading, data: mdmsData, isFetching } = Digit.Hooks.useCustomAPIHook(reqCriteria);
    const config = useMemo(()=>{
        if(!mdmsData) return mdmsData;
        const formConfig = [
            {
                navLink: "HOUSEHOLD_LOCATION",
                head: "SCREEN_HEADING",
                subHead: "SCREEN_DESCRIPTION",
                body: [
                    {
                        type: "text",
                        label: "Address Line 1",
                        isMandatory: true,
                        populators: {
                            name: "addressLine1",
                            validation: {
                                required: true,
                                pattern: /^[a-zA-Z0-9\s,.-]*$/,
                                maxlength: 100
                            }
                        }
                    },
                    {
                        type: "dropdown",
                        label: "Country",
                        isMandatory: true,
                        populators: {
                            name: "country",
                            validation: { required: true },
                            optionsKey: "code",
                            options: [
                                { code: "US", name: "United States" },
                                { code: "IN", name: "India" },
                                { code: "UK", name: "United Kingdom" }
                            ]
                        }
                    },
                    {
                        type: "multiselectdropdown",
                        label: "Country",
                        isMandatory: true,
                        populators: {
                            name: "country",
                            validation: { required: true },
                            optionsKey: "name",
                            options: [
                                { code: "US", name: "United States" },
                                { code: "IN", name: "India" },
                                { code: "UK", name: "United Kingdom" }
                            ]
                        }
                    },
                    {
                        type: "mobileNumber",
                        label: "Contact Number",
                        isMandatory: true,
                        populators: {
                            name: "mobile",
                            validation: {
                                required: true,
                                pattern: /^[0-9]{10}$/
                            }
                        }
                    },
                ]
            },
        ];
        return formConfig;
        
    }, [mdmsData]);
    console.log("config", config);

    const horizontalNavConfig = [
        { name: "HOUSEHOLD_LOCATION", title: "Household Location" },
        { name: "HOUSEHOLD_DETAILS", title: "Household Details" },
        { name: "INDIVIDUAL_DETAIL", title: "Individual Details" },
        { name: "INDIVIDUAL_LOCATION", title: "Individual Location" }
    ];

    const formConfig = [
        {
            navLink: "HOUSEHOLD_LOCATION",
            head: "SCREEN_HEADING",
            subHead: "SCREEN_DESCRIPTION",
            body: [
                {
                    type: "text",
                    label: "Address Line 1",
                    isMandatory: true,
                    populators: {
                        name: "addressLine1",
                        validation: {
                            required: true,
                            pattern: /^[a-zA-Z0-9\s,.-]*$/,
                            maxlength: 100
                        }
                    }
                },
                {
                    type: "dropdown",
                    label: "Country",
                    isMandatory: true,
                    populators: {
                        name: "country",
                        validation: { required: true },
                        optionsKey: "code",
                        options: [
                            { code: "US", name: "United States" },
                            { code: "IN", name: "India" },
                            { code: "UK", name: "United Kingdom" }
                        ]
                    }
                },
                {
                    type: "multiselectdropdown",
                    label: "Country",
                    isMandatory: true,
                    populators: {
                        name: "country",
                        validation: { required: true },
                        optionsKey: "name",
                        options: [
                            { code: "US", name: "United States" },
                            { code: "IN", name: "India" },
                            { code: "UK", name: "United Kingdom" }
                        ]
                    }
                },
                {
                    type: "mobileNumber",
                    label: "Contact Number",
                    isMandatory: true,
                    populators: {
                        name: "mobile",
                        validation: {
                            required: true,
                            pattern: /^[0-9]{10}$/
                        }
                    }
                },
            ]
        },
    ];
    return (
        <div>
            <FormComposerV2
                config={formConfig}
                horizontalNavConfig={horizontalNavConfig}
                showFormInNav={true}
                showMultipleCardsInNavs={true}
                // onSubmit={handleSubmit}
                label="Submit"
            />
        </div>
    )
};

export default DummyTry;