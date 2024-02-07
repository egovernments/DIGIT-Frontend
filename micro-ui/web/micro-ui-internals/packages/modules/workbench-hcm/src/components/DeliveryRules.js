import React from "react";
import { FormStep, RadioOrSelect, TextArea, FormComposer, Card } from "@egovernments/digit-ui-react-components";
import TimelineCampaign from "./TimelineCampaign";
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

const DeliveryRules = ({ t, userType, formData }) => {
  const config = 
    {
      form:[
        {
            "head": "",
            "subHead": "",
            "stepper":1,
            "navLink": "Delivery 1",
            "body": [
                {
                  isMandatory: false,
                  key: "campaignName",
                  type: "text",
                  label: "CAMPAIGN_NAME",
                //   di sable: false,
                //   stepCount: "1",
                  populators: {
                    name: "campaignName",
                    error: "ES_TQM_REQUIRED",
                    required: true,
                  },
                },  {
                    isMandatory: false,
                    key: "campaignName",
                    type: "text",
                    label: "CAMPAIGN_NAME",
                  //   di sable: false,
                  //   stepCount: "1",
                    populators: {
                      name: "campaignName",
                      error: "ES_TQM_REQUIRED",
                      required: true,
                    },
                  },
              ],
        },
        {
            "head": "",
            "subHead": "",
            "stepper":3,
            "navLink": "Delivery 2",
            "body": [
                {
                  isMandatory: false,
                  key: "campaignName",
                  type: "text",
                  label: "CAMPAIGN_NAME",
                //   di sable: false,
                //   stepCount: "1",
                  populators: {
                    name: "campaignName",
                    error: "ES_TQM_REQUIRED",
                    required: true,
                  },
                },
              ],
        },
        {
            "head": "",
            "subHead": "",
            "stepper":3,
            "navLink": "Delivery 2",
            "body": [
                {
                  isMandatory: false,
                  key: "campaignName",
                  type: "text",
                  label: "CAMPAIGN_NAME",
                //   di sable: false,
                //   stepCount: "1",
                  populators: {
                    name: "campaignName",
                    error: "ES_TQM_REQUIRED",
                    required: true,
                  },
                },
              ],
        },
      ]
    };
  console.log(config.form)
  return (
    <FormComposer
      //   label={isEdit ? "CORE_COMMON_SUBMIT" :"ACTION_TEST_CREATE_ESTIMATE"}
      config={config.form}
      //   onSubmit={onFormSubmit}
      //   submitInForm={false}
        fieldStyle={{ marginRight: 0 }}
        inline={false}
      // className="card-no-margin"
      // defaultValues={(isEdit && estimateNumber) ? initialDefaultValues : sessionFormData}
      //   defaultValues = {sessionFormData}
        // showWrapperContainers={false}
      //   isDescriptionBold={false}
        noBreakLine={true}
        showMultipleCardsWithoutNavs={false}
      //   showMultipleCardsInNavs={false}
      horizontalNavConfig={configNavItems}
      showFormInNav={true}
      showNavs={true}
    //   sectionHeadStyle={{ marginTop: "2rem" }}
      labelBold={true}
      //   onFormValueChange={onFormValueChange}
    />
  );
};

export default DeliveryRules;
