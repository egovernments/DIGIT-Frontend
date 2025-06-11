import React from "react";
import { Button } from "@egovernments/digit-ui-components";
import { getRegisteredComponent } from "../utils/template_components/RegistrationRegistry";

const SearchBeneficiaryRegistrationWrapper = ({ components = [], t, selectedField }) => {
  // Split fields directly using jsonPath
  const contentFields = components.filter(
    (field) => !field.hidden && field.jsonPath !== "BeneficiaryRegistrationButton" && field.jsonPath !== "scanner"
  );
  const buttonFields = components.filter(
    (field) => !field.hidden && (field.jsonPath === "BeneficiaryRegistrationButton" || field.jsonPath === "qrscanner")
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, height: "100%" }}>
      {/* Render content fields */}
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

      {/* Render buttons */}
      {buttonFields.length > 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            marginTop: "auto",
            paddingTop: "1rem",
          }}
        >
          {buttonFields.map((field, index) => {
            const isSelected = selectedField?.jsonPath === field.jsonPath;
            return (
              <Button
                key={index}
                className={`app-preview-action-button ${isSelected ? `app-preview-field-pair app-preview-selected` : ""}`}
                variation={field.jsonPath === "qrscanner" ? "secondary" : "primary"}
                label={t(field.label) || "LABEL"}
                title={t(field.label) || "LABEL"}
                icon={field.jsonPath === "qrscanner" ? "QrCodeScanner" : null}
                onClick={() => {}}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchBeneficiaryRegistrationWrapper;
