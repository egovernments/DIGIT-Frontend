import React, { useEffect, useState, createContext, useContext, useCallback } from "react";
import { ViewCardFieldPair, Toast, Card, TextBlock, Button, PopUp, CardText, TextInput, BreadCrumb, Loader, ActionBar } from "@egovernments/digit-ui-components";
import { FormComposerV2 } from "@egovernments/digit-ui-react-components";
import { useHistory, useLocation } from "react-router-dom";
import { checklistCreateConfig } from "../../configs/checklistCreateConfig";
import { useTranslation } from "react-i18next";
import CreateQuestion from "../../components/CreateQuestion";
import PreviewComponent from "../../components/PreviewComponent";
import { isError, set, template } from "lodash";
import { value } from "jsonpath";
import data_hook from "../../hooks/data_hook";
import { QuestionContext } from "../../components/CreateQuestionContext";
// import { LabelFieldPair } from "@egovernments/digit-ui-react-components";
import _ from 'lodash';
import MobileChecklist from "../../components/MobileChecklist";
// import { QuestionContext } from "../../components/CreateQuestionContext";

let temp_data = []

const CreateChecklist = () => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const searchParams = new URLSearchParams(location.search);
  const [showToast, setShowToast] = useState(null);
  const checklistType = searchParams.get("checklistType");
  let clt = searchParams.get("checklistType");
  const checklistTypeLocal = (!clt.startsWith("HCM_CHECKLIST_TYPE_")) ? "HCM_CHECKLIST_TYPE_" + clt : clt;
  const clTranslated = t(`${checklistTypeLocal}`);
  const projectName = searchParams.get("campaignName");
  const campagnType = searchParams.get("campaignType");
  const [checklistTypeCode, setChecklistTypeCode] = useState(null);
  const [roleCode, setRoleCode] = useState(null);
  const flow = searchParams.get("flow");
  const role = searchParams.get("role");
  const rlt = searchParams.get("role");
  const roleLocal = (!rlt.startsWith("ACCESSCONTROL_ROLES_ROLES_")) ? "ACCESSCONTROL_ROLES_ROLES_" + rlt : rlt;
  const rlTranslated = t(`${roleLocal}`);
  const campaignName = searchParams.get("campaignName");
  let module = searchParams.get("module");
  const [showPopUp, setShowPopUp] = useState(false);
  const [tempFormData, setTempFormData] = useState([]);
  const [tempFormData1, setTempFormData1] = useState([]);
  const [config, setConfig] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading_new, setLoading_New] = useState(true);
  let locale = Digit?.SessionStorage.get("initData")?.selectedLanguage || "en_IN";
  const { mutateAsync } = Digit.Hooks.campaign.useCreateChecklist(tenantId);
  const history = useHistory();
  const [serviceCode, setServiceCode] = useState(null);
  const [def_data, setDef_Data] = useState(null);

  // const { questionData1, dispatchQuestionData } = useContext(QuestionContext);

  let data_mdms = []
  let template_data = []
  // const urlMd = window.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH");
  const reqCriteriaResource = {
    url: `/mdms-v2/v2/_search`,
    // url: `/${urlMd}/v2/_search`,
    body: {
      MdmsCriteria: {
        tenantId: tenantId,
        // schemaCode: "HCMadminconsole.checklisttemplates"
        schemaCode: "HCM-ADMIN-CONSOLE.ChecklistTemplates_DEMO2"
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
  const { isLoading, data: mdms, isFetching } = Digit.Hooks.useCustomAPIHook(reqCriteriaResource);
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
  const { isLoading1, data: localization, isFetching1 } = Digit.Hooks.useCustomAPIHook(reqCriteria);
  useEffect(() => {
    if (localization?.messages?.length > 0) {
      let matchedItem = localization.messages.find(item => item.message === checklistType);
      // If a match is found, assign the 'code' to 'checklistcode'
      if (matchedItem) {
        let code = matchedItem.code;
        let res = code.replace("HCM_CHECKLIST_TYPE_", "");
        setChecklistTypeCode(res);
      } else {
      }
    } else {
    }

  }, [localization])


  useEffect(() => {
    if (data_mdms && data_mdms.length != 0) template_data = data_mdms;
  }, [mdms])

  module = "hcm-checklist";
  const { mutateAsync: localisationMutateAsync } = Digit.Hooks.campaign.useUpsertLocalisation(tenantId, module, locale);

  let processedData = [];

  useEffect(() => {
    setServiceCode(`${campaignName}.${checklistType}.${role}`)
  }, [])

  useEffect(() => {

    const callSearch = async () => {
      const res = await Digit.CustomService.getResponse({
        url: `/mdms-v2/v2/_search`,
        params: {
          tenantId: tenantId
        },
        body: {
          MdmsCriteria: {
            tenantId: tenantId,
            // schemaCode: "HCMadminconsole.checklisttemplates"
            schemaCode: "HCM-ADMIN-CONSOLE.ChecklistTemplates_DEMO2",
            filters: {
              role: role,
              checklistType: checklistType
            }
          }
        },
      });
      return res;
    }
    const fetchData = async () => {
      try {
        const res = await callSearch();

        if (res?.mdms?.[0]?.data?.data) {
          setLoading_New(false)
          let temp_data = res?.mdms?.[0]?.data?.data
          let formatted_data = temp_data;
          setDef_Data(formatted_data);

        }
      }
      catch (error) {
      }
    }
    fetchData();
  }, [serviceCode])

  useEffect(() => {

    const currentTime = new Date();
    if (def_data !== null) {
      setConfig(checklistCreateConfig(def_data, currentTime, "create"));
      // setConfig(checklistCreateConfig({
      //     data: viewData,
      //     time: currentTime,
      //     typeOfCall: "view"
      // }));
    }

  }, [def_data])




  // useEffect(()=>{

  //   setConfig(checklistCreateConfig([{ id: crypto.randomUUID(), parentId: null, level: 1, key: 1, title: null, type: {"code": "SingleValueList"}, value: null, isRequired: false }]));
  // },[])


  const [checklistName, setChecklistName] = useState(`${checklistType} ${role}`);
  // const addChecklistName = (data) => {
  //   setChecklistName(data);
  // }

  const closeToast = () => {
    setShowToast(null);
  };

  useEffect(() => {
    if (showToast) {
      setTimeout(closeToast, 5000);
    }
  }, [showToast]);

  const popShow = () => {
    const pr = organizeQuestions(tempFormData);
    setPreviewData(pr);
    setShowPopUp(!showPopUp);
  };


  // const [clearTrigger, setClearTrigger] = useState(false);
  // const [idd, setIdd] = useState(crypto.randomUUID());

  // const clearData = useCallback(() => {
  //   const newId = crypto.randomUUID();
  //   setIdd(newId);
  //   const cleared_data = [{
  //     id: newId,
  //     parentId: null,
  //     level: 1,
  //     key: 1,
  //     title: null,
  //     type: { "code": "SingleValueList" },
  //     value: null,
  //     isRequired: false,
  //     options: [{
  //       id: crypto.randomUUID(),
  //       key: 1,
  //       parentQuestionId: newId,
  //       label: "OPTION",
  //       optionDependency: false,
  //       optionComment: false,
  //     }]
  //   }];
  //   localStorage.removeItem("questions");
  //   setConfig(checklistCreateConfig(cleared_data, new Date()));
  //   setTempFormData([]);
  //   setTempFormData1([]);
  //   setPreviewData([]);
  //   setClearTrigger(true);
  // }, []);

  // useEffect(() => {
  //   if (clearTrigger) {
  //     // Reset the trigger after the effect has run
  //     setClearTrigger(false);
  //   }
  // }, [clearTrigger]);

  const clearData = () => {
    const currentTime = new Date();
    const newId = crypto.randomUUID();
    // localStorage.removeItem("questions");
    const cleared_data = [{
      id: newId,
      parentId: null,
      level: 1,
      key: 1,
      title: null,
      type: { "code": "SingleValueList" },
      value: null,
      isRequired: true,
      options: [{
        id: crypto.randomUUID(),
        key: 1,
        parentQuestionId: newId,
        label: "OPTION",
        optionDependency: false,
        optionComment: false,
      }]
    }];
    // const cleared_data = [{ id: crypto.randomUUID(), parentId: null, level: 1, key: 1, title: null, type: { "code": "SingleValueList" }, value: null, isRequired: false }];
    setConfig(checklistCreateConfig(cleared_data, currentTime));
  }

  const { defaultData, setDefaultData } = data_hook();

  const useTemplateData = () => {
    const currentTime = new Date();
    setConfig(checklistCreateConfig(mdms, currentTime));
  }


  const onFormValueChange = (ll, formData) => {
    setTempFormData(formData?.createQuestion?.questionData);
  };

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
      isActive: true,
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
      tenantId: tenantId,
      code: idCodeMap[item.id],  // Use the idCodeMap to get the code
      dataType: String(item?.type?.code),
      values: labelsArray,
      required: item?.isRequired,
      isActive: true,
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
    uniqueLocal = local.filter((value, index, self) =>
      index === self.findIndex((t) => JSON.stringify(t) === JSON.stringify(value))
    );
    let fp = final_payload.filter((value, index, self) =>
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
          setShowToast({ label: "CHECKLIST_CREATED_LOCALISATION_ERROR", isError: "true" });
          return; // Exit if localization fails
        }

        // setShowToast({ label: "CHECKLIST_AND_LOCALISATION_CREATED_SUCCESSFULLY"});
        history.push(`/${window.contextPath}/employee/campaign/response?isSuccess=${true}`, {
          message: "ES_CHECKLIST_CREATE_SUCCESS_RESPONSE",
          preText: "ES_CHECKLIST_CREATE_SUCCESS_RESPONSE_PRE_TEXT",
          actionLabel: "ES_CHECKLIST_RESPONSE_ACTION",
          actionLink: `/${window.contextPath}/employee/campaign/my-campaign`,
        });
      } else {
        setShowToast({ label: "CHECKLIST_CREATED_FAILED", isError: "true" });
      }
    } catch (error) {
      // Handle error scenario
      setShowToast({ label: "CHECKLIST_CREATED_FAILED", isError: "true" });
      // console.error("Error creating checklist:", error);
    } finally {
      setSubmitting(false);
    }
  };




  const fieldPairs = [
    { label: "ROLE", value: roleLocal },
    { label: "TYPE_OF_CHECKLIST", value: checklistTypeLocal },
    { label: "CAMPAIGN_NAME", value: campaignName }
  ];
  return (
    <div>
      {loading_new && <Loader />}
      {!loading_new && submitting && <Loader />}
      {!submitting && !loading_new &&
        <div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <h2 style={{ fontSize: "36px", fontWeight: "700" }}>
                {t("CREATE_NEW_CHECKLIST")}
              </h2>
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <Button
                variation="secondary"
                label={t("CLEAR")}
                className={"hover"}
                style={{ marginTop: "2rem", marginBottom: "2rem" }}
                // icon={<AddIcon style={{ height: "1.5rem", width: "1.5rem" }} fill={PRIMARY_COLOR} />}
                onClick={clearData}
              // onClick={useTemplateData}
              />
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
                  label={t("CREATE_CHECKLIST")}
                  onClick={() => {
                    onSubmit(null, 1, tempFormData);
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
                <div style={{ height: "1rem" }}></div>
              </div>
            ))}
            {
              <hr style={{ width: "100%", borderTop: "1px solid #ccc" }} />
            }
            <div style={{ height: "1rem" }}>
            </div>
            <div style={{ display: "flex" }}>
              <div style={{ width: "26%", fontWeight: "500", marginTop: "0.7rem" }}>{t("NAME_OF_CHECKLIST")}</div>
              <TextInput
                disabled={true}
                className="tetxinput-example"
                type={"text"}
                name={t("NAME_OF_CHECKLIST")}
                // value={`${checklistTypeLocal} ${roleLocal}`}
                value={`${clTranslated} ${rlTranslated}`}
                // onChange={(event) => addChecklistName(event.target.value)}
                placeholder={"Checklist Name"}
              />
            </div>
          </Card>
          <FormComposerV2
            showMultipleCardsWithoutNavs={true}
            label={t("CREATE_CHECKLIST")}
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
          />

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
  );
};

export { temp_data, CreateChecklist };
