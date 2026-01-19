// // Update your downloadPdfWithCustomName utility (or create a new generic one)
// export const downloadFileWithCustomName = ({ fileStoreId, customName, fileUrl, mimeType }) => {
//     const link = document.createElement("a");
//     link.href = fileUrl;
    
//     // Determine extension based on mime type or original filename
//     const extension = mimeType?.includes("pdf") ? "pdf" 
//       : mimeType?.includes("jpeg") || mimeType?.includes("jpg") ? "jpg"
//       : mimeType?.includes("png") ? "png" 
//       : "file";
    
//     link.download = `${customName}.${extension}`;
//     link.target = "_blank";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };