import React, { useEffect, useState, createContext, useContext } from "react";
import { checklistCreateConfig } from "../../configs/checklistCreateConfig";
import { useTranslation } from "react-i18next";
import { ViewCardFieldPair, Toast, Card, TextBlock, Button, PopUp, CardText, TextInput, BreadCrumb, Loader, ActionBar, Tag } from "@egovernments/digit-ui-components";
import { FormComposerV2 } from "@egovernments/digit-ui-react-components";
import { useHistory, useLocation } from "react-router-dom";
import MobileChecklist from "../../components/MobileChecklist";
import TagComponent from "../../components/TagComponent";

const UpdateChecklist = () => {
    const { t } = useTranslation();
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const searchParams = new URLSearchParams(location.search);
    const campaignName = searchParams.get("campaignName");
    const role = searchParams.get("role");
    const rlt = searchParams.get("role");
    const projectType = searchParams.get("projectType");
    const campaignId = searchParams.get("campaignId");
    const roleLocal = (!rlt.startsWith("ACCESSCONTROL_ROLES_ROLES_")) ? "ACCESSCONTROL_ROLES_ROLES_" + rlt : rlt;
    const checklistType = searchParams.get("checklistType");
    let clt = searchParams.get("checklistType");
    const checklistTypeLocal = (!clt.startsWith("HCM_CHECKLIST_TYPE_")) ? "HCM_CHECKLIST_TYPE_" + clt : clt;
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
    const [curActive, setCurActive] = useState(false);


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
                    setCurActive(res?.ServiceDefinitions?.[0].isActive);
                    let temp_data = res?.ServiceDefinitions?.[0]?.attributes
                    let formatted_data = temp_data.map((item) => item.additionalFields?.fields?.[0]?.value);
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
            data.forEach((question) => {
                if (question.type.code === "String") {
                    question.type.code = "Short Answer";
                }
            });

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
        const codes = {};
        const local = [];
        let activeCounters = { top: 0 }; // Track active question counts at each level
    
        // Helper function to generate codes recursively
        const generateCode = (question, prefix, index, parentCounter = '') => {
            // Generate code regardless of isActive status
            let code = '';
            if (question.parentId === null) {
                code = `SN${index + 1}`;
                // Only increment counter for active questions
                if (question.isActive) {
                    activeCounters.top += 1;
                    parentCounter = String(activeCounters.top);
                }
            } else {
                code = `${prefix}.SN${index + 1}`;
                
                // Initialize counter for this nesting level if it doesn't exist
                const nestingKey = prefix || 'root';
                if (!activeCounters[nestingKey]) {
                    activeCounters[nestingKey] = 0;
                }
                
                // Only increment counter for active questions
                if (question.isActive) {
                    activeCounters[nestingKey] += 1;
                    // Build the counter string (e.g., "2.1" or "2.1.3")
                    parentCounter = parentCounter + '.' + activeCounters[nestingKey];
                }
            }
            
            codes[question.id] = code;
    
            let moduleChecklist = "hcm-checklist";
            let checklistTypeTemp = checklistType.toUpperCase().replace(/ /g, "_");
            let roleTemp = role.toUpperCase().replace(/ /g, "_");
            if (checklistTypeCode) checklistTypeTemp = checklistTypeCode;
            
            // Format the final string with the code (generate for all questions)
            let formattedString = `${campaignName}.${checklistTypeTemp}.${roleTemp}.${code}`;
            
            // Only add message with numbering for active questions
            if (question.isActive) {
                const msg = `${parentCounter}) ${String(question.title)}`;
                const obj = {
                    "code": formattedString,
                    "message": String(msg),
                    "module": moduleChecklist,
                    "locale": locale
                }
                local.push(obj);
            }
    
            // Process options
            if (question.options) {
                question.options.forEach((option, optionIndex) => {
                    const optionval = option.label;
                    const upperCaseString = optionval.toUpperCase();
                    const transformedString = upperCaseString.replace(/ /g, '_');
                    
                    if (checklistTypeCode) checklistTypeTemp = checklistTypeCode;
                    let formattedStringTemp = `${campaignName}.${checklistTypeTemp}.${roleTemp}.${transformedString}`;
                    
                    // Generate codes for options regardless of question's active status
                    const obj = {
                        "code": formattedStringTemp,
                        "message": String(optionval),
                        "module": moduleChecklist,
                        "locale": locale
                    }
                    local.push(obj);
    
                    // Process subquestions under options
                    if (option.subQuestions) {
                        const optionNestingKey = `${code}.${transformedString}`;
                        activeCounters[optionNestingKey] = 0;
                        
                        option.subQuestions.forEach((subQuestion, subQuestionIndex) => {
                            generateCode(
                                subQuestion, 
                                `${code}.${transformedString}`, 
                                subQuestionIndex,
                                question.isActive ? parentCounter : ''
                            );
                        });
                    }
                });
            }
    
            // Process direct subquestions
            if (question.subQuestions) {
                // Reset counter for this level of subquestions
                activeCounters[code] = 0;
                
                question.subQuestions.forEach((subQuestion, subQuestionIndex) => {
                    generateCode(
                        subQuestion, 
                        code, 
                        subQuestionIndex, 
                        question.isActive ? parentCounter : ''
                    );
                });
            }
        };
    
        // Process all top-level questions
        questions.forEach((question, index) => {
            if (question.parentId === null) {
                generateCode(question, '', index);
            }
        });
    
        return { codes: codes, local: local };
    };
    
    // Helper function remains unchanged as it already handles both active and inactive questions
    function createQuestionObject(item, tenantId, idCodeMap) {
        let labelsArray = [];
        if (item?.options) {
            labelsArray = item.options.map(option => {
                const optionval = option?.label || "";
                const upperCaseString = optionval.toUpperCase();
                return upperCaseString.replace(/ /g, '_');
            });
        }
        if(String(item?.type?.code) === "SingleValueList"){
            labelsArray.push("NOT_SELECTED");
        }
    
        const questionObject = {
            id: item.id,
            tenantId: tenantId,
            code: idCodeMap[item.id],
            dataType: String(item?.type?.code),
            values: labelsArray,
            required: item?.isRequired,
            isActive: item?.isActive,
            reGex: item?.isRegex ? item?.regex?.regex : null,
            order: item?.key,
            additionalFields: {
                schema: "serviceDefinition",
                version: 1,
                fields: [
                  {
                    key: crypto.randomUUID(),  // Using crypto.randomUUID() for a unique key
                    value: item
                  }
                ]
              }
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

        data.forEach((question) => {
            if (question.type.code === "Short Answer") {
                question.type.code = "String";
                delete question.options;
            }
        });

        processedData = organizeQuestions(data);
        let { codes, local } = generateCodes(processedData);
        // let codes = generateCodes(processedData);
        let final_payload = transformQuestions(processedData, tenantId, codes);

        const fp = final_payload.filter((value, index, self) =>
            index === self.findIndex((t) => t.id === value.id || t.code === value.code)
        );
        uniqueLocal = local.filter((value, index, self) =>
            index === self.findIndex((t) => JSON.stringify(t.code) === JSON.stringify(value.code))
        );
        let checklistTypeTemp = checklistType.toUpperCase().replace(/ /g, "_");
        let roleTemp = role.toUpperCase().replace(/ /g, "_");
        if (checklistTypeCode) checklistTypeTemp = checklistTypeCode;
        let code_of_checklist = `${campaignName}.${checklistTypeTemp}.${roleTemp}`;
        return {
            tenantId: tenantId,
            // code: role,
            code: code_of_checklist,
            isActive: curActive,
            attributes: fp,
            additionalFields: {
                schema: "serviceDefinition",
                version: 1,
                fields: [
                  {
                    key: crypto.randomUUID(),  // Using crypto.randomUUID() for a unique key
                    value: {
                      name: checklistName,
                      type: checklistType,
                      role: role
                    }
                  }
                ]
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
                code: `${campaignName}.${checklistTypeTemp}.${roleTemp}`,
                locale: locale,
                message: `${t(checklistTypeLocal)} ${t(roleLocal)}`,
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
                    actionLabel: "CS_CHECKLIST_NEW_RESPONSE_ACTION",
                    actionLink: `/${window.contextPath}/employee/campaign/checklist/search?name=${campaignName}&campaignId=${campaignId}&projectType=${projectType}`,
                    secondaryActionLabel: "MY_CAMPAIGN",
                    secondaryActionLink: `/${window?.contextPath}/employee/campaign/my-campaign`,
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

    useEffect(()=>{
        if(showToast !== null)
        {
          setShowPopUp(false);
        }
      }, [showToast])




    const name = t(`${checklistTypeLocal}`) + " " + t(`${roleLocal}`);
    const fieldPairs = [
        { label: "CHECKLIST_ROLE", value: roleLocal },
        { label: "TYPE_OF_CHECKLIST", value: checklistTypeLocal },
        { label: "CAMPAIGN_NAME", value: campaignName },
        // { label: "CHECKLIST_NAME", value: name}            
    ];

    if (isLoading) {
        return <Loader />;
    }
    return (
        <div>
            {/* {submitting && <Loader />} */}
            {!submitting &&
                <div>
                    <TagComponent campaignName={campaignName} /> 
                    <div style={{ display: "flex", justifyContent: "space-between", height: "5.8rem", marginTop:"-1.2rem" }}>
                        <div>
                            <h2 style={{ fontSize: "2.5rem", fontWeight: "700", fontFamily: "Roboto Condensed" }}>
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
                                <div></div>,
                                <Button
                                    type={"button"}
                                    size={"large"}
                                    variation={"primary"}
                                    label={t("CLOSE")}
                                    onClick={() => {
                                        setShowPopUp(false);
                                    }}
                                />
                            ]}
                            sortFooterChildren={true}
                        >

                            <MobileChecklist questions={previewData} campaignName={campaignName} checklistRole={t(`${roleLocal}`)} typeOfChecklist={t(`${checklistTypeLocal}`)}></MobileChecklist>
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
                    <div style={{ height: "1rem" }}></div>
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
            <div style={{height: "2rem"}}></div>
        </div>
    )



};

export default UpdateChecklist;