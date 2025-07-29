import {
  Header,
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
import { Toast } from "@egovernments/digit-ui-components";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import _ from "lodash";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
// import { UiSchema } from '@rjsf/utils';
import { titleId } from "@rjsf/utils";
import CustomDropdown from "./MultiSelect";
import CustomDropdownV2 from "./MultiSelectV2";
import CustomCheckbox from "./Checbox";
import { BulkModal } from "./BulkModal";
import { tranformLocModuleName } from "../pages/employee/localizationUtility";
import { PopUp } from "@egovernments/digit-ui-components";
import JSONViewer from "./JSONViewer";

/*created the form using rjfs json form 
https://rjsf-team.github.io/react-jsonschema-form/docs/
*/

/* context added for state management in MdmsAddV2*/
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
  const isArrayOfObjects = schema?.type == "object";
  const newClass = getArrayWrapperClassName(schema?.type);
  return (
    <div className={`${className} ${newClass}`}>
      <span className={"array-children"}>{children}</span>
      {isArrayOfObjects ? (
        <span className="array-obj">
          {props.hasRemove && (
            <div className="array-remove-button-wrapper">
              <Button
                label={`${t("WBH_DELETE_ACTION")}`}
                variation="secondary"
                className="array-remove-button"
                icon={<SVG.Delete width={"28"} height={"28"} />}
                onButtonClick={onDropIndexClick(index)}
                type="button"
                isDisabled={disabled}
              />
            </div>
          )}
        </span>
      ) : (
        props.hasRemove && (
          <div className="array-remove-button-wrapper">
            <Button
              label={`${t("WBH_DELETE_ACTION")}`}
              variation="secondary"
              className="array-remove-button"
              icon={<SVG.Delete width={"28"} height={"28"} />}
              onButtonClick={onDropIndexClick(index)}
              type="button"
              isDisabled={disabled}
            />
          </div>
        )
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
      {props.items.map((element, index) => {
        return (
          <span className="array-element-wrapper">
            <ArrayFieldItemTemplate title={props?.title} key={index} index={index} {...element}></ArrayFieldItemTemplate>
          </span>
        );
      })}
      {props.canAdd && (
        <Button
          label={`${t(`WBH_ADD`)} ${t(props?.title)}`}
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

function ObjectFieldTemplate(props) {
  const { formData, schema, idSchema, formContext } = props;
  const { schemaCode, MdmsRes, additionalProperties } = formContext;
  const isRoot = idSchema["$id"] === "digit_root";
  const { t } = useTranslation();

  const localisableFields = MdmsRes?.find((item) => item?.schemaCode === schemaCode)?.localisation?.localisableFields || [];
  const children = props.properties.map((element) => {
    const fieldName = element.name;
    const isLocalisable = localisableFields.some((field) => field?.fieldPath === fieldName);

    if (isLocalisable) {
      const fieldProps = additionalProperties?.[fieldName];
      const mdmsCode = fieldProps?.mdmsCode;
      const localizationCode = fieldProps?.localizationCode;
      const transformedLocCode = tranformLocModuleName(localizationCode);
      return (
        <div key={fieldName} style={{ marginBottom: "1rem" }}>
          <div className="field-wrapper object-wrapper" id={`${idSchema["$id"]}_${fieldName}`}>
            {element.content}
          </div>

          {/* MDMS and Localization Codes */}
          <div className="code-details">
            <div className="code-row">
              <label className="code-key">{t("MDMS_CODE_WORKBENCH")}:</label>
              <div className="code-value-container">
                <span className="code-value">{mdmsCode || ""}</span>
              </div>
            </div>
            <div className="code-row">
              <label className="code-key">{t("LOCALIZATION_CODE_WORKBENCH")}:</label>
              <div className="code-value-container">
                <span className="code-value">{transformedLocCode || ""}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div key={fieldName} className="field-wrapper object-wrapper" id={`${idSchema["$id"]}_${fieldName}`}>
        {element.content}
      </div>
    );
  });

  return (
    <div id={props?.idSchema?.["$id"]}>
      {/* {props.title} */}
      {props.description}

      {isRoot ? (
        children
      ) : (
        <CollapseAndExpandGroups showHelper={true} groupHeader={""} groupElements={true} children={children}></CollapseAndExpandGroups>
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
            <span className="tooltiptext" style={{ maxWidth: "540px" }}>
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

const FieldErrorTemplate = ({ errors }) => (errors && errors.length > 0 && errors[0] ? <CardLabelError>{errors[0]}</CardLabelError> : null);

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
  const [showPopUp, setShowPopUp] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const { moduleName, masterName } = Digit.Hooks.useQueryParams();
  const [internalFormData, setInternalFormData] = useState(formData);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const enableBulkUpload = window?.globalConfigs?.getConfig?.("ENABLE_MDMS_BULK_UPLOAD")
    ? window.globalConfigs.getConfig("ENABLE_MDMS_BULK_UPLOAD")
    : false;

  const { data: MdmsRes } = Digit.Hooks.useCustomMDMS(tenantId, "Workbench", [{ name: "UISchema" }], {
    select: (data) => data?.["Workbench"]?.["UISchema"],
  });

  useEffect(() => {
    if (schema?.code && MdmsRes && formData) {
      const localisableFields = MdmsRes?.find((item) => item?.schemaCode === schema?.code)?.localisation?.localisableFields || [];
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
      if (Object.hasOwn(additionalProperties, fieldName)) {
        const fieldProps = additionalProperties[fieldName];
        if (fieldProps?.localizationCode) {
          transformedFormData[fieldName] = fieldProps.mdmsCode;
        }
      }
    }
    return transformedFormData;
  };

  const buildSecondFormatMessages = (additionalProperties, schemaCode, locale) => {
    const schemaCodeParts = schemaCode?.split(".") || [];
    const firstPart = schemaCodeParts[0]?.toLowerCase() || "default";
    const secondPart = schemaCodeParts[1]?.toUpperCase() || "";

    const messages = [];
    for (const fieldName in additionalProperties) {
      if (Object.hasOwn(additionalProperties, fieldName)) {
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
    const locale = Digit.StoreData.getCurrentLanguage();
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
  const formDisabled = screenType === "view" ? true : disabled;

  const handleConfirm = () => {
    Object.assign(formData, updatedData); 
    setShowPopUp(false); 
  };

  const onFormChangeInternal = ({ formData }) => {
    setInternalFormData(formData);
    onFormChange && onFormChange({ formData });
  };
  

  return (
    <AdditionalPropertiesContext.Provider value={{ additionalProperties, updateAdditionalProperties: () => {} }}>
      <React.Fragment>
        <Header className="digit-form-composer-header">
          {screenType === "add" ? t("WBH_ADD_MDMS") : screenType === "view" ? t("WBH_VIEW_MDMS") : t("WBH_EDIT_MDMS")}
        </Header>
        {screenType === "add" && enableBulkUpload && (
          <BulkModal
            showBulkUploadModal={showBulkUploadModal}
            setShowBulkUploadModal={setShowBulkUploadModal}
            moduleName={moduleName}
            masterName={masterName}
            uploadFileTypeXlsx={false}
          />
        )}
        <Card className="workbench-create-form">
          <Header className="digit-form-composer-sub-header">
            {typeof Digit?.Utils?.workbench?.getMDMSLabel === "function"
              ? t(Digit.Utils.workbench.getMDMSLabel(`SCHEMA_` + schema?.code))
              : `SCHEMA_${schema?.code}`}
          </Header>
          {window?.globalConfigs?.getConfig?.("ENABLE_JSON_EDIT")&&  <div className="workbench-mdms-json-container">
            <Button
            className="action-bar-button" 
            variation="secondary" 
            label={t("WBH_SHOW_JSON")} 
            onButtonClick={() => setShowPopUp(true)} />
          </div>}
          <Form
            schema={schema?.definition}
            validator={validator}
            showErrorList={false}
            noHtml5Validate={true}
            formData={internalFormData}
            onChange={onFormChangeInternal}
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
            disabled={formDisabled}
          >
            {(screenType === "add" || screenType === "edit") && (
              <ActionBar className="action-bar">
                {screenType === "add" && enableBulkUpload && (
                  <Button
                    className="action-bar-button"
                    variation="secondary"
                    label={t("WBH_LOC_BULK_UPLOAD_XLS")}
                    onButtonClick={() => setShowBulkUploadModal(true)}
                  />
                )}
                <SubmitBar label={screenType === "edit" ? t("WBH_ADD_MDMS_UPDATE_ACTION") : t("WBH_ADD_MDMS_ADD_ACTION")} submit="submit" />
              </ActionBar>
            )}
            {screenType === "view" && viewActions && viewActions.length > 0 && (
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
                <SubmitBar label={t("WORKBENCH_ACTIONS")} onSubmit={() => setDisplayMenu(!displayMenu)} />
              </ActionBar>
            )}
          </Form>
        </Card>
        {showPopUp && (
          <PopUp
            type={"default"}
            children={[]}
            onOverlayClick={() => {
              setShowPopUp(false);
            }}
            onClose={() => {
              setShowPopUp(false);
            }}
            equalWidthButtons={"false"}
            footerChildren={[
              <Button
                className={"campaign-type-alert-button"}
                type={"button"}
                size={"large"}
                variation={"secondary"}
                label={t("WBH_CANCEL")}
                onButtonClick = {() => setShowPopUp(false)}
              />,
              <Button
                className={"campaign-type-alert-button"}
                type={"button"}
                size={"large"}
                variation={"primary"}
                label={t("WBH_CONFIRM")}
                onButtonClick={handleConfirm}
              />
            ]}
          >
            <JSONViewer 
            formData={formData} 
            screenType={screenType} 
            onDataUpdate={setUpdatedData}
            />
          </PopUp>
        )}
        {showToast && (
          <Toast
            label={t(showToast)}
            type={showErrorToast ? "error" : ""}
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