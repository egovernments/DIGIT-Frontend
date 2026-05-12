import axios from "axios";

export const downloadPdfWithCustomName = ({ fileStoreId = null, customName = null }) => {
  const downloadPdf = (blob, fileName) => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName + ".pdf"; // Always ends with .pdf
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  };

  if (fileStoreId) {
    axios
      .get("/filestore/v1/files/id", {
        responseType: "arraybuffer",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/pdf",
          "auth-token": Digit.UserService.getUser()?.["access_token"],
        },
        params: {
          tenantId: Digit.ULBService.getCurrentTenantId(),
          fileStoreId: fileStoreId,
        },
      })
      .then((res) => {
        downloadPdf(
          new Blob([res.data], { type: "application/pdf" }),
          customName ? customName : "download"
        );
      })
      .catch((error) => {
        console.error("PDF download failed:", error);
        const errorMessage = error.response?.status === 404 
         ? "File not found. Please check the file ID."
         : error.response?.status === 401 || error.response?.status === 403
         ? "You don't have permission to download this file."
         : "Failed to download PDF. Please try again.";
         Digit.Utils.Toast.error(errorMessage);
      });
  }
};
