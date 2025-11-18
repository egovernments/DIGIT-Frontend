import React from "react";
import { Button, CustomSVG } from "@egovernments/digit-ui-components";

const QRScanner = ({ field, t, fieldTypeMasterData, props }) => {
  // Get variation and icon from field with fallback to defaults
  return (
    <Button
      variation={"secondary"}
      label={t(field?.label || props?.field?.label || "")}
      onClick={() => {}}
      className="app-preview-action-button"
      icon={"QrCodeScanner"}
    />
  );
};

export default QRScanner;
