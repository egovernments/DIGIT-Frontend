import { Button, Header } from "@egovernments/digit-ui-react-components";
import React, { useRef , useState } from "react";
import { useTranslation } from "react-i18next";
import { DownloadIcon } from "@egovernments/digit-ui-react-components";
import BulkUpload from "./BulkUpload";

const UploadBoundaryData = () => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [downloadFile, setDownloadFile] = useState(null);

  const onBulkUploadSubmit = async (file) => {
    const module = "PGR"
    const { data: { files: fileStoreIds } = {} } = await Digit.UploadServices.MultipleFilesStorage(module, file, tenantId);
    const filesArray = [fileStoreIds?.[0]?.fileStoreId];
    const downloadFile = await Digit.UploadServices.Filefetch(filesArray, tenantId);
    setDownloadFile(downloadFile);
    console.log("filesssss" , fileStoreIds);
    console.log("fileArray" , filesArray);
    // console.log("Download" , Download);
  }

  return (
    <React.Fragment>
      <div className="workbench-bulk-upload">
        <Header className="digit-form-composer-sub-header">{t("WBH_UPLOAD_BOUNDARY")}</Header>
        <Button
          label={t("WBH_DOWNLOAD_TEMPLATE")}
          variation="secondary"
          icon={<DownloadIcon styles={{ height: "1.25rem", width: "1.25rem" }} fill="#F47738" />}
          type="button"
          className="workbench-download-template-btn"
        />
      </div>
      <div className="info-text">{t(`HCM_MESSAGE`)}</div>
      <BulkUpload onSubmit={onBulkUploadSubmit} downloadFile={downloadFile}  />
    </React.Fragment>
  );
};

export default UploadBoundaryData;
