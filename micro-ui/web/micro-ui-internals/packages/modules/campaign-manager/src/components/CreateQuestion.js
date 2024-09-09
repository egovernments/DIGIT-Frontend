import React, { useState, useEffect, Fragment, useContext } from "react";
import { LabelFieldPair, AddIcon, Button, Card, TextInput, Dropdown } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { DustbinIcon } from "./icons/DustbinIcon";
import { PRIMARY_COLOR } from "../utils";
import { CheckBox, FieldV1 } from "@egovernments/digit-ui-components";
import MultipleChoice from "./MultipleChoice";
import Checkboxes from "./Checkboxes";
import Dropdowns from "./Dropdowns";
import { QuestionContext } from "./CreateQuestionContext";
import { set } from "lodash";

// field selector for multiselect and signle select component.
const FieldSelector = ({ type, name, value, onChange, placeholder = "", t, field, dispatchQuestionData,
  subQclassName,
  subQlevel,
  subQparent,
  subQparentId,
  subQinitialQuestionData,
}) => {
  const [options, setOptions] = useState([
    {
      id: crypto.randomUUID(),
      key: 1,
      parentQuestionId: field.id,
      label: "OPTION",
      optionDependency: false,
      optionComment: false,
    },
  ]);
  useEffect(() => {
    dispatchQuestionData({
      type: "UPDATE_OPTIONS",
      payload: {
        options: options,
        field: field,
      },
    });
  }, [options]);
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
      console.log("param is", param);
      return prev.map((item) => {
        if(item.key == param.id) {
          console.log("para.value is", param.value);
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



  console.log("type of code is", type?.code);
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
        />
      );
      break;
    case "Dropdown":
        console.log("dd");
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
          />
        );
        break;
    default:
      return null;
      break;
  }
};

const CreateQuestion = ({ onSelect, className, level = 1, initialQuestionData, parent = null, parentId = null, optionId}) => {
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
    if(optionId) 
    {
      console.log("par", parent);
      console.log("optionID", optionId);
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
    else{
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

  const deleteField = (index) => {
    dispatchQuestionData({
      type: "DELETE_QUESTION",
      payload: {
        index: index,
      },
    });
  };

  const handleUpdateField = (data, target, index, id) => {
    console.log("the data going is", data);
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
  
  const example={
    maxWidth:"100rem"
  }
  return (
    <React.Fragment>
      {initialQuestionData
        ?.filter((i) => i.level === level && i.parentId === parentId )
        ?.map((field, index) => {
          console.log("intial:", initialQuestionData);
          console.log("current:", field);
          return (
            <Card className={`question-card-container ${className}`}>  
              <LabelFieldPair className="question-label-field" style={{ display: "block" }}>
                <div className="question-label" style={{height:"1.5rem", display:"flex", justifyContent:"space-between", width:"100%"}}>
                  <span>{`${t("Question")} ${index + 1}`}</span>
                  {/* <span className="mandatory-span">*</span> */}
                  {initialQuestionData?.length > 1 && (
                  <>
                    <div className="separator"></div>
                    <div
                      onClick={() => deleteField(field.key)}
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
                    <div className="question-field" style={{ display:"flex", height:"3.5rem", gap:"1.5rem"}}>
                      <TextInput
                        // style={{ maxWidth: "40rem" }}
                        name="title"
                        value={field?.title || ""}
                        onChange={(event) => handleUpdateField(event.target.value, "title", field.key, field.id)}
                        placeholder={"Type your questions here"}
                        className={"example"}
                      />
                      {/* <FieldV1 
                        type="text"
                        value={field?.title || ""}
                        onChange={(event) => handleUpdateField(event.target.value, "title", field.key, field.id)}
                        placeholder={"Type your questions here"}
                      /> */}
                      <Dropdown
                        style={{ width: "20%" }}
                        t={t}
                        option={dataType}
                        optionKey={"code"}
                        selected={field?.type || ""}
                        select={(value) => {
                          handleUpdateField(value, "type", field.key, field.id);
                        }}
                        placeholder="Type"
                      />
                      {parent?.dependency && (
                        <Dropdown
                          style={{ width: "20%" }}
                          t={t}
                          option={parent?.options}
                          optionKey={"label"}
                          selected={field?.dependencyAns || ""}
                          select={(value) => {
                            handleUpdateField(value, "dependencyAns", field.key, field.id);
                          }}
                          placeholder="dependencyAns"
                        />
                      )}
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
                      />
                    )}
                    {
                      (field?.type?.code === "Short Answer") && (
                        <FieldV1
                        className="example"
                        type={"textarea"}
                        populators={{
                          resizeSmart:true
                        }}
                        props={{ fieldStyle: example }}
                        name="Short Answer"
                        value={field.value || ""}
                        onChange={(event) => handleUpdateField(event.target.value, "value", field.key, field.id)}
                        placeholder={""}
                      />
                      )
                      

                    }
                    {field.dependency && (
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
                {/* <CheckBox
                  key={field.key}
                  styles={{ margin: "20px 0 40px", maxWidth: "70%" }}
                  label={t("REQUIRED")}
                  checked={field?.isRequired}
                  onChange={(event) => handleUpdateField(event, "isRequired", field.key, field.id)}
                  // isLabelFirst={true}
                  index={field.key}
                />
                <CheckBox
                  key={field.key}
                  styles={{ margin: "20px 0 40px", maxWidth: "70%" }}
                  label={t("REGEX")}
                  checked={field?.isRegex}
                  onChange={(event) => handleUpdateField(event, "isRegex", field.key, field.id)}
                  // isLabelFirst={true}
                  index={field.key}
                />
                {level < 4 && field?.type?.code && field?.type?.code === "SingleValueList" ? (
                  <CheckBox
                    key={field.key}
                    styles={{ margin: "20px 0 40px", maxWidth: "70%" }}
                    label={t("DEPENDENCY")}
                    checked={field?.dependency}
                    onChange={(event) => handleUpdateField(event, "dependency", field.key, field.id)}
                    // isLabelFirst={true}
                    index={field.key}
                  />
                ) : null} */}
                {/* {initialQuestionData?.length > 1 && (
                  <>
                    <div className="separator"></div>
                    <div
                      onClick={() => deleteField(field.key)}
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
                )} */}
              </div>
            </Card>
          );
        })}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button
          variation="secondary"
          label={t(`ADD_QUESTION`)}
          className={"hover"}
          icon={<AddIcon styles={{ height: "1.5rem", width: "1.5rem" }} fill={PRIMARY_COLOR} />}
          onButtonClick={addMoreField}
        />
      </div>
    </React.Fragment>
  );
};

export default CreateQuestion;
