import { CloseSvg } from "@egovernments/digit-ui-react-components";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { CheckBox } from "@egovernments/digit-ui-components";
import CreateQuestion from "./CreateQuestion";
import { DustbinIcon } from "./icons/DustbinIcon";
import { FieldV1, Button} from "@egovernments/digit-ui-components";

const MultipleChoice = ({
  t,
  options,
  optionsKey,
  updateOption,
  addOption,
  removeOption,
  createNewSurvey,
  isPartiallyEnabled,
  formDisabled,
  inputRef,
  maxLength,
  titleHover,
  isInputDisabled,
  labelstyle,
  field,
  handleOptionDependency,
  subQclassName,
  subQlevel,
  subQparent,
  subQparentId,
  subQinitialQuestionData,
  addComment,
  handleOptionComment,
}) => {
  return (
    <div>
      {options.map((item, index) => (
        <>
         <RadioButtonOption
            key={item.key}
            index={item.key}
            title={item?.[optionsKey]}
            updateOption={updateOption}
            removeOption={removeOption}
            maxLength={maxLength}
            titleHover={titleHover}
            inputRef={inputRef}
            labelstyle={labelstyle}
            isPartiallyEnabled={isPartiallyEnabled}
            isInputDisabled={isInputDisabled}
            formDisabled={formDisabled}
            field={field}
            handleOptionDependency={handleOptionDependency}
            optionId={item.id}
            optionDependency={item.optionDependency}
            optionComment={item.optionComment}
            t={t}
            addComment={addComment}
            handleOptionComment={handleOptionComment}
          ></RadioButtonOption>
          {item.optionComment && <FieldV1
            // className="example"
            type={"textarea"}
            populators={{
              resizeSmart:true
            }}
            // props={{ fieldStyle: example }}
            name="Short Answer"
            value={item.comment || ""}
            onChange={(event) => addComment({value: event.target.value, target: "value", id: item.key, parentId: field.id})}
            placeholder={""}
          />}
          {item.optionDependency && (
            <>
              {/* JavaScript logic goes here */}

              
              {/* JSX for rendering the component */}
              <CreateQuestion
                className={subQclassName}
                level={subQlevel}
                parent={item}
                parentId={item.id}
                initialQuestionData={subQinitialQuestionData}
                optionId={item.id}
              />
            </>
          )}
          {
            <hr style={{ width: "100%", borderTop: "1px solid #ccc" }} />
          }
        </>
      ))}
      <div>
      <Button
        className="custom-class"
        icon="AddIcon"
        iconFill=""
        label={t("ADD_OPTIONS")}
        onClick={() => addOption()}
        size="medium"
        title=""
        variation="teritiary"
        textStyles={{width:'unset'}}
      />
      </div>
    </div>
  );
};      

export default MultipleChoice;

export const RadioButtonOption = ({
  index,
  title,
  updateOption,
  removeOption,
  maxLength,
  titleHover,
  inputRef,
  labelstyle,
  isPartiallyEnabled,
  isInputDisabled,
  formDisabled,
  disableDelete = false,
  field,
  handleOptionDependency,
  optionId,
  optionDependency,
  optionComment,
  t,
  addComment,
  handleOptionComment
}) => {
  // const [optionTitle, setOptionTitle] = useState(title);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div>
      <div key={index} className="optionradiobtnwrapper" style={{justifyContent:"space-between", height:"3rem"}}>
        <div style={{display:"flex"}}>
          <input type="radio" className="customradiobutton" disabled={isInputDisabled} style={{marginTop:"0.7rem"}}/>
          <input
            type="text"
            ref={inputRef}
            value={title}
            onChange={(ev) => updateOption({ value: ev.target.value, id: index })}
            onBlur={() => setIsFocused(false)}
            onFocus={() => setIsFocused(true)}
            className={isFocused ? "simple_editable-input" : "simple_readonly-input"}
            maxLength={maxLength}
            title={titleHover}
            disabled={isPartiallyEnabled ? !isPartiallyEnabled : formDisabled}
          />
        </div>
        <div style={{display:"flex", gap:"1rem", alignItems:"center"}}>
          {
            <>
              <CheckBox
              key={field.key}
              mainClassName={"checkboxOptionVariant"}
              disabled={optionDependency ? true: false}
              // styles={{ margin: "0px 0px 0px", maxWidth: "70%",  }}
              // className={"digit-checkbox-containe  r"}
              label={t("ADD_COMMENT_(OR)")}
              checked={optionComment}
              onChange={(event) => handleOptionComment(optionId)}
              // isLabelFirst={true}
              index={field.key}
            />
          </>
          }
          {
            <>
              <CheckBox
              key={field.key}
              mainClassName={"checkboxOptionVariant"}
              disabled={optionComment ? true: false}
              // styles={{ margin: "0px 0px 0px", maxWidth: "70%",  }}
              // className={"digit-checkbox-containe  r"}
              label={t("LINK_NESTED_CHECKLIST")}
              checked={optionDependency}
              onChange={(event) => handleOptionDependency(optionId)}
              // isLabelFirst={true}
              index={field.key}
            />
          </> 
          }
          {!disableDelete && (
            // <div className="pointer" style={{}} onClick={() => removeOption(index)}>
            //   <DustbinIcon />
            //   {t(`CAMPAIGN_DELETE_ROW_TEXT`)}
            // </div>
            <Button
              // className="custom-class"
              icon="Delete"
              iconFill=""
              label={t(`DELETE`)}
              onClick={()=>removeOption(index)}
              size=""
              style={{}}
              title=""
              variation="link"
            />
          )}
        </div>
      </div>
    </div>
  );
};
