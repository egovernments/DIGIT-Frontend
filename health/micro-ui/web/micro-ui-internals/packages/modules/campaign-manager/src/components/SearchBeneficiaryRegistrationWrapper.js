import React from "react";
import { Button } from "@egovernments/digit-ui-components";
import { getRegisteredComponent } from "../utils/template_components/RegistrationRegistry";

const SearchBeneficiaryRegistrationWrapper = ({ components = [], metaMasterConfig, t, selectedField }) => {
  // Build config map for quick lookup
  const configMap = metaMasterConfig?.reduce((acc, cfg) => {
    if (cfg?.metadata?.format) acc[cfg.metadata.format] = cfg;
    return acc;
  }, {}) || {};

  // Get enriched metadata for a field
  const getMetaDataForField = (field) => {
    const match = configMap[field?.jsonPath];
    if (!match) return null;
    return {
      variation: match?.metadata?.variation || "primary",
      icon: match?.metadata?.icon || "",
      component: match?.metadata?.component || "",
      type: match?.type,
      ...match.metadata,
    };
  };

  // Split fields
  const contentFields = [];
  const buttonFields = [];

  for (const field of components) {
    if (field.hidden) continue;
    const meta = getMetaDataForField(field);
    if (!meta) continue;

    if (meta.type === "button") {
      buttonFields.push({ field, meta });
    } else {
      contentFields.push({ field, meta });
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, height: "100%" }}>
      {/* Render content fields */}
      <div style={{ flexGrow: 1 }}>
        {contentFields.map(({ field, meta }, index) => {
          const isSelected = selectedField?.type === meta.format;
          const ComponentToRender = getRegisteredComponent(meta.component);
          if (!ComponentToRender) return null;

          return (
            <div className={isSelected ? "app-preview-field-pair app-preview-selected" : ""} key={index} style={{ marginBottom: "16px", width: "100%" }}>
              <ComponentToRender props={field} t={t} />
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
          {buttonFields
            .sort((a, b) => a.field.order - b.field.order)
            .map(({ field, meta }, index) => {
              const isSelected = selectedField?.type === meta.format;
              return (
              <Button
                key={index}
                className={`app-preview-action-button ${isSelected ? `app-preview-field-pair app-preview-selected` : ""}`}
                variation={meta.variation}
                label={t(field.label) || "LABEL"}
                title={t(field.label) || "LABEL"}
                icon={meta.icon}
                onClick={() => {}}
              />
            );
            }
            )}
        </div>
      )}
    </div>
  );
};

export default SearchBeneficiaryRegistrationWrapper;
