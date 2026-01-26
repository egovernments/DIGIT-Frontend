import React from "react";
import {
  CheckBox,
  InputTextAmount,
  MobileNumber,
  MultiSelectDropdown,
  Paragraph,
  TextArea,
  TextInput
} from "../atoms";
import {
  ApiDropdown,
  CustomDropdown,
  LocationDropdownWrapper,
  MultiUploadWrapper
} from "../molecules";
import { Controller } from "react-hook-form";
import UploadFileComposer from "./UploadFileComposer";

const Fields = (
  t,
  errors,
  type,
  populators,
  isMandatory,
  disable = false,
  component,
  config,
  sectionFormCategory,
  formData,
  control,
  selectedFormCategory,
  setValue,
  register,
  setError,
  clearErrors,
  formState,
  getValues,
  handleSubmit,
  reset,
  watch,
  trigger,
  unregister
) => {
  let disableFormValidation = false;

  if (sectionFormCategory && selectedFormCategory) {
    disableFormValidation = sectionFormCategory !== selectedFormCategory;
  }

  const Component =
    typeof component === "string"
      ? Digit.ComponentRegistryService.getComponent(component)
      : component;

  const customValidation = config?.populators?.validation?.customValidation;
  const customRules = customValidation ? { validate: customValidation } : {};
  const customProps = config?.customProps;

  switch (type) {
    case "text":
    case "number":
    case "password":
    case "time":
    case "date":
      return (
        <div className="field-container">
          <Controller
            name={populators.name}
            control={control}
            rules={
              !disableFormValidation
                ? { required: isMandatory, ...populators.validation, ...customRules }
                : {}
            }
            defaultValue={formData?.[populators.name]}
            render={({ field, fieldState }) => (
              <TextInput
                {...field}
                type={type}
                disable={disable}
                errorStyle={fieldState.error}
                max={populators?.validation?.max}
                min={populators?.validation?.min}
                maxlength={populators?.validation?.maxlength}
                minlength={populators?.validation?.minlength}
                customIcon={populators?.customIcon}
                customClass={populators?.customClass}
              />
            )}
          />
        </div>
      );

    case "amount":
      return (
        <div className="field-container">
          <Controller
            name={populators.name}
            control={control}
            rules={
              !disableFormValidation
                ? { required: isMandatory, ...populators.validation, ...customRules }
                : {}
            }
            defaultValue={formData?.[populators.name]}
            render={({ field, fieldState }) => (
              <InputTextAmount
                {...field}
                errorStyle={fieldState.error}
                disable={disable}
                prefix={populators?.prefix}
                intlConfig={populators?.intlConfig}
              />
            )}
          />
        </div>
      );

    case "textarea":
      return (
        <div className="field-container">
          <Controller
            name={populators.name}
            control={control}
            rules={!disableFormValidation ? { required: isMandatory } : {}}
            defaultValue={formData?.[populators.name]}
            render={({ field, fieldState }) => (
              <TextArea
                {...field}
                disable={disable}
                errorStyle={fieldState.error}
              />
            )}
          />
        </div>
      );

    case "paragraph":
      return (
        <Controller
          name={populators.name}
          control={control}
          defaultValue={formData?.[populators.name]}
          render={({ field }) => (
            <Paragraph {...field} customClass={populators?.customClass} />
          )}
        />
      );

    case "mobileNumber":
      return (
        <Controller
          name={populators.name}
          control={control}
          rules={!disableFormValidation ? { required: isMandatory } : {}}
          defaultValue={populators.defaultValue}
          render={({ field, fieldState }) => (
            <MobileNumber
              {...field}
              disable={disable}
              errorStyle={fieldState.error}
            />
          )}
        />
      );

    case "checkbox":
      return (
        <Controller
          name={populators.name}
          control={control}
          defaultValue={formData?.[populators.name]}
          render={({ field }) => (
            <CheckBox
              checked={field.value}
              label={t(populators?.title)}
              onChange={(e) => field.onChange(e.target.checked)}
            />
          )}
        />
      );

    case "multiupload":
      return (
        <Controller
          name={populators.name}
          control={control}
          defaultValue={[]}
          render={({ field }) => (
            <MultiUploadWrapper
              t={t}
              module="works"
              tenantId={Digit.ULBService.getCurrentTenantId()}
              setuploadedstate={field.value}
              getFormState={(files) => field.onChange(files)}
              {...populators}
            />
          )}
        />
      );

    case "dropdown":
    case "radio":
      return (
        <Controller
          name={config.key}
          control={control}
          rules={!disableFormValidation ? { required: isMandatory } : {}}
          defaultValue={formData?.[populators.name]}
          render={({ field, fieldState }) => (
            <CustomDropdown
              {...field}
              t={t}
              config={populators}
              errorStyle={fieldState.error}
            />
          )}
        />
      );

    case "component":
      return (
        <Controller
          name={config.key}
          control={control}
          render={({ field }) => (
            <Component
              {...field}
              t={t}
              setValue={setValue}
              config={config}
              formData={formData}
              register={register}
              errors={errors}
              setError={setError}
              clearErrors={clearErrors}
              watch={watch}
              unregister={unregister}
            />
          )}
        />
      );

    default:
      return null;
  }
};

export default Fields;

//TODO: This component is currently not in use. We plan to revisit it later for necessary changes and updates.
// <Fields.js />
