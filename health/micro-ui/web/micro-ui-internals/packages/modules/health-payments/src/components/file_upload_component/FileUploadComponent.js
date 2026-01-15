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
  const [error, setError] = useState(null);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const user = Digit.UserService.getUser();
  const timestamp = new Date().getTime();

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
  // useEffect(() => {
  //   if (mockFile && !value) {
  //     onSelect(config.key, mockFile);
  //     setUploadedFile(mockFile);
  //   }
  // }, []);
  // useEffect(() => {
  //   (async () => {
  //     setError(null);
  //     if (file) {
  //       // Added: Validate file type
  //       const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg'];
  //       if (!validTypes.includes(file.type)) {
  //         setError(t("CS_INVALID_FILE_TYPE"));
  //         return;
  //       }

  //       if (file.size >= maxFileSize) {
  //         setError(`${t("CS_MAXIMUM_UPLOAD_SIZE_EXCEEDED")} (${t("MAX_FILE_SIZE")}: ${maxFileSizeMB} MB)`);
  //       } else {
  //         try {
  //           // Convert JPEG/JPG to PDF before uploading
  //           let fileToUpload = file;
  //           // if (file.type === "image/jpeg" || file.type === "image/jpg") {
  //           //   fileToUpload = await convertImageToPdf(file);
  //           // }
  //           const response = await Digit.UploadServices.Filestorage("test", fileToUpload, "cg");
  //           console.log("FilestorageResponse123",response)
  //           if (response?.data?.files?.length > 0) {
  //             const uploaded = response?.data?.files[0];
  //             // setUploadedFile(uploaded);
  //             if (config?.key) {
  //               const auditDetails = {
  //                 createdBy: user?.info?.uuid,
  //                 lastModifiedBy: user?.info?.uuid,
  //                 createdTime: timestamp,
  //                 lastModifiedTime: timestamp
  //               };
  //               // onSelect(config.key, { ...uploaded, auditDetails });
  //               onSelect(config.key, {
  //                 ...uploaded,
  //                 auditDetails
  //               });
  //             }
  //           } else {
  //             setError(t("CS_FILE_UPLOAD_ERROR"));
  //           }
  //         } catch (err) {
  //           // Modified: Enhanced error handling for corrupted files
  //           if (err.message && err.message.includes('corrupt')) {
  //             setError(t("CS_FILE_CORRUPTED_ERROR"));
  //           } else {
  //             setError(t("CS_FILE_UPLOAD_ERROR"));
  //           }
  //         }
  //       }
  //     }
  //   })();
  // }, [file, maxFileSize]);

  useEffect(() => {
    (async () => {
      setError(null);
  
      if (!files?.length) return;
  
      const validTypes = ["application/pdf", "image/jpeg", "image/jpg"];
      const uploadedResults = [];
  
      for (const file of files) {
        // 1️⃣ Validate type
        if (!validTypes.includes(file.type)) {
          setError(t("CS_INVALID_FILE_TYPE"));
          return;
        }
  
        // 2️⃣ Validate size
        if (file.size >= maxFileSize) {
          setError(
            `${t("CS_MAXIMUM_UPLOAD_SIZE_EXCEEDED")} (${t("MAX_FILE_SIZE")}: ${maxFileSizeMB} MB)`
          );
          return;
        }
  
        try {
          // 3️⃣ Upload ONE file (filestore supports single only)
          const response = await Digit.UploadServices.Filestorage(
            "test",
            file,
            "cg"
          );
  
          const uploaded = response?.data?.files?.[0];
  
          if (uploaded) {
            uploadedResults.push({
              ...uploaded,
              auditDetails: {
                createdBy: user?.info?.uuid,
                lastModifiedBy: user?.info?.uuid,
                createdTime: timestamp,
                lastModifiedTime: timestamp,
              },
            });
          }
        } catch (err) {
          if (err?.message?.includes("corrupt")) {
            setError(t("CS_FILE_CORRUPTED_ERROR"));
          } else {
            setError(t("CS_FILE_UPLOAD_ERROR"));
          }
          return;
        }
      }
  
      // 4️⃣ Single onSelect call with ARRAY
      if (uploadedResults.length && config?.key) {
        onSelect(config.key, uploadedResults);
      }
    })();
  }, [files, maxFileSize]);

  function selectFile(e) {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    console.log("Selected files:", selectedFiles);
  }

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
  const handleDownload = (file) => {
    downloadFile({
      fileStoreId: file.fileStoreId,
      tenantId,
      fileName: file.name?.replace(/\.[^/.]+$/, ""), // remove extension
      mimeType: file.mimeType,
      setError,
      t,
    });
  };

  const handleDelete = (index) => {
    const updated = uploadedFiles.filter((_, i) => i !== index);
    onSelect(config?.key, updated);
  };

  return (
    <div className="pgr-upload-file-wrapper" style={{ maxWidth: "37.5rem" }}>
      <UploadFile
        multiple
        // id={config?.key ? `upload-${config.key}` : "upload-doc"}
        accept=".pdf,.jpg,.jpeg"
        onUpload={selectFile}
        // onDelete={() => {
        //   setFiles(null);
        //   setError(null);
        //   // if (config?.key) onSelect(config.key, null);
        //   onSelect(config.key, null);
        // }}
        message={
          uploadedFiles.length
            ? `${uploadedFiles.length} ${t("CS_ACTION_FILEUPLOADED")}`
            : t("CS_ACTION_NO_FILEUPLOADED")
        }
      />
      {/* {uploadedFile1 && (
  <Button
    label={t("DELETE")}
    variation="secondary"
    onClick={() => {
      setFile(null);
      setError(null);
      setUploadedFile(null);
      onSelect(config.key, null); // 🔥 parent notified
    }}
  />
)}
      {uploadedFile1 && (
        <Button
            label={t("WBH_DOWNLOAD")}
            variation="secondary"
            type="button"
            size={"medium"}
            icon={t("DownloadIcon")}
            onClick={downloadFile}
          />
      )} */}
      {uploadedFiles.map((file, index) => (
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
))}
      {error && <p className="pgr-upload-error">{error}</p>}
    </div>
  );
};

export default UploadedFileComponent;