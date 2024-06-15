import React,{useState,useEffect} from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import {  Header,Loader } from "@egovernments/digit-ui-react-components";
import { FormComposerV2 } from "@egovernments/digit-ui-components";
//TODO: Some dropdown data is static, pls update these configs once data comes from previous flows
import { configsCreateOrderSchedule,configsCreateOrderWarrant,configsCreateOrderSummon } from "../../configs/ordersCreateConfig";
import { transformCreateData } from "../../utils/createUtils";

const fieldStyle={ marginRight: 0 };

const OrdersCreate = () => {
  const {ordertype:OrderType} = Digit.Hooks.useQueryParams()
  const [configs,setConfigs] = useState(null)
  const defaultValue={};
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const history = useHistory();
  const reqCreate = {
    url: `/individual/v1/_create`,
    params: {},
    body: {},
    config: {
      enable: false,
    },
  };

  const mutation = Digit.Hooks.useCustomAPIMutationHook(reqCreate);

  const onSubmit = async(data) => {
   //TODO: API Integration code will come in this function
    await mutation.mutate(
      {
        url: `/individual/v1/_create`,
        params: { tenantId },
        body: transformCreateData(data),
        config: {
          enable: true,
        },
      },
    );
  };

  const updateConfigsBasedOnOrderType = () => {
    switch (OrderType) {
      case "WARRANT":
        setConfigs(()=> configsCreateOrderWarrant)
        break;
      case "SCHEDULE":
        setConfigs(()=> configsCreateOrderSchedule)
        break;
      case "SUMMON":
        setConfigs(()=> configsCreateOrderSummon)
        break;
      default:
        setConfigs(()=> configsCreateOrderSchedule)
        break;
    }
  }

  useEffect(() => {
    updateConfigsBasedOnOrderType()
  }, [OrderType])
  
  const onFormUpdate = (setValue, formData, formState, reset, setError, clearErrors, trigger, getValues) => {
    console.log(formData, "formData");
    
  }

  if(!configs){
    return <Loader />
  }
  
  return (
    <div>
      <Header> {t("CREATE_ORDER")}</Header>
      <FormComposerV2
        label={t("SUBMIT_BUTTON")}
        config={configs.map((config) => {
          return {
            ...config,
          };
        })}
        defaultValues={configs?.[0]?.defaultValues}
        onFormValueChange ={onFormUpdate}
        onSubmit={(data,) => onSubmit(data, )}
        fieldStyle={fieldStyle}
        noBreakLine={true}
      />
       
    </div>
  );
}

export default OrdersCreate;