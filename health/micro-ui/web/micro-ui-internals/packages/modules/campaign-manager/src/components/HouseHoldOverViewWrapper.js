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

const HouseHoldOverViewWrapper = ({
  components = [
    {
      type: "button",
      label: "Edit HouseHold",
      active: true,
      jsonPath: "EditButton",
      metaData: {},
      required: true,
    },
  ],
  metaMasterConfig,
  t,
  selectedField,
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, height: "100%" }}>
      {/* Render content fields */}
      <div style={{ flexGrow: 1 }}>
        {components.map(({ jsonPath, label, type }, index) => {
          const ComponentToRender = getRegisteredComponent("EditButton");
          const ContentDetails = getRegisteredComponent("ContentDetails");
          const ProfileCard = getRegisteredComponent("ProfileCard");
          return (
            <div
              // className={"app-preview-field-pair app-preview-selected"}
              key={index}
              style={{ marginBottom: "16px", width: "100%" }}
            >
              {jsonPath === "Description" ? (
                <CardHeader>{t(label)}</CardHeader>
              ) : (
                <div>
                  <ComponentToRender label={label} t={t} onClick={() => {}} />
                  <ContentDetails />
                  <ProfileCard name="Joseph Sergio" gender="Male" age={40} relation="H" label={"Edit"} t={t} onClick={() => {}} />
                  <div style={{ marginTop: "16px" }}>
                    <ComponentToRender alignment="center" label={"Add Member"} t={t} onClick={() => {}} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div
        style={{
        //   display: "flex",
        //   flexDirection: "column",
        //   gap: "0.5rem",
          marginTop: "auto",
        //   paddingTop: "1rem",
        }}
      >
        <Button
          label={"Go To Home"}
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
