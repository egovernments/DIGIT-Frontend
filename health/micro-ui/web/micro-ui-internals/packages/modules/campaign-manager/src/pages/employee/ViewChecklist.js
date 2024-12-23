import React, { useEffect, useState, createContext, useContext } from "react";
import { checklistCreateConfig } from "../../configs/checklistCreateConfig";
import { useTranslation } from "react-i18next";
import { ViewCardFieldPair, Toast, Card, TextBlock, Button, PopUp, CardText, TextInput, BreadCrumb, Loader, ActionBar, Tag} from "@egovernments/digit-ui-components";
import { FormComposerV2 } from "@egovernments/digit-ui-react-components";
import { useHistory, useLocation } from "react-router-dom";
import MobileChecklist from "../../components/MobileChecklist";
import TagComponent from "../../components/TagComponent";

const ViewChecklist = () => {
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
    const serviceCode = `${campaignName}.${checklistType}.${role}`
    const [config, setConfig] = useState(null);
    const [showPopUp, setShowPopUp] = useState(false);
    const [previewData, setPreviewData] = useState([]);

    const [viewData, setViewData] = useState(null);

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
                    const temp_data = res?.ServiceDefinitions?.[0]?.attributes
                    const formatted_data = temp_data.map((item) => item.additionalFields?.fields?.[0]?.value);
                    const nvd = formatted_data.filter((value, index, self) =>
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

        const currentTime = new Date();
        if (viewData !== null) {
            setConfig(checklistCreateConfig(viewData, currentTime, "view"));
        }

    }, [viewData])





    const fieldPairs = [
        { label: "CHECKLIST_ROLE", value: roleLocal },
        { label: "TYPE_OF_CHECKLIST", value: checklistTypeLocal },
        { label: "CAMPAIGN_NAME", value: campaignName },
    ];

    if (isLoading) {
        return <Loader />;
    }


    return (
        <div style={{marginBottom: "2rem"}}>
            <TagComponent campaignName={campaignName} /> 
            <div style={{ display: "flex", justifyContent: "space-between", height:"5.8rem", marginTop:"-1.2rem" }}>
                <div>
                    <h2 style={{ fontSize: "2.5rem", fontWeight: "700", fontFamily: "Roboto Condensed"}}>
                        {t("VIEW_CHECKLIST")}
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
                    {/* <PreviewComponent
              questionsArray={previewData}></PreviewComponent> */}

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
                        />
                        {index !== fieldPairs.length - 1 && <div style={{ height: "1rem" }}></div>}
                    </div>
                ))}
            </Card>
            <div style={{ height: "1rem" }} />

            {!isLoading && <FormComposerV2
                showMultipleCardsWithoutNavs={true}
                label={t("UPDATE")}
                config={config}
                onSubmit={() => {
                    history.push(`/${window.contextPath}/employee/campaign/checklist/update?campaignName=${campaignName}&role=${role}&checklistType=${checklistType}&projectType=${projectType}&campaignId=${campaignId}`)
                }}
                fieldStyle={{ marginRight: 0 }}
                noBreakLine={true}
                // cardClassName={"page-padding-fix"}
                // onFormValueChange={onFormValueChange}
                actionClassName={"checklistCreate"}
                // noCardStyle={currentKey === 4 || currentStep === 7 || currentStep === 0 ? false : true}
                noCardStyle={true}
            // showWrapperContainers={false}
            />}

        </div>
    )



};

export default ViewChecklist;