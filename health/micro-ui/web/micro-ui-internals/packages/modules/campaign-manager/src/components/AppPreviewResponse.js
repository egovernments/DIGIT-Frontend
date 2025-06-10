import React from "react";
import { Button, PanelCard } from "@egovernments/digit-ui-components";

const dummyConfig = [
    {
        "label": "RESPONSE_HEADER",
        "value": true,
        "defaultValue": true,
        "active": true,
        "jsonPath": "ResponseHeader",
        "metaData": {},
        "hidden": true,
        "deleteFlag": false,
        "isLocalised": false,
        "innerLabel": "",
        "helpText": "",
        "errorMessage": "",
        "tooltip": "",
        "infoText": "",
        "order": 1,
        "readOnly": false,
        "systemDate": false,
        "RegexPattern": false,
        "MdmsDropdown": false,
        "isMdms": false,
        "isMultiSelect": false,
        "type": "textInput",
        "appType": "textInput"
    },
    {
        "label": "RESPONSE_DESCRIPTION",
        "value": "",
        "defaultValue": false,
        "active": true,
        "jsonPath": "ResponseDescription",
        "metaData": {},
        "hidden": false,
        "deleteFlag": false,
        "isLocalised": false,
        "innerLabel": "enter the name of household",
        "helpText": "",
        "errorMessage": "",
        "tooltip": "",
        "infoText": "",
        "order": 2,
        "readOnly": false,
        "systemDate": false,
        "RegexPattern": false,
        "MdmsDropdown": false,
        "isMdms": false,
        "isMultiSelect": false,
        "type": "textInput",
        "appType": "textInput",
        "toArray.required": true,
        "toArray.required.message": ""
    },
    {
        "label": "RESPONSE_BUTTON_LABEL",
        "value": [],
        "defaultValue": true,
        "active": true,
        "jsonPath": "ResponseButton",
        "metaData": {},
        "hidden": false,
        "deleteFlag": false,
        "isLocalised": false,
        "innerLabel": "",
        "helpText": "",
        "errorMessage": "",
        "tooltip": "",
        "infoText": "",
        "order": 3,
        "readOnly": false,
        "systemDate": false,
        "RegexPattern": false,
        "MdmsDropdown": false,
        "isMdms": false,
        "isMultiSelect": false,
        "type": "textInput",
        "appType": "textInput"
    }
]; 

const AppPreviewResponse = ({ components = [], t, selectedField }) => {
  const headerField = components.find((f) => f.jsonPath === "ResponseHeader");
      const descriptionField = components.find((f) => f.jsonPath === "ResponseDescription");
      const buttonField = components.find((f) => f.jsonPath === "ResponseButton");
    
      const message = !headerField?.hidden ? t(headerField?.label) : "";
      const description = !descriptionField?.hidden ? t(descriptionField?.label) : "";
    
      const footerButtons = !buttonField?.hidden
        ? [
            <Button
              key="footer-btn"
              label={t(buttonField?.label)}
              onClick={() => {}}
              variation="primary"
              style={{ minWidth: "100%" }}
            />,
          ]
        : [];
    
      return (
        <PanelCard
          animationProps={{
            loop: false,
            noAutoplay: false,
          }}
          children={[]}
          cardClassName={"app-preview-selected"}
          cardStyles={{}}
          className=""
          customIcon=""
          description={description}
          footerChildren={footerButtons}
          footerStyles={{
            align: "center",
            minWidth: "100%",
          }}
          iconFill=""
          maxFooterButtonsAllowed={1}
          message={message}
          multipleResponses={[]}
          props={{}}
          sortFooterButtons
          style={{}}
          type={"success"}
        />
      );
};

export default AppPreviewResponse;
