import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { formatTimestampToDateTime } from "../utils";

/**
 * Renders the sign-offs captured on a bill (printed name, signature image,
 * role, action and date/time) wherever approval details are shown.
 */
const BillSignaturesView = ({ signatures }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [urlByFileStoreId, setUrlByFileStoreId] = useState({});

  const fileStoreIds = useMemo(
    () => (signatures || []).map((s) => s?.fileStoreId).filter(Boolean),
    [signatures]
  );

  useEffect(() => {
    if (!fileStoreIds.length) return;
    Digit.UploadServices.Filefetch(fileStoreIds, tenantId)
      .then((res) => setUrlByFileStoreId(res?.data || {}))
      .catch((err) => console.error("Failed to fetch signature images:", err));
  }, [JSON.stringify(fileStoreIds), tenantId]);

  if (!signatures || signatures.length === 0) return null;

  const resolveUrl = (fileStoreId) => {
    const value = urlByFileStoreId?.[fileStoreId];
    if (!value) return null;
    // filestore url responses can be comma-separated variants; take the first
    return typeof value === "string" ? value.split(",")[0] : null;
  };

  return (
    <div style={{ marginTop: "1.5rem" }}>
      <span style={{ fontSize: "18px", fontWeight: 700, color: "#0B4B66" }}>{t("HCM_AM_BILL_SIGNATURES")}</span>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginTop: "0.75rem" }}>
        {signatures.map((signature, index) => {
          const imageUrl = resolveUrl(signature?.fileStoreId);
          return (
            <div
              key={signature?.id || index}
              style={{
                border: "1px solid #D6D5D4",
                borderRadius: "4px",
                padding: "0.75rem 1rem",
                minWidth: "260px",
                backgroundColor: "#FAFAFA",
              }}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={t("HCM_AM_SIGNATURE")}
                  style={{
                    maxHeight: "70px",
                    maxWidth: "220px",
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #EEEEEE",
                    borderRadius: "4px",
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                />
              ) : (
                <div style={{ color: "#505A5F", marginBottom: "0.5rem" }}>{t("HCM_AM_SIGNATURE_IMAGE_UNAVAILABLE")}</div>
              )}
              <div style={{ fontWeight: 700 }}>{signature?.printedName || t("NA")}</div>
              <div style={{ color: "#505A5F", fontSize: "14px" }}>
                {signature?.role ? t(`HCM_AM_ROLE_${signature.role}`) : t("NA")}
              </div>
              <div style={{ color: "#505A5F", fontSize: "14px" }}>
                {signature?.action ? t(`HCM_AM_SIGNATURE_ACTION_${signature.action}`) : t("NA")}
              </div>
              <div style={{ color: "#505A5F", fontSize: "14px" }}>
                {signature?.signedTime ? formatTimestampToDateTime(signature.signedTime) : t("NA")}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BillSignaturesView;