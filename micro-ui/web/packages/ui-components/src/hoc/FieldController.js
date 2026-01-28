import React from "react";
import FieldV1 from "./FieldV1";
import { Controller } from "react-hook-form";
import get from "lodash/get";

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
    defaultValues,
    controllerProps,
  } = args;

  let { apiDetails } = props;

  let disableFormValidation = false;
  if (sectionFormCategory && selectedFormCategory) {
    disableFormValidation = sectionFormCategory !== selectedFormCategory;
  }

  const customValidation = config?.populators?.validation?.customValidation;

  const customValidations = config?.additionalValidation
    ? Digit?.Customizations?.[apiDetails?.masterName]?.[apiDetails?.moduleName]?.additionalValidations(
        config?.additionalValidation?.type,
        formData,
        config?.additionalValidation?.keys
      )
    : null;

  const customRules = customValidation
    ? { validate: customValidation }
    : customValidations
    ? { validate: customValidations }
    : {};

  const errorObject = get(errors, populators?.name);
  const error = errorObject ? populators?.error : null;

  const customProps = config?.customProps;

  return (
    <Controller
      name={populators?.name}
      control={control}
      defaultValue={formData?.[populators?.name] ?? ""}
      rules={
        !disableFormValidation
          ? { required: isMandatory, ...populators?.validation, ...customRules }
          : {}
      }
      render={({ field, fieldState }) => {
        const { onChange, value, ref, onBlur } = field;

        return (
          <FieldV1
            error={error}
            label={config.label}
            nonEditable={config.nonEditable}
            placeholder={config.placeholder}
            inline={props.inline}
            description={config.description}
            charCount={config.charCount}
            infoMessage={config.infoMessage}
            withoutLabel={config.withoutLabel}
            variant={config.variant}
            type={type}
            populators={populators}
            required={isMandatory}
            control={control}
            disabled={disable}
            component={component}
            config={config}
            sectionFormCategory={sectionFormCategory}
            formData={formData}
            selectedFormCategory={selectedFormCategory}
            defaultValues={defaultValues}
            value={value}
            ref={ref}
            onBlur={onBlur}
            onChange={(val) => onChange(val)}
            props={props}
            errors={errors}
            controllerProps={controllerProps}
            {...customProps}
          />
        );
      }}
      key={populators?.name}
    />
  );
}

export default FieldController;
