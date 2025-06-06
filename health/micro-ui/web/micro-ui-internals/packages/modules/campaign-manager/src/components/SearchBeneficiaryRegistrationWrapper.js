import React, { Fragment } from "react";
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
} from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { ProximitySearch, RegistrationComponentRegistry } from "../utils/template_components/RegistrationComponents";


const SearchBeneficiaryRegistrationWrapper = ({ components = dummydata, metaMasterConfig, t }) => {

  const getMetaDataForComponent = (field, componentMetaConfig) => {
    const match = componentMetaConfig.find(
      (cfg) => cfg.metadata.format === field.jsonPath && cfg.type === "button"
    );
  
    if (!match) return null;
  
    return {
      variation: match.metadata.variation || "primary",
      icon: match.metadata.icon || "",
      component: match.metadata.component || "",
      format: match.metadata.format,
      ...match.metadata, // return all metadata keys 
    };
  };
  
    // Build config map for quick lookup
    const configMap = {};
    metaMasterConfig.forEach((cfg) => {
      configMap[cfg.metadata.format] = cfg.metadata;
    });

    // Separate fields and buttons
        const contentFields = components.filter(
          (field) => !field.hidden && field.type !== "button"
        );
        const buttonFields = components.filter(
              (field) =>
                !field.hidden &&
                field.type === "button" &&
                configMap[field.jsonPath]?.component
            );
  

    return (
      <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, height: "100%" }}>
        {/* Field Components */}
        <div style={{ flexGrow: 1 }}>
          {contentFields.map((field, index) => {
            const meta = configMap[field.jsonPath];
            const ComponentToRender = RegistrationComponentRegistry[meta?.component];
            if (!ComponentToRender) return null;
  
            return (
              <div key={index} style={{ marginBottom: "16px", width: "100%" }}>
                <ComponentToRender props={field} t={t} />
              </div>
            );
          })}
        </div>
  
        {/* Buttons */}
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
            {buttonFields
              .sort((a, b) => a.order - b.order)
              .map((field, index) => (
                <Button
                  key={index}
                  className="app-preview-action-button"
                  variation={getMetaDataForComponent(field, metaMasterConfig).variation}
                  label={t(field.label) || "LABEL"}
                  title={t(field.label) || "LABEL"}
                  icon={getMetaDataForComponent(field, metaMasterConfig).icon}
                  onClick={() => {}}
                />
              ))}
          </div>
        )}
      </div>
    );
  };

export default SearchBeneficiaryRegistrationWrapper;
