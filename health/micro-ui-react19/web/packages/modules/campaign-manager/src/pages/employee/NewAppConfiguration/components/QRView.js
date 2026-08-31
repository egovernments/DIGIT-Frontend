import React from "react";
import { SVG } from "@egovernments/digit-ui-components";

const QRView = ({ field, t, fieldTypeMasterData, props }) => {
  const IconComponent = SVG["QrCodeScanner"] || SVG["Home"];

  if (!IconComponent) {
    return null;
  }

  return (
    // width:100% is load-bearing. The wrapper this renders into
    // (.template-field-wrapper) is itself display:flex with the default
    // justify-content:flex-start, so without an explicit width this div is a
    // shrink-to-fit flex item pinned to the left edge — and the centering
    // below would only centre the icon inside that narrow box.
    <div style={{ width: "100%", maxHeight: "200px", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <IconComponent width="100%" height="100%" style={{ maxHeight: "200px" }} fill={"black"}/>
    </div>
  );
};

export default QRView;
