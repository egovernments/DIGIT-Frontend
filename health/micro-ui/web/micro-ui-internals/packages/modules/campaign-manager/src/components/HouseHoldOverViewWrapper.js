import React from "react";
//import { Button } from "@egovernments/digit-ui-components";
import { getRegisteredComponent } from "../utils/template_components/RegistrationRegistry";
import "../utils/template_components/RegistrationComponents";

import {
  Card,
  CardText,
  TextInput,
  SelectionTag,
  Dropdown,
  CardHeader,
  Button,
  TooltipWrapper,
  AlertCard,
  FieldV1,
  Loader,
  CheckBox,
  Header,
} from "@egovernments/digit-ui-components";

const my = [
  {
    "type": "template",
    "label": "EDIT_HOUSEHOLD",
    "order": 1,
    "value": true,
    "format": "editHousehold",
    "hidden": false,
    "tooltip": "",
    "helpText": "",
    "infoText": "",
    "readOnly": false,
    "fieldName": "editHousehold",
    "deleteFlag": false,
    "innerLabel": "",
    "systemDate": false,
    "validations": [],
    "errorMessage": "",
    "isMultiSelect": false
  },
  {
    "type": "template",
    "label": "EDIT_INDIVIDUAL",
    "order": 2,
    "value": "",
    "format": "editIndividual",
    "hidden": false,
    "tooltip": "",
    "helpText": "",
    "infoText": "",
    "readOnly": false,
    "fieldName": "editIndividual",
    "deleteFlag": false,
    "innerLabel": "",
    "systemDate": false,
    "validations": [
    ],
    "errorMessage": "",
    "isMultiSelect": false
  },
  {
    "type": "template",
    "label": "ADD_MEMBER",
    "order": 3,
    "value": [],
    "format": "addMember",
    "hidden": false,
    "tooltip": "",
    "helpText": "",
    "infoText": "",
    "readOnly": false,
    "fieldName": "addMember",
    "deleteFlag": false,
    "innerLabel": "",
    "systemDate": false,
    "validations": [],
    "errorMessage": "",
    "isMultiSelect": false
  },
  {
    "type": "template",
    "label": "UNABLE_TO_DELIVER",
    "order": 4,
    "value": true,
    "format": "SMCDeliverySecondaryButton",
    "hidden": false,
    "tooltip": "",
    "helpText": "",
    "infoText": "",
    "readOnly": false,
    "fieldName": "SMCDeliverySecondaryButton",
    "deleteFlag": false,
    "innerLabel": "",
    "systemDate": false,
    "validations": [],
    "errorMessage": "",
    "isMultiSelect": false
  },
  {
    "type": "template",
    "label": "DELIVERY_DETAILS_LABEL",
    "order": 5,
    "value": "",
    "format": "SMCDeliveryPrimaryButton",
    "hidden": false,
    "tooltip": "",
    "helpText": "",
    "infoText": "",
    "readOnly": false,
    "fieldName": "SMCDeliveryPrimaryButton",
    "deleteFlag": false,
    "innerLabel": "",
    "systemDate": false,
    "validations": [
    ],
    "errorMessage": "",
    "isMultiSelect": false
  }
];
const HouseHoldOverViewWrapper = ({ components = [], t, selectedField }) => {

  components = components && components.length > 0 ? components : my;
  const renderComponents = (inputData) => {
    const formatMap = {};
    inputData.forEach((item) => {
      formatMap[item.jsonPath] = item;
    });
    const ComponentToRender = getRegisteredComponent("EditButton");
    const ContentDetails = getRegisteredComponent("ContentDetails");
    const HouseholdOverViewMemberCard = getRegisteredComponent("HouseholdOverViewMemberCard");
    const editHousehold = formatMap["editHousehold"];
    const editIndividual = formatMap["editIndividual"];
    const smcSecondaryBtn = formatMap["SMCDeliverySecondaryButton"];
    const smcPrimaryBtn = formatMap["SMCDeliveryPrimaryButton"];
    const addMember = formatMap["addMember"];

    return (
      <div>
        {/* 1. Household Edit Button - outside ProfileCard */}


        <ComponentToRender label={editHousehold.label} t={t} onClick={() => { }} hidden={editHousehold.hidden}

          text="HouseHold"
        />

        <ContentDetails t={t} />

        {/* 2. ProfileCard always rendered */}
        <HouseholdOverViewMemberCard
          name="Joseph Sergio"
          gender="Male"
          age={40}
          editIndividual={editIndividual}
          smcPrimaryBtn={smcPrimaryBtn}
          smcSecondaryBtn={smcSecondaryBtn}
          t={t}
        />

        {addMember &&
          <div style={{ marginTop: "16px" }}><ComponentToRender alignment="center" hidden={addMember.hidden} label={addMember.label} t={t} onClick={() => { }} /></div>}
        {/*<div style={{ marginTop: "16px" }}>
          <ComponentToRender alignment="center" label={"Add Member"} t={t} onClick={() => { }} />
        </div>*/}
      </div>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, height: "100%" }}>
      {/* Render content fields */}
      <div style={{ flexGrow: 1 }}>
        {

          renderComponents(components)
        }
      </div>
      {components.some(c => c.jsonPath?.includes("IRS") && !c.hidden) &&
        (<div
          style={{
            marginTop: "auto",
          }}
        >
          <Button
            label={"Deliver Intervention"}
            onClick={() => { }}
            variation="primary"
            style={{
              minWidth: "100%",
            }}
          />
        </div>)
      }
    </div>
  );
};

export default HouseHoldOverViewWrapper;
