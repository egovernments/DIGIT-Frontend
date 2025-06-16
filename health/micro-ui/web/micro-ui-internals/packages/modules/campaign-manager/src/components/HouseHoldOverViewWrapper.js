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



  const renderComponents = (inputData) => {
    const formatMap = {};
    inputData.forEach((item) => {
      formatMap[item.jsonPath] = item;
    });
    const TextButton = getRegisteredComponent("TextButton");
    const HouseHoldDetailsCard = getRegisteredComponent("HouseHoldDetailsCard");
    const HouseholdOverViewMemberCard = getRegisteredComponent("HouseholdOverViewMemberCard");
    // const editHousehold = formatMap["editHousehold"];
    // const editIndividual = formatMap["editIndividual"];
    // const smcSecondaryBtn = formatMap["IndividualDeliverySecondaryButton"];
    // const smcPrimaryBtn = formatMap["IndividualDeliveryPrimaryButton"];
    // const addMember = formatMap["addMember"];
    // console.log(formatMap);
    // debugger
    const editHousehold = formatMap["editHousehold"] || { label: "", hidden: true };
    const editIndividual = formatMap["editIndividual"] || {};
    const smcSecondaryBtn = formatMap["IndividualDeliverySecondaryButton"] || {};
    const smcPrimaryBtn = formatMap["IndividualDeliveryPrimaryButton"] || {};
    const addMember = formatMap["addMember"] || { label: "", hidden: true };

    return (
      <div>
        {/* 1. Household Edit Button*/}


        <TextButton label={t(editHousehold.label || "")} onClick={() => { }} hidden={editHousehold.hidden}
          alignment="flex-end"
          t={t}

        />

        <HouseHoldDetailsCard t={t} />

        {/* 2. Individual ProfileCard always rendered */}
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
          <div style={{ marginTop: "16px" }}><TextButton
            addMember={true}
            alignment="center" hidden={addMember.hidden} label={t(addMember.label || "")} onClick={() => { }} t={t} /></div>}

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

    </div>
  );
};

export default HouseHoldOverViewWrapper;
