import React, { useState, useEffect } from "react";
import { UploadFile, SubmitBar } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
// import { downloadFileWithCustomName } from "../utils/downloadFileWithCustomName";
// import jsPDF from "jspdf";
import { Button} from "@egovernments/digit-ui-components";

const UploadedFileComponent = ({ config, onSelect }) => {
  const { t } = useTranslation();
  const [file, setFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
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

  useEffect(() => {
    (async () => {
      setError(null);
      if (file) {
        // Added: Validate file type
        const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
          setError(t("CS_INVALID_FILE_TYPE"));
          return;
        }

        if (file.size >= maxFileSize) {
          setError(`${t("CS_MAXIMUM_UPLOAD_SIZE_EXCEEDED")} (${t("MAX_FILE_SIZE")}: ${maxFileSizeMB} MB)`);
        } else {
          try {
            // Convert JPEG/JPG to PDF before uploading
            let fileToUpload = file;
            // if (file.type === "image/jpeg" || file.type === "image/jpg") {
            //   fileToUpload = await convertImageToPdf(file);
            // }
            const response = await Digit.UploadServices.Filestorage("cghealthprd", fileToUpload, "cg");
            console.log("FilestorageResponse123",response)
            if (response?.data?.files?.length > 0) {
              const uploaded = response?.data?.files[0];
              setUploadedFile(uploaded);
              if (config?.key) {
                const auditDetails = {
                  createdBy: user?.info?.uuid,
                  lastModifiedBy: user?.info?.uuid,
                  createdTime: timestamp,
                  lastModifiedTime: timestamp
                };
                onSelect(config.key, { ...uploaded, auditDetails });
              }
            } else {
              setError(t("CS_FILE_UPLOAD_ERROR"));
            }
          } catch (err) {
            // Modified: Enhanced error handling for corrupted files
            if (err.message && err.message.includes('corrupt')) {
              setError(t("CS_FILE_CORRUPTED_ERROR"));
            } else {
              setError(t("CS_FILE_UPLOAD_ERROR"));
            }
          }
        }
      }
    })();
  }, [file, maxFileSize]);

  function selectFile(e) {
    setFile(e.target.files[0]);
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

  async function downloadFile() {
    if (!uploadedFile?.fileStoreId) return;
  
    try {
      const { data: { fileStoreIds } = {} } = await Digit.UploadServices.Filefetch([uploadedFile.fileStoreId], tenantId);
      const fileData = fileStoreIds?.[0];
  
      if (fileData?.url) {
        // Get original file name and extension
        const originalName = uploadedFile?.name || "downloaded_file";
        const fileExtension = originalName.split('.').pop();
        const fileNameWithoutExtension = originalName.replace(`.${fileExtension}`, '');
        
        // Use generic download function
        // downloadFileWithCustomName({
        //   fileStoreId: fileData?.id,
        //   customName: fileNameWithoutExtension,
        //   fileUrl: fileData?.url,
        //   mimeType: uploadedFile?.mimeType || fileData?.mimeType
        // });
      }
    } catch (err) {
      console.error("Download error:", err);
      setError(t("CS_FILE_DOWNLOAD_ERROR"));
    }
  }

  return (
    <div className="pgr-upload-file-wrapper" style={{ maxWidth: "37.5rem" }}>
      <UploadFile
        id={config?.key ? `upload-${config.key}` : "upload-doc"}
        accept=".pdf,.jpg,.jpeg"
        onUpload={selectFile}
        onDelete={() => {
          setUploadedFile(null);
          setFile(null);
          setError(null);
          if (config?.key) onSelect(config.key, null);
        }}
        message={uploadedFile ? `1 ${t("CS_ACTION_FILEUPLOADED")}` : t("CS_ACTION_NO_FILEUPLOADED")}
      />
      {uploadedFile && (
        <Button
            label={t("WBH_DOWNLOAD")}
            variation="secondary"
            type="button"
            size={"medium"}
            icon={t("DownloadIcon")}
            onClick={downloadFile}
          />
      )}
      {error && <p className="pgr-upload-error">{error}</p>}
    </div>
  );
};

export default UploadedFileComponent;