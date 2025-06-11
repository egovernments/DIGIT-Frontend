import React from "react";
import { Button, PanelCard } from "@egovernments/digit-ui-components";

const AppPreviewResponse = ({ components = [], t, selectedField }) => {

  //[TO DO:: Components to render , Currently hardcoded, Need to move it to config if required]
  const headerField = components.find((f) => f.jsonPath === "AcknowledgementTitle");
      const descriptionField = components.find((f) => f.jsonPath === "AcknowledgementDescription");
      const primaryButtonField = components.find((f) => f.jsonPath === "AcknowledgementPrimaryButton");
      const secondaryButtonField = components.find((f) => f.jsonPath === "AcknowledgementSecondaryButton");
    
      const message = !headerField?.hidden ? t(headerField?.label) : "";
      const description = !descriptionField?.hidden ? t(descriptionField?.label) : "";
    
      const footerButtons = [];

  if (!secondaryButtonField?.hidden) {
    footerButtons.push(
      <Button
        key="secondary-btn"
        label={t(secondaryButtonField.label)}
        onClick={() => {}}
        variation="secondary"
        style={{ minWidth: "100%" }}
      />
    );
  }

  if (!primaryButtonField?.hidden) {
    footerButtons.push(
      <Button
        key="primary-btn"
        label={t(primaryButtonField.label)}
        onClick={() => {}}
        variation="primary"
        style={{ minWidth: "100%" }}
      />
    );
  }

    
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
          maxFooterButtonsAllowed={2}
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
