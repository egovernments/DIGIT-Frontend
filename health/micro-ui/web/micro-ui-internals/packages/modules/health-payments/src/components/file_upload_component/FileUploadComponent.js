import React, { useState, useEffect } from "react";
import { UploadFile, SubmitBar } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
// import { downloadFileWithCustomName } from "../utils/downloadFileWithCustomName";
import { downloadFileWithCustomName } from "./downloadFileWithCustomName";
// import jsPDF from "jspdf";
import { Button} from "@egovernments/digit-ui-components";
import { set } from "lodash";

const UploadedFileComponent = ({ config, onSelect, value, isMandatory = false , mockFile}) => {
  const { t } = useTranslation();
  const [files, setFiles] = useState([]);
  const uploadedFiles = value || [];
  const [filesToUpload, setFilesToUpload] = useState([]);

  const [error, setError] = useState(null);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const user = Digit.UserService.getUser();
  const timestamp = new Date().getTime();
  const MAX_FILES = 5; // Maximum number of files allowed
  // Fetch max file size from MDMS v2
  const { isLoading: isMaxFileSizeLoading, data: maxFileSizeData } = Digit.Hooks.useCustomMDMS(
    tenantId,
    "PGR",
    [{ name: "MaxFileSize" }],
    {
      select: (data) => {
        // Extract maxFileSize from MDMS v2 response
        const maxFileSize = data?.PGR?.MaxFileSize?.[0]?.maxFileSize;
        return maxFileSize ? parseInt(maxFileSize) : 5242880; // Default to 5MB if not found
      },
    },
    {
      schemaCode: "PGR.MaxFileSize",
      limit: 10,
      offset: 0
    }
  );

  const maxFileSize = maxFileSizeData || 5242880; // Default to 5MB (5242880 bytes)
  const maxFileSizeMB = (maxFileSize / 1048576).toFixed(0); // Convert bytes to MB for display
  

  useEffect(() => {
    if (!filesToUpload.length) return;

    (async () => {
      setError(null);

      const validTypes = ["application/pdf", "image/jpeg", "image/jpg","image/png"];
      const uploadedResults = [];

      for (const file of filesToUpload) {
        if (!validTypes.includes(file.type)) {
          setError(t("CS_INVALID_FILE_TYPE"));
          return;
        }

        if (file.size > maxFileSize) {
          setError(
            `${t("CS_MAXIMUM_UPLOAD_SIZE_EXCEEDED")} (${maxFileSizeMB} MB)`
          );
          return;
        }

        try {
          const response = await Digit.UploadServices.MultipleFilesStorage(
            "test",
            [file],
            tenantId
          );

          const uploaded = response?.data?.files?.[0];

          if (uploaded) {
            uploadedResults.push({
              fileStoreId: uploaded.fileStoreId,
              tenantId: uploaded.tenantId,
              name: file.name,
              mimeType: file.type,
              size: file.size,
              auditDetails: {
                createdBy: user?.info?.uuid,
                lastModifiedBy: user?.info?.uuid,
                createdTime: Date.now(),
                lastModifiedTime: Date.now(),
              },
            });
          }
        } catch (err) {
          setError(t("CS_FILE_UPLOAD_ERROR"));
          return;
        }
      }

      if (uploadedResults.length) {
        onSelect(config?.key, [...uploadedFiles, ...uploadedResults]);
      }

      setFilesToUpload([]);
    })();
  }, [filesToUpload]);
      const onFileSelect = (e) => {
        const selectedFiles = Array.from(e.target.files);

        // 🔥 CRITICAL: clear the input immediately
        e.target.value = "";
      
         // ✅ Total file count validation
        const totalFilesCount =
          uploadedFiles.length + selectedFiles.length;
      
          if (totalFilesCount > MAX_FILES) {
            setError(
              `${t("CS_MAXIMUM_FILES_EXCEEDED")} (${MAX_FILES})`
            );
            return;
          }
      
        setError(null);
        setFilesToUpload(selectedFiles);     };
  // Convert image file to PDF
  // const convertImageToPdf = (imageFile) => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
      
  //     reader.onload = (event) => {
  //       const img = new Image();
        
  //       img.onload = () => {
  //         try {
  //           const pdf = new jsPDF();
  //           const imgWidth = 190;
  //           const imgHeight = (img.height * imgWidth) / img.width;
  //           pdf.addImage(img, 'JPEG', 10, 10, imgWidth, imgHeight);
            
  //           // Convert PDF to Blob
  //           const pdfBlob = pdf.output('blob');
            
  //           // Create new File object with .pdf extension
  //           const fileName = imageFile.name.replace(/\.(jpg|jpeg)$/i, '.pdf');
  //           const pdfFile = new File([pdfBlob], fileName, { type: 'application/pdf' });
            
  //           resolve(pdfFile);
  //         } catch (error) {
  //           // Modified: Reject with corrupted file error
  //           reject(new Error('corrupt: Unable to process image file'));
  //         }
  //       };
        
  //       // Modified: Handle corrupted image files
  //       img.onerror = () => reject(new Error('corrupt: Image file is corrupted or invalid'));
  //       img.src = event.target.result;
  //     };
      
  //     // Modified: Handle corrupted file reading
  //     reader.onerror = () => reject(new Error('corrupt: Unable to read file'));
  //     reader.readAsDataURL(imageFile);
  //   });
  // };

  async function downloadFile(
    fileStoreId,
  tenantId,
  fileName,
  mimeType,
  setError,
  t,
  ) {
    if (!fileStoreId) return;
  
    try {
      console.log("fileStoreId45",fileStoreId)
      const { data } = await Digit.UploadServices.Filefetch(
        [fileStoreId],
        tenantId
      );
  
      const fileData = data?.fileStoreIds?.[0];
  
      if (fileData?.url) {
        // Get original file name and extension
        // const originalName = uploadedFile1?.name || "downloaded_file";
        // const fileExtension = originalName.split('.').pop();
        // const fileNameWithoutExtension = originalName.replace(`.${fileExtension}`, '');
        
        // Use generic download function
        downloadFileWithCustomName({
          fileStoreId: fileData?.id,
          fileUrl: fileData.url,
          customName: fileName || "download",
          mimeType: mimeType || fileData.mimeType,
        });
      }
    } catch (err) {
      console.error("Download error:", err);
      setError(t("CS_FILE_DOWNLOAD_ERROR"));
    }
  }

  const handleDownload = async (file) => {
    try {
      const { data } = await Digit.UploadServices.Filefetch(
        [file.fileStoreId],
        tenantId
      );

      const fileData = data?.fileStoreIds?.[0];

      if (fileData?.url) {
        downloadFileWithCustomName({
          fileStoreId: fileData.id,
          fileUrl: fileData.url,
          customName: file.name.replace(/\.[^/.]+$/, ""),
          mimeType: file.mimeType,
        });
      }
    } catch {
      setError(t("CS_FILE_DOWNLOAD_ERROR"));
    }
  };


  // const handleDownload = (file) => {
  //   downloadFile({
  //     fileStoreId: file.fileStoreId,
  //     tenantId,
  //     fileName: file.name?.replace(/\.[^/.]+$/, ""), // remove extension
  //     mimeType: file.mimeType,
  //     setError,
  //     t,
  //   });
  // };

  const handleDelete = (index) => {
    const updated = uploadedFiles.filter((_, i) => i !== index);
    onSelect(config?.key, updated);
  };
  console.log("uploadedFiles from parent", uploadedFiles);
  const uploadFileTags = uploadedFiles.map(file => [
    file.name,
    file
  ]);
  const removeTargetedFile = (fileToRemove) => {
    const updated = uploadedFiles.filter(
      (file) => file.fileStoreId !== fileToRemove.fileStoreId
    );
    onSelect(config?.key, updated);
  };
  const handleDeleteAll = () => {
    // UploadFile internally calls this to reset input
    // Do NOT clear uploadedFiles here unless you want "clear all"
  };
  console.log("uploadFileTags", uploadFileTags);
  return (
    <div className="pgr-upload-file-wrapper" style={{ maxWidth: "37.5rem" }}>
      <UploadFile
  multiple
  accept=".pdf,.jpg,.jpeg,.png"
  onUpload={onFileSelect}
  onDelete={handleDeleteAll}
  uploadedFiles={uploadFileTags}
  removeTargetedFile={removeTargetedFile}
  // message={
  //   uploadedFiles.length
  //     ? `${uploadedFiles.length} ${t("CS_ACTION_FILEUPLOADED")}`
  //     : t("CS_ACTION_NO_FILEUPLOADED")
  // }
/>

<p className="file-upload-status">
  {uploadedFiles.length === 0
    ? t("CS_ACTION_NO_FILEUPLOADED")
    : `${uploadedFiles.length} ${t("CS_ACTION_FILEUPLOADED")}`}
</p>
      
      {/* {uploadedFiles.map((file, index) => (
  <div key={file.fileStoreId} className="uploaded-file-row">
    <span>{file.name}</span>

    <Button
      label={t("WBH_DOWNLOAD")}
      variation="secondary"
      onClick={() => handleDownload(file)}
    />

    <Button
      label={t("DELETE")}
      variation="secondary"
      onClick={() => handleDelete(index)}
    />
  </div>
))} */}
      {error && <p className="pgr-upload-error">{error}</p>}
    </div>
  );
};

export default UploadedFileComponent;