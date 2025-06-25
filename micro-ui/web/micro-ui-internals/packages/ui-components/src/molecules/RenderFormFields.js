import React,{Fragment} from "react";
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
            defaultValue={formData?.[populators?.name]}
            render={({ onChange, ref, value }) => (
              <BoundaryFilter
              levelConfig={populators.levelConfig}
              hierarchyType={populators.hierarchyType}
              module={populators.module}
              layoutConfig={populators.layoutConfig}
              preSelected={populators.preSelected}
              frozenData={populators.frozenData}
              onChange={onChange}
            />
            )}
            name={populators?.name}
            rules={{ required: isMandatory, ...populators.validation, ...customRules }}
            control={control}
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
            defaultValue={formData?.[populators?.name]}
            render={({ onChange, ref, value }) => (
              <TextInput
                type={type}
                value={formData?.[populators?.name]}
                name={populators?.name}
                onChange={onChange}
                inputRef={ref}
                max={populators?.max}
                min={populators?.min}
                errorStyle={errors?.[populators?.name]}
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
            name={populators?.name}
            rules={{ required: isMandatory, ...populators.validation, ...customRules }}
            control={control}
          />
        );

      case "textarea":
        return (
          <Controller
            defaultValue={formData?.[populators?.name]}
            render={({ onChange, ref, value }) => (
              <TextArea
                type={type}
                value={formData?.[populators?.name]}
                name={populators?.name}
                onChange={onChange}
                inputRef={ref}
                disabled={disable}
                errorStyle={errors?.[populators?.name]}
                populators={populators}
                maxlength={populators?.validation?.maxlength}
                minlength={populators?.validation?.minlength}
              />
            )}
            name={populators?.name}
            rules={{ required: isMandatory, ...populators.validation }}
            control={control}
          />
        );
      case "mobileNumber":
        return (
          <Controller
            render={(props) => (
              <MobileNumber
                inputRef={props.ref}
                onChange={props.onChange}
                value={props.value}
                disable={disable}
                {...props}
                errorStyle={errors?.[populators?.name]}
              />
            )}
            defaultValue={populators.defaultValue}
            name={populators?.name}
            rules={{ required: isMandatory, ...populators.validation }}
            control={control}
          />
        );
      case "custom":
        return (
          <Controller
            render={(props) => populators.component({ ...props, setValue }, populators.customProps)}
            defaultValue={populators.defaultValue}
            name={populators?.name}
            control={control}
          />
        );
        case "radio":
        case "dropdown":
        case "select":
        case "radioordropdown":
        case "toggle":
        return (
          <Controller
            render={(props) => (
              <CustomDropdown
                t={t}
                label={config?.label}
                type={type}
                onBlur={props.onBlur}
                value={props.value}
                inputRef={props.ref}
                onChange={props.onChange}
                config={populators}
                disabled={config?.disable}
                errorStyle={errors?.[populators?.name]}
                variant={
                  populators?.variant
                    ? populators?.variant
                    : errors?.[populators?.name]
                    ? "digit-field-error"
                    : ""
                }
              />
            )}
            rules={{ required: isMandatory, ...populators.validation }}
            defaultValue={formData?.[populators?.name]}
            name={populators?.name}
            control={control}
          />
        );

      case "multiselectdropdown":
        return (
          <Controller
            name={`${populators?.name}`}
            control={control}
            defaultValue={formData?.[populators?.name]}
            rules={{ required: populators?.isMandatory }}
            render={(props) => {
              return (
                <div style={{ gridAutoFlow: "row", width: "100%" }}>
                  <MultiSelectDropdown
                    options={populators?.options}
                    optionsKey={populators?.optionsKey}
                    chipsKey={populators?.chipsKey}
                    props={props}
                    isPropsNeeded={true}
                    onSelect={(e) => {
                      props.onChange(
                        e
                          ?.map((row) => {
                            return row?.[1] ? row[1] : null;
                          })
                          .filter((e) => e)
                      );
                    }}
                    selected={props?.value || []}
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
              );
            }}
          />
        );
      case "locationdropdown":
        return (
          <Controller
            name={`${populators?.name}`}
            control={control}
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
                    disabled={disable}
                    setValue={setValue}
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
            control={control}
            defaultValue={formData?.[populators?.name]}
            rules={{ required: populators?.isMandatory, ...populators.validation }}
            render={(props) => {
              return (
                <div style={{ display: "grid", gridAutoFlow: "row",width:"100%" }}>
                  <ApiDropdown props={props} populators={populators} formData={formData} inputRef={props.ref} errors={errors} disabled={disable} />
                </div>
              );
            }}
          />
        );

      case "workflowstatesfilter":
        return (
          <Controller
            name={`${populators?.name}`}
            control={control}
            defaultValue={formData?.[populators?.name]}
            rules={{ required: populators?.isMandatory }}
            render={(props) => {
              return (
                <div style={{ display: "grid", gridAutoFlow: "row",width:"100%" }}>
                  <WorkflowStatusFilter inboxResponse={data} props={props} populators={populators} t={t} formData={formData} />
                </div>
              );
            }}
          />
        );
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
            rules={{ required: isMandatory, ...populators.validation }}
            defaultValue={formData?.[populators?.name]}
            name={populators?.name}
            control={control}
          />
        );

      case "component":
        return (
          <Controller
            render={(props) => (
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
                props={{ ...props, ...customProps }}
                setError={setError}
                clearErrors={clearErrors}
                onBlur={props.onBlur}
                control={control}
                getValues={getValues}
                responseData={data}
              />
            )}
            name={config?.key}
            control={control}
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
          <>
            <LabelFieldPair
              key={index}
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
                        <span class="infotext">{t(item?.infoMessage)}</span>
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
          </>
        );
      })}
    </React.Fragment>
  );
};

export default RenderFormFields;
