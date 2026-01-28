import React from "react";
import { useState, useEffect, useReducer } from "react";
import { useTranslation } from "react-i18next";
import { FormComposerV2, Loader, Toast, Button } from "@egovernments/digit-ui-components";
import CreateCheckListConfig from "../../../configs/createCheckListConfig.js";
import { updateCheckListConfig } from "../../../configs/createCheckListConfig.js";
import { useParams } from "react-router-dom";
import transformViewCheckList from "../../../utils/createUtils.js";
import { transformCreateCheckList } from "../../../utils/createUtils.js";
import { transformViewApplication } from "../../../utils/createUtils.js";
import { useLocation } from "react-router-dom";

const CreateCheckList = () => {
  const queryStrings = Digit.Hooks.useQueryParams();
  const accid=queryStrings?.accid;
  const id=queryStrings?.id;
  const code=queryStrings?.code;
  const { t } = useTranslation();
  const [cardItems, setCardItems] = useState([]);
  const [formData, setFormData] = useState({});
  const [defValues,setDefValues]=useState({});
  const [shouldUpdate,setShouldUpdate]=useState(false);
  const [ loading, setLoading]=useState(false);
  const [showToast, setShowToast] = useState(null);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [checklistSearchData, setChecklistSearchData] = useState(null);
  const location = useLocation();
  const isCitizen = window.location.href.includes("/citizen/") ? true : false;

  const [config, setConfig] = useState(null);

  const closeToast = () => {
    setTimeout(() => {
      setShowToast(null)
    }, 5000);
  }
 
  setTimeout(() => {
    setShowToast(null);
  }, 20000);

  const def_search_request = {
    url: "/health-service-request/service/definition/v1/_search",
    params: {},
    body: {},
    method: "POST",
    headers: {},
    config: {
      enable: false,
    },
  }
  const smutation = Digit.Hooks.useCustomAPIMutationHook(def_search_request);

  //application creation request
  const create_request = {
    url: "/health-service-request/service/v1/_create",
    params: {},
    body: {},
    method: "POST",
    headers: {},
    config: {
      enable: false,
    },
  }
  const cmutation = Digit.Hooks.useCustomAPIMutationHook(create_request);

  const search_request = {
    url: "/health-service-request/service/v1/_search",
    params: {},
    body: {},
    method: "POST",
    headers: {},
    config: {
      enable: false,
    },
  }
  const mutation = Digit.Hooks.useCustomAPIMutationHook(search_request);

   const update_request = {
    url: "/health-service-request/service/v1/_update",
    params: {},
    body: {},
    method: "POST",
    headers: {},
    config: {
      enable: false,
    },
  }
  const umutation = Digit.Hooks.useCustomAPIMutationHook(update_request);

  const getapp = async (id, accid) => {
    await mutation.mutate(
      {
        url: '/health-service-request/service/v1/_search',
        method: "POST",
        body: transformViewApplication(id, accid, tenantId),
        config: {
          enable: false,
        },
      },
      {
        onSuccess: (res) => {
          setChecklistSearchData(res);
          let field = res.Services.filter(items => items.serviceDefId == id);
          if(field.length>0){
            setShouldUpdate(true);
          }
          const defaultValue = field[0].attributes.reduce((acc, attr) => {
            if(attr.value=="NOT_SELECTED"){
              acc[attr.attributeCode] = "";
            }
            else{
              const matchingItem = cardItems[0]?.attributes?.find(
                (a) => a.code === attr.attributeCode && a.dataType === "SingleValueList"
              );
              if (matchingItem) {
                acc[attr.attributeCode] = {code: attr.value, name: `${code}.${attr.value}`,
                };
              } 
              else {
                acc[attr.attributeCode] = attr.value;
              }
            }
            return acc;
          }, {});
          setDefValues(defaultValue);
          setLoading(true);
        },
        onError: () => {
          console.error("Error checking filled status");
          setLoading(true);
        },
      }
    )
  }

  const getcarditems = async (code) => {
    await smutation.mutate(
      {
        url: "/health-service-request/service/definition/v1/_search",
        method: "POST",
        body: transformViewCheckList(code),
        config: {
          enable: false,
        },
      },
      {
        onSuccess: (res) => {
          setCardItems(res?.ServiceDefinitions || []);
        },
        onError: () => {
          console.error("Error occurred");
          setCardItems([]);
        },
      }
    )
  }

  useEffect(() => {
    getcarditems([code]);
  }, [code]);

  useEffect(() => {
    if (cardItems && cardItems.length > 0) {
      getapp(id, accid);
      setConfig(CreateCheckListConfig(cardItems));
    }
  }, [cardItems]);

  const onSubmit = async (data) => {
    const fetchdata = async (data) => {
      await umutation.mutate(
        {
          url: "/health-service-request/service/v1/_update",
          method: "POST",
          body: transformCreateCheckList(id, accid, data,"SUBMIT",shouldUpdate,checklistSearchData?.Services?.filter((ob) => ob?.serviceDefId === id)?.[0]),
          config: {
            enable: false,
          },
        },
        {
          onSuccess: (res) => {
            setShowToast({ label: Digit.Utils.locale.getTransformedLocale(`${code?.replaceAll(".","_").toUpperCase()}_SUBMIT_SUCCESS_CHECKLIST`) })
            setTimeout(() => {
              window.location.href = location?.state?.redirectionUrl;
            }, 3000);
          },
          onError: () => {
            console.error("Error occurred");
          },
        }
      )
    }
    if (shouldUpdate) {
      fetchdata(data);
    }
    else {
      create(data, "SUBMIT");
    }
  };

  const handleFormValueChange = (updatedFormData) => {
    if (JSON.stringify(updatedFormData) !== JSON.stringify(formData)) {
      setFormData(updatedFormData);
      setConfig(updateCheckListConfig(config, updatedFormData));
    }
  };

  const create = async (data, action) => {
    await cmutation.mutate(
      {
        url: "/health-service-request/service/v1/_create",
        method: "POST",
        body: transformCreateCheckList(id, accid, data, action),
        config: {
          enable: false,
        },
      },
      {
        onSuccess: (res) => {
          if(action=="SAVE_AS_DRAFT"){
            setShowToast({ label: Digit.Utils.locale.getTransformedLocale(`${code?.replaceAll(".", "_").toUpperCase()}_CREATE_SUCCESS_CHECKLIST`) })
            setTimeout(() => {
              window.location.href = location?.state?.redirectionUrl;
            }, 3000);
          } 
          if(action=="SUBMIT"){
            setShowToast({ label: Digit.Utils.locale.getTransformedLocale(`${code?.replaceAll(".","_").toUpperCase()}_SUBMIT_SUCCESS_CHECKLIST`) })
            setTimeout(() => {
              window.location.href = location?.state?.redirectionUrl;
            }, 3000);
          }  
        },
        onError: () => {
          console.error("Error occurred");
        },
      }
    )
  }

  const onSaveAsDraft = async (data)  =>{
    console.log("clicked sad")
    let action = "SAVE_AS_DRAFT";
    const updatefetchdata = async (data, action) => {
      await umutation.mutate(
        {
          url: "/health-service-request/service/v1/_update",
          method: "POST",
          body: transformCreateCheckList(id, accid, data, action, shouldUpdate, checklistSearchData?.Services?.filter((ob) => ob?.serviceDefId === id)?.[0]),
          config: {
            enable: false,
          },
        },
        {
          onSuccess: (res) => {
            setShowToast({ label: Digit.Utils.locale.getTransformedLocale(`${code?.replaceAll(".", "_").toUpperCase()}_UPDATE_SUCCESS_CHECKLIST`) })
            setTimeout(() => {
              window.location.href = location?.state?.redirectionUrl;
            }, 3000);
          },
          onError: () => {
            console.error("Error occurred");
          },
        }
      )
    }
    if(shouldUpdate){
      updatefetchdata(data,action);
    }
    else{
      create(data,action);
    }
  }

  return (
  <div>
    {config && loading ? (
      <div>
        <FormComposerV2
          defaultValues={defValues}
          label={t("Submit")}
          config={config}
          onFormValueChange={(setValue, formData) => { handleFormValueChange(formData) }}
          onSubmit={onSubmit}
          fieldStyle={{ marginRight: 2 }}
          // Remove draftLabel and onDraftLabelClick
          submitButtonStyle={{minWidth:"unset",width:"revert",marginLeft:isCitizen ? "0rem" : "1.5rem"}}
          isDisabled={cmutation.isLoading || umutation.isLoading}
        />
        {/* Add your own draft button */}
        <div style={{ position: "fixed", bottom: 0, left: 0, padding: "1rem 4.5rem", zIndex: 100000 }}>
          <Button
            type="button"
            label={t("Save as Draft")}
            onClick={() => onSaveAsDraft(formData)}
            disabled={cmutation.isLoading || umutation.isLoading}
            variation="primary"
          />
        </div>
      </div>
    ) : (
      <Loader />
    )}
    {showToast && (
      <Toast
        type={showToast?.type}
        label={t(showToast?.label)}
        onClose={() => setShowToast(null)}
        isDleteBtn={showToast?.isDleteBtn}
      />
    )}
  </div>
);
};

export default CreateCheckList;