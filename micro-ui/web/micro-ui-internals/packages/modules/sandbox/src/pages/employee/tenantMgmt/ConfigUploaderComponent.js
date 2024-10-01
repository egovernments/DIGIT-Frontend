import React, { useEffect, useState } from "react";
import { CardLabel, LabelFieldPair, Uploader } from "@egovernments/digit-ui-components";
import {Toast} from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { Fragment } from "react";

const ConfigUploaderComponent = ({ onSelect, ...props }) => {
  const [showToast, setShowToast] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [file, setFile] = useState(null);
  const [fileStoreId, setFileStoreId] = useState(null);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [uploadErrorMEssage, setUploadErrorMessage] = useState("");
  const { t } = useTranslation();


  const handleUploadFile = async () => {
    // Upload the file first
    try {
      const response = await Digit.UploadServices.Filestorage("Sandbox", file, tenantId);
      const fileStoreId = response?.data?.files?.[0]?.fileStoreId;
      setFileStoreId(fileStoreId)
      setUploadErrorMessage("");
    } catch (error) {
      setToastMessage(t("BANNER_UPLOAD_FAILED"));
      setIsError(true);
      setUploadErrorMessage(t("BANNER_UPLOAD_FAILED"));
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 2000);
    }
  };


  useEffect(() => {
    if (fileStoreId) {
      onSelect("ConfigUploaderComponent", { "fileStoreId": fileStoreId, "type": props?.config?.customProps?.type })
    }
  }, [fileStoreId])


  const selectFile = (file) => {
    setFile(file?.[0])
  }

  useEffect(() => {
    if (file) {
    handleUploadFile();
     }
  }, [file])
  return (
    <>

      <LabelFieldPair className={"uploader-label-field"}>
        <CardLabel>{`${t("BANNER_UPLOAD")}`}</CardLabel>
        <Uploader
          uploadedFiles={[]}
          variant="uploadFile"
          onUpload={(files) => selectFile(files)}
          iserror={uploadErrorMEssage}
          accept="image/*, .jpg, .png, .jpeg"
        // if (files && files.length > 0) {
        //   handleUploadFile(files);
        // }
        />
      </LabelFieldPair>
      {showToast && (
        <Toast
          error={isError}
          label={toastMessage}
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
};

export default ConfigUploaderComponent;
