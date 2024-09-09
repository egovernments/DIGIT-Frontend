import React, { useEffect, useState } from "react";
import { ViewCardFieldPair,Toast, Card, TextBlock, Button, PopUp, CardText} from "@egovernments/digit-ui-components";
import { FormComposerV2, LabelFieldPair } from "@egovernments/digit-ui-react-components";
import { checklistCreateConfig } from "../../configs/checklistCreateConfig";
import { useTranslation } from "react-i18next";
import CreateQuestion from "../../components/CreateQuestion";
import PreviewComponent from "../../components/PreviewComponent";
// import { LabelFieldPair } from "@egovernments/digit-ui-react-components";

const CreateChecklist = () => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const searchParams = new URLSearchParams(location.search);
  const [showToast, setShowToast] = useState(null);
  const projectType = searchParams.get("type");
  const projectName = searchParams.get("name");
  const flow = searchParams.get("flow");
  const role = searchParams.get("role");
  const module = searchParams.get("module");
  const [showPopUp, setShowPopUp] = useState(false);
  const [tempFormData, setTempFormData] = useState([]);
  const [tempFormData1, setTempFormData1] = useState([]);
  const [previewData, setPreviewData] = useState([]);
  let locale = Digit?.SessionStorage.get("initData")?.selectedLanguage || "en_IN";
  const { mutate } = Digit.Hooks.campaign.useCreateChecklist(tenantId);
  const { mutate: localisationMutate } = Digit.Hooks.campaign.useUpsertLocalisation(tenantId);
  
  let processedData=[];

  const closeToast = () => {
    setShowToast(null);
  };

  // useEffect(()=> {
  //   console.log("updated form data is",formData);
  // }, [formData]);

  useEffect(() => {
    if (showToast) {
      setTimeout(closeToast, 5000);
    }
  }, [showToast]);

  const popShow = ()=> {
    // const tempVal = organizeQuestions(tempFormData); 
    setPreviewData(organizeQuestions(tempFormData));
    console.log("data going in preview is", previewData);
    // setTempFormData(tempVal);
    setShowPopUp(!showPopUp);
    console.log(showPopUp);
  };

  const onFormValueChange = (ll, formData) => {
    console.log("changing form data is:", formData);
    setTempFormData(formData?.createQuestion?.questionData);
    // setTempFormData1(formData);
  };

  // creating localisation data payload 
  const addLocal = (data) => {
    return data?.map((item, index) => {
      return {
        code: `${projectType?.toUpperCase()}${tenantId?.toUpperCase()}.${projectName?.toUpperCase()}.${flow.toUpperCase()}.${role.toUpperCase()}.SM${
          item?.key
        }`,
        message: item?.title,
        locale: locale,
        module: module,
      };
    });
  };

  const buildCode = (item, data) => {
    if (!item.parentId) {
        return `SM${item.key}`;
    }

    const parentItem = data.find(parent => parent.id === item.parentId);
    const parentCode = buildCode(parentItem, data);
    const dependencyLabel = item.dependencyAns?.label || ''; // Access the current item's dependencyAns.label

    return `${parentCode}${dependencyLabel ? '.' + dependencyLabel : ''}.SM${item.key}`;
};
  // const payloadData = (data) => {

  //   // attributes structure needs to be redefine for dependency checklist  
  //   const attributes = data?.map((item, index) => {
  //     const code = buildCode(item, data);

  //   console.log("code" , code);
  //     return {
  //       tenantId: tenantId,
  //       code: code,
  //       dataType: item?.type?.code,
  //       values: item?.value,
  //       required: item?.isRequired,
  //       isActive: true,
  //       reGex: item?.isRegex ? item?.regex?.regex : null,
  //       order: item?.key,
  //       additionalDetails: {},
  //     };
  //   });
  //   return {
  //     tenantId: tenantId,
  //     code: role,
  //     isActive: true,
  //     attributes: attributes,
  //     additionalDetails: {},
  //   };
  // };

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
              "module": "HCM", // to be dynamic
              "locale": "en_mz" //to be dynamic
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
  
    return {codes: codes, local:local};
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
    if(item?.options) labelsArray = item?.options.map(option => option?.label);
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

  const payloadData = (data) => {

    processedData = organizeQuestions(data);
    let {codes, local} = generateCodes(processedData);
    // let codes = generateCodes(processedData);
    let final_payload = transformQuestions(processedData, tenantId, codes);
    let uniqueLocal = local.filter((value, index, self) =>
      index === self.findIndex((t) => JSON.stringify(t) === JSON.stringify(value))
    );
    console.log("processed data is:",processedData);
    console.log("codes are:", codes);
    console.log("final payload is:", final_payload);
    console.log("localization codes are:", uniqueLocal);
    let role1= "HCM_TEST";
    return {
      tenantId: tenantId,
      // code: role,
      code: role1,
      isActive: true,
      attributes: final_payload,
      additionalDetails: {},

    }


    // attributes structure needs to be redefine for dependency checklist  
    // const attributes = data?.map((item, index) => {
    //   const code = buildCode(item, data);

    // console.log("code" , code);
    //   return {
    //     tenantId: tenantId,
    //     code: code,
    //     dataType: item?.type?.code,
    //     values: item?.value,
    //     required: item?.isRequired,
    //     isActive: true,
    //     reGex: item?.isRegex ? item?.regex?.regex : null,
    //     order: item?.key,
    //     additionalDetails: {},
    //   };
    // });
    // return {
    //   tenantId: tenantId,
    //   code: role,
    //   isActive: true,
    //   attributes: attributes,
    //   additionalDetails: {},
    // };
  };
  

  // on submit creating checklist. After success adding localisation
  // const onSubmit = async (formData) => {
  //   console.log("formData" , formData);
  //   const payload = payloadData(formData?.createQuestion?.questionData);
  //   await mutate(payload, {
  //     onError: (error, variables) => {
  //       setShowToast({ label: "CHECKLIST_CREATED_FAILED" });
  //     },
  //     onSuccess: async (data) => {
  //       if (module) {
  //         const localisations = addLocal(formData?.createQuestion?.questionData);
  //         await localisationMutate(localisations, {
  //           onError: (error, variables) => {
  //             setShowToast({ label: "CHECKLIST_CREATED_LOCALISATION_ERROR" });
  //           },
  //           onSuccess: async (data) => {
  //             setShowToast({ label: "CHECKLIST_AND_LOCALISATION_CREATED_SUCCESSFULLY" });
  //           },
  //         });
  //       } else {
  //         setShowToast({ label: "CHECKLIST_CREATED_SUCCESSFULLY" });
  //       }
  //     },
  //   });
  // };
  const onSubmit = async (formData, flag = 0, preview = null) => {
    console.log("formData" , formData);
    let payload;
    if(flag === 1) payload = payloadData(preview);
    else payload = payloadData(formData?.createQuestion?.questionData);
    await mutate(payload, {
      onError: (error, variables) => {
        setShowToast({ label: "CHECKLIST_CREATED_FAILED" });
      },
      onSuccess: async (data) => {
        if (module) {
          const localisations = addLocal(formData?.createQuestion?.questionData);
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
    { label: "Type", value: projectType }
  ];
  return (
    <div>
      <div  style={{display:"flex", justifyContent:"space-between"}}>
        <div>
        <h2 style={{fontSize: "36px"}}>
          Create New Checklist
        </h2>
        </div>
        <Button
          variation="secondary"
          label="Preview Checklist"
          className={"hover"}
          style={{marginTop:"2rem", marginBottom:"2rem"}}
          // icon={<AddIcon style={{ height: "1.5rem", width: "1.5rem" }} fill={PRIMARY_COLOR} />}
          onClick={popShow}
        />


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
        
        <ViewCardFieldPair
          className=""
          inline
          label="Label"
          style={{}}
          value="Value"
        />
      </Card>
      <FormComposerV2
        showMultipleCardsWithoutNavs={true}
        label={t("CREATE_CHECKLIST")}
        config={checklistCreateConfig?.map((config) => {
          return {
            ...config,
          };
        })}
        onSubmit={onSubmit}
        fieldStyle={{ marginRight: 0 }}
        noBreakLine={true}
        cardClassName={"page-padding-fix"}
        onFormValueChange={onFormValueChange}
        actionClassName={"checklistCreate"}
        // noCardStyle={currentKey === 4 || currentStep === 7 || currentStep === 0 ? false : true}
        noCardStyle={false}
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

export default CreateChecklist;
