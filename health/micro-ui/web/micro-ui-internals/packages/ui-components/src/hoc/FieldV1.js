import React, { Fragment } from "react";
import {
  CardText,
  ErrorMessage,
  HeaderComponent,
  TextArea,
  TextInput,
  CheckBox,
  SVG,
  MultiSelectDropdown,
  MobileNumber,
  InputTextAmount,
  StringManipulator,
  LabelFieldPair
} from "../atoms";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import UploadFileComposer from "./UploadFileComposer";
import { CustomDropdown } from "../molecules";
import { Controller } from "react-hook-form";
import { LocationDropdownWrapper } from "../molecules";
import { ApiDropdown } from "../molecules";
import { WorkflowStatusFilter } from "../molecules";
import { DateRangeNew } from "../molecules";
import BoundaryFilter from "./BoundaryFilter";

const FieldV1 = ({
  type = "",
  value = "",
  onChange = () => {},
  error = "",
  label = "",
  disabled = false,
  nonEditable = false,
  placeholder = "",
  inline = false,
  required = false,
  description = "",
  charCount = false,
  populators = {},
  withoutLabel = false,
  props = {},
  ref,
  onBlur,
  config,
  errors,
  infoMessage,
  component,
  sectionFormCategory,
  formData,
  selectedFormCategory,
  controllerProps,
  variant,
}) => {
  const { t: i18nT } = useTranslation();
  const t = populators.t || i18nT; // consuming custom translation function if provided, otherwise use i18nT
  let disableFormValidation = false;
  if (sectionFormCategory && selectedFormCategory) {
    disableFormValidation =
      sectionFormCategory !== selectedFormCategory ? true : false;
  }
  const Component =
    typeof component === "string"
      ? Digit.ComponentRegistryService.getComponent(component)
      : component;
  const customValidation = config?.populators?.validation?.customValidation;
  const customRules = customValidation ? { validate: customValidation } : {};
  const customProps = config?.customProps;
  const fieldId=Digit?.Utils.getFieldIdName?.(label)||"NA";

  const [currentCharCount, setCurrentCharCount] = useState(0);

  useEffect(() => {
    setCurrentCharCount(value?.length);
  }, [value]);

  const renderCharCount = () => {
    if (charCount) {
      const maxCharacters = populators?.validation?.maxlength || 0;
      return (
        <CardText
          style={{
            marginTop: "0px",
            fontSize: "0.875rem",
            lineHeight: "1.5rem",
          }}
        >
          {currentCharCount}/{maxCharacters}
        </CardText>
      );
    }
  };

  // To render the description or the error message
  const renderDescriptionOrError = () => {
    if (error) {
      return (
        <ErrorMessage
          message={t(error)}
          truncateMessage={true}
          maxLength={256}
          showIcon={true}
        />
      );
    } else if (description) {
      return (
        <CardText
          style={{
            width: "100%",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            marginTop: "0px",
            fontSize: "0.875rem",
            lineHeight: "1.5rem",
          }}
        >
          {StringManipulator(
            "TOSENTENCECASE",
            StringManipulator("TRUNCATESTRING", t(description), {
              maxLength: 256,
            })
          )}
        </CardText>
      );
    }
    return null;
  };

  const renderField = () => {
    switch (type) {
      case "text":
      case "date":
      case "time":
      case "geolocation":
      case "password":
      case "search":
      case "number":
      case "numeric":
        return (
          <TextInput
            type={type}
            value={value}
            name={populators?.name}
            onChange={onChange}
            error={error}
            allowNegativeValues={populators?.allowNegativeValues}
            disabled={disabled}
            nonEditable={nonEditable}
            placeholder={placeholder}
            inline={inline}
            required={required}
            populators={populators}
            inputRef={ref}
            step={config?.step}
            errorStyle={errors?.[populators?.name]}
            max={populators?.validation?.max}
            min={populators?.validation?.min}
            maxlength={populators?.validation?.maxlength}
            minlength={populators?.validation?.minlength}
            customIcon={populators?.customIcon}
            customClass={populators?.customClass}
            onIconSelection={populators?.onIconSelection}
            id={fieldId}
          />
        );
      case "textarea":
        return (
          <div className="digit-field-container">
            <TextArea
              type={type}
              value={value}
              name={populators?.name}
              onChange={onChange}
              error={error}
              disabled={disabled}
              nonEditable={nonEditable}
              placeholder={placeholder}
              inline={inline}
              required={required}
              populators={populators}
              inputRef={ref}
              errorStyle={errors?.[populators?.name]}
              maxlength={populators?.validation?.maxlength}
              minlength={populators?.validation?.minlength}
              id={fieldId}
            />
          </div>
        );
      case "radio":
      case "dropdown":
      case "select":
      case "radioordropdown":
      case "toggle":
        return (
          <CustomDropdown
            t={t}
            label={label}
            type={type}
            onBlur={onBlur}
            value={value}
            inputRef={ref}
            onChange={onChange}
            config={populators}
            disabled={disabled}
            id={fieldId}
            errorStyle={errors?.[populators?.name]}
            mdmsv2= {populators?.mdmsv2}
            variant={
              variant
                ? variant
                : errors?.[populators?.name]
                ? "digit-field-error"
                : ""
            }
          />
        );
      case "checkbox":
        return (
          <div style={{ display: "grid", gridAutoFlow: "row" }}>
            <CheckBox
              onChange={(e) => {
                onChange(e.target.checked);
              }}
              value={value}
              checked={formData?.[populators?.name]}
              isIntermediate={populators?.isIntermediate}
              label={t(`${populators?.title}`)}
              styles={populators?.styles}
              style={populators?.labelStyles}
              disabled={disabled}
              isLabelFirst={populators?.isLabelFirst}
              id={fieldId}
            />
          </div>
        );
      case "multiselectdropdown":
        return (
          <div style={{ display: "grid", gridAutoFlow: "row", width: "100%" }}>
            <MultiSelectDropdown
              options={populators?.options}
              optionsKey={populators?.optionsKey}
              chipsKey={populators?.chipsKey}
              props={props}
              id={fieldId}
              isPropsNeeded={true}
              onSelect={(e) => {
                onChange(
                  e
                    ?.map((row) => {
                      return row?.[1] ? row[1] : null;
                    })
                    .filter((e) => e)
                );
              }}
              selected={value || []}
              defaultLabel={t(populators?.defaultText)}
              defaultUnit={t(populators?.selectedText)}
              config={populators}
              disabled={disabled}
              variant={variant}
              addSelectAllCheck={populators?.addSelectAllCheck}
              addCategorySelectAllCheck={populators?.addCategorySelectAllCheck}
              selectAllLabel={populators?.selectAllLabel}
              categorySelectAllLabel={populators?.categorySelectAllLabel}
              restrictSelection={populators?.restrictSelection}
              isSearchable={populators?.isSearchable}
            />
          </div>
        );
      case "mobileNumber":
        return (
          <div className="digit-field-container">
            <MobileNumber
              inputRef={ref}
              onChange={onChange}
              value={value}
              disable={disabled}
              id={fieldId}
              prefix={populators?.prefix}
              hideSpan={populators?.hideSpan}
              errorStyle={errors?.[populators?.name]}
            />
          </div>
        );
      case "component":
        return (
          <Component
            userType={"employee"}
            t={t}
            setValue={controllerProps?.setValue}
            onSelect={controllerProps?.setValue}
            config={config}
            data={formData}
            id={fieldId}
            formData={formData}
            register={controllerProps?.register}
            errors={errors}
            props={{ ...props, ...customProps }}
            setError={controllerProps?.setError}
            clearErrors={controllerProps?.clearErrors}
            formState={controllerProps?.formState}
            onBlur={onBlur}
            control={controllerProps?.control}
            sectionFormCategory={sectionFormCategory}
            selectedFormCategory={selectedFormCategory}
            getValues={controllerProps?.getValues}
            watch={controllerProps?.watch}
            unregister={controllerProps?.unregister}
          />
        );
      case "documentUpload":
        return (
          <UploadFileComposer
            mdmsModuleName={config?.mdmsModuleName}
            module={config?.module}
            config={config}
            Controller={Controller} // TODO: NEED TO DISCUSS ON THIS
            register={controllerProps?.register}
            formData={formData}
            errors={errors}
            id={fieldId}
            control={controllerProps?.control}
            customClass={config?.customClass}
            customErrorMsg={config?.error}
            localePrefix={config?.localePrefix}
            variant={
              variant
                ? variant
                : errors?.[populators?.name]
                ? "digit-field-error"
                : ""
            }
          />
        );
        case "boundary":
          return (
            <BoundaryFilter
              levelConfig={populators.levelConfig}
              hierarchyType={populators.hierarchyType}
              module={populators.module}
              layoutConfig={{ isDropdownLayoutHorizontal: false, isLabelFieldLayoutHorizontal: false }}
              preSelected={populators.preSelected}
              frozenData={populators.frozenData}
              onChange={onChange}
            />
          );
      case "custom":
        return populators.component;
      case "amount":
        return (
          <InputTextAmount
            value={formData?.[populators?.name]}
            type={"text"}
            name={populators?.name}
            onChange={onChange}
            inputRef={ref}
            id={fieldId}
            errorStyle={errors?.[populators?.name]}
            max={populators?.validation?.max}
            min={populators?.validation?.min}
            disable={disabled}
            style={type === "date" ? { paddingRight: "3px" } : ""}
            maxlength={populators?.validation?.maxlength}
            minlength={populators?.validation?.minlength}
            customIcon={populators?.customIcon}
            customClass={populators?.customClass}
            prefix={populators?.prefix}
            intlConfig={populators?.intlConfig}
            variant={
              variant
                ? variant
                : errors?.[populators?.name]
                ? "digit-field-error"
                : ""
            }
          />
        );
        case "locationdropdown":
          return (
            <Controller
              name={`${populators?.name}`}
              control={controllerProps?.control}
              defaultValue={formData?.[populators?.name]}
              rules={{ required: populators?.isMandatory, ...populators.validation }}
              render={(props) => {
                return (
                  <div style={{ display: "grid", gridAutoFlow: "row" ,width:"100%"}}>
                    <LocationDropdownWrapper
                      props={props}
                      populators={populators}
                      formData={formData}
                      inputRef={props.ref}
                      errors={errors}
                      disabled={disabled}
                      setValue={controllerProps?.setValue}
                    />
                  </div>
                );
              }}
            />
          );
        case "apidropdown":
          return (
            <Controller
              name={`${populators?.name}`}
              control={controllerProps?.control}
              defaultValue={formData?.[populators?.name]}
              rules={{ required: populators?.isMandatory, ...populators.validation }}
              render={(props) => {
                return (
                  <div style={{ display: "grid", gridAutoFlow: "row",width:"100%" }}>
                    <ApiDropdown props={props} populators={populators} formData={formData} inputRef={props.ref} errors={errors} disabled={disabled} />
                  </div>
                );
              }}
            />
          );
        // case "workflowstatesfilter":
        //   return (
        //     <Controller
        //       name={`${populators?.name}`}
        //       control={controllerProps?.control}
        //       defaultValue={formData?.[populators?.name]}
        //       rules={{ required: populators?.isMandatory }}
        //       render={(props) => {
        //         return (
        //           <div style={{ display: "grid", gridAutoFlow: "row",width:"100%" }}>
        //             <WorkflowStatusFilter inboxResponse={data} props={props} populators={populators} t={t} formData={formData} />
        //           </div>
        //         );
        //       }}
        //     />
        //   );
        case "dateRange":
          return (
            <Controller
              render={(props) => (
                <DateRangeNew
                  t={t}
                  values={formData?.[populators?.name]?.range}
                  name={populators?.name}
                  onFilterChange={props.onChange}
                  inputRef={props.ref}
                  errorStyle={errors?.[populators?.name]}
                />
              )}
              rules={{ required: required, ...populators.validation }}
              defaultValue={formData?.[populators?.name]}
              name={populators?.name}
              control={controllerProps?.control}
            />
          );
      default:
        return null;
    }
  };



  return (
    <LabelFieldPair removeMargin={true} vertical={populators?.alignFieldPairVerically} className={`digit-formcomposer-fieldpair ${populators?.fieldPairClassName}`}>
      {!withoutLabel && (
        <HeaderComponent
          className={`label ${disabled ? "disabled" : ""} ${
            nonEditable ? "noneditable" : ""
          } ${populators?.wrapLabel ? "wraplabel" : ""} ${populators?.boldLabel ? "boldLabel" : ""}`}
        >
          <div
            className={`label-container ${
              populators?.wrapLabel ? "wraplabel" : ""
            }`}
          >
            <label
              for={fieldId}
              className={`label-styles ${
                populators?.wrapLabel ? "wraplabel" : ""
              }`}
            >
              {StringManipulator(
                "TOSENTENCECASE",
                StringManipulator("TRUNCATESTRING", t(label), {
                  maxLength: 64,
                })
              )}
            </label>
            <div style={{ color: "#B91900" }}>{required ? " * " : null}</div>
            {infoMessage ? (
              <div className="info-icon">
                <SVG.InfoOutline
                  width="1.1875rem"
                  height="1.1875rem"
                  fill="#505A5F"
                />
                <span class="infotext">{t(infoMessage)}</span>
              </div>
            ) : null}
          </div>
        </HeaderComponent>
      )}
      <div
        style={
          withoutLabel
            ? { width: "100%", ...props?.fieldStyle}
            : { ...props?.fieldStyle}
        }
        className="digit-field"
      >
        {renderField()}
        {(charCount || error || description) && (
          <div
            className={`${
              charCount && !error && !description
                ? "digit-charcount"
                : "digit-description"
            }`}
          >
            {renderDescriptionOrError()}
            {renderCharCount()}
          </div>
        )}
      </div>
    </LabelFieldPair>
  );
};

export default FieldV1;