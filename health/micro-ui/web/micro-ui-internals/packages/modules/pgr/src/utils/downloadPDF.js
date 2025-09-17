import axios from "axios";

export const downloadPdfWithCustomName = ({ fileStoreId = null, customName = null }) => {
console.log("999 downloadPdfWithCustomName",fileStoreId,customName)
  const downloadPdf = (blob, fileName) => {
    console.log("999 blob filename",blob,fileName)
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName + ".pdf"; // Always ends with .pdf
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 7000);
  };

  if (fileStoreId) {
    console.log("999 filestoreid",fileStoreId)
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
      });
  }
};
