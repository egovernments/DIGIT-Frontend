import { useState } from "react";
import { FormStep, CardLabel, UploadFile } from "@egovernments/digit-ui-react-components";

const SelectImages = ({ t, config, onSelect, onSkip, value }) => {
  const [uploadedImages, setUploadedImages] = useState(value?.uploadedImages || []);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size >= 5242880) { setError(t("CS_MAXIMUM_UPLOAD_SIZE_EXCEEDED")); return; }
    setUploading(true);
    setError(null);
    try {
      const response = await Digit.UploadServices.Filestorage("pgr", file, tenantId);
      const fileStoreId = response?.data?.files?.[0]?.fileStoreId;
      if (fileStoreId) setUploadedImages((prev) => [...prev, fileStoreId]);
      else setError(t("CS_FILE_UPLOAD_ERROR"));
    } catch {
      setError(t("CS_FILE_UPLOAD_ERROR"));
    }
    setUploading(false);
  };

  return (
    <FormStep config={config} onSelect={() => onSelect({ uploadedImages })} onSkip={onSkip} t={t}>
      <CardLabel>{t("CS_ADDCOMPLAINT_UPLOAD_PHOTO")}</CardLabel>
      <UploadFile
        id="pgr-photos"
        accept=".jpg,.jpeg,.png"
        onUpload={handleUpload}
        onDelete={() => setUploadedImages([])}
        message={uploading ? t("CS_UPLOADING") : uploadedImages.length > 0 ? `${uploadedImages.length} ${t("CS_ACTION_FILEUPLOADED")}` : t("CS_ACTION_NO_FILEUPLOADED")}
      />
      {error && <span className="pgr-input-error">{error}</span>}
    </FormStep>
  );
};

export default SelectImages;
