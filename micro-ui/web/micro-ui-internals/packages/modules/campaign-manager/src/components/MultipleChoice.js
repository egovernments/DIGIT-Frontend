import React, { Fragment, useState, useEffect, useRef } from "react";
import { CheckBox, Tooltip } from "@egovernments/digit-ui-components";
import CreateQuestion from "./CreateQuestion";
import { DustbinIcon } from "./icons/DustbinIcon";
import { FieldV1, Button } from "@egovernments/digit-ui-components";

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
  typeOfCall,
  parentNumber,
  questionNumber,
  maxDepth
}) => {
  let dis = typeOfCall === "view" ? true : false;
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
            typeOfCall={typeOfCall}
            parentNumber={parentNumber}
            subQlevel={subQlevel}
            maxDepth={maxDepth}
          ></RadioButtonOption>
          {item.optionComment && <FieldV1
            // className="example"
            // disabled={dis}
            nonEditable={dis}
            type={"textarea"}
            populators={{
              resizeSmart: true
            }}
            // props={{ fieldStyle: example }}
            name="Short Answer"
            value={item.comment || ""}
            onChange={(event) => addComment({ value: event.target.value, target: "value", id: item.key, parentId: field.id })}
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
                typeOfCall={typeOfCall}
                parentNumber={parentNumber}
              />
            </>
          )}
          {
            <hr style={{ width: "100%", borderTop: "1px solid #ccc" }} />
          }
        </>
      ))}
      {!dis && <div style={{marginTop: "0.8rem"}}>
        <Button
          // disabled={"true"}
          className="custom-class"
          icon="AddIcon"
          iconFill=""
          label={`${t("ADD_OPTIONS")} ${questionNumber}`}
          onClick={() => addOption()}
          size="medium"
          title=""
          variation="link"
          textStyles={{ width: 'unset' }}
        />
      </div>}
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
  handleOptionComment,
  typeOfCall,
  subQlevel,
  maxDepth
}) => {
  // const [optionTitle, setOptionTitle] = useState(title);
  const [isFocused, setIsFocused] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false); // State to control tooltip visibility
  const optionInputRef = useRef(null); // Reference to the option input element
  const inputContainerRef = useRef(null);
  const tooltipRef = useRef(null);

  const commentsEnabled = window?.globalConfigs?.getConfig("CHECKLIST_COMMENT_ENABLED") || false;

  let dis = typeOfCall === "view" ? true : false;

  useEffect(() => {
    if (optionInputRef.current) {
      setIsOverflowing(
        optionInputRef.current.scrollWidth > optionInputRef.current.clientWidth
      );
    }
  }, [title]);

  const adjustTooltipPosition = () => {
    if (tooltipRef.current && optionInputRef.current) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const inputRect = optionInputRef.current.getBoundingClientRect();

      // Center the tooltip above the input
      const inputCenter = inputRect.left + (inputRect.width / 2);

      return {
        position: 'fixed',
        left: `${inputCenter - (Math.min(200, tooltipRect.width) / 2)}px`, // Center tooltip or limit width
        top: `${inputRect.top - tooltipRect.height - 8}px`, // 8px spacing
      };
    }
    return {};
  };

  return (
    <div>
      <div
        key={index}
        className="optionradiobtnwrapper"
        style={{ justifyContent: "space-between", height: "3rem" }}
      >
        <div
          style={{ display: "flex", position: "relative" }}
          ref={inputContainerRef}
          onMouseEnter={() => setShowTooltip(isOverflowing)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <input
            type="radio"
            className="customradiobutton"
            // disabled={dis}
            onClick={(e) => e.preventDefault()} // Prevents interaction
            style={{ marginTop: "0.7rem" , marginRight: "1rem" }}
          />
          <input
            disabled={dis}
            type="text"
            ref={optionInputRef}
            value={t(title)}
            onChange={(ev) => updateOption({ value: ev.target.value, id: index })}
            onBlur={() => setIsFocused(false)}
            onFocus={() => setIsFocused(true)}
            className={isFocused ? "simple_editable-input" : "simple_readonly-input"}
            style={{ width: "20rem", minWidth: "10rem", fontSize: "1rem" }}
          />
          {showTooltip && (
            <Tooltip
              // arrow={false}
              className=""
              ref={tooltipRef}
              content={title}
              style={{
                position: 'absolute',
                backgroundColor: '#363636',
                color: '#ffffff',
                padding: '1rem',
                borderRadius: '4px',
                fontSize: '1rem',
                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
                zIndex: 9999,
                width: 'auto',
                maxWidth: '20rem', // Limit tooltip width
                wordWrap: 'break-word', // Enable word wrapping
                whiteSpace: 'normal', // Allow text to wrap
                lineHeight: '1.4', // Improve readability of wrapped text
                textAlign: 'center', // Center the text
                ...adjustTooltipPosition()
              }}
            />
          )}
        </div>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          {commentsEnabled && !dis && (
            <>
              <CheckBox
                key={field.key}
                mainClassName={"checkboxOptionVariant"}
                disabled={optionDependency ? true : false }  
                label={t("ADD_COMMENT_(OR)")}
                checked={optionComment}
                onChange={(event) => handleOptionComment(optionId)}
                index={field.key}
              />
            </>
          )}
          {!dis && (
            <>
              <CheckBox
                key={field.key}
                mainClassName={"checkboxOptionVariant"}
                disabled={optionComment ? true : false || subQlevel>=maxDepth+1}
                label={t("LINK_NESTED_CHECKLIST")}
                checked={optionDependency}
                onChange={(event) => handleOptionDependency(optionId)}
                index={field.key}
              />
            </>
          )}
          {!dis && !disableDelete && (
            <Button
              icon="Delete"
              iconFill=""
              label={t(`DELETE`)}
              onClick={() => removeOption(index)}
              size="medium"
              title=""
              variation="link"
            />
          )}
        </div>
      </div>
    </div>
  );
};