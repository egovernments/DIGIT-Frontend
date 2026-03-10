import React from "react";
// Removed @cyntler/react-doc-viewer to fix CVE-2024-4367 (pdfjs-dist vulnerability).
// Replaced with Office Online iframe for XLSX preview.

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

function XlsPreviewNew({ file }) {
  const safeUrl = sanitizeUri(file?.url);

  return (
    <div>
      <div className="campaign-popup-module"
      style={{ marginTop: "0.5rem" }}
      >
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
    </div>
  );
}

export default XlsPreviewNew;
