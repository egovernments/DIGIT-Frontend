import React,{useState} from 'react'
import MDMSAdd from './MDMSAddV2'
import { Loader,Toast } from '@egovernments/digit-ui-react-components';
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
const MDMSEdit = ({...props}) => {
  const history = useHistory()

  const { t } = useTranslation()

  const { moduleName, masterName, tenantId,uniqueIdentifier } = Digit.Hooks.useQueryParams();
  const stateId = Digit.ULBService.getCurrentTenantId();

  const [showToast, setShowToast] = useState(false);
  const [renderLoader,setRenderLoader] = useState(false)
  const reqCriteria = {
    url: `/${Digit.Hooks.workbench.getMDMSContextPath()}/v2/_search`,
    params: {},
    body: {
      MdmsCriteria: {
        tenantId: stateId,
        uniqueIdentifiers:[uniqueIdentifier],
        schemaCode:`${moduleName}.${masterName}`
      },
    },
    config: {
      enabled: moduleName && masterName && true,
      select: (data) => {
        return data?.mdms?.[0]
      },
    },
  };

  const reqCriteriaSchema = {
    url: `/${Digit.Hooks.workbench.getMDMSContextPath()}/schema/v1/_search`,
    params: {},
    body: {
      SchemaDefCriteria: {
        tenantId: stateId,
        codes:[`${moduleName}.${masterName}`]
      },
    },
    config: {
      enabled: moduleName && masterName && true,
      select: (data) => { 
        const uniqueFields = data?.SchemaDefinitions?.[0]?.definition?.["x-unique"]
        const updatesToUiSchema = {}
        uniqueFields.forEach(field => updatesToUiSchema[field] = {"ui:readonly":true})
        return {schema:data?.SchemaDefinitions?.[0],updatesToUiSchema}
      },
    },
    changeQueryName:"schema"
  };

  const closeToast = () => {
    setTimeout(() => {
      setShowToast(null)
    }, 5000);
  }

  const gotoView = () => { 
    setTimeout(() => {
      setRenderLoader(true)
      history.push(`/${window?.contextPath}/employee/workbench/mdms-view?moduleName=${moduleName}&masterName=${masterName}&uniqueIdentifier=${uniqueIdentifier}`)
    }, 2000);
  }

  const { isLoading, data, isFetching } = Digit.Hooks.useCustomAPIHook(reqCriteria);
  const { isLoading:isLoadingSchema,data: schemaData,isFetching: isFetchingSchema,...rest } = Digit.Hooks.useCustomAPIHook(reqCriteriaSchema);
  

  const reqCriteriaUpdate = {
    url:  Digit.Utils.workbench.getMDMSActionURL(moduleName,masterName,"update"),
    params: {},
    body: {
      
    },
    config: {
      enabled: true,
    },
  };
  const mutation = Digit.Hooks.useCustomAPIMutationHook(reqCriteriaUpdate);

  const handleUpdate = async (formData) => {
    console.log(formData,"formData");
    const schemaCodeToValidate = `${moduleName}.${masterName}`;
    console.log(schemaCodeToValidate,"schemaCodeToValidate");
    console.log(await Digit?.Customizations?.["commonUiConfig"]?.["AddMdmsConfig"]?.[schemaCodeToValidate]?.getTrasformedData(formData),"ui cutomization call");
    const transformedData = await Digit?.Customizations?.["commonUiConfig"]?.["AddMdmsConfig"]?.[schemaCodeToValidate]?.getTrasformedData(formData) || formData;
    console.log(transformedData,"transformedData")
    const validation = await Digit?.Customizations?.["commonUiConfig"]?.["AddMdmsConfig"]?.[schemaCodeToValidate]?.validateForm(transformedData, { tenantId: stateId });
    console.log(validation,"validation");

    if (validation && !validation?.isValid) {
      setShowToast({
        label: `${t("RA_DATE_RANGE_ERROR")}`,
        isError: true
      });
      return;
    }


    const onSuccess = (resp) => {
      
      setShowToast({
        label:`${t("WBH_SUCCESS_UPD_MDMS_MSG")} ${resp?.mdms?.[0]?.id}`
      });
      // closeToast()
      gotoView()
    };

    const onError = (resp) => {
      setShowToast({
        label:`${t("WBH_ERROR_MDMS_DATA")} ${t(resp?.response?.data?.Errors?.[0]?.code)}`,
        isError:true
      });
      
      closeToast()
    };

    console.log(formData, "before Final");
    mutation.mutate(
      {
        url:reqCriteriaUpdate?.url,
        params: {},
        body: {
          Mdms:{
            ...data,
            data:transformedData
          },
        },
      },
      {
        onError,
        onSuccess,
      }
    );

  }

  const convertEpochToDate = (dateEpoch) => {
    if (dateEpoch == null || dateEpoch == undefined || dateEpoch == "") {
      return "NA";
    }
    const dateFromApi = new Date(dateEpoch);
    let month = dateFromApi.getUTCMonth() + 1;
    let day = dateFromApi.getUTCDate();
    let year = dateFromApi.getUTCFullYear();
    month = (month > 9 ? "" : "0") + month;
    day = (day > 9 ? "" : "0") + day;
    return `${day}/${month}/${year}`;
  };


  const formattedData = data?.data
  ? {
      ...data?.data,
      validFrom: convertEpochToDate(Number(data?.data?.validFrom)),
    }
  : null;

  if(isLoading || isLoadingSchema || renderLoader ) return <Loader />
  
  return (
    <React.Fragment>
      <MDMSAdd 
      defaultFormData = {(`${moduleName}.${masterName}` === "WORKS-SOR.Rates" || `${moduleName}.${masterName}` === "WORKS-SOR.Composition") ? formattedData : data?.data} 
      screenType={"edit"} onSubmitEditAction={handleUpdate} updatesToUISchema ={schemaData?.updatesToUiSchema} />
      {showToast && <Toast label={t(showToast.label)} error={showToast?.isError} onClose={()=>setShowToast(null)} ></Toast>}
    </React.Fragment>
  )
}

export default MDMSEdit