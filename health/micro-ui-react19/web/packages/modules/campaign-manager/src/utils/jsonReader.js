import axios from "axios";
export const jsonReader = async ({ fileStoreId = null }) => {
    if (!fileStoreId) {
      return null;
    }
  
    try {
      const response = await axios.get("/filestore/v1/files/id", {
        responseType: "arraybuffer",
        headers: {
          Accept:  "application/json",
          "auth-token": Digit.UserService.getUser()?.["access_token"],
        },
        params: {
          tenantId: Digit.ULBService.getCurrentTenantId(),
          fileStoreId: fileStoreId,
        },
      });
  
      const arrayBuffer = response.data;
      const text = new TextDecoder("utf-8").decode(new Uint8Array(arrayBuffer));
      const jsonData = JSON.parse(text);
      return jsonData; 
    } catch (error) {
      console.error("Error fetching or decoding JSON:", error);
      return null; 
    }
  };
  