import React, { useState, useMemo , useEffect } from "react";
import { UploadIcon, FileIcon, DeleteIconv2 , ActionBar , SubmitBar  } from "@egovernments/digit-ui-react-components";
import { Toast } from "@egovernments/digit-ui-components";
import { FileUploader } from "react-drag-drop-files";
import { useTranslation } from "react-i18next";

const BulkUpload = ({ multiple = true, onSubmit , onSuccess }) => {
  const { t } = useTranslation();
  const [files, setFiles] = useState([]);
  const fileTypes = ["XLS", "XLSX"];
  const [showToast, setShowToast] = useState(null);

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

  const closeToast = () => {
    setTimeout(() => {
      setShowToast(null);
    }, 5000);
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
    if (newFiles.length > 1) {
      setShowToast({ key: "error", label: t("WBH_ERROR_MORE_THAN_ONE_FILE") , type: "error" });
      closeToast();
      return;
    }
    // setFiles([...files, ...newFiles]);
    setFiles([...newFiles]);
  };

  return (
    <React.Fragment>
      {(!files || files?.length === 0) && (
        <FileUploader multiple={multiple} handleChange={handleChange} name="file" types={fileTypes} children={dragDropJSX} />
      )}
      {/* <FileUploader multiple={multiple} handleChange={handleChange} name="file" types={fileTypes} children={dragDropJSX} /> */}
      {files.length > 0 && renderFileCards}
      {showToast && <Toast label={showToast?.label} type={showToast?.type} isDleteBtn={true} onClose={() => setShowToast(null)}></Toast>}
      <ActionBar>
        <SubmitBar label={t("WBH_CONFIRM_UPLOAD")} onSubmit={() => onSubmit(files)} disabled={files.length === 0} />
      </ActionBar>

    </React.Fragment>
  );
};

export default BulkUpload;
