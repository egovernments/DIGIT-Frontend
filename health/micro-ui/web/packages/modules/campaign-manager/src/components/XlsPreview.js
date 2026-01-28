import { PopUp, SVG, DownloadIcon } from "@egovernments/digit-ui-react-components";
import React from "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { Button } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { PRIMARY_COLOR } from "../utils";

const ArrowBack = ({ className = "", height = "15", width = "15", styles = {} }) => {
  return (
    <svg className={className} style={styles} width={width} height={height} viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14.1663 6.16658H4.02467L8.68301 1.50825L7.49967 0.333252L0.833008 6.99992L7.49967 13.6666L8.67467 12.4916L4.02467 7.83325H14.1663V6.16658Z"
        fill={PRIMARY_COLOR}
      />
    </svg>
  );
};
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
      <div style={{ display: "flex", justifyContent: "space-between", marginLeft: "2.5rem", marginRight: "2.5rem", marginTop: "2.5rem" }}>
        <Button
          label={t("BACK")}
          title={t("BACK")}
          onClick={() => props?.onBack()}
          variation="secondary"
          icon="ArrowBack"
          className={"back-button-xlsxpreview"}
        />
        <Button
          label={t("WBH_DOWNLOAD")}
          title={t("WBH_DOWNLOAD")}
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
