import { Card, Loader, SVG } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { DigitJSONForm } from "../../Module";
import _ from "lodash";
import { DigitLoader } from "../../components/DigitLoader";

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
  const [api, setAPI] = useState(false);

  const [noSchema, setNoSchema] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [disableForm, setDisableForm] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const { moduleName, masterName } = Digit.Hooks.useQueryParams();
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

  const mutation = Digit.Hooks.useCustomAPIMutationHook(reqCriteriaAdd);
  const onSubmit = (data) => {
    toggleSpinner(true);
    const onSuccess = (resp) => {
      toggleSpinner(false);
      setSessionFormData({});
      setSession({});
      setShowErrorToast(false);
      const jsonPath = api?.responseJson ? api?.responseJson : "mdms[0].id";
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
      setSession({ ...session, ...formData });
    }
  };

  useEffect(() => {
    // setFormSchema(schema);
    /* localise */
    if (schema && schema?.definition) {
      Digit.Utils.workbench.updateTitleToLocalisationCodeForObject(schema?.definition, schema?.code);
      setFormSchema(schema);
      /* logic to search for the reference data from the mdms data api */

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
        /* added disable to get the complete form re rendered to get the enum values reflected */
        setDisableForm(true);
        setTimeout(() => {
          setDisableForm(false);
        });
      }
    }
  }, [schema]);

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
  if (isLoading || !formSchema || Object.keys(formSchema) == 0) {
    return <Loader />;
  }

  const uiJSONSchema = formSchema?.["definition"]?.["x-ui-schema"];

  function updateAllPropertiesBasedOnUIOrder(schema) {
    // Iterate through all properties in schema.definition.properties
    for (let propertyName in schema.definition.properties) {
      let targetProperty = schema.definition.properties[propertyName];

      // Check if the property has items and the x-ui-schema with a ui:order field
      if (targetProperty.items && targetProperty.items["x-ui-schema"] && targetProperty.items["x-ui-schema"]["ui:order"]) {
        const orderArray = targetProperty.items["x-ui-schema"]["ui:order"];
        let properties = targetProperty.items.properties;

        // Create a new properties object sorted by ui:order
        let sortedProperties = {};

        // Sort properties according to the orderArray
        orderArray.forEach((key) => {
          if (properties.hasOwnProperty(key)) {
            sortedProperties[key] = properties[key];
          }
        });

        // Add remaining properties that were not in the orderArray
        for (let key in properties) {
          if (!sortedProperties.hasOwnProperty(key)) {
            sortedProperties[key] = properties[key];
          }
        }

        // Re-assign the sorted properties back to the schema
        targetProperty.items.properties = sortedProperties;
      }
    }

    return schema;
  }

  return (
    <React.Fragment>
      {spinner && <DigitLoader />}
      {formSchema && (
        <DigitJSONForm
          schema={
            updateAllPropertiesBasedOnUIOrder(formSchema)
          }
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
