import React,{useState} from 'react'
import MDMSAdd from './MDMSAddV2'
import { Loader,Toast } from '@egovernments/digit-ui-react-components';
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from '@egovernments/digit-ui-components';

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
  const fetchActionItems = (data) => {
    let actionItems = [{
      action:"EDIT",
      label:"Edit Master"
    }]

    const isActive = data?.isActive
    if(isActive) actionItems.push({
      action:"DISABLE",
      label:"Disable Master"
    })
    else actionItems.push({
      action:"ENABLE",
      label:"Enable Master"
    })

    return actionItems
  }

  

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

  const onActionSelect = (action) => {
    const {action:actionSelected} = action 
    //action===EDIT go to edit screen 
    if(actionSelected==="EDIT") {
      const additionalParamString = new URLSearchParams(additionalParams).toString();
      history.push(`/${window?.contextPath}/employee/workbench/mdms-edit?moduleName=${moduleName}&masterName=${masterName}&uniqueIdentifier=${uniqueIdentifier}${additionalParamString ? "&"+additionalParamString : ""}`)
    }
    //action===DISABLE || ENABLE call update api and show toast respectively
    else{
      //call update mutation
      handleEnableDisable(actionSelected)
    }
  }

  if(isLoading) return <Loader />

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