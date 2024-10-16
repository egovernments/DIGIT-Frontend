import React, { useState, useEffect, Fragment, useContext } from "react";
import {  } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { DustbinIcon } from "./icons/DustbinIcon";
import { PRIMARY_COLOR } from "../utils";
import { CheckBox, FieldV1, LabelFieldPair, Button, AddIcon, Card, TextInput, Dropdown } from "@egovernments/digit-ui-components";
import MultipleChoice from "./MultipleChoice";
import Checkboxes from "./Checkboxes";
import Dropdowns from "./Dropdowns";
import { QuestionContext } from "./CreateQuestionContext";
import { set } from "lodash";
import { temp_data, CreateChecklist } from "../pages/employee/CreateChecklist"

// field selector for multiselect and signle select component.
const FieldSelector = ({ type, name, value, onChange, placeholder = "", t, field, dispatchQuestionData,
  subQclassName,
  subQlevel,
  subQparent,
  subQparentId,
  subQinitialQuestionData,
  typeOfCall
}) => {

  const [options, setOptions] = useState(() => {
    if (field.options) {
      return field.options;
    } else {
      const defaultOption = {
        id: crypto.randomUUID(),
        key: 1,
        parentQuestionId: field.id,
        label: "OPTION",
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
          id: crypto.randomUUID(),
          key: prev.length + 1,
          parentQuestionId: field.id,
          label: `OPTION`,
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
            label: param?.value,
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



  switch (type?.code) {
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
        />
      );
      break;
    default:
      return null;
      break;
  }
};

const CreateQuestion = ({ onSelect, className, level = 1, initialQuestionData, parent = null, parentId = null, optionId, typeOfCall=null }) => {
  const { t } = useTranslation();
  const state = Digit.ULBService.getStateId();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  let user = Digit.UserService.getUser();
  const searchParams = new URLSearchParams(location.search);
  const projectType = searchParams.get("type");
  const projectName = searchParams.get("name");
  const flow = searchParams.get("flow");
  const role = searchParams.get("role");
  let locale = Digit?.SessionStorage.get("initData")?.selectedLanguage || "en_IN";
  const { questionData, dispatchQuestionData } = useContext(QuestionContext);
  const dataType = [
    // { code: "String" },
    { code: "SingleValueList" },
    { code: "MultiValueList" },
    { code: "Short Answer" },
    { code: "Dropdown" }
  ];
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
  };

  const example = {
    maxWidth: "100rem"
  }
  
  let dis = typeOfCall === "view" ? true : false;
  console.log("type fof call", typeOfCall);
  console.log("dis", dis);
  return (
    <React.Fragment>
      {initialQuestionData
        ?.filter((i) => i.level === level && (i.parentId ? (i.parentId === parentId) : true))
        ?.map((field, index) => {
          return (
            <Card type={"primary"} variant={"form"} className={`question-card-container ${className}`}>
              <LabelFieldPair className="question-label-field" style={{ display: "block" }}>
                <div className="question-label" style={{ height: "1.5rem", display: "flex", justifyContent: "space-between", width: "100%" }}>
                  <span style={{fontWeight:"700"}}>{`${t("QUESTION")} ${index + 1}`}</span>
                  {/* <span className="mandatory-span">*</span> */}
                  <div style={{ height: "1rem" }}>
                  </div>
                  {!dis && initialQuestionData?.length > 1 && (
                    <>
                      <div className="separator"></div>
                      <div
                        onClick={() => deleteField(field.key, initialQuestionData, field.id, field)}
                        style={{
                          cursor: "pointer",
                          fontWeight: "600",
                          // marginLeft: "1rem",
                          fontSize: "1rem",
                          color: PRIMARY_COLOR,
                          display: "flex",
                          flexDirection: "row-reverse",
                          gap: "0.5rem",
                          alignItems: "center",
                          // marginTop: "1rem",
                        }}
                      >
                        <DustbinIcon />
                        {t(`CAMPAIGN_DELETE_ROW_TEXT`)}
                      </div>
                    </>
                  )}
                </div>
                <div>
                  <div className="question-field-container">
                    <div className="question-field" style={{ display: "flex", height: "3.5rem", gap: "1.5rem" }}>
                      {/* <TextInput
                        // style={{ maxWidth: "40rem" }}
                        name="title"
                        value={field?.title || ""}
                        onChange={(event) => handleUpdateField(event.target.value, "title", field.key, field.id)}
                        placeholder={"Type your questions here"}
                        className={"example"}
                      /> */}
                      <TextInput
                          disabled={dis}
                          isRequired={true}
                          className="tetxinput-example"
                          type={"text"}
                          // props={{ fieldStyle: example }}
                          name="title"
                          value={field?.title || ""}
                          onChange={(event) => handleUpdateField(event.target.value, "title", field.key, field.id)}
                          placeholder={"Type your question here"}
                        />
                      {!dis && <Dropdown
                        style={{ width: "20%" }}
                        t={t}
                        option={dataType}
                        optionKey={"code"}
                        selected={field?.type || ""}
                        select={(value) => {
                          handleUpdateField(value, "type", field.key, field.id);
                        }}
                        placeholder="Type"
                      />}
                    </div>
                    {field?.isRegex && (
                      <Dropdown
                        style={{ width: "70%" }}
                        t={t}
                        option={regexOption}
                        optionKey={"code"}
                        selected={field?.regex || ""}
                        select={(value) => {
                          handleUpdateField(value, "regex", field.key, field.id);
                        }}
                        placeholder="Choose Regex"
                      />
                    )}
                    {(field?.type?.code === "SingleValueList" || field?.type?.code === "MultiValueList" || field?.type?.code === "Dropdown") && (
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
                      />
                    )}
                    {
                      (field?.type?.code === "Short Answer") && (
                        <FieldV1
                          disabled="true"
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
                    {!dis && field.dependency && (
                      <CreateQuestion
                        onSelect={onSelect}
                        className="subSection"
                        level={level + 1}
                        parent={field}
                        parentId={field.id}
                        initialQuestionData={initialQuestionData} // Pass sub-questions data to nested component
                      >
                      </CreateQuestion>
                    )}
                  </div>
                </div>
              </LabelFieldPair>
              <div className="heading-bar">
              </div>
            </Card>
          );
        })}
      {!dis && <div style={{ display: "flex", justifyContent: "center" }}>
        <Button
          variation="secondary"
          label={t("ADD_QUESTION")}
          className={"hover"}
          // icon={<AddIcon styles={{ height: "1.5rem", width: "1.5rem" }} fill={PRIMARY_COLOR} />}
          icon="Add"
          iconFill=""
          // onButtonClick={addMoreField}
          onClick={()=>addMoreField()}
          textStyles={{width:'unset'}}
        />
      </div>}
    </React.Fragment>
  );
};

export default CreateQuestion;
