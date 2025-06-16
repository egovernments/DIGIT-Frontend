import React from "react";
//import { Button } from "@egovernments/digit-ui-components";
import { getRegisteredComponent } from "../utils/template_components/RegistrationRegistry";
import "../utils/template_components/RegistrationComponents";
import { HouseHoldOverviewSection } from "../utils/template_components/RegistrationComponents";

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


const HouseHoldOverViewWrapper = ({ components = [], t, selectedField }) => {

  const renderComponents = (inputData) => {
    const formatMap = {};
    inputData.forEach((item) => {
      formatMap[item.jsonPath] = item;
    });
    

    const editHousehold = formatMap["editHousehold"] || { label: "", hidden: true };
    const editIndividual = formatMap["editIndividual"] || {};
    const smcSecondaryBtn = formatMap["IndividualDeliverySecondaryButton"] || {};
    const smcPrimaryBtn = formatMap["IndividualDeliveryPrimaryButton"] || {};
    const addMember = formatMap["addMember"] || { label: "", hidden: true };


    return (
      <HouseHoldOverviewSection
        editHousehold={editHousehold}
        editIndividual={editIndividual}
        smcPrimaryBtn={smcPrimaryBtn}
        smcSecondaryBtn={smcSecondaryBtn}
        addMember={addMember}
        t={t}
      />

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
