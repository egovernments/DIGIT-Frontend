import React, { useEffect, useState, createContext, useContext } from "react";
import { ViewCardFieldPair, Toast, Card, TextBlock, Button, PopUp, CardText, FieldV1 } from "@egovernments/digit-ui-components";
import { FormComposerV2, LabelFieldPair, TextInput } from "@egovernments/digit-ui-react-components";

import { checklistCreateConfig } from "../../configs/checklistCreateConfig";
import { useTranslation } from "react-i18next";
import CreateQuestion from "../../components/CreateQuestion";
import PreviewComponent from "../../components/PreviewComponent";
import { set } from "lodash";
import { value } from "jsonpath";
import data_hook from "../../hooks/data_hook";
import def from "ajv/dist/vocabularies/discriminator";
import { QuestionContext } from "../../components/CreateQuestionContext";
// import { LabelFieldPair } from "@egovernments/digit-ui-react-components";

let temp_data=[]

const CreateChecklist = () => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const searchParams = new URLSearchParams(location.search);
  const [showToast, setShowToast] = useState(null);
  const checklistType = searchParams.get("type");
  const projectName = searchParams.get("name");
  const flow = searchParams.get("flow");
  const role = searchParams.get("role");
  const campaignName = searchParams.get("name");
  let module = searchParams.get("module");
  const [showPopUp, setShowPopUp] = useState(false);
  const [tempFormData, setTempFormData] = useState([]);
  const [tempFormData1, setTempFormData1] = useState([]);
  const [config, setConfig] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  let locale = Digit?.SessionStorage.get("initData")?.selectedLanguage || "en_IN";
  const { mutate } = Digit.Hooks.campaign.useCreateChecklist(tenantId);
  const data = [
    {
        "id": "1e6e6c1f-1f2f-4a8a-9672-43396c6c9a1c",
        "parentId": null,
        "level": 1,
        "key": 1,
        "title": "q111",
        "type": {
            "code": "SingleValueList"
        },
        "value": null,
        "isRequired": false,
        "options": [
            {
                "id": "7e241cbf-03a2-4453-bf0e-200cdda5f390",
                "key": 1,
                "parentQuestionId": "1e6e6c1f-1f2f-4a8a-9672-43396c6c9a1c",
                "label": "OPTION a",
                "optionDependency": false,
                "optionComment": false
            },
            {
                "id": "dec73afa-7c0d-48b1-9d53-8601c6264b90",
                "key": 2,
                "parentQuestionId": "1e6e6c1f-1f2f-4a8a-9672-43396c6c9a1c",
                "label": "OPTION aa",
                "optionDependency": false
            }
        ]
    },
    {
        "id": "0cff9846-fc98-4e71-a783-27dbb922c99f",
        "level": 1,
        "parentId": null,
        "key": 2,
        "title": "q2",
        "type": {
            "code": "SingleValueList"
        },
        "value": null,
        "isRequired": false,
        "options": [
            {
                "id": "b2768f1e-e0b5-428f-9d11-12fc5b10b1ac1",
                "key": 1,
                "parentQuestionId": "0cff9846-fc98-4e71-a783-27dbb922c99f",
                "label": "OPTION test",
                "optionDependency": false,
                "optionComment": false

            },
            {
                "id": "b2768f1e-e0b5-428f-9d11-12fc5b10b1ac",
                "key": 2,
                "parentQuestionId": "0cff9846-fc98-4e71-a783-27dbb922c99f",
                "label": "OPTION b",
                "optionDependency": true,
                "optionComment": false
            },
            {
                "id": "26dd50f9-db87-469b-8be4-22012cc22284",
                "key": 3,
                "parentQuestionId": "0cff9846-fc98-4e71-a783-27dbb922c99f",
                "label": "OPTION bb",
                "optionDependency": false
            }
        ]
    },
    {
        "id": "33de07ec-038e-42df-a557-bb5fcd374dd5",
        "level": 1,
        "parentId": null,
        "key": 3,
        "title": "q3",
        "type": {
            "code": "SingleValueList"
        },
        "value": null,
        "isRequired": false,
        "options": [
            {
                "id": "f1d6782f-7e0a-49ba-a1fc-bbf4ed1f1e4f",
                "key": 1,
                "parentQuestionId": "33de07ec-038e-42df-a557-bb5fcd374dd5",
                "label": "OPTION c",
                "optionDependency": false,
                "optionComment": false
            },
            {
                "id": "f2514582-d13f-4340-ae5e-fe7f8aca4212",
                "key": 2,
                "parentQuestionId": "33de07ec-038e-42df-a557-bb5fcd374dd5",
                "label": "OPTION cc",
                "optionDependency": false
            }
        ]
    },
    {
        "id": "f85d589e-7cc0-4993-a8fe-37e854d2b189",
        "level": 2,
        "parentId": "b2768f1e-e0b5-428f-9d11-12fc5b10b1ac",
        "key": 4,
        "title": "q2.q",
        "type": {
            "code": "SingleValueList"
        },
        "value": null,
        "isRequired": false,
        "options": [
            {
                "id": "80677c1c-59e4-4bf0-81b3-ee244cafd128",
                "key": 1,
                "parentQuestionId": "f85d589e-7cc0-4993-a8fe-37e854d2b189",
                "label": "OPTION adfasdfasd",
                "optionDependency": false,
                "optionComment": false
            },
            {
                "id": "cecf0f88-60da-4c51-8501-cf4a4f473a66",
                "key": 2,
                "parentQuestionId": "f85d589e-7cc0-4993-a8fe-37e854d2b189",
                "label": "OPTION asdfasf",
                "optionDependency": false
            }
        ]
    }
];

  module = "HCM";
  const { mutate: localisationMutate } = Digit.Hooks.campaign.useUpsertLocalisation(tenantId, module, locale);

  let processedData = [];
  useEffect(()=>{
    setConfig(checklistCreateConfig([{ id: crypto.randomUUID(), parentId: null, level: 1, key: 1, title: null, type: {"code": "SingleValueList"}, value: null, isRequired: false }]));
  },[])


  const [checklistName, setChecklistName] = useState("");
  const addChecklistName = (data) => {
    console.log("the checklist name is", data);
    setChecklistName(data);
  }

  const closeToast = () => {
    setShowToast(null);
  };

  useEffect(() => {
    if (showToast) {
      setTimeout(closeToast, 5000);
    }
  }, [showToast]);

  const popShow = () => {
    setPreviewData(organizeQuestions(tempFormData));
    console.log("data going in preview is", previewData);
    setShowPopUp(!showPopUp);
    console.log(showPopUp);
  };

  const { defaultData, setDefaultData } = data_hook();

  const useTemplateData = () => {
    console.log("button clicked");
    setConfig(checklistCreateConfig(data));
    console.log("in first component data is", defaultData);
  }

  useEffect(()=>{
    console.log("config changed", config);
  }, config);

  const onFormValueChange = (ll, formData) => {
    // console.log("changing form data is:", formData);
    setTempFormData(formData?.createQuestion?.questionData);
    // setTempFormData1(formData);
  };

  function organizeQuestions(questions) {
    // Create a map to store each question and option by its ID for quick lookup
    const questionMap = new Map();
    const optionMap = new Map();

    // Initialize a list to hold the top-level questions (those without a parent)
    const organizedQuestions = [];

    // First pass: Populate the maps with questions and options
    questions?.forEach((question) => {
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
    questions?.forEach((question) => {
      if (question.parentId) {
        // Try to find the parent in questionMap or optionMap
        const parentQuestion = questionMap.get(question.parentId);
        const parentOption = optionMap.get(question.parentId);

        if (parentQuestion) {
          // Parent is a question, add current question to its subQuestions
          parentQuestion.subQuestions.push(question);
        } else if (parentOption) {
          // Parent is an option, add current question to its subQuestions
          parentOption.subQuestions.push(question);
        }
      } else {
        // If the question has no parentId, it is a top-level question
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
      const obj = {
        "code": String(code),
        "message": String(question.title),
        "module": module,
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
          option.label = transformedString;
          const obj = {
            "code": String(option.label),
            "message": String(optionval),
            "module": module, // to be dynamic
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

    console.log("what i have to work on data is:", data);
    processedData = organizeQuestions(data);
    let { codes, local } = generateCodes(processedData);
    // let codes = generateCodes(processedData);
    let final_payload = transformQuestions(processedData, tenantId, codes);
    uniqueLocal = local.filter((value, index, self) =>
      index === self.findIndex((t) => JSON.stringify(t) === JSON.stringify(value))
    );

    console.log("localization data us", uniqueLocal);
    console.log("processed data is:", processedData);
    console.log("codes are:", codes);
    console.log("final payload is:", final_payload);
    console.log("localization codes are:", uniqueLocal);
    let code_of_checklist = `${projectName}.${checklistType}.${role}`;
    console.log("code of the checklist is:", code_of_checklist);
    return {
      tenantId: tenantId,
      // code: role,
      code: code_of_checklist,
      isActive: true,
      attributes: final_payload,
      additionalDetails: {
        name: checklistName,
        type: checklistType,
        role: role
      },

    }
  };

  const onSubmit = async (formData, flag = 0, preview = null) => {
    console.log("formData", formData);
    let payload;
    if (flag === 1) payload = payloadData(preview);
    else payload = payloadData(formData?.createQuestion?.questionData);
    await mutate(payload, {
      onError: (error, variables) => {
        setShowToast({ label: "CHECKLIST_CREATED_FAILED" });
      },
      onSuccess: async (data) => {
        // module="HCM";
        console.log("modeule is", module);
        if (true) {
          console.log("hehebcbcbc", uniqueLocal);

          // const localisations = addLocal(formData?.createQuestion?.questionData);
          const localisations = uniqueLocal;
          await localisationMutate(localisations, {
            onError: (error, variables) => {
              setShowToast({ label: "CHECKLIST_CREATED_LOCALISATION_ERROR" });
            },
            onSuccess: async (data) => {
              setShowToast({ label: "CHECKLIST_AND_LOCALISATION_CREATED_SUCCESSFULLY" });
            },
          });
        } else {
          setShowToast({ label: "CHECKLIST_CREATED_SUCCESSFULLY" });
        }
      },
    });
  };

  const fieldPairs = [
    { label: "Role", value: role },
    { label: "Type of Checklist", value: checklistType },
    { label: "Campaign Name", value: campaignName }
  ];
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <h2 style={{ fontSize: "36px" }}>
            Create New Checklist
          </h2>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Button
            variation="secondary"
            label="Use Template"
            className={"hover"}
            style={{ marginTop: "2rem", marginBottom: "2rem" }}
            // icon={<AddIcon style={{ height: "1.5rem", width: "1.5rem" }} fill={PRIMARY_COLOR} />}
            onClick={useTemplateData}
          />
          <Button
            variation="secondary"
            label="Preview Checklist"
            className={"hover"}
            style={{ marginTop: "2rem", marginBottom: "2rem" }}
            // icon={<AddIcon style={{ height: "1.5rem", width: "1.5rem" }} fill={PRIMARY_COLOR} />}
            onClick={popShow}
          />
        </div>
      </div>
      {showPopUp && (
        <PopUp
          className={"boundaries-pop-module"}
          type={"default"}
          heading={"checklist preview"}
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
          <PreviewComponent
            questionsArray={previewData}></PreviewComponent>
        </PopUp>
      )}
      <Card type={"primary"} variant={"viewcard"} className={"example-view-card"}>
        {fieldPairs.map((pair, index) => (
          <ViewCardFieldPair
            key={index} // Provide a unique key for each item
            className=""
            inline
            label={pair.label} // Dynamically set the label
            value={pair.value} // Dynamically set the value
          // style={{ fontSize: "16px", fontWeight: "bold" }} // Optional: customize styles
          />
        ))}
        <div style={{ height: "2rem" }}>
        </div>
        <div style={{ display: "flex" }}>
          <div style={{ width: "27%", fontWeight: "500", marginTop: "0.7rem" }}>Name of Checklist</div>
          <FieldV1
            type={"text"}
            populators={{
              resizeSmart: false
            }}
            name="Name of Checklist"
            value={checklistName || ""}
            onChange={(event) => addChecklistName(event.target.value)}
            placeholder={""}
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
  );
};

export { temp_data, CreateChecklist };

