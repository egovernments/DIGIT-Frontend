import React, { useState, useEffect, Fragment, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { CheckBox, FieldV1, LabelFieldPair, Button, AddIcon, Card, TextInput, Dropdown } from "@egovernments/digit-ui-components";
import MultipleChoice from "./MultipleChoice";
import Checkboxes from "./Checkboxes";
import Dropdowns from "./Dropdowns";
import { QuestionContext } from "./CreateQuestionContext";

const maxDepth = 3;

// Counter for generating unique option IDs
let optionIdCounter = 0;

// Helper function to generate readable option IDs
const generateOptionId = (questionId, optionNumber) => {
  optionIdCounter++;
  return `option_${questionId}_${optionNumber}`;
};

// field selector for multiselect and signle select component.
const FieldSelector = ({ type, name, value, onChange, placeholder = "", t, field, dispatchQuestionData,
  subQclassName,
  subQlevel,
  subQparent,
  subQparentId,
  subQinitialQuestionData,
  typeOfCall,
  parentNumber,
  questionNumber
}) => {

  const [options, setOptions] = useState(() => {
    if (field.options) {
      return field.options;
    } else {
      const defaultOption = {
        id: generateOptionId(field.id, 1),
        key: 1,
        parentQuestionId: field.id,
        label: null,
        optionDependency: false,
        optionComment: false,
      };
      // field.options=[defaultOption];
      // handleAddOption();
      return [defaultOption];
    }
  });

  useEffect(() => {
    dispatchQuestionData({
      type: "UPDATE_OPTIONS",
      payload: {
        options: options,
        field: field,
      },
    });
  }, [options]);

  useEffect(() => {
    // Check if field.options is defined and not equal to the current options
    if (field?.options && JSON.stringify(field.options) !== JSON.stringify(options)) {
      setOptions(field.options);
    }
  }, [field?.options]);

  const handleAddOption = () => {
    setOptions((prev) => {
      return [
        ...prev,
        {
          id: generateOptionId(field.id, prev.length + 1),
          key: prev.length + 1,
          parentQuestionId: field.id,
          label: null,
          optionDependency: false
        },
      ];
    });
  };
  const handleUpdateOption = (param) => {
    setOptions((prev) => {
      return prev.map((item) => {
        if (item.key === param.id) {
          return {
            ...item,
            label: param?.value?.replace(/[.:,]/g, ''),
          };
        }
        return {
          ...item,
        };
      });
    });
  };

  const handleAddComment = (param) => {
    setOptions((prev) => {
      return prev.map((item) => {
        if (item.key == param.id) {
          return {
            ...item,
            comment: param.value,
          };
        }
        return {
          ...item,
        };
      });
    });
  };

  const removeOption = (id) => {
    if (options.length === 1) return null; // Prevent removing the last option

    setOptions((prev) => {
      // Filter out the option with the matching 'id'
      const filteredOptions = prev.filter((option) => option.key !== id);

      // Map the filtered options to reset the 'key' values
      return filteredOptions.map((option, index) => ({
        ...option, // Spread the existing option properties
        key: index + 1, // Reassign the 'key' value based on the new index
      }));
    });
  };

  const handleOptionDependency = (id) => {
    setOptions((prevOptions) => {
      return prevOptions.map((option) => {
        if (option.id === id) {
          // Update the option with the matching ID
          return {
            ...option,
            optionDependency: !option.optionDependency,
          };
        }
        return option;
      });
    });
  };

  const handleOptionComment = (id) => {
    setOptions((prevOptions) => {
      return prevOptions.map((option) => {
        if (option.id === id) {
          // Update the option with the matching ID
          return {
            ...option,
            optionComment: !option.optionComment,
          };
        }
        return option;
      });
    });
  };



  // Handle both object and string types
  const typeCode = typeof type === 'string' ? type : type?.code;
  
  switch (typeCode) {
    case "SingleValueList":
      return (
        <MultipleChoice
          maxLength={60}
          titleHover={t("MAX_LENGTH_60")}
          t={t}
          addOption={handleAddOption}
          updateOption={handleUpdateOption}
          handleOptionDependency={handleOptionDependency}
          handleOptionComment={handleOptionComment}
          removeOption={removeOption}
          addComment={handleAddComment}
          options={options}
          optionsKey="label"
          field={field}
          subQclassName={subQclassName}
          subQlevel={subQlevel}
          subQparent={subQparent}
          subQparentId={subQparentId}
          subQinitialQuestionData={subQinitialQuestionData}
          typeOfCall={typeOfCall}
          parentNumber={parentNumber}
          questionNumber={questionNumber}
          maxDepth={maxDepth}
        />
      );
      break;
    case "MultiValueList":
      return (
        <Checkboxes
          maxLength={60}
          titleHover={t("MAX_LENGTH_60")}
          t={t}
          addOption={handleAddOption}
          updateOption={handleUpdateOption}
          removeOption={removeOption}
          handleOptionDependency={handleOptionDependency}
          handleOptionComment={handleOptionComment}
          addComment={handleAddComment}
          options={options}
          optionsKey="label"
          field={field}
          subQclassName={subQclassName}
          subQlevel={subQlevel}
          subQparent={subQparent}
          subQparentId={subQparentId}
          subQinitialQuestionData={subQinitialQuestionData}
          typeOfCall={typeOfCall}
          parentNumber={parentNumber}
          questionNumber={questionNumber}
          maxDepth={maxDepth}
        />
      );
      break;
    case "Dropdown":
      return (
        <Dropdowns
          maxLength={60}
          titleHover={t("MAX_LENGTH_60")}
          t={t}
          addOption={handleAddOption}
          updateOption={handleUpdateOption}
          removeOption={removeOption}
          handleOptionDependency={handleOptionDependency}
          handleOptionComment={handleOptionComment}
          addComment={handleAddComment}
          options={options}
          optionsKey="label"
          field={field}
          subQclassName={subQclassName}
          subQlevel={subQlevel}
          subQparent={subQparent}
          subQparentId={subQparentId}
          subQinitialQuestionData={subQinitialQuestionData}
          typeOfCall={typeOfCall}
          parentNumber={parentNumber}
          questionNumber={questionNumber}
          maxDepth={maxDepth}
        />
      );
      break;
    case "Text":
      // Text type is now handled in the main component with a separate placeholder input
      return null;
      break;
    default:
      return null;
      break;
  }
};

const CreateQuestion = ({ onSelect, className, level = 1, initialQuestionData, parent = null, parentId = null, optionId, typeOfCall = null, parentNumber = "" }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const {  dispatchQuestionData } = useContext(QuestionContext);
  
  const mdms_context_path = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";

  const reqCriteria = useMemo(() => ({
    url: `/${mdms_context_path}/v2/_search`,
    body: {
      MdmsCriteria: {
        tenantId: tenantId,
        schemaCode: "HCM-ADMIN-CONSOLE.appFieldTypes",
        isActive: true
      }
    }
  }), [tenantId]); // Only recreate if tenantId changes

  // Use the custom hook with memoized criteria
  const { isLoading1, data: mdmsData, isFetching1 } = Digit.Hooks.useCustomAPIHook(reqCriteria);

  // Memoize the dataType array based on the API response
  const dataType = useMemo(() => {
    if (!mdmsData || mdmsData?.mdms?.length == 0) return [
      { code: "SingleValueList", i18nKey:"STUDIO_SINGLE_VALUE" },
      // { code: "MultiValueList", i18nKey:"STUDIO_MULTI_VALUE" },
      { code: "Text", i18nKey:"STUDIO_TEXT" }
    ];
    const apiTypes = mdmsData.mdms?.map(role => ({
      code: role?.data?.code
    })).filter(type => type.code !== "MultiValueList") || [];
    // Add Text option if not already present
    const hasText = apiTypes.some(type => type.code === "Text");
    return hasText ? apiTypes : [...apiTypes, { code: "Text" }];
  }, [mdmsData]); // Only recompute when mdmsData changes

  const regexOption = [
    {
      code: "TEXT_ONLY",
      regex: `^[a-zA-Z]+$`,
    },
    {
      code: "NUMBER_ONLY",
      regex: `^[0-9]+$`,
    },
    {
      code: "ALPHANUMERIC",
      regex: `^[a-zA-Z0-9]+$`,
    },
    {
      code: "MORE_THAN_100",
      regex: `(\b\w+\b\s*){101,}`,
    },
    {
      code: "LEES_THAN_100",
      regex: `^(\w+\s*){1,99}$`,
    },
  ];

  const getQuestionNumber = (index, level, parentNumber) => {
    const currentNumber = index + 1;
    if (parentNumber) {
      return `${parentNumber}.${currentNumber}`;
    }
    return currentNumber.toString();
  };

  useEffect(() => {
    if (level === 1) {
      onSelect("createQuestion", {
        initialQuestionData,
      });
    }
  }, [initialQuestionData]);

  const addMoreField = () => {
    if (optionId) {
      dispatchQuestionData({
        type: "ADD_SUB_QUESTION",
        payload: {
          currentQuestionData: initialQuestionData,
          level: level,
          parent: parent,
          optionId: optionId
        }
      })
    }
    else {
      dispatchQuestionData({
        type: "ADD_QUESTION",
        payload: {
          currentQuestionData: initialQuestionData,
          level: level,
          parent: parent,
        },
      });
    }
  };

  const deleteField = (index, initialQuestionData, id, field) => {
    dispatchQuestionData({
      type: "DELETE_QUESTION",
      payload: {
        index: index,
        initialQuestionData: initialQuestionData,
        id: id
      },
    });
  };

  const handleUpdateField = (data, target, index, id) => {
    // If changing to Text type, automatically set regex to null
    if (target === "type" && (data?.code === "Text" || data === "Text")) {
      // First update the type
      dispatchQuestionData({
        type: "UPDATE_QUESTION",
        payload: {
          data: data,
          target: target,
          index: index,
          id: id,
          parent: parent,
          level: level,
        },
      });
      
      // Then set regex to null
      setTimeout(() => {
        dispatchQuestionData({
          type: "UPDATE_QUESTION",
          payload: {
            data: null,
            target: "regex",
            index: index,
            id: id,
            parent: parent,
            level: level,
          },
        });
      }, 100);
    } else {
      dispatchQuestionData({
        type: "UPDATE_QUESTION",
        payload: {
          data: data,
          target: target,
          index: index,
          id: id,
          parent: parent,
          level: level,
        },
      });
    }
  };

  const handleRequiredField = (id) => {
    dispatchQuestionData({
      type: "UPDATE_REQUIRED",
      payload: {
        id: id
      }
    })
  }

  const example = {
    maxWidth: "100rem"
  }

  const [nextQuestionNumber, setNextQuestionNumber] = useState("1");

  useEffect(() => {
    if (initialQuestionData?.length > 0) {
      const filteredQuestions = initialQuestionData.filter(
        i => i.level === level &&
          (i.parentId ? (i.parentId === parentId) : true) &&
          (i.level <= 3) &&
          (i.isActive === true)
      );

      if (filteredQuestions.length > 0) {
        const lastIndex = filteredQuestions.length - 1;
        const lastQuestionNumber = getQuestionNumber(lastIndex, level, parentNumber);
        const parts = lastQuestionNumber.split(".");
        parts[parts.length - 1] = (parseInt(parts[parts.length - 1], 10) + 1).toString();
        // setNextQuestionNumber(parts.join("."));
        const calculatedNextNumber = parts.join(".");
        
        // If next number would be "1" and we have a parent number, append ".1" to parent number instead
        if (calculatedNextNumber === "1" && parentNumber) {
          setNextQuestionNumber(`${parentNumber}.1`);
        } else {
          setNextQuestionNumber(calculatedNextNumber);
        }
      } else if (parentNumber) {
        // If no questions exist yet but we have a parent number, start with ".1"
        setNextQuestionNumber(`${parentNumber}.1`);
      }
      else
      {
        setNextQuestionNumber("1");
      }
      
    }
  }, [initialQuestionData, level, parentId, parentNumber, getQuestionNumber]);

  let dis = typeOfCall === "view" ? true : false;
  return (
    <React.Fragment>
        {initialQuestionData
          ?.filter((i) => i.level === level && (i.parentId ? (i.parentId === parentId) : true) && (i.level <= maxDepth) && (i.isActive === true))
          ?.map((field, index) => {
            const questionNumber = getQuestionNumber(index, level, parentNumber);
            return (
              <div>
                <Card type={"primary"} variant={"form"} className={`question-card-container ${className}`} style={{ backgroundColor: level % 2 === 0 ? "#FAFAFA" : "#FFFFFF" }}>
                  <LabelFieldPair className="question-label-field" style={{ display: "block" }}>
                    <div className="question-label" style={{ height: "3.5rem", display: "flex", justifyContent: "space-between", width: "100%" }}>
                      <div style={{ display: "flex", gap: "1rem" , alignItems: "center"}}>
                        {/* <span style={{ fontWeight: "700", marginTop: "1rem" }}>{`${t("QUESTION")} ${index + 1}`}</span> */}
                        <span style={{ fontWeight: "700", fontSize: "1.5rem", display: "flex", justifyContent: "center", alignItems: "center" }}>{`${t("STUDIO_CHECKLIST_QUESTION")} ${questionNumber}`}</span>
                        <div style={{ alignItems: "center" }}>
                          <CheckBox
                            disabled={dis}
                            // style={{height:"1rem", alignItems:"center", paddingBottom:"0.5rem"}}
                            key={field.key}
                            mainClassName={"checkboxOptionVariant"}
                            // disabled={optionDependency ? true : false}
                            label={t("REQUIRED")}
                            checked={field?.isRequired}
                            // onChange={handleRequiredField(field.id)}
                            onChange={() => handleRequiredField(field.id)}
                            // isLabelFirst={true}
                            index={field.key}
                          />
                        </div>
                      </div>
                      {/* <span className="mandatory-span">*</span> */}
                      {/* <div style={{ height: "0.5rem" }}> */}
                      {/* </div> */}
                      {!dis && initialQuestionData?.filter(q => q.isActive === true)?.length > 1 && (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Button
                            icon="Delete"
                            iconFill=""
                            label={`${t(`CAMPAIGN_DELETE_QUESTION`)} ${questionNumber}`}
                            onClick={() => deleteField(field.key, initialQuestionData, field.id, field)}
                            size="medium"
                            title=""
                            variation="link"
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="question-field-container">
                        <div className="question-field" style={{ display: "flex", height: "3.5rem", gap: "1.5rem" }}>
                          <TextInput
                            // disabled={dis}
                            nonEditable={dis}
                            isRequired={true}
                            className="tetxinput-example"
                            type={"text"}
                            name="title"
                            value={field?.title || ""}
                            onChange={(event) => handleUpdateField(event.target.value.replace(/[.:]/g, ''), "title", field.key, field.id)}
                            placeholder={t("TYPE_YOUR_QUESTION_HERE")}
                          />
                          {!dis && <Dropdown
                            style={{ width: "20%" }}
                            t={t}
                            option={dataType.filter(type => {
                              const currentTypeCode = field?.type?.code || field?.type;
                              return type.code !== currentTypeCode;
                            })}
                            optionKey={"code"}
                            selected={field?.type || null}
                            select={(value) => {
                              handleUpdateField(value, "type", field.key, field.id);
                            }}
                            placeholder="Type"
                            isSearchable={false}
                          />}
                        </div>
                        {field?.isRegex && (field?.type?.code !== "Text" && field?.type !== "Text") && (
                          <Dropdown
                            style={{ width: "70%" }}
                            t={t}
                            option={regexOption}
                            optionKey={"code"}
                            selected={field?.regex || null}
                            select={(value) => {
                              handleUpdateField(value, "regex", field.key, field.id);
                            }}
                            placeholder="Choose Regex"
                          />
                        )}
                        {(field?.type?.code === "SingleValueList" || field?.type?.code === "MultiValueList" || field?.type?.code === "Dropdown" || field?.type === "SingleValueList" || field?.type === "MultiValueList" || field?.type === "Dropdown") && (
                          <FieldSelector
                            t={t}
                            type={field?.type}
                            name={"value"}
                            value={field?.value || ""}
                            onChange={(event) => handleUpdateField(event.target.value, "value", field?.key, field.id)}
                            placeholder={"Answer"}
                            dispatchQuestionData={dispatchQuestionData}
                            field={field}
                            subQclassName="subSection"
                            subQlevel={level + 1}
                            subQparent={field}
                            subQparentId={field.id}
                            subQinitialQuestionData={initialQuestionData}
                            typeOfCall={typeOfCall}
                            parentNumber={questionNumber}
                            ind={index}
                            questionNumber={questionNumber}
                          />
                        )}
                        {(field?.type?.code === "Text" || field?.type === "Text") && (
                          <div style={{ marginTop: "1rem" }}>
                            <TextInput
                              nonEditable={false}
                              type={"text"}
                              name="placeholder"
                              value={field?.value || ""}
                              onChange={(event) => handleUpdateField(event.target.value.replace(/[.:]/g, ''), "value", field?.key, field.id)}
                              placeholder="Enter placeholder text (e.g., abc)"
                              label="Placeholder Text"
                            />
                          </div>
                        )}
                        {
                          (field?.type?.code === "Short Answer" || field?.type === "Short Answer") && (
                            <FieldV1
                              nonEditable={dis}
                              // disabled={dis}
                              className="example"
                              type={"textarea"}
                              populators={{
                                resizeSmart: true
                              }}
                              props={{ fieldStyle: example }}
                              name="Short Answer"
                              value={field.value || ""}
                              onChange={(event) => handleUpdateField(event.target.value, "value", field.key, field.id)}
                              placeholder={""}
                            />
                          )
                        }
                        {!dis && (field.dependency || field?.hasDependency) && (
                          <CreateQuestion
                            onSelect={onSelect}
                            className="subSection"
                            level={level + 1}
                            parent={field}
                            parentId={field.id}
                            initialQuestionData={initialQuestionData} // Pass sub-questions data to nested component
                            parentNumber={questionNumber}
                          >
                          </CreateQuestion>
                        )}
                      </div>
                    </div>
                  </LabelFieldPair>
                  <div className="heading-bar">
                  </div>
                </Card>
                <div style={{ height: "1rem" }}></div>
              </div>
            );
          })}
        {!dis && level<=maxDepth && (<div style={{ display: "flex", justifyContent: "center", marginBottom: "0.9rem" }}>
          <Button
            variation="secondary"
            size="medium"
            label={`${t("ADD_QUESTION")} ${nextQuestionNumber}`}
            className={"hover"}
            icon="Add"
            iconFill=""
            onClick={() => addMoreField()}
            textStyles={{ width: 'unset' }}
          />
        </div>)
        }
    </React.Fragment>
  );
};

export default CreateQuestion;
