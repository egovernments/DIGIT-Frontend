import { CloseSvg } from "@egovernments/digit-ui-react-components";
import React, { Fragment, useEffect, useMemo, useState, useRef } from "react";
import { CheckBox, Tooltip } from "@egovernments/digit-ui-components";
import CreateQuestion from "./CreateQuestion";
import { DustbinIcon } from "./icons/DustbinIcon";
import { FieldV1, Button } from "@egovernments/digit-ui-components";

const Checkboxes = ({
  t,
  options,
  optionsKey,
  updateOption,
  addOption,
  removeOption,
  isPartiallyEnabled,
  createNewSurvey,
  formDisabled,
  maxLength,
  titleHover,
  inputRef,
  labelstyle,
  isInputDisabled,
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
}) => {
  let dis = typeOfCall === "view" ? true : false;
  return (
    <div>
      {options.map((item, index) => (
        <>
          <CheckBoxOption
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
          />
          {item.optionComment && (
            <FieldV1
              // className="example"
              // disabled={dis}
              nonEditable={dis}
              type={"textarea"}
              populators={{
                resizeSmart: true,
              }}
              // props={{ fieldStyle: example }}
              name="Short Answer"
              value={item.comment || ""}
              onChange={(event) => addComment({ value: event.target.value, target: "value", id: item.key, parentId: field.id })}
              placeholder={""}
            />
          )}
          {item.optionDependency && (
            <CreateQuestion
              className={subQclassName}
              level={subQlevel}
              parent={subQparent}
              // parentId={subQparentId}
              parentId={item.id}
              initialQuestionData={subQinitialQuestionData}
              optionId={item.id}
              typeOfCall={typeOfCall}
              parentNumber={parentNumber}
            />
          )}
          {<hr style={{ width: "100%", borderTop: "1px solid #ccc" }} />}
        </>
      ))}
      {!dis && (
        <div style={{ marginTop: "0.8rem" }}>
          <Button
            icon="AddIcon"
            iconFill=""
            label={`${t("ADD_OPTIONS")} ${questionNumber}`}
            onClick={() => addOption()}
            size="medium"
            title={`${t("ADD_OPTIONS")} ${questionNumber}`}
            variation="link"
            textStyles={{ width: "unset" }}
          />
        </div>
      )}
    </div>
  );
};

export default Checkboxes;

const CheckBoxOption = ({
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
  t,
  optionComment,
  addComment,
  handleOptionComment,
  typeOfCall,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false); // State to control tooltip visibility
  const optionInputRef = useRef(null); // Reference to the option input element
  const inputContainerRef = useRef(null);
  const tooltipRef = useRef(null);
  let dis = typeOfCall === "view" ? true : false;

  const commentsEnabled = window?.globalConfigs?.getConfig("CHECKLIST_COMMENT_ENABLED") || false;

  useEffect(() => {
    if (optionInputRef.current) {
      setIsOverflowing(optionInputRef.current.scrollWidth > optionInputRef.current.clientWidth);
    }
  }, [title]);

  const adjustTooltipPosition = () => {
    if (tooltipRef.current && optionInputRef.current) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const inputRect = optionInputRef.current.getBoundingClientRect();

      // Center the tooltip above the input
      const inputCenter = inputRect.left + inputRect.width / 2;

      return {
        position: "fixed",
        left: `${inputCenter - Math.min(200, tooltipRect.width) / 2}px`, // Center tooltip or limit width
        top: `${inputRect.top - tooltipRect.height - 8}px`, // 8px spacing
      };
    }
    return {};
  };

  return (
    <div>
      <div className="optioncheckboxwrapper" style={{ justifyContent: "space-between", height: "3rem" }} key={index}>
        <div
          style={{ display: "flex", position: "relative" }}
          ref={inputContainerRef}
          onMouseEnter={() => setShowTooltip(isOverflowing)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <CheckBox mainClassName="checkboxOptionVariant" label="" disable={dis} />
          <input
            disabled={dis}
            ref={optionInputRef}
            type="text"
            value={t(title)}
            onChange={(ev) => updateOption({ value: ev.target.value, id: index })}
            onBlur={() => setIsFocused(false)}
            onFocus={() => setIsFocused(true)}
            className={isFocused ? "simple_editable-input" : "simple_readonly-input"}
            // maxLength={maxLength}
            // title={titleHover}
            style={{ width: "20rem", minWidth: "10rem", fontSize: "1rem" }} // Adjust width as needed
            // disabled={isPartiallyEnabled ? !isPartiallyEnabled : formDisabled}
          />
          {showTooltip && (
            <Tooltip
              // arrow={false}
              className=""
              ref={tooltipRef}
              content={title}
              style={{
                position: "absolute",
                backgroundColor: "#363636",
                color: "#ffffff",
                padding: "1rem",
                borderRadius: "4px",
                fontSize: "1rem",
                boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
                zIndex: 9999,
                width: "auto",
                maxWidth: "20rem", // Limit tooltip width
                wordWrap: "break-word", // Enable word wrapping
                whiteSpace: "normal", // Allow text to wrap
                lineHeight: "1.4", // Improve readability of wrapped text
                textAlign: "center", // Center the text
                ...adjustTooltipPosition(),
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
                disabled={optionDependency ? true : false}
                label={t("ADD_COMMENT")}
                checked={optionComment}
                onChange={(event) => handleOptionComment(optionId)}
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
              style={{}}
              title={t(`DELETE`)}
              variation="link"
            />
          )}
        </div>
      </div>
    </div>
  );
};
