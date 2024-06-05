import React,{useState} from 'react'
import MDMSAdd from './MDMSAddV2'
import { Loader,Toast } from '@egovernments/digit-ui-react-components';
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

const MDMSView = ({...props}) => {
  const history = useHistory()
  const { t } = useTranslation()
  const [showToast, setShowToast] = useState(false);
  let { moduleName, masterName, tenantId,uniqueIdentifier } = Digit.Hooks.useQueryParams();
  // const stateId = Digit.ULBService.getStateId();
  tenantId = Digit.ULBService.getCurrentTenantId();
  const fetchActionItems = (data) => Digit?.Customizations?.['commonUiConfig']?.['ViewMdmsConfig']?.fetchActionItems(data);

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
    url: `/${Digit.Hooks.workbench.getMDMSContextPath()}/v2/_update/${moduleName}.${masterName}`,
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
        url:`/${Digit.Hooks.workbench.getMDMSContextPath()}/v2/_update/${moduleName}.${masterName}`,
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

  console.log(data);
  let propsToSend = {
    moduleName,
    masterName,
    tenantId,
    uniqueIdentifier,
    history,
    handleEnableDisable
  }
  const onActionSelect = (action) => Digit?.Customizations?.['commonUiConfig']?.['ViewMdmsConfig']?.onActionSelect(action,propsToSend);

  if(isLoading) return <Loader />

  return (
    <React.Fragment>
      <MDMSAdd defaultFormData = {data?.data} updatesToUISchema ={{"ui:readonly": true}} screenType={"view"} onViewActionsSelect={onActionSelect} viewActions={fetchActionItems(data)} />
      {showToast && <Toast label={showToast.label} error={showToast?.isError} isDleteBtn={true} onClose={()=> setShowToast(null)}></Toast>}
    </React.Fragment>
  )
}

export default MDMSView