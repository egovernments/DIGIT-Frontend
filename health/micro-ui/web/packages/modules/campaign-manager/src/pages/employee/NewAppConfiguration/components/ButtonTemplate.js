import React from "react";
import { Button, CustomSVG } from "@egovernments/digit-ui-components";

const ButtonTemplate = ({ field, t, fieldTypeConfig }) => {
  // Get icon component if specified
  const iconName = field?.additionalProps?.icon;
  let IconComponent = null;

  if (iconName) {
    // Direct icon name mapping - the CustomSVG component expects these exact names
    // Based on common DIGIT UI patterns
    IconComponent = () => <CustomSVG name={iconName} />;
  }

  return (
    <Button
      variation={field?.additionalProps?.variation || "primary"}
      label={t(field?.label) || "Button"}
      onClick={() => {}}
      className="app-preview-action-button"
      icon={IconComponent}
    />
  );
};

export default ButtonTemplate;
