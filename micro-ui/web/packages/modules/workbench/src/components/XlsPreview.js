import { PopUp } from "@egovernments/digit-ui-react-components";
import React from "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { Button } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { PRIMARY_COLOR } from "../utils";

function XlsPreview({ file, ...props }) {
  const { t } = useTranslation();
  const documents = file
    ? [
      {
        fileType: "xlsx",
        fileName: file?.filename,
        uri: file?.url,
      },
    ]
    : null;

  return (
    <PopUp className="campaign-data-preview" style={{ flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginLeft: "2.5rem", marginRight: "2.5rem", marginTop: "6.25rem" }}>
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
        <DocViewer
          style={{ height: "80vh", overflowY: "hidden" }}
          theme={{
            primary: PRIMARY_COLOR,
            secondary: "#feefe7",
            tertiary: "#feefe7",
            textPrimary: "#FFFFFF",
            textSecondary: "#505A5F",
            textTertiary: "#00000099",
            disableThemeScrollbar: true,
          }}
          documents={documents}
          pluginRenderers={DocViewerRenderers}
        />
      </div>
    </PopUp>
  );
}

export default XlsPreview;
