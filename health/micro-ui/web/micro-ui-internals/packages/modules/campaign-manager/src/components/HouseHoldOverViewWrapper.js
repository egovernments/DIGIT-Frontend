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
} from "@egovernments/digit-ui-components";

const HouseHoldOverViewWrapper = ({ components = [], t, selectedField }) => {

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
        <ComponentToRender label={editHousehold.label} t={t} onClick={() => {}} hidden={editHousehold.hidden} />
        <ContentDetails t={t}/>
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

        {addMember && <ComponentToRender hidden={addMember.hidden} label={addMember.label} t={t} onClick={() => {}} />}
        <div style={{ marginTop: "16px" }}>
          <ComponentToRender alignment="center" label={"Add Member"} t={t} onClick={() => {}} />
        </div>
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
      <div
        style={{
          marginTop: "auto",
        }}
      >
        <Button
          label={"Deliver Intervention"}
          onClick={() => {}}
          variation="primary"
          style={{
            minWidth: "100%",
          }}
        />
      </div>
    </div>
  );
};

export default HouseHoldOverViewWrapper;
