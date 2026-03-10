import { PopUp } from "@egovernments/digit-ui-react-components";
import React from "react";
// Removed @cyntler/react-doc-viewer to fix CVE-2024-4367 (pdfjs-dist vulnerability).
// Replaced with Office Online iframe for XLSX preview.
import { Button } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
function XlsPreview({ file, ...props }) {
  const { t } = useTranslation();

  return (
    <PopUp className="campaign-data-preview" style={{ flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginLeft: "2.5rem", marginRight: "2.5rem", marginTop: "2.5rem" }}>
        <Button
          label={t("BACK")}
          onClick={() => props?.onBack()}
          variation="secondary"
          icon="ArrowBack"
          className={"back-button-xlsxpreview"}
        />
        <Button
          label={t("WBH_DOWNLOAD")}
          onClick={() => props?.onDownload()}
          variation="primary"
          isSuffix
          icon="FileDownload"
        />
      </div>
      <div className="campaign-popup-module" style={{ marginTop: "1.5rem" }}>
        <iframe
          src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(file?.url)}`}
          style={{ width: "100%", height: "80vh", border: "none" }}
          title="XLSX Preview"
        />
      </div>
    </PopUp>
  );
}

export default XlsPreview;
