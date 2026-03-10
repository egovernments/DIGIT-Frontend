import React from "react";
// Removed @cyntler/react-doc-viewer to fix CVE-2024-4367 (pdfjs-dist vulnerability).
// Replaced with Office Online iframe for XLSX preview.

function XlsPreviewNew({ file }) {

  return (
    <div>
      <div className="campaign-popup-module"
      style={{ marginTop: "0.5rem" }}
      >
        <iframe
          src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(file?.url)}`}
          style={{ width: "100%", height: "80vh", border: "none" }}
          title="XLSX Preview"
        />
      </div>
    </div>
  );
}

export default XlsPreviewNew;
