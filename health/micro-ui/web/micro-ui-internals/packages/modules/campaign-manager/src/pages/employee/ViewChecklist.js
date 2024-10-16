import React, { useEffect, useState, createContext, useContext } from "react";
import { checklistCreateConfig } from "../../configs/checklistCreateConfig";
import { useTranslation } from "react-i18next";
import { ViewCardFieldPair, Toast, Card, TextBlock, Button, PopUp, CardText, TextInput, BreadCrumb, Loader, ActionBar } from "@egovernments/digit-ui-components";
import { FormComposerV2 } from "@egovernments/digit-ui-react-components";
import { useHistory, useLocation } from "react-router-dom";

const ViewChecklist = () => {
    const { t } = useTranslation();
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const searchParams = new URLSearchParams(location.search);
    const campaignName = searchParams.get("campaignName");
    const role = searchParams.get("role");
    const checklistType = searchParams.get("checklistType");
    const [config, setConfig] = useState(null);
    const [checklistTypeCode, setChecklistTypeCode] = useState(null);
    const [roleCode, setRoleCode] = useState(null);
    const [serviceCode, setServiceCode] = useState(null);
    const [searching, setSearching] = useState(true);
    const [viewData, setViewData] = useState(
        //     [
        //     { 
        //         id: crypto.randomUUID(), 
        //         parentId: null, 
        //         level: 1, 
        //         key: 1, 
        //         title: null, 
        //         type: { code: "SingleValueList" }, 
        //         value: null, 
        //         isRequired: false 
        //     }
        // ]
        null
    );



    const reqCriteriaResourceMDMS = {
        url: `/mdms-v2/v2/_search`,
        // url: `/${urlMd}/v2/_search`,
        body: {
            MdmsCriteria: {
                tenantId: tenantId,
                schemaCode: "HCMadminconsole.checklisttemplates"
                // schemaCode: "HCM-ADMIN-CONSOLE.ChecklistTemplates"
            }
        },
        config: {
            enabled: true,
            select: (data) => {
                return data?.mdms?.[0]?.data?.data;
            },
        },
        // changeQueryName:"checklsit template "
    };
    const { isLoading1, data: mdms, isFetching } = Digit.Hooks.useCustomAPIHook(reqCriteriaResourceMDMS);

    const reqCriteria = {

        url: `/localization/messages/v1/_search`,
        body: {
            tenantId: tenantId
        },
        params: {
            locale: "en_MZ",
            tenantId: tenantId,
            module: "hcm-campaignmanager"
        },
    }
    const { isLoading2, data: localization, isFetching2 } = Digit.Hooks.useCustomAPIHook(reqCriteria);

    useEffect(() => {
        if (localization?.messages?.length > 0) {
            let matchedItem = localization.messages.find(item => item.message === checklistType);
            console.log("matched item", matchedItem);
            // If a match is found, assign the 'code' to 'checklistcode'
            if (matchedItem) {
                let code = matchedItem.code;
                let res = code.replace("HCM_CHECKLIST_TYPE_", "");
                setChecklistTypeCode(res);
                setRoleCode(role.toUpperCase().replace(/ /g, "_"));
                console.log("type", checklistTypeCode);
                console.log("role", roleCode);
            } else {
            }
        } else {
        }

    }, [localization])

    useEffect(() => {
        setServiceCode(`${campaignName}.${checklistTypeCode}.${roleCode}`);
    }, [checklistTypeCode, roleCode]
    )

    useEffect(() => {
        console.log("service code", serviceCode);

        const callSearch = async () => {
            const res = await Digit.CustomService.getResponse({
                url: `/service-request/service/definition/v1/_search`,
                body: {
                    ServiceDefinitionCriteria: {
                        "tenantId": tenantId,
                        "code": [serviceCode]
                    },
                },
            });
            return res;
        }
        const fetchData = async () => {
            try {
                const res = await callSearch();
                console.log("the res is", res);

                if (res?.ServiceDefinitions?.[0]?.attributes) {
                    setSearching(false);
                    let temp_data = res?.ServiceDefinitions?.[0]?.attributes
                    let formatted_data = temp_data.map((item) => item.additionalDetails);
                    setViewData(formatted_data);
                    console.log("formatted data", formatted_data);

                }
            }
            catch (error) {
            }
        }
        fetchData();
    }, [serviceCode])

    useEffect(() => {
        // setConfig(checklistCreateConfig(data=[{ id: crypto.randomUUID(), parentId: null, level: 1, key: 1, title: null, type: {"code": "SingleValueList"}, value: null, isRequired: false }], typeOfCall="view"));
        // const initialData = [
        //     { 
        //         id: crypto.randomUUID(), 
        //         parentId: null, 
        //         level: 1, 
        //         key: 1, 
        //         title: null, 
        //         type: { code: "SingleValueList" }, 
        //         value: null, 
        //         isRequired: false 
        //     }
        // ];
        console.log("achieved data is", viewData);
        const currentTime = new Date();
        if (viewData !== null) {
            setConfig(checklistCreateConfig(viewData, currentTime, "view"));
            // setConfig(checklistCreateConfig({
            //     data: viewData,
            //     time: currentTime,
            //     typeOfCall: "view"
            // }));
        }

    }, [viewData])





    const fieldPairs = [
        { label: "ROLE", value: role },
        { label: "TYPE_OF_CHECKLIST", value: checklistType },
        { label: "CAMPAIGN_NAME", value: campaignName },
        { label: "CHECKLIST_NAME", value: `${checklistType} ${role}` }
    ];
    return (
        <div>
            <h2 style={{ fontSize: "36px", fontWeight: "700" }}>
                {t("VIEW_CHECKLIST")}
            </h2>
            <Card type={"primary"} variant={"viewcard"} className={"example-view-card"}>
                {fieldPairs.map((pair, index) => (
                    <div>
                        <ViewCardFieldPair
                            key={index} // Provide a unique key for each item
                            className=""
                            inline
                            label={pair.label} // Dynamically set the label
                            value={pair.value} // Dynamically set the value
                        // style={{ fontSize: "16px", fontWeight: "bold" }} // Optional: customize styles
                        />
                        {index !== fieldPairs.length - 1 && <div style={{ height: "1rem" }}></div>}
                    </div>
                ))}
            </Card>
            {!searching && <FormComposerV2
                showMultipleCardsWithoutNavs={true}
                // label={t("CREATE_CHECKLIST")}
                config={config}
                // onSubmit={onSubmit}
                fieldStyle={{ marginRight: 0 }}
                noBreakLine={true}
                // cardClassName={"page-padding-fix"}
                // onFormValueChange={onFormValueChange}
                actionClassName={"checklistCreate"}
                // noCardStyle={currentKey === 4 || currentStep === 7 || currentStep === 0 ? false : true}
                noCardStyle={true}
            // showWrapperContainers={false}
            />}
            {searching && <Loader />}
            <ActionBar
                actionFields={[
                    // <Button
                    //     icon="ArrowBack"
                    //     style={{ marginLeft: "3.5rem" }}
                    //     label={t("Back")}
                    //     isDisabled={true}
                    //     // onClick={{}}
                    //     type="button"
                    //     variation="secondary"
                    //     textStyles={{ width: 'unset' }}
                    // />,
                    <Button
                        icon="ArrowForward"
                        // isDisabled={!disableFile}
                        style={{ marginLeft: "auto" }}
                        isSuffix
                        label={t("Next")}
                        onClick={() => { const currentTime = new Date(); setConfig(checklistCreateConfig(viewData, currentTime, "update")) }}
                        type="button"
                        textStyles={{ width: 'unset' }}
                    />
                ]}
                className="custom-action-bar"
                maxActionFieldsAllowed={5}
                setactionFieldsToRight
                sortActionFields
                style={{}}
            />

        </div>
    )



};

export default ViewChecklist;