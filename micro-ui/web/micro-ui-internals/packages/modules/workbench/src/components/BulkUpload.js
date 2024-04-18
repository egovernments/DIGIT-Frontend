import React, { useState, useMemo , useEffect } from "react";
import { UploadIcon, FileIcon, DeleteIconv2 , ActionBar , SubmitBar } from "@egovernments/digit-ui-react-components";
import { FileUploader } from "react-drag-drop-files";
import { useTranslation } from "react-i18next";

const BulkUpload = ({ multiple = true, onSubmit , onSuccess }) => {
  const { t } = useTranslation();
  const [files, setFiles] = useState([]);
  const fileTypes = ["XLS", "XLSX"];

  useEffect(() => {
    if (onSuccess) {
      setFiles([]);
    }
  }, [onSuccess]);

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

  const renderFileCards = useMemo(() => {
    return files.map((file, index) => (
      <div className="uploaded-file-container" key={index}>
        <div className="uploaded-file-container-sub">
          <FileIcon className="icon" />
          <div style={{ marginLeft: "0.5rem" }}>{file.name}</div>
        </div>
        <div className="icon" onClick={() => handleFileDelete(index)}>
          <DeleteIconv2 />
        </div>
      </div>
    ));
  }, [files]);

  const handleChange = (newFiles) => {
    setFiles([...files, ...newFiles]);
  };

  return (
    <React.Fragment>
      <FileUploader multiple={multiple} handleChange={handleChange} name="file" types={fileTypes} children={dragDropJSX} />
      {files.length > 0 && renderFileCards}
      <ActionBar>
        <SubmitBar label={t("WBH_CONFIRM_UPLOAD")} onSubmit={() => onSubmit(files)} disabled={files.length === 0} />
      </ActionBar>
    </React.Fragment>
  );
};

export default BulkUpload;
