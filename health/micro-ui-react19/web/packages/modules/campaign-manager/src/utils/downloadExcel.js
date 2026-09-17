import axios from "axios";

/* Fetching sheet as json object from the API , converting them into blob and downloading it.
 * Way to use the function. Just import the funtion downloadExcelWithCustomName and pass the filestoreid and customName you want to download the file.
 * Rest this function will take care for you and download it in your system.
 *
 * Eg. ->
 *  const handleDownload = (id, name) => {
 *      downloadExcelWithCustomName({fileStoreId: id, customName: name});
 *  }
 *
 */

const normalizeToken = (value) => {
  if (!value || typeof value !== "string") return value;
  return value.replace(/^"|"$/g, "");
};

const getAuthToken = () => {
  return (
    normalizeToken(Digit.UserService.getUser()?.["access_token"]) ||
    normalizeToken(window?.localStorage?.getItem("Employee.token")) ||
    normalizeToken(window?.localStorage?.getItem("Citizen.token")) ||
    normalizeToken(window?.localStorage?.getItem("token"))
  );
};

export const downloadExcelWithCustomName = async ({ fileStoreId = null, customName = null, tenantId = null }) => {
  const downloadExcel = (blob, fileName) => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName + ".xlsx";
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 7000);
  };

  if (fileStoreId) {
    try {
      const authToken = getAuthToken();
      const res = await axios.get("/filestore/v1/files/id", {
        responseType: "arraybuffer",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          ...(authToken ? { "auth-token": authToken } : {}),
        },
        params: {
          tenantId: tenantId || Digit.ULBService.getCurrentTenantId(),
          fileStoreId: fileStoreId,
        },
      });

      downloadExcel(
        new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
        customName ? customName : "download"
      );

      return true;
    } catch (error) {
      console.error("Error downloading excel file:", error);
      return false;
    }
  }

  return false;
};