import React, { useEffect, useState } from "react";
import { CardLabel, LabelFieldPair, Uploader, Toast } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { Fragment } from "react";

const LogoUploaderComponent = ({ onSelect, ...props }) => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [file, setFile] = useState(null);
  const [fileStoreId, setFileStoreId] = useState(null);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();



  const handleUploadFile = async () => {
    // Upload the file first
    try {
      const response = await Digit.UploadServices.Filestorage("Sandbox", file, tenantId);
      const fileStoreId = response?.data?.files?.[0]?.fileStoreId;
      setFileStoreId(fileStoreId)
    } catch (error) {
      setToastMessage(error.message);
      setIsError(true);
      setShowToast(true);
    }
  };

  useEffect(() => {
    if (fileStoreId) {
      onSelect("LogoUploaderComponent", { "fileStoreId": fileStoreId, "type": "LogoUrl" })
    }
  }, [fileStoreId])


  const selectFile = (file) => {
    setFile(file?.[0])
  }

  useEffect(() => {
    // if (file?.length > 0) {
    handleUploadFile();
    // }
  }, [file])
  return (
    <>
      <LabelFieldPair className={"uploader-label-field"}>
        <CardLabel>{`${t("LOGO_UPLOAD_LABEL")}`}</CardLabel>
        <Uploader
          uploadedFiles={[]}
          variant="uploadFile"
          onUpload={(files) => selectFile(files)}
        // if (files && files.length > 0) {
        //   handleUploadFile(files);
        // }
        />
      </LabelFieldPair>
    </>
  );
};

export default LogoUploaderComponent;
