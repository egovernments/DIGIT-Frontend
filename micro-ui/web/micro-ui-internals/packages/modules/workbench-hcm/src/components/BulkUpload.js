import React, { useState, useMemo, useRef } from "react";
import { UploadIcon, FileIcon, DeleteIconv2 } from "@egovernments/digit-ui-react-components";
import { FileUploader } from "react-drag-drop-files";
import { useTranslation } from "react-i18next";
import { ActionBar, Button, DownloadIcon } from "@egovernments/digit-ui-react-components";
import { SubmitBar } from "@egovernments/digit-ui-react-components";
import XLSX from "xlsx";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import DocViewerWrapper from "@egovernments/digit-ui-module-utilities/src/pages/employee/DocViewer";
import validateExcel from "../utils/validateExcel";

const BulkUpload = ({ multiple = true, onSubmit, downloadFile }) => {
  const { t } = useTranslation();
  const [files, setFiles] = useState([]);
  const fileTypes = ["XLS", "XLSX", "csv" , "CSV"];
  const inputRef = useRef(null);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [showPreview, setShowPreview] = useState(false);
  const [fileUrl, setFileUrl] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [selectedDocs, setSelectedDocs] = useState([]);
  // const documents = fileUrl
  //   ? [{ uri: fileUrl, fileName }]
  //   : selectedDocs.map((file) => ({
  //       uri: window.URL.createObjectURL(file),
  //       fileName: file?.name || fileName,
  //     }));

  const documents = fileUrl
  ? [{ uri: fileUrl, fileName }]
  : Array.isArray(selectedDocs)
    ? selectedDocs.map((file) => ({
        uri: window.URL.createObjectURL(file),
        fileName: file?.name || fileName,
      }))
    : [];

  console.log("down", downloadFile);
  console.log("CHECK", selectedDocs)

  const dragDropJSX = (
    <div className="drag-drop-container">
      <UploadIcon />
      <p className="drag-drop-text">
        {t("WBH_DRAG_DROP")} <text className="browse-text">{t("WBH_BULK_BROWSE_FILES")}</text>
      </p>
    </div>
  );

  const handleFileDelete = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  const handleFileDownload = async(file) => {
    const fileInput = [file];
    const module = "PGR"
    const { data: { files: fileStoreIds } = {} } = await Digit.UploadServices.MultipleFilesStorage(module, fileInput, tenantId);
    const filesArray = [fileStoreIds?.[0]?.fileStoreId]
    const pdfDownload = await Digit.UploadServices.Filefetch(filesArray, tenantId);
    console.log("fileee" , file);
    setFileUrl(pdfDownload?.data?.fileStoreIds?.[0]?.url);
    setFileName(file?.File?.name);
    window.open(pdfDownload?.data?.fileStoreIds?.[0]?.url, "_blank", `name=${fileName}`);
};

console.log("previiiiii" , showPreview);
  const renderFileCards = useMemo(() => {
    return files.map((file, index) => (
      <div className="uploaded-file-container" key={index}>
        <div className="uploaded-file-container-sub" style={{cursor: "pointer"}} onClick={() => {
      setShowPreview(true);
      setSelectedDocs([file]);
      console.log("Clicked file:", file);
    }}>
          <FileIcon className="icon" />
          <div style={{ marginLeft: "0.5rem" }}>{file.name}</div>
        </div>
        <div className="delete-and-download-button">
          <Button
            label={t("WBH_DOWNLOAD")}
            variation="secondary"
            icon={<DownloadIcon styles={{ height: "1.25rem", width: "1.25rem" }} fill="#F47738" />}
            type="button"
            className="workbench-download-template-btn"
            onButtonClick={() => handleFileDownload(file)}
          />
          <Button
            label={t("WBH_DELETE")}
            variation="secondary"
            icon={<DeleteIconv2 styles={{ height: "1.3rem", width: "1.3rem" }} fill="#F47738" />}
            type="button"
            className="workbench-download-template-btn"
            onButtonClick={() => {
              handleFileDelete(index);
              setShowPreview(false);
            }}
          />
        </div>
      </div>
    ));
  }, [files]);

  

  const handleChange = async (newFiles) => {
    const d = validateExcel(newFiles[0]);
    console.log(d, "newFiles")
    setFiles([...newFiles]);
    onSubmit([...newFiles]);
  };

  
  return (
    <React.Fragment>
      <FileUploader multiple={multiple} handleChange={handleChange} name="file" types={fileTypes} children={dragDropJSX} />
      {files.length > 0 && renderFileCards}
      {showPreview && (
       <DocViewer
       theme={{
         primary: "#F47738",
         secondary: "#feefe7",
         tertiary: "#feefe7",
         textPrimary: "#0B0C0C",
         textSecondary: "#505A5F",
         textTertiary: "#00000099",
         disableThemeScrollbar: false,
       }}
       documents={documents}
       pluginRenderers={DocViewerRenderers}
     />
    // <DocViewerWrapper />
  )}
    </React.Fragment>
  );
};

export default BulkUpload;
