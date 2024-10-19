import React, { useEffect, useState, createContext, useContext } from "react";
import { checklistCreateConfig } from "../../configs/checklistCreateConfig";
import { useTranslation } from "react-i18next";
import { ViewCardFieldPair, Toast, Card, TextBlock, Button, PopUp, CardText, TextInput, BreadCrumb, Loader, ActionBar } from "@egovernments/digit-ui-components";
import { FormComposerV2 } from "@egovernments/digit-ui-react-components";
import { useHistory, useLocation } from "react-router-dom";
import MobileChecklist from "../../components/MobileChecklist";

const ViewChecklist = () => {
    const { t } = useTranslation();
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const searchParams = new URLSearchParams(location.search);
    const campaignName = searchParams.get("campaignName");
    const role = searchParams.get("role");
    const rlt = searchParams.get("role");
    const roleLocal = (!rlt.startsWith("ACCESSCONTROL_ROLES_ROLES_")) ? "ACCESSCONTROL_ROLES_ROLES_" + rlt : rlt;
    const checklistType = searchParams.get("checklistType");
    let clt = searchParams.get("checklistType");
    const checklistTypeLocal = (!clt.startsWith("HCM_CHECKLIST_TYPE_")) ? "HCM_CHECKLIST_TYPE_" + clt : clt;
    const history = useHistory(); // Get history object for navigation
    let checklistName = `${checklistType} ${role}`;
    const [config, setConfig] = useState(null);
    const [checklistTypeCode, setChecklistTypeCode] = useState(null);
    const [roleCode, setRoleCode] = useState(null);
    const [serviceCode, setServiceCode] = useState(null);
    const [searching, setSearching] = useState(true);
    const [showPopUp, setShowPopUp] = useState(false);
    const [previewData, setPreviewData] = useState([]);

    const [viewData, setViewData] = useState(null);



    // const reqCriteriaResourceMDMS = {
    //     url: `/mdms-v2/v2/_search`,
    //     // url: `/${urlMd}/v2/_search`,
    //     body: {
    //         MdmsCriteria: {
    //             tenantId: tenantId,
    //             schemaCode: "HCMadminconsole.checklisttemplates"
    //             // schemaCode: "HCM-ADMIN-CONSOLE.ChecklistTemplates"
    //         }
    //     },
    //     config: {
    //         enabled: true,
    //         select: (data) => {
    //             return data?.mdms?.[0]?.data?.data;
    //         },
    //     },
    //     // changeQueryName:"checklsit template "
    // };
    // const { isLoading1, data: mdms, isFetching } = Digit.Hooks.useCustomAPIHook(reqCriteriaResourceMDMS);

    // const reqCriteria = {

    //     url: `/localization/messages/v1/_search`,
    //     body: {
    //         tenantId: tenantId
    //     },
    //     params: {
    //         locale: "en_MZ",
    //         tenantId: tenantId,
    //         module: "hcm-campaignmanager"
    //     },
    // }
    // const { isLoading2, data: localization, isFetching2 } = Digit.Hooks.useCustomAPIHook(reqCriteria);


    function organizeQuestions(questions) {
        // Deep clone the questions to avoid mutating the original tempFormData
        const clonedQuestions = JSON.parse(JSON.stringify(questions));

        const questionMap = new Map();
        const optionMap = new Map();
        const organizedQuestions = [];

        // First pass: Populate the maps with questions and options
        clonedQuestions.forEach((question) => {
            question.subQuestions = []; // Initialize an array to hold sub-questions
            questionMap.set(question.id, question);

            if (question?.options) {
                question.options.forEach((option) => {
                    option.subQuestions = []; // Initialize an array to hold sub-questions for options
                    optionMap.set(option.id, option);
                });
            }
        });

        // Second pass: Link each question to its parent, whether it's a question or an option
        clonedQuestions.forEach((question) => {
            if (question.parentId) {
                const parentQuestion = questionMap.get(question.parentId);
                const parentOption = optionMap.get(question.parentId);

                if (parentQuestion) {
                    parentQuestion.subQuestions.push(question);
                } else if (parentOption) {
                    parentOption.subQuestions.push(question);
                }
            } else {
                organizedQuestions.push(question);
            }
        });

        return organizedQuestions;
    }

    const popShow = () => {
        const pr = organizeQuestions(viewData);
        setPreviewData(pr);
        setShowPopUp(!showPopUp);
    };

    useEffect(() => {
        setServiceCode(`${campaignName}.${checklistType}.${role}`)
    }, [])

    useEffect(() => {

        const callSearch = async () => {
            const res = await Digit.CustomService.getResponse({
                url: `/service-request/service/definition/v1/_search`,
                body: {
                    ServiceDefinitionCriteria: {
                        "tenantId": tenantId,
                        "code": [serviceCode]
                    },
                    includeDeleted: true
                },
            });
            return res;
        }
        const fetchData = async () => {
            try {
                const res = await callSearch();

                if (res?.ServiceDefinitions?.[0]?.attributes) {
                    setSearching(false);
                    let temp_data = res?.ServiceDefinitions?.[0]?.attributes
                    let formatted_data = temp_data.map((item) => item.additionalDetails);
                    let nvd = formatted_data.filter((value, index, self) =>
                        index === self.findIndex((t) => t.id === value.id)
                    );
                    setViewData(nvd);

                }
            }
            catch (error) {
            }
        }
        fetchData();
    }, [serviceCode])

    useEffect(() => {

        const currentTime = new Date();
        if (viewData !== null) {
            setConfig(checklistCreateConfig(viewData, currentTime, "view"));
        }

    }, [viewData])





    const fieldPairs = [
        { label: "ROLE", value: roleLocal },
        { label: "TYPE_OF_CHECKLIST", value: checklistTypeLocal },
        { label: "CAMPAIGN_NAME", value: campaignName },
        // { label: "CHECKLIST_NAME", value: `${checklistTypeLocal} ${roleLocal}` }
    ];
    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                    <h2 style={{ fontSize: "36px", fontWeight: "700" }}>
                        {t("VIEW_CHECKLIST")}
                    </h2>
                </div>
                <div style={{ display: "flex", gap: "1rem" }}>
                    {/* <Button
                                variation="secondary"
                                label={t("USE_TEMPLATE")}
                                className={"hover"}
                                style={{ marginTop: "2rem", marginBottom: "2rem" }}
                                // icon={<AddIcon style={{ height: "1.5rem", width: "1.5rem" }} fill={PRIMARY_COLOR} />}
                                onClick={useTemplateData}
                                /> */}
                    <Button
                        icon="Preview"
                        variation="secondary"
                        label={t("PREVIEW_CHECKLIST")}
                        className={"hover"}
                        style={{ marginTop: "2rem", marginBottom: "2rem" }}
                        // icon={<AddIcon style={{ height: "1.5rem", width: "1.5rem" }} fill={PRIMARY_COLOR} />}
                        onClick={popShow}
                    />
                </div>
            </div>
            {showPopUp && (
                <PopUp
                    className={"custom-pop-up"}
                    type={"default"}
                    heading={t("CHECKLIST_PREVIEW")}
                    children={[
                        // <div>
                        //   <CardText style={{ margin: 0 }}>{"testing" + " "}</CardText>
                        // </div>, 
                    ]}
                    onOverlayClick={() => {
                        setShowPopUp(false);
                    }}
                    onClose={() => {
                        setShowPopUp(false);
                    }}
                    footerChildren={[
                        <Button
                            type={"button"}
                            size={"large"}
                            variation={"secondary"}
                            label={t("CLOSE")}
                            onClick={() => {
                                setShowPopUp(false);
                            }}
                        />,
                        <Button
                            type={"button"}
                            size={"large"}
                            variation={"primary"}
                            label={t("UPDATE_CHECKLIST")}
                            onClick={() => {
                                history.push(`/${window.contextPath}/employee/campaign/checklist/update?campaignName=${campaignName}&role=${role}&checklistType=${checklistType}`)
                            }}
                        />,
                    ]}
                    sortFooterChildren={true}
                >
                    {/* <PreviewComponent
              questionsArray={previewData}></PreviewComponent> */}

                    <MobileChecklist questions={previewData} checklistRole={t(`${roleLocal}`)} typeOfChecklist={t(`${checklistTypeLocal}`)}></MobileChecklist>
                </PopUp>
            )}

            <Card type={"primary"} variant={"viewcard"} className={"example-view-card"}>
                {fieldPairs.map((pair, index) => (
                    <div>
                        <ViewCardFieldPair
                            key={index} // Provide a unique key for each item
                            className=""
                            inline
                            label={t(pair.label)} // Dynamically set the label
                            value={t(pair.value)} // Dynamically set the value
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
                        label={t("UPDATE")}
                        onClick={() => {
                            history.push(`/${window.contextPath}/employee/campaign/checklist/update?campaignName=${campaignName}&role=${role}&checklistType=${checklistType}`)
                        }}
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