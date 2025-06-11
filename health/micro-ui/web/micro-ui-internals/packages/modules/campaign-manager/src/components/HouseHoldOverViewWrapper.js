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

const config = [
  {
    type: "template",
    label: "EDIT_HOUSEHOLD",
    order: 1,
    value: true,
    format: "editHousehold",
    hidden: false,
    tooltip: "",
    helpText: "",
    infoText: "",
    readOnly: false,
    fieldName: "editHousehold",
    deleteFlag: false,
    innerLabel: "",
    systemDate: false,
    validations: [],
    errorMessage: "",
    isMultiSelect: false,
  },
  {
    type: "template",
    label: "EDIT_INDIVIDUAL",
    order: 2,
    value: "",
    format: "editIndividual",
    hidden: false,
    tooltip: "",
    helpText: "",
    infoText: "",
    readOnly: false,
    fieldName: "editIndividual",
    deleteFlag: false,
    innerLabel: "",
    systemDate: false,
    validations: [],
    errorMessage: "",
    isMultiSelect: false,
  },
  {
    type: "template",
    label: "ADD_MEMBER",
    order: 3,
    value: [],
    format: "addMember",
    hidden: false,
    tooltip: "",
    helpText: "",
    infoText: "",
    readOnly: false,
    fieldName: "addMember",
    deleteFlag: false,
    innerLabel: "",
    systemDate: false,
    validations: [],
    errorMessage: "",
    isMultiSelect: false,
  },
  {
    type: "template",
    label: "UNABLE_TO_DELIVER",
    order: 4,
    value: true,
    format: "SMCDeliverySecondaryButton",
    hidden: false,
    tooltip: "",
    helpText: "",
    infoText: "",
    readOnly: false,
    fieldName: "SMCDeliverySecondaryButton",
    deleteFlag: false,
    innerLabel: "",
    systemDate: false,
    validations: [],
    errorMessage: "",
    isMultiSelect: false,
  },
  {
    type: "template",
    label: "DELIVERY_DETAILS_LABEL",
    order: 5,
    value: "",
    format: "SMCDeliveryPrimaryButton",
    hidden: false,
    tooltip: "",
    helpText: "",
    infoText: "",
    readOnly: false,
    fieldName: "SMCDeliveryPrimaryButton",
    deleteFlag: false,
    innerLabel: "",
    systemDate: false,
    validations: [],
    errorMessage: "",
    isMultiSelect: false,
  },
];

