import { Loader, FormComposerV2, Header, Toast, MultiUploadWrapper, Button, Close, LogoutIcon } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import TimelineCampaign from "../../components/TimelineCampaign";
import { CampaignConfig } from "../../configs/CampaignConfig";


const SetupCampaign = () => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const history = useHistory();
  const [currentStep, setCurrentStep] = useState(0);
  const [updatedConfigNavItems, setUpdatedConfigNavItems] = useState([]);
  const [deliveryNumber, setDeliveryNumber] = useState(undefined);
  const [cycleNumber, setCycleNumber] = useState(undefined);
  const [campaignConfig, setCampaignConfig] = useState(CampaignConfig);
  const [arrayData, setArrayData] = useState([{},{},{},{}]);

  console.log(arrayData," aaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
  
  const onSubmit = async (formData) => {
    console.log("form11", formData);
    const { deliveryNumber, cycleNumber } = formData;
  
    // Assuming formData is an object, set the cycles property dynamically
    formData["cycles"] = {};
    for (let cycle = 1; cycle <= cycleNumber; cycle++) {
      const cycleKey = `cycle${cycle}`;
      formData["cycles"][cycleKey] = {};
  
      // Generate properties like delivery1, delivery2, etc. under each cycle
      for (let delivery = 1; delivery <= deliveryNumber; delivery++) {
        const deliveryKey = `delivery${delivery}`;
        formData["cycles"][cycleKey][deliveryKey] = {};
  
        // Populate delivery-specific properties
        formData["cycles"][cycleKey][deliveryKey]["campaignName"] = formData[`campaignName_${cycle}_${delivery}`];
        formData["cycles"][cycleKey][deliveryKey]["campaignType"] = formData[`campaigntype_${cycle}_${delivery}`];
      }
    }
    console.log(currentStep,"current");
    if (currentStep < 4) setCurrentStep(currentStep + 1);
    console.log("formmm", formData);
  };
  

  const onStepClick = (step) => {
    console.log("step", step);
    onFormValueChange

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

    }
  }, [deliveryNumber]);

  const updateCampaignConfig = (newNavLinks) => {
    console.log(newNavLinks, "new");
    const updatedCampaignConfig = CampaignConfig?.[0].form.map((formStep) => {
      const objectSize = Object.keys(formStep).length;
      for(let i=1 ;i<=cycleNumber ; i++){
      if (formStep.stepCount === "3" && objectSize>2) {
        return newNavLinks.map((newNavLink, index) => ({
          ...formStep,
          navLink: newNavLink,
          body: formStep.body.map((bodyElement) => ({
            ...bodyElement,
            key: `${bodyElement.key}_${i}_${index+1}`,
            populators: {
              ...bodyElement.populators,
              name: `${bodyElement.key}_${i}_${index+1}`,
            },
          })),
        }));
      }
    }
      return formStep;
    }).flat(); // Flatten the array to remove nested arrays
    setCampaignConfig([{ form: updatedCampaignConfig }]);
  };
  
  useEffect(() => {
    // Ensure that currentStep and deliveryNumber are defined
    if (currentStep === 2 && deliveryNumber) {
      const newNavLinks = Array.from({ length: deliveryNumber }, (_, index) => `Delivery ${index + 1}`);
      updateCampaignConfig(newNavLinks);
    }
  }, [currentStep, deliveryNumber, CampaignConfig, cycleNumber]);

  // useEffect(() => {
  //   onFormValueChange
  //   console.log("hello")
  // },[currentStep])
  
  const filteredConfig = campaignConfig.map((config) => {
    return {
      ...config,
      form: config?.form.filter((step) => parseInt(step.stepCount) === currentStep + 1),
    };
  }).filter((config) => config.form.length > 0);

  const config= filteredConfig?.[0];

  console.log("config", config);


  const onFormValueChange = (setValue, formData) => {
    const { deliveryNumber, cycleNumber , campaignName ,  campaigntype} = formData;
    setDeliveryNumber(deliveryNumber);
    setCycleNumber(cycleNumber);
    var newArrayData=arrayData;
    newArrayData[currentStep]=formData;
    setArrayData(newArrayData);
    console.log("formData", formData);
  };
  

  return (
    <React.Fragment>
    <TimelineCampaign currentStep={currentStep+1} onStepClick={onStepClick}/>
    <FormComposerV2

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
    onFormValueChange={onFormValueChange}
     />
  </React.Fragment>
  );
};

export default SetupCampaign;


