import React from "react";
// Removed @cyntler/react-doc-viewer to fix CVE-2024-4367 (pdfjs-dist vulnerability).
// Replaced with Office Online iframe for XLSX preview.
import { useTranslation } from "react-i18next";
import PopUp from "./PopUp";
import { DownloadIcon } from "./svgindex";
import Button from "./Button";
import { SVG } from "./SVG";


/* Steps to use
*   1. Import the XlsPreview component
*        import XlsPreview from "@egovernments/digit-ui-react-components";
*    2.  Call the component
*        <XlsPreview file={file} onDownload={() => handleFileDownload(fileUrl)} onBack={() => {}} />
*
*    Note:
*      Props need to pass in XlsPreview while calling
*      a) file
*      The Structure of the file props is
*      {
*          "id": fileStoreId, (id is optional)
*          "url": "https://unified-dev-bucket-s3.s3-ap-south-1.amazonaws.com/....", (url of th file getting from filestore search)
*          "fileName": "dummyName.xlsx" (FileName to show the on header)
*      }
*      b) onDownload
*      c) onBack
*
*/


import PropTypes from 'prop-types';
import { COLOR_FILL } from "./contants";

const sanitizeUri = (value) => {
  if (!value) return null;
  if (typeof value === "string" && value.startsWith("blob:")) return value;
  try {
    const parsed = new URL(value, window.location.origin);
    if (!["http:", "https:", "blob:"].includes(parsed.protocol)) return null;
    return parsed.href;
  } catch (e) {
    return null;
  }
};

function XlsPreview({ file, ...props }) {
  const { t } = useTranslation();
  const safeUrl = sanitizeUri(file?.url);

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
          icon={<SVG.ArrowBackIos styles={{ height: "1.25rem", width: "1.25rem" }} fill={COLOR_FILL} />}
          type="button"
          onButtonClick={() => props?.onBack()}
        />
        <Button
          label={t("CS_COMMON_DOWNLOAD")}
          variation="secondary"
          icon={<DownloadIcon styles={{ height: "1.25rem", width: "1.25rem" }} fill={COLOR_FILL} />}
          type="button"
          onButtonClick={() => props?.onDownload()}
        />
      </div>
      <div className="xls-popup-module" style={{ marginTop: "1.5rem", ...props?.containerStyle }}>
        {safeUrl ? (
          <iframe
            src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(safeUrl)}`}
            style={{ width: "100%", height: "80vh", border: "none" }}
            title="XLSX Preview"
          />
        ) : (
          <span>Unable to preview this file.</span>
        )}
      </div>
    </PopUp>
  );
}

XlsPreview.propTypes = {
  file: PropTypes.shape({
    fileName: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }),
  className: PropTypes.string,
  modalStyle: PropTypes.object,
  btnStyle: PropTypes.object,
  onBack: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired,
  containerStyle: PropTypes.object,
};

export default XlsPreview;
