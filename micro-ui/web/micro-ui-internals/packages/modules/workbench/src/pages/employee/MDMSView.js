import React,{useState} from 'react'
import MDMSAdd from './MDMSAddV2'
import { Loader,Toast } from '@egovernments/digit-ui-react-components';
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from '@egovernments/digit-ui-components';
import { transform } from "lodash";

const MDMSView = ({...props}) => {
  const history = useHistory()
  const { t } = useTranslation()
  const [showToast, setShowToast] = useState(false);
  let { moduleName, masterName, tenantId,uniqueIdentifier } = Digit.Hooks.useQueryParams();
  let {from, screen, action} = Digit.Hooks.useQueryParams()

  const additionalParams = {
    from: from,
    screen: screen,
    action: action
  }
  
  Object.keys(additionalParams).forEach(key => {
    if (additionalParams[key] === undefined || additionalParams[key] === null) {
      delete additionalParams[key];
    }
  });
  // const stateId = Digit.ULBService.getStateId();
  tenantId = Digit.ULBService.getCurrentTenantId();

  

  const reqCriteria = {
    url: `/${Digit.Hooks.workbench.getMDMSContextPath()}/v2/_search`,
    params: {},
    body: {
      MdmsCriteria: {
        tenantId: tenantId ,
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

  const closeToast = () => {
    setTimeout(() => {
      setShowToast(null)
    }, 5000);
  }

  const { isLoading, data, isFetching,refetch,revalidate } = Digit.Hooks.useCustomAPIHook(reqCriteria);

  const reqCriteriaSorSearch = {
    url: `/${Digit.Hooks.workbench.getMDMSContextPath()}/v2/_search`,
    params: {},
    body: {
      MdmsCriteria: {
        tenantId: tenantId?.split(".")[0],
        uniqueIdentifiers: [uniqueIdentifier?.split(".")[0]],
        schemaCode: `${moduleName}.${"SOR"}`,
      },
    },
    config: {
      enabled: data?.data?.sorId ? true : false,
      select: (response) => {
        return response?.mdms?.[0];
      },
    },
    changeQueryName: uniqueIdentifier?.split(".")[0],
  };
  const { isLoading: isSORLoading, data: sorData } = Digit.Hooks.useCustomAPIHook(reqCriteriaSorSearch);

  let propsToSendButtons = {
    moduleName,
    masterName,
    sorData,
  };

  const fetchActionItems = (data) => Digit?.Customizations?.["commonUiConfig"]?.["ViewMdmsConfig"]?.fetchActionItems(data, propsToSendButtons);


  const reqCriteriaUpdate = {
    url: Digit.Utils.workbench.getMDMSActionURL(moduleName,masterName,"update"),
    params: {},
    body: {
      
    },
    config: {
      enabled: true,
    },
  };
  const mutation = Digit.Hooks.useCustomAPIMutationHook(reqCriteriaUpdate);
  
  const handleEnableDisable = async (action) => {

    const onSuccess = (resp) => {
      
      setShowToast({
        label:`${t(`WBH_SUCCESS_${resp?.mdms?.[0]?.isActive?"ENA":"DIS"}_MDMS_MSG`)} ${resp?.mdms?.[0]?.id}`
      });
      closeToast()
      refetch()
    };
    const onError = (resp) => {
      setShowToast({
        label:`${t("WBH_ERROR_MDMS_DATA")} ${t(resp?.response?.data?.Errors?.[0]?.code)}`,
        isError:true
      });
      
      closeToast()
      refetch()
    };


    mutation.mutate(
      {
        url:reqCriteriaUpdate?.url,
        params: {},
        body: {
          Mdms:{
            ...data,
            isActive:action==="ENABLE" ? true : false
          },
        },
      },
      {
        onError,
        onSuccess,
      }
    );
  }

  let propsToSend = {
    moduleName,
    masterName,
    tenantId,
    uniqueIdentifier,
    data,
    history,
    handleEnableDisable,
  };

  const onActionSelect = (action) => Digit?.Customizations?.["commonUiConfig"]?.["ViewMdmsConfig"]?.onActionSelect(action, propsToSend);

  if(isLoading || isSORLoading) return <Loader />

  return (
    <React.Fragment>
      <MDMSAdd defaultFormData = {data?.data} updatesToUISchema ={{"ui:readonly": true}} screenType={"view"} onViewActionsSelect={onActionSelect} viewActions={fetchActionItems(data)} />
      <Button className={"mdms-view-audit"} label="view audit" variation="secondary" icon={"History"} onClick={()=>{
        history.push(`../utilities/audit-log?id=${data?.id}&tenantId=${data?.tenantId}`)
      }}></Button>
      {showToast && <Toast label={showToast.label} error={showToast?.isError} isDleteBtn={true} onClose={()=> setShowToast(null)}></Toast>}
    </React.Fragment>
  )
}

export default MDMSView