import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
 import {  Header, Toast ,FormComposerV2, } from "@egovernments/digit-ui-react-components";
import { SorConfig } from "../../configs/SorCreateConfig";
import { transformCreateEstimateData } from "../../utils/createEstimateUtils";




const SorCreate = ()=>{
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const { t } = useTranslation();
    const history = useHistory();
    const [toast, setToast] = useState({show:false, error:false, label:""})
      const [showToast, setShowToast] = useState(null);

    const reqCreate = {
        url:`/mdms-v2/v2/_create/digitAssignment.estimate`,
        params:{},
        body:{},
        config: {
            enable: false,
          },
    }

    const mutation = Digit.Hooks.useCustomAPIMutationHook(reqCreate);

    const onSubmit = async(data)=>{
          
       await  mutation.mutate(
            {
                url:`/mdms-v2/v2/_create/digitAssignment.estimate`,
                params:{tenantId},
                body:transformCreateEstimateData(data),
                config: {
                    enable: true,
                  },
            },
            {
                onSuccess:()=>{
                    setToast({show:true, error:false, label:t("Estimate is Created Successfully")})
                },
                onError:()=>{
                    setToast({show:true, error:true, label:t("Create Estimate Failed")})
                }
            }
        )
    }

    
    
    
    
  return (
    <div>
      <Header> {t("CREATE_SOR")}</Header>
      <FormComposerV2
        label={t("SUBMIT_BUTTON")}
        config={SorConfig.map((config) => {
          return {
            ...config,
          };
        })}
        defaultValues={{}}
        onFormValueChange ={ (setValue, formData, formState, reset, setError, clearErrors, trigger, getValues) => {
          console.log(formData, "formData");
        }}
        onSubmit={(data,) => onSubmit(data, )}
        fieldStyle={{ marginRight: 0 }}
        noBreakLine={true}
        
      />
      {toast.show && <Toast
      label={toast.label}
      error={toast.error}
      isDleteBtn={true}
      onClose={()=> setToast({show:false, error:false, label:""})}
      />}

      {toast.show && setTimeout(()=>{
        setToast((pre)=> ({...pre, show:false}))
      }, 5000)}
       
    </div>
  );



}

export default SorCreate