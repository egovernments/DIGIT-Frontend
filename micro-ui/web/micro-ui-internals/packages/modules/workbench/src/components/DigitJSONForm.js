import {
  Header,
  Toast,
  Card,
  Button,
  ActionBar,
  AddFilled,
  SubmitBar,
  CardLabelError,
  SVG,
  Menu,
  CollapseAndExpandGroups,
} from "@egovernments/digit-ui-react-components";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import _ from "lodash";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import { titleId } from "@rjsf/utils";
import CustomDropdown from "./MultiSelect";
import CustomDropdownV2 from "./MultiSelectV2";
import CustomCheckbox from "./Checbox";
import { BulkModal } from "./BulkModal";

const AdditionalPropertiesContext = createContext();
export const useAdditionalProperties = () => useContext(AdditionalPropertiesContext);

const uiSchema = {
  "ui:title": " ",
  "ui:classNames": "my-class",
  "ui:submitButtonOptions": {
    props: {
      disabled: false,
      className: "btn btn-info",
    },
    norender: true,
    submitText: "Submit",
  },
  "ui:submitButtonOptions": {
    props: {
      className: "object-jk",
    },
  },
};

// Removed transformErrors to reduce re-renders
// Removed Digit references from errors to reduce complexity

const getArrayWrapperClassName = (type) => {
  switch (type) {
    case "array":
      return "jk-array-of-array";
    case "object":
      return "jk-array-objects";
    default:
      return "jk-array-of-non-objects";
  }
};

function ArrayFieldItemTemplate(props) {
  const { t } = useTranslation();
  const { children, className, index, onDropIndexClick, schema, disabled } = props;
  const isArrayOfObjects = schema?.type === "object";
  const newClass = getArrayWrapperClassName(schema?.type);
  return (
    <div className={`${className} ${newClass}`}>
      <span className="array-children">{children}</span>
      {props.hasRemove && (
        <div className="array-remove-button-wrapper">
          <Button
            label={t("WBH_DELETE_ACTION")}
            variation="secondary"
            className="array-remove-button"
            icon={<SVG.Delete width={"28"} height={"28"} />}
            onButtonClick={onDropIndexClick(index)}
            type="button"
            isDisabled={disabled}
          />
        </div>
      )}
    </div>
  );
}

function TitleFieldTemplate(props) {
  const { id, required, title } = props;
  return (
    <header id={id}>
      {title}
      {required && <mark>*</mark>}
    </header>
  );
}

function ArrayFieldTitleTemplate(props) {
  const { title, idSchema } = props;
  const id = titleId(idSchema);
  return null;
}

function ArrayFieldTemplate(props) {
  const { t } = useTranslation();
  if (props?.required && !props?.schema?.minItems) {
    props.schema.minItems = 1;
  }

  return (
    <div className="array-wrapper">
      {props.items.map((element, index) => (
        <span className="array-element-wrapper" key={index}>
          <ArrayFieldItemTemplate index={index} {...element} />
        </span>
      ))}
      {props.canAdd && (
        <Button
          label={`${t("WBH_ADD")} ${t(props?.title)}`}
          variation="secondary"
          icon={<AddFilled style={{ height: "20px", width: "20px" }} />}
          onButtonClick={props.onAddClick}
          type="button"
          isDisabled={props.disabled}
        />
      )}
    </div>
  );
}

const tranformLocModuleName = (localModuleName) => {
  if (!localModuleName) return null;
    return localModuleName.replace(/[^a-zA-Z0-9]/g, "-").toUpperCase();
};