const prevconfig = [
  {
    label: "Edit HouseHold",
    value: true,
    defaultValue: true,
    active: true,
    jsonPath: "EditButton",
    metaData: {},
    hidden: false,
    deleteFlag: false,
    isLocalised: false,
    innerLabel: "",
    helpText: "",
    errorMessage: "",
    tooltip: "",
    infoText: "",
    order: 1,
    readOnly: false,
    systemDate: false,
    RegexPattern: false,
    MdmsDropdown: false,
    isMdms: false,
    isMultiSelect: false,
    type: "button",
    appType: "button",
  },
  {
    label: "",
    value: true,
    defaultValue: true,
    active: true,
    jsonPath: "ContentDetails",
    metaData: {},
    hidden: true,
    deleteFlag: false,
    isLocalised: false,
    innerLabel: "",
    helpText: "",
    errorMessage: "",
    tooltip: "",
    infoText: "",
    order: 1,
    readOnly: false,
    systemDate: false,
    RegexPattern: false,
    MdmsDropdown: false,
    isMdms: false,
    isMultiSelect: false,
    type: "button",
    appType: "button",
  },
  {
    label: "",
    value: true,
    defaultValue: true,
    active: true,
    jsonPath: "ProfileCard",
    metaData: {},
    hidden: true,
    deleteFlag: false,
    isLocalised: false,
    innerLabel: "",
    helpText: "",
    errorMessage: "",
    tooltip: "",
    infoText: "",
    order: 1,
    readOnly: false,
    systemDate: false,
    RegexPattern: false,
    MdmsDropdown: false,
    isMdms: false,
    isMultiSelect: false,
    type: "button",
    appType: "button",
  },

  {
    label: "",
    value: true,
    defaultValue: true,
    active: true,
    jsonPath: "DeliverInterventionBtn",
    metaData: {},
    hidden: true,
    deleteFlag: false,
    isLocalised: false,
    innerLabel: "",
    helpText: "",
    errorMessage: "",
    tooltip: "",
    infoText: "",
    order: 1,
    readOnly: false,
    systemDate: false,
    RegexPattern: false,
    MdmsDropdown: false,
    isMdms: false,
    isMultiSelect: false,
    type: "button",
    appType: "button",
  },
];
const HouseHoldOverViewWrapper = ({ components = config, metaMasterConfig, t, selectedField }) => {
  // const renderComponent = (data) => {
  //   const ComponentToRender = getRegisteredComponent("EditButton");
  //   const ContentDetails = getRegisteredComponent("ContentDetails");
  //   const ProfileCard = getRegisteredComponent("ProfileCard");
  //   switch (data.jsonPath) {
  //     case "EditButton":
  //       return <ComponentToRender label={data.label} t={t} onClick={() => {}} hidden={data.hidden} />;
  //     case "ContentDetails":
  //       return <ContentDetails />;
  //     case "ProfileCard":
  //       return (
  //         <ProfileCard
  //           name="Joseph Sergio"
  //           gender="Male"
  //           age={40}
  //           relation="H"
  //           label={"Edit"}
  //           t={t}
  //           onClick={() => {}}
  //           unableToDeliver={false}
  //           ableToDeliver={false}
  //         />
  //       );

  //     case "DeliverInterventionBtn":
  //       return (
  //         <div style={{ marginTop: "16px" }}>
  //           <ComponentToRender alignment="center" label={"Add Member"} t={t} onClick={() => {}} />
  //         </div>
  //       );
  //     case "Description":
  //       return <CardHeader>{t(data.label)}</CardHeader>;

  //     case "SMCDeliverySecondaryButton":
  //       return (
  //         <ProfileCard
  //           name="Joseph Sergio"
  //           gender="Male"
  //           age={40}
  //           relation="H"
  //           label={"Edit"}
  //           t={t}
  //           onClick={() => {}}
  //           unableToDeliver={data.hidden}
  //           ableToDeliver={false}
  //           smcDeliverLabel={""}
  //           unableToDeliverLabel={data.label}
  //         />
  //       );
  //     case "SMCDeliveryPrimaryButton":
  //       return (
  //         <ProfileCard
  //           name="Joseph Sergio"
  //           gender="Male"
  //           age={40}
  //           relation="H"
  //           label={"Edit"}
  //           t={t}
  //           onClick={() => {}}
  //           unableToDeliver={false}
  //           ableToDeliver={data.hidden}
  //           smcDeliverLabel={data.label}
  //           unableToDeliverLabel={""}
  //         />
  //       );
  //     default:
  //       return <ComponentToRender label={data.label} t={t} onClick={() => {}} />;
  //   }
  // };

  const renderComponents = (inputData) => {
    const formatMap = {};
    inputData.forEach((item) => {
      formatMap[item.format] = item;
    });
    const ComponentToRender = getRegisteredComponent("EditButton");
    const ContentDetails = getRegisteredComponent("ContentDetails");
    const ProfileCard = getRegisteredComponent("ProfileCard");
    const editHousehold = formatMap["editHousehold"];
    const editIndividual = formatMap["editIndividual"];
    const smcSecondaryBtn = formatMap["SMCDeliverySecondaryButton"];
    const smcPrimaryBtn = formatMap["SMCDeliveryPrimaryButton"];
    const addMember = formatMap["addMember"];

    return (
      <div>
        {/* 1. Household Edit Button - outside ProfileCard */}
        <ComponentToRender label={data.label} t={t} onClick={() => {}} hidden={data.hidden} />
        <ContentDetails />
        {/* 2. ProfileCard always rendered */}
        <HousedoldOverViewMemberCard
          name="Joseph Sergio"
          relation="H"
          gender="Male"
          age={40}
          editIndividual={editIndividual}
          smcPrimaryBtn={smcPrimaryBtn}
          smcSecondaryBtn={smcSecondaryBtn}
        />

        {addMember && <ComponentToRender hidden={addMember.hidden} label={data.label} t={t} onClick={() => {}} />}
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
          //   components.map((data, index) => {

          //   return (
          //     <div
          //       // className={"app-preview-field-pair app-preview-selected"}
          //       key={index}
          //       style={{ marginBottom: "16px", width: "100%" }}
          //     >
          //       {renderComponent(data)}

          //     </div>
          //   );
          // })

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
