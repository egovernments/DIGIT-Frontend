import React, { Fragment } from "react";
import {
  CardText,
  ErrorMessage,
  Header,
  TextArea,
  TextInput,
  CheckBox,
  SVG,
  MultiSelectDropdown,
  MobileNumber,
  InputTextAmount,
  StringManipulator,
} from "../atoms";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import UploadFileComposer from "./UploadFileComposer";
import { CustomDropdown } from "../molecules";
import { Controller } from "react-hook-form";

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
  const { t } = useTranslation();
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

  const [currentCharCount, setCurrentCharCount] = useState(0);

  useEffect(() => {
    setCurrentCharCount(value.length);
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
            name={populators.name}
            onChange={onChange}
            error={error}
            disabled={disabled}
            nonEditable={nonEditable}
            placeholder={placeholder}
            inline={inline}
            required={required}
            populators={populators}
            inputRef={ref}
            step={config?.step}
            errorStyle={errors?.[populators.name]}
            max={populators?.validation?.max}
            min={populators?.validation?.min}
            maxlength={populators?.validation?.maxlength}
            minlength={populators?.validation?.minlength}
            customIcon={populators?.customIcon}
            customClass={populators?.customClass}
            onIconSelection={populators?.onIconSelection}
          />
        );
      case "textarea":
        return (
          <div className="digit-field-container">
            <TextArea
              type={type}
              value={value}
              name={populators.name}
              onChange={onChange}
              error={error}
              disabled={disabled}
              nonEditable={nonEditable}
              placeholder={placeholder}
              inline={inline}
              required={required}
              populators={populators}
              inputRef={ref}
              errorStyle={errors?.[populators.name]}
              maxlength={populators?.validation?.maxlength}
              minlength={populators?.validation?.minlength}
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
            errorStyle={errors?.[populators.name]}
            variant={
              variant
                ? variant
                : errors?.[populators.name]
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
              checked={formData?.[populators.name]}
              label={t(`${populators?.title}`)}
              styles={populators?.styles}
              style={populators?.labelStyles}
              customLabelMarkup={populators?.customLabelMarkup}
              disabled={disabled}
              isLabelFirst={populators?.isLabelFirst}
            />
          </div>
        );
      case "multiselectdropdown":
        return (
          <div style={{ display: "grid", gridAutoFlow: "row", width: "100%" }}>
            <MultiSelectDropdown
              options={populators?.options}
              optionsKey={populators?.optionsKey}
              props={props}
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
              errorStyle={errors?.[populators.name]}
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
            module={config?.module}
            config={config}
            Controller={Controller} // TODO: NEED TO DISCUSS ON THIS
            register={controllerProps?.register}
            formData={formData}
            errors={errors}
            control={controllerProps?.control}
            customClass={config?.customClass}
            customErrorMsg={config?.error}
            localePrefix={config?.localePrefix}
            variant={
              variant
                ? variant
                : errors?.[populators.name]
                ? "digit-field-error"
                : ""
            }
          />
        );
      case "custom":
        return populators.component;
      case "amount":
        return (
          <InputTextAmount
            value={formData?.[populators.name]}
            type={"text"}
            name={populators.name}
            onChange={onChange}
            inputRef={ref}
            errorStyle={errors?.[populators.name]}
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
                : errors?.[populators.name]
                ? "digit-field-error"
                : ""
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {!withoutLabel && (
        <Header
          className={`label ${disabled ? "disabled" : ""} ${
            nonEditable ? "noneditable" : ""
          } ${populators?.wrapLabel ? "wraplabel" : ""}`}
        >
          <div
            className={`label-container ${
              populators?.wrapLabel ? "wraplabel" : ""
            }`}
          >
            <div
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
            </div>
            <div style={{ color: "#B91900" }}>{required ? " * " : null}</div>
            {infoMessage ? (
              <div className="info-icon">
                <SVG.InfoOutline
                  width="1.1875rem"
                  height="1.1875rem"
                  fill="#505A5F"
                />
                <span class="infotext">{infoMessage}</span>
              </div>
            ) : null}
          </div>
        </Header>
      )}
      <div
        style={
          withoutLabel
            ? { width: "100%", ...props?.fieldStyle, marginBottom: "24px" }
            : { ...props?.fieldStyle, marginBottom: "24px" }
        }
        className="digit-field"
      >
        {renderField()}
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
      </div>
    </>
  );
};

export default FieldV1;
