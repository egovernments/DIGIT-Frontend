import { Loader, FormComposerV2, Header, Toast, MultiUploadWrapper, Button, Close, LogoutIcon } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import TimelineCampaign from "../../components/TimelineCampaign";
import { CampaignConfig } from "../../configs/CampaignConfig";

const configNavItems = [
    {
      name: "Delivery 1",
      code: "HCM_DELIVERY_1",
      activeByDefault: true,
    },
    {
      name: "Delivery 2",
      code: "HCM_DELIVERY_2",
    },
    {
      name: "Delivery 3",
      code: "HCM_DELIVERY_3",
    },
  ];

const SetupCampaign = () => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const history = useHistory();
  const [currentStep, setCurrentStep] = useState(0);
  const [updatedConfigNavItems, setUpdatedConfigNavItems] = useState([]);
  const [deliveryNumber, setDeliveryNumber] = useState(undefined);

  
  const filteredConfig = CampaignConfig.map((config) => {
    return {
      ...config,
      form: config?.form.filter((step) => parseInt(step.stepCount) === currentStep + 1),
    };
  }).filter((config) => config.form.length > 0);


  const onSubmit = async(formData) =>{
    console.log("formData",formData)
    if(currentStep < 4) setCurrentStep(currentStep+1);
  }

  const onStepClick = (step) => {
    setCurrentStep(step);
  };

  const onSecondayActionClick = () => {
    // Ensure not to go below the first step
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  useEffect(() => {
    if (deliveryNumber !== undefined) {
      let updatedConfigNavItems = [
        {
          name: `Delivery 1`,
          code: `HCM_DELIVERY_1`,
          activeByDefault: true,
        },
      ];

      if (deliveryNumber > 1) {
        for (let i = 2; i <= deliveryNumber; i++) {
          updatedConfigNavItems.push({
            name: `Delivery ${i}`,
            code: `HCM_DELIVERY_${i}`,
          });
        }
      }

      setUpdatedConfigNavItems(updatedConfigNavItems);

      console.log("delivery", deliveryNumber);
      console.log("updated", updatedConfigNavItems);
    }
  }, [deliveryNumber]);

  const onFormValueChange = (setValue, formData) => {
    const { deliveryNumber } = formData;
    setDeliveryNumber(deliveryNumber);
  };


//   const onFormValueChange = (setValue, formData) => {
//     // console.log(setValue);
//     const { deliveryNumber } = formData;
//     useEffect(() => {
//     if(deliveryNumber!==undefined){
  
//     // Set the default configuration with only one item
//     let updatedConfigNavItems = [
//       {
//         name: `Delivery ${deliveryNumber}`,
//         code: `HCM_DELIVERY_${deliveryNumber}`,
//         activeByDefault: true,
//       },
//     ];
  
//     // If there are more deliveries, update the configuration accordingly
//     if (deliveryNumber > 1) {
//       for (let i = 2; i <= deliveryNumber; i++) {
//         updatedConfigNavItems.push({
//           name: `Delivery ${i}`,
//           code: `HCM_DELIVERY_${i}`,
//         });
//       }
//     }
  
//     // Set the updated configuration to the state or perform any other action
//     setValue("configNavItems", updatedConfigNavItems);
  
//     // Log the formData

//     setUpdatedConfigNavItems(updatedConfigNavItems)
//     console.log(formData, "formData");
//     console.log("delivery", deliveryNumber);

//     console.log("updated", updatedConfigNavItems);
//   }
// }, [deliveryNumber]);
//   };

const config= filteredConfig?.[0];

  return (
    <React.Fragment>
    <TimelineCampaign currentStep={currentStep+1} onStepClick={onStepClick}/>
    <FormComposerV2
    // config = {filteredConfig.body}
    config={config?.form.map((config) => {
        return {
            ...config,
            body: config?.body.filter((a) => !a.hideInEmployee),
        };
    })}
    onSubmit = {onSubmit}
    showSecondaryLabel= {currentStep > 0 ? true: false}
    secondaryLabel={"PREVIOUS"}
    onSecondayActionClick = {onSecondayActionClick}
    label={currentStep < 3 ? "NEXT" : "SUBMIT"}
    horizontalNavConfig={updatedConfigNavItems}
    showFormInNav={currentStep===2}
    showNavs={currentStep===2}
    // onFormValueChange={(setValue,formData)=>console.log(formData," ffffffffffffffffffffffffffffff")}
    onFormValueChange={onFormValueChange}
     />
  </React.Fragment>
  );
};

export default SetupCampaign;


