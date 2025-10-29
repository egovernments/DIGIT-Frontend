import { Card,  SVG } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect, useRef  } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { DigitJSONForm } from "../../Module";
import _ from "lodash";
import { buildLocalizationMessages } from "./localizationUtility";
import { Loader } from "@egovernments/digit-ui-components";

/*

created the foem using rjfs json form 

https://rjsf-team.github.io/react-jsonschema-form/docs/

*/
const onFormError = (errors) => console.log("I have", errors.length, "errors to fix");

const MDMSAdd = ({ defaultFormData, updatesToUISchema, screenType = "add", onViewActionsSelect, viewActions, onSubmitEditAction, ...props }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [spinner, toggleSpinner] = useState(false);
  const [uiSchema, setUiSchema] = useState({});
  const [api, setAPI] = useState(false);
  const [noSchema, setNoSchema] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [disableForm, setDisableForm] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const { moduleName, masterName, from } = Digit.Hooks.useQueryParams();
  const FormSession = Digit.Hooks.useSessionStorage(`MDMS_${screenType}_${moduleName}_${masterName}`, {});
  const [sessionFormData, setSessionFormData, clearSessionFormData] = FormSession;
  const [formSchema, setFormSchema] = useState({});
  const [session, setSession] = useState(sessionFormData);

  useEffect(() => {
    setSession({ ...session, ...defaultFormData });
  }, [defaultFormData]);

  const { t } = useTranslation();
  const history = useHistory();
  const reqCriteria = {
    url: `/${Digit.Hooks.workbench.getMDMSContextPath()}/schema/v1/_search`,
    params: {},
    body: {
      SchemaDefCriteria: {
        tenantId: tenantId,
        codes: [`${moduleName}.${masterName}`],
      },
    },
    config: {
      enabled: moduleName && masterName && true,
      select: (data) => {
        if (data?.SchemaDefinitions?.length == 0) {
          setNoSchema(true);
        }
        if (data?.SchemaDefinitions?.[0]?.definition?.["x-ui-schema"]?.["ui-apidetails"]) {
          setAPI(data?.SchemaDefinitions?.[0]?.definition?.["x-ui-schema"]?.["ui-apidetails"]);
        }
        return data?.SchemaDefinitions?.[0] || {};
      },
    },
    changeQueryName: "schema",
  };

  const { isLoading, data: schema, isFetching } = Digit.Hooks.useCustomAPIHook(reqCriteria);
  const body = api?.requestBody
    ? { ...api?.requestBody }
    : {
        Mdms: {
          tenantId: tenantId,
          schemaCode: `${moduleName}.${masterName}`,
          uniqueIdentifier: null,
          data: {},
          isActive: true,
        },
      };
  const reqCriteriaAdd = {
    url: api ? api?.url : Digit.Utils.workbench.getMDMSActionURL(moduleName, masterName, "create"),
    params: {},
    body: { ...body },
    config: {
      enabled: schema ? true : false,
      select: (data) => {
        return data?.SchemaDefinitions?.[0] || {};
      },
    },
  };

  const gotoView = () => {
    setTimeout(() => {
      history.push(
        `/${window?.contextPath}/employee/workbench/mdms-search-v2?moduleName=${moduleName}&masterName=${masterName}${
          from ? `&from=${from}` : ""
        }`
      );
    }, 2000);
  };

  const mutation = Digit.Hooks.useCustomAPIMutationHook(reqCriteriaAdd);

  // Define a localization upsert mutation similar to how the main mutation is defined
  const localizationReqCriteria = {
    url: `/localization/messages/v1/_upsert`,
    params: {},
    body: {},
    config: {
      enabled: false,
    },
  };
  const localizationMutation = Digit.Hooks.useCustomAPIMutationHook(localizationReqCriteria);

  const closeToast = () => {
    setTimeout(() => {
      setShowToast(null);
    }, 5000);
  };


  const tranformLocModuleName = (localModuleName) => {
    if (!localModuleName) return null;
      return localModuleName.replace(/[^a-zA-Z0-9]/g, "-").toUpperCase();
  };

  const schemaCodeToValidate = `${moduleName}.${masterName}`;
  const onSubmit = async (data, additionalProperties) => {
    const validationConfig = Digit?.Customizations?.["commonUiConfig"]?.["AddMdmsConfig"]?.[schemaCodeToValidate];
    if (!validationConfig?.validateForm){
      console.warn(`No validation configuration found for schema: ${schemaCodeToValidate}`);
    }else{
    const validation = await validationConfig.validateForm(data, { tenantId: tenantId });
    if (validation && !validation?.isValid) {
      setShowToast(t(validation.message) || t('VALIDATION_ERROR_DEFAULT'));
      setShowErrorToast(true);
      toggleSpinner(false);
      return;
    }
  }
    let locale = Digit.StoreData.getCurrentLanguage();
    toggleSpinner(true);
  
    const onSuccess = async (resp) => {
      // After main MDMS add success
      const jsonPath = api?.responseJson ? api?.responseJson : "mdms[0].id";
      setShowToast(`${t("WBH_SUCCESS_MDMS_MSG")} ${_.get(resp, jsonPath, "NA")}`);
      setShowErrorToast(false);
  
      const locModuleName = `digit-mdms-${schema?.code}`;
      const messages = buildLocalizationMessages(additionalProperties, locModuleName, locale);
  
      if (messages.length > 0) {
        const localizationBody = {
          tenantId: tenantId,
          messages: messages,
        };
  
        // Perform localization upsert
        localizationMutation.mutate(
          {
            params: {},
            body: localizationBody,
          },
          {
            onError: (resp) => {
              toggleSpinner(false);
              setShowToast(`${t("WBH_ERROR_MDMS_DATA")} ${t(resp?.response?.data?.Errors?.[0]?.code)}`);
              setShowErrorToast(true);
              closeToast();
            },
            onSuccess: () => {
              toggleSpinner(false);
              setSessionFormData({});
              setSession({});
              closeToast();
              gotoView();
            },
          }
        );
      } else {
        // No localization messages to upsert, just proceed
        toggleSpinner(false);
        setSessionFormData({});
        setSession({});
        closeToast();
        gotoView();
      }
    };
  
    const onError = (resp) => {
      toggleSpinner(false);
      setShowToast(`${t("WBH_ERROR_MDMS_DATA")} ${t(resp?.response?.data?.Errors?.[0]?.code)}`);
      setShowErrorToast(true);
      closeToast();
    };
  
    _.set(body, api?.requestJson ? api?.requestJson : "Mdms.data", { ...data });
    mutation.mutate(
      {
        params: {},
        body: {
          ...body,
        },
      },
      {
        onError,
        onSuccess,
      }
    );
  };

  const onFormValueChange = (updatedSchema, element) => {
    const { formData } = updatedSchema;
    if (!_.isEqual(session, formData)) {
      setSession((prev) => ({ ...prev, ...formData }));
    }
  };

  useEffect(() => {
    if (schema && schema?.definition) {
      Digit.Utils.workbench.updateTitleToLocalisationCodeForObject(schema?.definition, schema?.code);
      setFormSchema(schema);

      if (schema?.definition?.["x-ref-schema"]?.length > 0) {
        schema?.definition?.["x-ref-schema"]?.map((dependent) => {
          if (dependent?.fieldPath) {
            let updatedPath = Digit.Utils.workbench.getUpdatedPath(dependent?.fieldPath);
            if (_.get(schema?.definition?.properties, updatedPath)) {
              _.set(schema?.definition?.properties, updatedPath, {
                ..._.get(schema?.definition?.properties, updatedPath, {}),
                enum: [],
                schemaCode: dependent?.schemaCode,
                fieldPath: dependent?.fieldPath,
                tenantId,
              });
            }
          }
        });
        
        setFormSchema({ ...schema });
        setDisableForm(true);
        setTimeout(() => {
          setDisableForm(false);
        });
      }
    }
  }, [schema]);

  const debouncedSave = useRef(_.debounce((newSession) => {
  setSessionFormData((prev) => ({ ...prev, ...newSession }));
}, 500)).current;

useEffect(() => {
  if (!_.isEqual(sessionFormData, session)) {
    debouncedSave(session);
  }
}, [session]);


  useEffect(() => {
    if (!_.isEqual(sessionFormData, session)) {
      const timer = setTimeout(() => {
        setSessionFormData((prev) => ({ ...prev, ...session }));
      }, 1000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [session]);

  if (noSchema) {
    return (
      <Card>
        <span className="workbench-no-schema-found">
          <h4>{t("WBH_NO_SCHEMA_FOUND")}</h4>
          <SVG.NoResultsFoundIcon width="20em" height={"20em"} />
        </span>
      </Card>
    );
  }

  if (isLoading || !formSchema || Object.keys(formSchema) == 0) {
    return <Loader page={true} variant={"PageLoader"} />;
  }

  const uiJSONSchema = formSchema?.["definition"]?.["x-ui-schema"];
  return (
    <React.Fragment>
      {spinner &&  <Loader page={true} variant={"OverlayLoader"} />}
      {formSchema && (
        <DigitJSONForm
          schema={formSchema}
          onFormChange={onFormValueChange}
          onFormError={onFormError}
          formData={session}
          onSubmit={screenType === "add" ? onSubmit : onSubmitEditAction}
          uiSchema={{ ...uiSchema, ...uiJSONSchema, ...updatesToUISchema }}
          showToast={showToast}
          closeToast={closeToast}
          setShowToast={setShowToast}
          showErrorToast={showErrorToast}
          setShowErrorToast={setShowErrorToast}
          screenType={screenType}
          viewActions={viewActions}
          onViewActionsSelect={onViewActionsSelect}
          disabled={disableForm}
        ></DigitJSONForm>
      )}
    </React.Fragment>
  );
};

export default MDMSAdd;
