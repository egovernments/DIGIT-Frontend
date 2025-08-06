import React from "react";
import { Button } from "@egovernments/digit-ui-components";
import { getRegisteredComponent } from "../utils/template_components/RegistrationRegistry";
import { getTemplateRenderer } from "../utils/template_components/RegistrationComponents";
import { DynamicImageComponent } from "./DynamicImageComponent";


const GenericTemplateScreen = ({ components = [], t, selectedField, templateName }) => {


  const TemplateRenderer = templateName ? getTemplateRenderer(templateName) : null;
  const contentFields = components
    .filter(
      (field) =>
        !field.hidden &&
        field.jsonPath !== "PrimaryButton" &&
        field.jsonPath !== "SecondaryButton"
    )
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const buttonFields = components
    .filter(
      (field) =>
        !field.hidden &&
        (field.jsonPath === "PrimaryButton" || field.jsonPath === "SecondaryButton" || field.jsonPath === "qrscanner")
    )
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div
      style={{
        position: "relative",     // required for absolute button placement
        minHeight: "200%",          // or whatever height your card should have
        overflow: "hidden",       // prevent scroll bleed
        background: "#fff",
      }}
    >
      {/* Scrollable Content Area */}
      <div
        style={{
          height: "60vh",
          overflowY: "auto",
          //   padding: "1rem",
          paddingBottom: buttonFields.length > 0 ? "6rem" : "1rem", // leave space for footer
          overflowX:"hidden"
        }}
      >
        {TemplateRenderer ? (
          <TemplateRenderer components={components} t={t} />
        ) :
          contentFields.map((field, index) => {
            const isSelected = selectedField?.jsonPath === field.jsonPath;
            if (field.type === "custom" && field.format === "custom" && field.appType) {
              return (
                <div
                  key={index}
                  className={isSelected ? "app-preview-field-pair app-preview-selected" : ""}
                  style={{ marginBottom: "16px", width: "100%", marginTop: "4px", display: "flex", alignItems: "center"}}
                >
                  <DynamicImageComponent type={field?.type} appType={field?.appType} />
                </div>
              )
            }
            const ComponentToRender = getRegisteredComponent(field.jsonPath);
            if (!ComponentToRender) return null;
            return (
              <div
                key={index}
                className={isSelected ? "app-preview-field-pair app-preview-selected" : ""}
                style={{ marginBottom: "16px", width: "100%", marginTop: "4px" }}
              >
                <ComponentToRender field={field} t={t} />
              </div>
            );
          })}
      </div>

      {/* Fixed Buttons at Card Bottom */}
      {buttonFields.length > 0 && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            background: "#fff",
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          {buttonFields.map((field, index) => (
            <div className={`${selectedField?.jsonPath === field.jsonPath ? "app-preview-field-pair app-preview-selected" : ""}`}>
            <Button
              key={index}
              variation={field.jsonPath === "SecondaryButton" ? "secondary" : "primary"}
              label={t(field?.label)}
              onClick={() => { }}
              style={{ minWidth: "100%" }}
              icon={field.icon || null}
            />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GenericTemplateScreen;