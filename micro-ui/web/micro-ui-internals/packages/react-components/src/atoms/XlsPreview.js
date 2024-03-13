import React from "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { useTranslation } from "react-i18next";
import PopUp from "./PopUp";
import { DownloadIcon } from "./svgindex";
import Button from "./Button";
import { SVG } from "./SVG";

function XlsPreview({ file, ...props }) {
  const { t } = useTranslation();
  const documents = file
    ? [
        {
          fileType: "xlsx",
          fileName: file?.fileName,
          uri: file?.url,
        },
      ]
    : null;

  return (
    <PopUp className={props?.className} style={{ flexDirection: "column", ...props?.modalStyle }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginLeft: "2.5rem",
          marginRight: "2.5rem",
          marginTop: "2.5rem",
          ...props?.btnStyle,
        }}
      >
        <Button
          label={t("CS_COMMON_BACK")}
          variation="secondary"
          icon={<SVG.ArrowBackIos styles={{ height: "1.25rem", width: "1.25rem" }} fill="#F47738" />}
          type="button"
          onButtonClick={() => props?.onBack()}
        />
        <Button
          label={t("CS_COMMON_DOWNLOAD")}
          variation="secondary"
          icon={<DownloadIcon styles={{ height: "1.25rem", width: "1.25rem" }} fill="#F47738" />}
          type="button"
          onButtonClick={() => props?.onDownload()}
        />
      </div>
      <div className="xls-popup-module" style={{ marginTop: "1.5rem", ...props?.containerStyle }}>
        <DocViewer
          style={{ height: "80vh", overflowY: "hidden" }}
          theme={{
            primary: "#F47738",
            secondary: "#feefe7",
            tertiary: "#feefe7",
            textPrimary: "#0B0C0C",
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
