import { Card, Loader, SVG } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { DigitJSONForm } from "../../Module";
import _ from "lodash";
import { DigitLoader } from "../../components/DigitLoader";
import { WorkbenchProvider } from "../../hooks/useWorkbenchFormContext";
/*

created the foem using rjfs json form 

https://rjsf-team.github.io/react-jsonschema-form/docs/

*/
const onFormError = (errors) => console.log("I have", errors.length, "errors to fix");

const MDMSAdd = ({ defaultFormData, updatesToUISchema, screenType = "add", onViewActionsSelect, viewActions, onSubmitEditAction, ...props }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [spinner, toggleSpinner] = useState(false);
  // const stateId = Digit.ULBService.getStateId();

  const [uiSchema, setUiSchema] = useState({});
  const [uiConfigs, setUiConfigs] = useState({});
  const [noSchema, setNoSchema] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [disableForm, setDisableForm] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const { moduleName, masterName } = Digit.Hooks.useQueryParams();
  const [formSchema, setFormSchema] = useState({});
  const FormSession = Digit.Hooks.useSessionStorage(`MDMS_${screenType}_${moduleName}_${masterName}`, {});
  const [sessionFormData, setSessionFormData, clearSessionFormData] = FormSession;
  const [session, setSession] = useState(sessionFormData);

  const updateFormSchema = (schema) => {
    setFormSchema({ ...schema });
    /* added disable to get the complete form re rendered to get the enum values reflected */
    setDisableForm(true);
    setTimeout(() => {
      setDisableForm(false);
    });
  };
  useEffect(() => {
    setSession({ ...session, ...defaultFormData });
  }, [defaultFormData]);

  const { t } = useTranslation();
  const history = useHistory();
  /* logics about the schema fetching and overriding with UI Schema */
  const { isLoading: isSchemaLoading, data: schemaData } = Digit.Hooks.workbench.getMDMSSchema(`${moduleName}.${masterName}`, tenantId);

  useEffect(() => {
    if (schemaData?.schema?.definition) {
      setFormSchema({ ...schemaData?.schema });
    }
    if (schemaData?.uiSchema) {
      setUiSchema({ ...schemaData?.uiSchema });
    }
    if (schemaData?.schema?.noSchemaFound) {
      setNoSchema(true);
    }
    if (schemaData?.customUiConfigs) {
      setUiConfigs({ customUiConfigs: schemaData?.customUiConfigs });
    }
  }, [isSchemaLoading]);
  const addAPI = uiConfigs?.customUiConfigs?.addAPI;
  const body = addAPI?.requestBody
    ? {
      ...(JSON.parse(addAPI?.requestBody) || {}),
    }
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
    url: addAPI ? addAPI?.url : `/${Digit.Hooks.workbench.getMDMSContextPath()}/v2/_create/${moduleName}.${masterName}`,
    params: {},
    body: { ...body },
    config: {
      enabled: formSchema ? true : false,
      select: (data) => {
        return data?.SchemaDefinitions?.[0] || {};
      },
    },
  };

  const mutation = Digit.Hooks.useCustomAPIMutationHook(reqCriteriaAdd);
  const onSubmit = (data) => {
    toggleSpinner(true);
    const onSuccess = (resp) => {
      toggleSpinner(false);
      setSessionFormData({});
      setSession({});
      setShowErrorToast(false);
      const jsonPath = addAPI?.responseJson ? addAPI?.responseJson : "mdms[0].id";
      setShowToast(`${t("WBH_SUCCESS_MDMS_MSG")} ${_.get(resp, jsonPath, "NA")}`);
      closeToast();

      //here redirect to search screen(check if it's required cos user might want  add multiple masters in one go)
    };
    const onError = (resp) => {
      toggleSpinner(false);
      setShowToast(`${t("WBH_ERROR_MDMS_DATA")} ${t(resp?.response?.data?.Errors?.[0]?.code)}`);
      setShowErrorToast(true);
      closeToast();
    };

    _.set(body, addAPI?.requestJson ? addAPI?.requestJson : "Mdms.data", { ...data });
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
      setSession({ ...session, ...formData });
    }
  };

  useEffect(() => {
    if (!_.isEqual(sessionFormData, session)) {
      const timer = setTimeout(() => {
        setSessionFormData({ ...sessionFormData, ...session });
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

  const closeToast = () => {
    setTimeout(() => {
      setShowToast(null);
    }, 5000);
  };

  /* use newConfig instead of commonFields for local development in case needed */
  if (isSchemaLoading || !formSchema || Object.keys(formSchema) == 0) {
    return <Loader />;
  }
  const uiJSONSchema = formSchema?.["definition"]?.["x-ui-schema"];
  return (
    <React.Fragment>
      <WorkbenchProvider.Provider value={{ configs: uiConfigs, updateConfigs: setUiConfigs, updateSchema: updateFormSchema, schema: formSchema, formData: session }}>
        {spinner && <DigitLoader />}
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
            v2={false}
          ></DigitJSONForm>
        )}
      </WorkbenchProvider.Provider>
    </React.Fragment>
  );
};

export default MDMSAdd;
