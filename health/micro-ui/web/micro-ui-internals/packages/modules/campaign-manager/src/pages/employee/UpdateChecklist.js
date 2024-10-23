import React, { useEffect, useState, createContext, useContext } from "react";
import { checklistCreateConfig } from "../../configs/checklistCreateConfig";
import { useTranslation } from "react-i18next";
import { ViewCardFieldPair, Toast, Card, TextBlock, Button, PopUp, CardText, TextInput, BreadCrumb, Loader, ActionBar } from "@egovernments/digit-ui-components";
import { FormComposerV2 } from "@egovernments/digit-ui-react-components";
import { useHistory, useLocation } from "react-router-dom";
import MobileChecklist from "../../components/MobileChecklist";

const UpdateChecklist = () => {
    const { t } = useTranslation();
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const searchParams = new URLSearchParams(location.search);
    const campaignName = searchParams.get("campaignName");
    const role = searchParams.get("role");
    const rlt = searchParams.get("role");
    const roleLocal = (!rlt.startsWith("ACCESSCONTROL_ROLES_ROLES_")) ? "ACCESSCONTROL_ROLES_ROLES_"+rlt : rlt;
    const checklistType = searchParams.get("checklistType");
    let clt = searchParams.get("checklistType");
    const checklistTypeLocal = (!clt.startsWith("HCM_CHECKLIST_TYPE_")) ? "HCM_CHECKLIST_TYPE_"+clt : clt;
    const history = useHistory(); // Get history object for navigation
    const [config, setConfig] = useState(null);
    const [checklistTypeCode, setChecklistTypeCode] = useState(null);
    const [roleCode, setRoleCode] = useState(null);
    const serviceCode = `${campaignName}.${checklistType}.${role}`
    const [searching, setSearching] = useState(true);
    const [viewData, setViewData] = useState(null);
    let locale = Digit?.SessionStorage.get("initData")?.selectedLanguage || "en_IN";
    const { mutateAsync } = Digit.Hooks.campaign.useUpdateChecklist(tenantId);
    const { mutateAsync: localisationMutateAsync } = Digit.Hooks.campaign.useUpsertLocalisation(tenantId, module, locale);
    module = "hcm-checklist";
    let processedData = [];
    let checklistName = `${checklistType} ${role}`;
    const [submitting, setSubmitting] = useState(false);
    const [showToast, setShowToast] = useState(null);
    const [tempFormData, setTempFormData] = useState([]);
    const [previewData, setPreviewData] = useState([]);
    const [showPopUp, setShowPopUp] = useState(false);


    const popShow = () => {
        const pr = organizeQuestions(tempFormData);
        setPreviewData(pr);
        setShowPopUp(!showPopUp);
    };

    const closeToast = () => {
        setShowToast(null);
    };

    const onFormValueChange = (ll, formData) => {
        setTempFormData(formData?.createQuestion?.questionData);
    };

    useEffect(() => {
        if (showToast) {
            setTimeout(closeToast, 5000);
        }
    }, [showToast]);

    const res = {
        url: `/service-request/service/definition/v1/_search`,
        body: {
            ServiceDefinitionCriteria: {
                "tenantId": tenantId,
                "code": [serviceCode]
            },
            includeDeleted: true
        },
        config: {
            select: (res) => {
                if (res?.ServiceDefinitions?.[0]?.attributes) {
                    let temp_data = res?.ServiceDefinitions?.[0]?.attributes
                    let formatted_data = temp_data.map((item) => item.additionalDetails);
                    let nvd = formatted_data.filter((value, index, self) =>
                        index === self.findIndex((t) => t.id === value.id)
                    );
                    return nvd;
                }
            }
        }
    }
    const { isLoading, data, isFetching } = Digit.Hooks.useCustomAPIHook(res);
  
    useEffect(() => {
        if (data) {
            setViewData(data);
        }
    }, [data])

    useEffect(() => {
        const currentTime = new Date();
        if (viewData !== null) {
            setConfig(checklistCreateConfig(viewData, currentTime, "update"));
        }

    }, [viewData])

    const callUpdate = () => {

    }

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



    const generateCodes = (questions) => {
        const codes = {}; // Store codes for each question
        const local = [];

        // Helper function to generate codes recursively
        const generateCode = (question, prefix, index) => {
            // Determine the code based on the index
            let code = '';
            if (question.parentId === null) {
                code = `SN${index + 1}`; // Top-level questions
            } else {
                code = `${prefix}.SN${index + 1}`; // Nested questions
            }
            codes[question.id] = code;

            let moduleChecklist = "hcm-checklist";

            let checklistTypeTemp = checklistType.toUpperCase().replace(/ /g, "_");
            let roleTemp = role.toUpperCase().replace(/ /g, "_");
            if (checklistTypeCode) checklistTypeTemp = checklistTypeCode;
            let formattedString = `${campaignName}.${checklistTypeTemp}.${roleTemp}.${code}`;


            const obj = {
                "code": formattedString,
                "message": String(question.title),
                "module": moduleChecklist,
                "locale": locale
            }
            local.push(obj);

            // Recursively generate codes for options and subQuestions
            if (question.options) {

                question.options.forEach((option, optionIndex) => {
                    //generateCode(option, code, optionIndex);
                    const optionval = option.label;
                    const upperCaseString = optionval.toUpperCase();
                    const transformedString = upperCaseString.replace(/ /g, '_');
                    if (checklistTypeCode) checklistTypeTemp = checklistTypeCode;
                    option.label = transformedString;
                    let formattedStringTemp = `${campaignName}.${checklistTypeTemp}.${roleTemp}.${option.label}`;
                    const obj = {
                        "code": formattedStringTemp,
                        "message": String(optionval),
                        "module": moduleChecklist, // to be dynamic
                        "locale": locale //to be dynamic
                    }
                    local.push(obj);
                    if (option.subQuestions) {
                        option.subQuestions.forEach((subQuestion, subQuestionIndex) =>
                            generateCode(subQuestion, `${code}.${option.label}`, subQuestionIndex)
                        );
                    }
                });
            }
            if (question.subQuestions) {
                question.subQuestions.forEach((subQuestion, subQuestionIndex) =>
                    generateCode(subQuestion, code, subQuestionIndex)
                );
            }
        };

        // Process all questions, starting with those that have no parentId
        questions.forEach((question, index) => {
            if (question.parentId === null) {
                generateCode(question, '', index);
            }
        });

        return { codes: codes, local: local };
    };

    function createQuestionObject(item, tenantId) {
        const questionObject = {
            tenantId: tenantId,
            code: idCodeMap[item.id],  // Use the idCodeMap to get the code
            dataType: item?.type?.code,
            values: item?.value,
            required: item?.isRequired,
            isActive: item?.isActive,
            reGex: item?.isRegex ? item?.regex?.regex : null,
            order: item?.key,
            additionalDetails: item // Complete object goes here
        };

        return questionObject;
    }

    // Helper function to generate the desired object format for each question
    function createQuestionObject(item, tenantId, idCodeMap) {
        let labelsArray = [];
        if (item?.options) labelsArray = item?.options.map(option => option?.label);
        const questionObject = {
            id: item.id,
            tenantId: tenantId,
            code: idCodeMap[item.id],  // Use the idCodeMap to get the code
            dataType: String(item?.type?.code),
            values: labelsArray,
            required: item?.isRequired,
            isActive: item?.isActive,
            reGex: item?.isRegex ? item?.regex?.regex : null,
            order: item?.key,
            additionalDetails: item // Complete object goes here
        };

        return questionObject;
    }


    // Recursive function to traverse the question array and its nested subquestions
    function transformQuestions(questions, tenantId, idCodeMap) {
        const result = [];

        questions.forEach(question => {
            // Create the main question object
            const questionObject = createQuestionObject(question, tenantId, idCodeMap);
            result.push(questionObject);

            // Handle subQuestions
            if (question.subQuestions && question.subQuestions.length > 0) {
                const subQuestions = transformQuestions(question.subQuestions, tenantId, idCodeMap);
                result.push(...subQuestions);
            }

            // Handle options with subQuestions
            if (question.options && question.options.length > 0) {
                question.options.forEach(option => {
                    if (option.subQuestions && option.subQuestions.length > 0) {
                        const optionSubQuestions = transformQuestions(option.subQuestions, tenantId, idCodeMap);
                        result.push(...optionSubQuestions);
                    }
                });
            }
        });

        return result;
    }
    let uniqueLocal;

    const payloadData = (data) => {
        processedData = organizeQuestions(data);
        let { codes, local } = generateCodes(processedData);
        // let codes = generateCodes(processedData);
        let final_payload = transformQuestions(processedData, tenantId, codes);

        const fp = final_payload.filter((value, index, self) =>
            index === self.findIndex((t) => t.id === value.id || t.code === value.code)
          );
        uniqueLocal = local.filter((value, index, self) =>
            index === self.findIndex((t) => JSON.stringify(t) === JSON.stringify(value))
        );
        let checklistTypeTemp = checklistType.toUpperCase().replace(/ /g, "_");
        let roleTemp = role.toUpperCase().replace(/ /g, "_");
        if (checklistTypeCode) checklistTypeTemp = checklistTypeCode;
        let code_of_checklist = `${campaignName}.${checklistTypeTemp}.${roleTemp}`;
        return {
            tenantId: tenantId,
            // code: role,
            code: code_of_checklist,
            isActive: true,
            attributes: fp,
            additionalDetails: {
                name: checklistName,
                type: checklistType,
                role: role
            },

        }
    };


    const onSubmit = async (formData, flag = 0, preview = null) => {
        let payload;
        if (flag === 1) {
            payload = payloadData(preview);
        } else {
            payload = payloadData(formData?.createQuestion?.questionData);
        }
        setSubmitting(true);
        try {
            const data = await mutateAsync(payload); // Use mutateAsync for await support
            // Handle successful checklist creation  
            // Proceed with localization if needed
            let checklistTypeTemp = checklistType.toUpperCase().replace(/ /g, "_");
            if (checklistTypeCode) checklistTypeTemp = checklistTypeCode;
            let roleTemp = role.toUpperCase().replace(/ /g, "_");
            uniqueLocal.push({
                code: `${campaignName}_${checklistTypeTemp}_${roleTemp}`,
                locale: locale,
                message: `${checklistType} ${role}`,
                module: "hcm-checklist"
            });
            if (data.success) { // Replace with your actual condition
                const localisations = uniqueLocal;
                const localisationResult = await localisationMutateAsync(localisations);
                // Check if localization succeeded
                if (!localisationResult.success) {
                    setShowToast({ label: "CHECKLIST_UPDATE_LOCALISATION_ERROR", isError: "true" });
                    return; // Exit if localization fails
                }

                // setShowToast({ label: "CHECKLIST_AND_LOCALISATION_CREATED_SUCCESSFULLY"});
                history.push(`/${window.contextPath}/employee/campaign/response?isSuccess=${true}`, {
                    message: "ES_CHECKLIST_UPDATE_SUCCESS_RESPONSE",
                    preText: "ES_CHECKLIST_UPDATE_SUCCESS_RESPONSE_PRE_TEXT",
                    actionLabel: "ES_CHECKLIST_RESPONSE_ACTION",
                    actionLink: `/${window.contextPath}/employee/campaign/my-campaign`,
                });
            } else {
                setShowToast({ label: "CHECKLIST_UPDATE_FAILED", isError: "true" });
            }
        } catch (error) {
            // Handle error scenario
            setShowToast({ label: "CHECKLIST_UPDATE_FAILED", isError: "true" });
            // console.error("Error creating checklist:", error);
        } finally {
            setSubmitting(false);
        }
    };




    const name = t(`${checklistTypeLocal}`) + " " + t(`${roleLocal}`);
    const fieldPairs = [
        { label: "ROLE", value: roleLocal },
        { label: "TYPE_OF_CHECKLIST", value: checklistTypeLocal },
        { label: "CAMPAIGN_NAME", value: campaignName },
        // { label: "CHECKLIST_NAME", value: name}            
    ];

    if(isLoading) {
        return <Loader />;
    }
    return (
        <div>
            {/* {submitting && <Loader />} */}
            {!submitting &&
                <div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div>
                            <h2 style={{ fontSize: "36px", fontWeight: "700" }}>
                                {t("UPDATE_CHECKLIST")}
                            </h2>
                        </div>
                        <div style={{ display: "flex", gap: "1rem" }}>
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
                                        onSubmit(null, 1, tempFormData);
                                    }}
                                />,
                            ]}
                            sortFooterChildren={true}
                        >

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
                    <div style={{height:"1rem"}}></div>
                    {!isLoading && <FormComposerV2
                        showMultipleCardsWithoutNavs={true}
                        label={t("UPDATE_CHECKLIST")}
                        config={config}
                        onSubmit={onSubmit}
                        fieldStyle={{ marginRight: 0 }}
                        noBreakLine={true}
                        // cardClassName={"page-padding-fix"}
                        onFormValueChange={onFormValueChange}
                        actionClassName={"checklistCreate"}
                        // noCardStyle={currentKey === 4 || currentStep === 7 || currentStep === 0 ? false : true}
                        noCardStyle={true}
                    // showWrapperContainers={false}
                    />}
                    {showToast && (
                        <Toast
                            type={showToast?.isError ? "error" : "success"}
                            // error={showToast?.isError}
                            label={t(showToast?.label)}
                            isDleteBtn={"true"}
                            onClose={() => closeToast()}
                        />
                    )}


                </div>
            }
        </div>
    )



};

export default UpdateChecklist;