function ObjectFieldTemplate(props) {
  const { formData, schema, idSchema, formContext } = props;
  const { schemaCode, MdmsRes, additionalProperties } = formContext;
  const isRoot = idSchema["$id"] === "digit_root";

  const localisableFields = MdmsRes?.find((item) => item.schemaCode === schemaCode)?.localisation?.localisableFields || [];

  const children = props.properties.map((element) => {
    const fieldName = element.name;
    const inputValue = formData[fieldName];
    const isLocalisable = localisableFields.some((field) => field.fieldPath === fieldName);

    if (isLocalisable) {
      const fieldProps = additionalProperties?.[fieldName];
      const mdmsCode = fieldProps?.mdmsCode;
      const localizationCode = fieldProps?.localizationCode;
      const transformedLocCode= tranformLocModuleName(localizationCode);
      const isMultiRootTenant = Digit.Utils.getMultiRootTenant();
      if(isMultiRootTenant){
        return (
          <div key={fieldName} style={{ marginBottom: "1rem" }}>
            {/* Actual Input Field */}
            <div className="field-wrapper object-wrapper" id={`${idSchema["$id"]}_${fieldName}`}>
              {element.content}
            </div>
        
            {/* MDMS and Localization Codes */}
            <div className="code-details" style={{ padding: "0.5rem 1.5rem", backgroundColor: "#f9f9f9", border: "1px solid #e0e0e0", borderRadius: "4px" }}>
              <div className="code-row" style={{ display: "flex", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                <label className="code-key" style={{ flex: "0 0 150px", fontWeight: "bold", color: "#444", textAlign: "left" }}>
                  mdms code:
                </label>
                <div className="code-value-container" style={{ display: "flex", flexDirection: "column", flex: "1" }}>
                  <span className="code-value" style={{ fontSize: "0.9rem", color: "#555", marginBottom: "0.2rem" }}>
                    {mdmsCode || ""}
                  </span>
                </div>
              </div>
              <div className="code-row" style={{ display: "flex", alignItems: "flex-start" }}>
                <label className="code-key" style={{ flex: "0 0 150px", fontWeight: "bold", color: "#444", textAlign: "left" }}>
                  localization code:
                </label>
                <div className="code-value-container" style={{ display: "flex", flexDirection: "column", flex: "1" }}>
                  <span className="code-value" style={{ fontSize: "0.9rem", color: "#555", marginBottom: "0.2rem" }}>
                    {transformedLocCode || ""}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      }

           
    }

    return (
      <div key={fieldName} className="field-wrapper object-wrapper" id={`${idSchema["$id"]}_${fieldName}`}>
        {element.content}
      </div>
    );
  });

  return (
    <div id={idSchema["$id"]}>
      {isRoot ? (
        children
      ) : (
        <CollapseAndExpandGroups showHelper={true} groupHeader={""} groupElements={true}>
          {children}
        </CollapseAndExpandGroups>
      )}
    </div>
  );
}

function CustomFieldTemplate(props) {
  const { t } = useTranslation();
  const { moduleName, masterName } = Digit.Hooks.useQueryParams();
  const { id, classNames, style, label, help, required, description, errors, children } = props;

  let titleCode = label;
  let additionalCode = "";
  if (
    moduleName &&
    masterName &&
    typeof Digit?.Utils?.locale?.getTransformedLocale === "function" &&
    !label?.includes(Digit.Utils.locale.getTransformedLocale(moduleName)) &&
    !label?.includes(Digit.Utils.locale.getTransformedLocale(masterName))
  ) {
    titleCode = Digit.Utils.locale.getTransformedLocale(`${moduleName}.${moduleName}_${label?.slice(0, -2)}`);
    additionalCode = label?.slice(-2);
  }

  return (
    <span>
      <div className={classNames} style={style}>
        <label htmlFor={id} className="control-label" id={"label_" + id}>
          <span className="tooltip">
            {t(titleCode)} {additionalCode}
            <span className="tooltiptext">
              <span className="tooltiptextvalue">{t(`TIP_${titleCode}`)}</span>
            </span>
          </span>
          {required ? "*" : null}
        </label>
        {description}
        <span className="all-input-field-wrapper">
          {children}
          {errors}
          {help}
        </span>
      </div>
    </span>
  );
}

const FieldErrorTemplate = ({ errors }) =>
  errors && errors.length > 0 && errors[0] ? <CardLabelError>{errors[0]}</CardLabelError> : null;

const DigitJSONForm = ({
  schema,
  onSubmit,
  uiSchema: inputUiSchema,
  showToast,
  showErrorToast,
  formData = {},
  onFormChange,
  onFormError,
  screenType = "add",
  onViewActionsSelect,
  viewActions,
  disabled = false,
  setShowToast,
  setShowErrorToast,
  v2 = true,
}) => {
  const { t } = useTranslation();

  const [additionalProperties, setAdditionalProperties] = useState({});
  const [displayMenu, setDisplayMenu] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const { moduleName, masterName } = Digit.Hooks.useQueryParams();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { data: MdmsRes } = Digit.Hooks.useCustomMDMS(
    tenantId,
    "Workbench",
    [{ name: "UISchema" }],
    {
      select: (data) => data?.["Workbench"]?.["UISchema"],
    }
  );

  // Compute additionalProperties whenever formData or MdmsRes changes
  useEffect(() => {
    if (schema?.code && MdmsRes && formData) {
      const localisableFields =
        MdmsRes?.find((item) => item.schemaCode === schema.code)?.localisation?.localisableFields || [];
      let newAdditionalProps = {};
      for (const fieldName in formData) {
        const inputValue = formData[fieldName];
        const isLocalisable = localisableFields.some((field) => field.fieldPath === fieldName);
        if (isLocalisable && inputValue !== undefined) {
          const mdmsCode = (inputValue || "").replace(/\s+/g, "").toUpperCase();
          const localizationCode = `${schema.code}_${fieldName}_${mdmsCode}`.toUpperCase();
          newAdditionalProps[fieldName] = {
            localizationMessage: inputValue,
            mdmsCode,
            localizationCode,
          };
        }
      }
      setAdditionalProperties(newAdditionalProps);
    }
  }, [formData, MdmsRes, schema]);

  const reqCriteriaSecondUpsert = {
    url: `/localization/messages/v1/_upsert`,
    params: {},
    body: {},
    config: {
      enabled: false, 
    },
  };
  const secondFormatLocalizationMutation = Digit.Hooks.useCustomAPIMutationHook(reqCriteriaSecondUpsert);

const transformFormDataWithProperties = (formData, additionalProperties) => {
  const transformedFormData = { ...formData };
  for (const fieldName in additionalProperties) {
    if (additionalProperties.hasOwnProperty(fieldName)) {
      const fieldProps = additionalProperties[fieldName];
      if (fieldProps?.localizationCode) {
        transformedFormData[fieldName] = fieldProps.mdmsCode;
      }
    }
  }
  return transformedFormData;
};

// Utility function to construct second format localization messages
const buildSecondFormatMessages = (additionalProperties, schemaCode, locale) => {
  const schemaCodeParts = schemaCode?.split(".") || [];
  const firstPart = schemaCodeParts[0]?.toLowerCase() || "default";
  const secondPart = schemaCodeParts[1]?.toUpperCase() || "";

  const messages = [];
  for (const fieldName in additionalProperties) {
    if (additionalProperties.hasOwnProperty(fieldName)) {
      const fieldProps = additionalProperties[fieldName];
      const { mdmsCode, localizationMessage } = fieldProps;
      if (mdmsCode && localizationMessage) {
        const code = `${secondPart}.${mdmsCode}`;
        messages.push({
          code: code,
          message: localizationMessage,
          module: firstPart,
          locale: locale,
        });
      }
    }
  }
  return messages;
};

const onSubmitV2 = async ({ formData }, e) => {
  let locale = Digit.StoreData.getCurrentLanguage();
  const transformedFormData = transformFormDataWithProperties(formData, additionalProperties);
  const secondFormatMessages = buildSecondFormatMessages(additionalProperties, schema?.code, locale);
  if (secondFormatMessages.length > 0) {
    try {
      await secondFormatLocalizationMutation.mutateAsync({
        params: {},
        body: {
          tenantId: tenantId,
          messages: secondFormatMessages,
        },
      });
    } catch (err) {
      console.error("Second format localization upsert failed:", err);
    }
  }
  onSubmit && onSubmit(transformedFormData, additionalProperties);
};


  const customWidgets = { SelectWidget: v2 ? CustomDropdown : CustomDropdownV2, CheckboxWidget: CustomCheckbox };

  const onError = (errors) => {
    onFormError && onFormError(errors);
  };

  return (
    <AdditionalPropertiesContext.Provider value={{ additionalProperties, updateAdditionalProperties: () => {} }}>
      <React.Fragment>
        <Header className="digit-form-composer-header">
          {screenType === "add" ? t("WBH_ADD_MDMS") : screenType === "view" ? t("WBH_VIEW_MDMS") : t("WBH_EDIT_MDMS")}
        </Header>
        <BulkModal
          showBulkUploadModal={showBulkUploadModal}
          setShowBulkUploadModal={setShowBulkUploadModal}
          moduleName={moduleName}
          masterName={masterName}
          uploadFileTypeXlsx={false}
        />
        <Card className="workbench-create-form">
          <Header className="digit-form-composer-sub-header">
            {typeof Digit?.Utils?.workbench?.getMDMSLabel === "function"
              ? t(Digit.Utils.workbench.getMDMSLabel(`SCHEMA_` + schema?.code))
              : `SCHEMA_${schema?.code}`}
          </Header>
          <Form
            schema={schema?.definition}
            validator={validator}
            showErrorList={false}
            formData={formData}
            noHtml5Validate={true}
            onChange={onFormChange}  
            formContext={{
              schemaCode: schema?.code,
              MdmsRes,
              localizationData: {},
              additionalProperties,
            }}
            onSubmit={onSubmitV2}
            idPrefix="digit_root"
            templates={{
              FieldErrorTemplate,
              ArrayFieldTemplate,
              FieldTemplate: CustomFieldTemplate,
              ObjectFieldTemplate,
              TitleFieldTemplate,
              ArrayFieldTitleTemplate,
              ArrayFieldItemTemplate,
            }}
            widgets={customWidgets}
            uiSchema={{ ...uiSchema, ...inputUiSchema }}
            onError={onError}
            disabled={disabled}
          >
            {(screenType === "add" || screenType === "edit") && (
              <ActionBar className="action-bar">
                {screenType === "add" && (
                  <Button
                    className="action-bar-button"
                    variation="secondary"
                    label={t("WBH_LOC_BULK_UPLOAD_XLS")}
                    onButtonClick={() => setShowBulkUploadModal(true)}
                  />
                )}
                <SubmitBar
                  label={screenType === "edit" ? t("WBH_ADD_MDMS_UPDATE_ACTION") : t("WBH_ADD_MDMS_ADD_ACTION")}
                  submit="submit"
                />
              </ActionBar>
            )}
            {screenType === "view" && (
              <ActionBar>
                {displayMenu ? (
                  <Menu
                    localeKeyPrefix=""
                    options={viewActions}
                    optionKey={"label"}
                    t={t}
                    onSelect={onViewActionsSelect}
                    textStyles={{ margin: "0px" }}
                  />
                ) : null}
                <SubmitBar label={t("WORKS_ACTIONS")} onSubmit={() => setDisplayMenu(!displayMenu)} />
              </ActionBar>
            )}
          </Form>
        </Card>
        {showToast && (
          <Toast
            label={t(showToast)}
            error={showErrorToast}
            onClose={() => {
              setShowToast(null);
            }}
            isDleteBtn={true}
          ></Toast>
        )}
      </React.Fragment>
    </AdditionalPropertiesContext.Provider>
  );
};

export default DigitJSONForm;