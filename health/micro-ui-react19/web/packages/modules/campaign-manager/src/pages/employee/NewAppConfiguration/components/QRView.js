import React from "react";
import { SVG } from "@egovernments/digit-ui-components";

const QRView = ({ field, t, fieldTypeMasterData, props }) => {
  const IconComponent = SVG["QrCodeScanner"] || SVG["Home"];

  if (!IconComponent) {
    return null;
  }

  return (
    <div style={{ maxHeight: "200px", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <IconComponent width="100%" height="100%" style={{ maxHeight: "200px" }} fill={"black"}/>
    </div>
  );
};

export default QRView;
