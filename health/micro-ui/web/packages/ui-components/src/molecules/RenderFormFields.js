import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Controller } from "react-hook-form";
import LabelFieldPair from "../atoms/LabelFieldPair";
import TextInput from "../atoms/TextInput";
import TextArea from "../atoms/TextArea";
import CustomDropdown from "./CustomDropdown";
import MobileNumber from "../atoms/MobileNumber";
import DateRangeNew from "./DateRangeNew";
import MultiSelectDropdown from "../atoms/MultiSelectDropdown";
import LocationDropdownWrapper from "./LocationDropdownWrapper";
import WorkflowStatusFilter from "./WorkflowStatusFilter";
import ApiDropdown from "./ApiDropdown";
import { ErrorMessage } from "../atoms";
import { SVG } from "../atoms";
import HeaderComponent from "../atoms/HeaderComponent";
import StringManipulator from "../atoms/StringManipulator";
import Divider from "../atoms/Divider";
import BoundaryFilter from "../hoc/BoundaryFilter";

const RenderFormFields = ({ data, ...props }) => {
  const { t } = useTranslation();
  const { fields, control, formData, errors, register, setValue, getValues, setError, clearErrors, apiDetails } = props;

  const fieldSelector = (type, populators, isMandatory, disable = false, component, config) => {
    const Component = typeof component === "string" ? Digit.ComponentRegistryService.getComponent(component) : component;
    let customValidations = config?.additionalValidation
      ? Digit?.Customizations?.[apiDetails?.masterName]?.[apiDetails?.moduleName]?.additionalValidations(
          config?.additionalValidation?.type,
          formData,
          config?.additionalValidation?.keys
        )
      : null;
    const customRules = customValidations ? { validate: customValidations } : {};
    const customProps = config?.customProps;

    switch (type) {
      case "boundary":
        return (
          <Controller
            name={populators?.name}
            control={control}
            defaultValue={formData?.[populators?.name]}
            rules={{ required: isMandatory, ...populators.validation, ...customRules }}
            render={({ field, fieldState }) => (
              <BoundaryFilter
                levelConfig={populators.levelConfig}
                hierarchyType={populators.hierarchyType}
                module={populators.module}
                layoutConfig={populators.layoutConfig}
                preSelected={populators.preSelected}
                frozenData={populators.frozenData}
                onChange={field.onChange}
                value={field.value}
                inputRef={field.ref}
              />
            )}
          />
        );

      case "date":
      case "text":
      case "number":
      case "password":
      case "time":
      case "geolocation":
      case "search":
      case "numeric":
        return (
          <Controller
            name={populators?.name}
            control={control}
            defaultValue={formData?.[populators?.name]}
            rules={{ required: isMandatory, ...populators.validation, ...customRules }}
            render={({ field, fieldState }) => (
              <TextInput
                type={type}
                value={field.value}
                name={field.name}
                onChange={field.onChange}
                onBlur={field.onBlur}
                inputRef={field.ref}
                max={populators?.max}
                min={populators?.min}
                errorStyle={fieldState.error || errors?.[populators?.name]}
                disabled={disable}
                maxlength={populators?.validation?.maxlength}
                minlength={populators?.validation?.minlength}
                allowNegativeValues={populators?.allowNegativeValues}
                populators={populators}
                step={config?.step}
                customIcon={populators?.customIcon}
                customClass={populators?.customClass}
                onIconSelection={populators?.onIconSelection}
              />
            )}
          />
        );

      case "textarea":
        return (
          <Controller
            name={populators?.name}
            control={control}
            defaultValue={formData?.[populators?.name]}
            rules={{ required: isMandatory, ...populators.validation }}
            render={({ field, fieldState }) => (
              <TextArea
                type={type}
                value={field.value}
                name={field.name}
                onChange={field.onChange}
                onBlur={field.onBlur}
                inputRef={field.ref}
                disabled={disable}
                errorStyle={fieldState.error || errors?.[populators?.name]}
                populators={populators}
                maxlength={populators?.validation?.maxlength}
                minlength={populators?.validation?.minlength}
              />
            )}
          />
        );

      case "mobileNumber":
        return (
          <Controller
            name={populators?.name}
            control={control}
            defaultValue={populators.defaultValue}
            rules={{ required: isMandatory, ...populators.validation }}
            render={({ field, fieldState }) => (
              <MobileNumber
                inputRef={field.ref}
                onChange={field.onChange}
                onBlur={field.onBlur}
                value={field.value}
                name={field.name}
                disable={disable}
                errorStyle={fieldState.error || errors?.[populators?.name]}
              />
            )}
          />
        );

      case "custom":
        return (
          <Controller
            name={populators?.name}
            control={control}
            defaultValue={populators.defaultValue}
            render={({ field, fieldState }) => 
              populators.component({ field, fieldState, setValue }, populators.customProps)
            }
          />
        );

      case "radio":
      case "dropdown":
      case "select":
      case "radioordropdown":
      case "toggle":
        return (
          <Controller
            name={populators?.name}
            control={control}
            defaultValue={formData?.[populators?.name]}
            rules={{ required: isMandatory, ...populators.validation }}
            render={({ field, fieldState }) => (
              <CustomDropdown
                t={t}
                label={config?.label}
                type={type}
                onBlur={field.onBlur}
                value={field.value}
                inputRef={field.ref}
                onChange={field.onChange}
                config={populators}
                disabled={config?.disable}
                errorStyle={fieldState.error || errors?.[populators?.name]}
                variant={
                  populators?.variant
                    ? populators?.variant
                    : fieldState.error || errors?.[populators?.name]
                    ? "digit-field-error"
                    : ""
                }
              />
            )}
          />
        );

      case "multiselectdropdown":
        return (
          <Controller
            name={populators?.name}
            control={control}
            defaultValue={formData?.[populators?.name]}
            rules={{ required: populators?.isMandatory }}
            render={({ field, fieldState }) => (
              <div style={{ gridAutoFlow: "row", width: "100%" }}>
                <MultiSelectDropdown
                  options={populators?.options}
                  optionsKey={populators?.optionsKey}
                  chipsKey={populators?.chipsKey}
                  props={{ field, fieldState }}
                  isPropsNeeded={true}
                  onSelect={(e) => {
                    field.onChange(
                      e
                        ?.map((row) => {
                          return row?.[1] ? row[1] : null;
                        })
                        .filter((e) => e)
                    );
                  }}
                  selected={field.value || []}
                  defaultLabel={t(populators?.defaultText)}
                  defaultUnit={t(populators?.selectedText)}
                  config={populators}
                  disabled={disable}
                  variant={populators?.variant}
                  addSelectAllCheck={populators?.addSelectAllCheck}
                  addCategorySelectAllCheck={populators?.addCategorySelectAllCheck}
                  selectAllLabel={populators?.selectAllLabel}
                  categorySelectAllLabel={populators?.categorySelectAllLabel}
                  restrictSelection={populators?.restrictSelection}
                  isSearchable={populators?.isSearchable}
                />
              </div>
            )}
          />
        );

      case "locationdropdown":
        return (
          <Controller
            name={populators?.name}
            control={control}
            defaultValue={formData?.[populators?.name]}
            rules={{ required: populators?.isMandatory, ...populators.validation }}
            render={({ field, fieldState }) => (
              <div style={{ display: "grid", gridAutoFlow: "row", width: "100%" }}>
                <LocationDropdownWrapper
                  props={{ field, fieldState }}
                  populators={populators}
                  formData={formData}
                  inputRef={field.ref}
                  errors={errors}
                  disabled={disable}
                  setValue={setValue}
                  value={field.value}
                  onChange={field.onChange}
                />
              </div>
            )}
          />
        );

      case "apidropdown":
        return (
          <Controller
            name={populators?.name}
            control={control}
            defaultValue={formData?.[populators?.name]}
            rules={{ required: populators?.isMandatory, ...populators.validation }}
            render={({ field, fieldState }) => (
              <div style={{ display: "grid", gridAutoFlow: "row", width: "100%" }}>
                <ApiDropdown
                  props={{ field, fieldState }}
                  populators={populators}
                  formData={formData}
                  inputRef={field.ref}
                  errors={errors}
                  disabled={disable}
                  value={field.value}
                  onChange={field.onChange}
                />
              </div>
            )}
          />
        );

      case "workflowstatesfilter":
        return (
          <Controller
            name={populators?.name}
            control={control}
            defaultValue={formData?.[populators?.name]}
            rules={{ required: populators?.isMandatory }}
            render={({ field, fieldState }) => (
              <div style={{ display: "grid", gridAutoFlow: "row", width: "100%" }}>
                <WorkflowStatusFilter
                  inboxResponse={data}
                  props={{ field, fieldState }}
                  populators={populators}
                  t={t}
                  formData={formData}
                />
              </div>
            )}
          />
        );

      case "dateRange":
        return (
          <Controller
            name={populators?.name}
            control={control}
            defaultValue={formData?.[populators?.name]}
            rules={{ required: isMandatory, ...populators.validation }}
            render={({ field, fieldState }) => (
              <DateRangeNew
                t={t}
                values={formData?.[populators?.name]?.range}
                name={populators?.name}
                onFilterChange={field.onChange}
                inputRef={field.ref}
                errorStyle={fieldState.error || errors?.[populators?.name]}
              />
            )}
          />
        );

      case "component":
        return (
          <Controller
            name={config?.key}
            control={control}
            render={({ field, fieldState }) => (
              <Component
                userType={"employee"}
                t={t}
                setValue={setValue}
                onSelect={setValue}
                config={config}
                data={formData}
                formData={formData}
                register={register}
                errors={errors}
                props={{ field, fieldState, ...customProps }}
                setError={setError}
                clearErrors={clearErrors}
                onBlur={field.onBlur}
                control={control}
                getValues={getValues}
                responseData={data}
              />
            )}
          />
        );

      default:
        return populators?.dependency !== false ? populators : null;
    }
  };

  return (
    <React.Fragment>
      {fields?.map((item, index) => {
        return (
          <Fragment key={index}>
            <LabelFieldPair
              className={"digit-inbox-search-composer-label-pair"}
              vertical={true}
            >
              {item.label && (
                <HeaderComponent className={`label search-screen`}>
                  <div className={`label-container`}>
                    <label className={`label-styles`}>
                      {StringManipulator(
                        "TOSENTENCECASE",
                        StringManipulator("TRUNCATESTRING", t(item.label), {
                          maxLength: 64,
                        })
                      )}
                    </label>
                    <div style={{ color: "#B91900" }}>
                      {item?.isMandatory ? " * " : null}
                    </div>
                    {item?.infoMessage ? (
                      <div className="info-icon">
                        <SVG.InfoOutline
                          width="1.1875rem"
                          height="1.1875rem"
                          fill="#505A5F"
                        />
                        <span className="infotext">{t(item?.infoMessage)}</span>
                      </div>
                    ) : null}
                  </div>
                </HeaderComponent>
              )}
              {fieldSelector(
                item.type,
                item.populators,
                item.isMandatory,
                item?.disable,
                item?.component,
                item
              )}
              {item?.populators?.name &&
              errors &&
              errors[item?.populators?.name] &&
              Object.keys(errors[item?.populators?.name]).length ? (
                <ErrorMessage
                  message={t(item?.populators?.error)}
                  truncateMessage={true}
                  maxLength={256}
                  showIcon={true}
                />
              ) : null}
            </LabelFieldPair>
            {item?.addDivider ? <Divider variant={"small"}></Divider> : null}
          </Fragment>
        );
      })}
    </React.Fragment>
  );
};

export default RenderFormFields;