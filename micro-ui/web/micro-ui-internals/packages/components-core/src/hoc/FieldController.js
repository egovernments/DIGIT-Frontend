import React from "react";
// import FieldComposer from "./FieldComposer";
import FieldV1 from "./FieldV1";
import { Controller } from "react-hook-form";

function FieldController(args) {
  const {
    type,
    populators,
    isMandatory,
    disable,
    component,
    config,
    sectionFormCategory,
    formData,
    selectedFormCategory,
    control,
    props,
    errors,
    controllerProps,
    nonEditable,
    placeholder,
    description,
    charCount,
    withoutLabel,
  } = args;
  let { apiDetails } = props;
  let disableFormValidation = false;
  if (sectionFormCategory && selectedFormCategory) {
    disableFormValidation = sectionFormCategory !== selectedFormCategory ? true : false;
  }
  const customValidation = config?.populators?.validation?.customValidation;
  let customValidations = config?.additionalValidation
    ? Digit?.Customizations?.[apiDetails?.masterName]?.[apiDetails?.moduleName]?.additionalValidations(
        config?.additionalValidation?.type,
        formData,
        config?.additionalValidation?.keys
      )
    : null;
  const customRules = customValidation ? { validate: customValidation } : customValidations ? { validate: customValidation } : {};
  const customProps = config?.customProps;
  return (
    <Controller
      defaultValue={formData?.[populators.name]}
      render={({ onChange, ref, value, onBlur }) => (
        <FieldV1
          error= {errors[populators.name]}
          label={config.label}
          nonEditable = {nonEditable}
          placeholder={placeholder}
          inline={props.inline}
          description={description}
          charCount = {charCount}
          withoutLabel = {withoutLabel}
          type={type}
          populators={populators}
          required={isMandatory}
          disabled={disable}
          component={component}
          config={config}
          sectionFormCategory={sectionFormCategory}
          formData={formData}
          selectedFormCategory={selectedFormCategory}
          onChange={onChange}
          ref={ref}
          value={value}
          props={props}
          errors={errors}
          onBlur={onBlur}
          controllerProps={controllerProps}
        />
      )}
      name={populators.name}
      rules={!disableFormValidation ? { required: isMandatory, ...populators.validation, ...customRules } : {}}
      control={control}
    />
  );
}

export default FieldController;
