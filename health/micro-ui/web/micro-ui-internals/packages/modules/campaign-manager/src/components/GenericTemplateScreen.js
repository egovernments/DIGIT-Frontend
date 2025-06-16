import React from "react";
import { Button } from "@egovernments/digit-ui-components";
import { getRegisteredComponent } from "../utils/template_components/RegistrationRegistry";

const GenericTemplateScreen = ({ components = [], t, selectedField }) => {
  const contentFields = components.filter(
    (field) => !field.hidden && !["PrimaryButton", "SecondaryButton"].includes(field.jsonPath)
  );

  const primaryButton = components.find((field) => field.jsonPath === "PrimaryButton" && !field.hidden);
  const secondaryButton = components.find((field) => field.jsonPath === "SecondaryButton" && !field.hidden);

  return (
    <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, height: "100%" }}>
      {/* Render Dynamic Components */}
      <div style={{ flexGrow: 1 }}>
        {contentFields.map((field, index) => {
          const ComponentToRender = getRegisteredComponent(field.jsonPath);
          const isSelected = selectedField?.jsonPath === field.jsonPath;
          if (!ComponentToRender) return null;

          return (
            <div
              className={isSelected ? "app-preview-field-pair app-preview-selected" : ""}
              key={index}
              style={{ marginBottom: "16px", width: "100%" }}
            >
              <ComponentToRender field={field} t={t} />
            </div>
          );
        })}
      </div>

      {/* Render Footer Buttons */}
      {(primaryButton || secondaryButton) && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            marginTop: "auto",
            paddingTop: "1rem",
          }}
        >
          {secondaryButton && (
            <Button
              variation="secondary"
              label={t(secondaryButton.label)}
              onClick={() => {}}
              style={{ minWidth: "100%" }}
              className={`app-preview-action-button ${
                selectedField?.jsonPath === secondaryButton.jsonPath ? "app-preview-selected" : ""
              }`}
              icon={secondaryButton.icon || null}
            />
          )}
          {primaryButton && (
            <Button
              variation="primary"
              label={t(primaryButton.label)}
              onClick={() => {}}
              style={{ minWidth: "100%" }}
              className={`app-preview-action-button ${
                selectedField?.jsonPath === primaryButton.jsonPath ? "app-preview-selected" : ""
              }`}
              icon={primaryButton.icon || null}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default GenericTemplateScreen;
