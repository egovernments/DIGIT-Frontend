import { CloseSvg } from "@egovernments/digit-ui-react-components";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { TextInput } from "@egovernments/digit-ui-components";
import { CheckBox, Button, FieldV1 } from "@egovernments/digit-ui-components";
import { DustbinIcon } from "./icons/DustbinIcon";

import CreateQuestion from "./CreateQuestion";

const Dropdowns = ({
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
}) => {
  return (
    <div className="options_checkboxes">
      {options.map((item, index) => (
        <>
          <DropdownOption
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
            addComment={addComment}
            handleOptionComment={handleOptionComment}
            t={t}
          />
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
          {item.optionDependency && <CreateQuestion
            className={subQclassName}
            level={subQlevel}
            parent={subQparent}
            // parentId={subQparentId}
            parentId={item.id}
            initialQuestionData={subQinitialQuestionData} 
            optionId={item.id} />
          }
          {
            <hr style={{ width: "100%", borderTop: "1px solid #ccc" }} />
          }
        </>
      ))}
      <div>
      <Button
        className="custom-class"
        icon="MyLocation"
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

export default Dropdowns;

const DropdownOption = ({
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
  addComment,
  handleOptionComment,
  t
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div>
      <div key={index} className="optioncheckboxwrapper" style={{justifyContent:"space-between", height:"2rem"}}>
        <div style={{display:"flex"}}>
        <TextInput
            // style={{ maxWidth: "40rem" }}
            name="title"
            // value={field?.title || ""}
            value={title}
            onChange={(ev) => updateOption({ value: ev.target.value, id: index })}         
            placeholder={"Dropdown section"}
        />
        </div>
        <div style={{display:"flex", gap:"1rem"}}>
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
            <div className="pointer"  onClick={() => removeOption(index)}>
              <DustbinIcon />
              {t(`CAMPAIGN_DELETE_ROW_TEXT`)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
