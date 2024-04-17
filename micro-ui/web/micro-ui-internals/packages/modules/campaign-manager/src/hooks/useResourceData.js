export const useResourceData = async (data) => {
    const response =  Digit.CustomService.getResponse({
        url: "/project-factory/v1/data/_create",
        body: {
            "ResourceDetails": {
                "type": data?.uploadFacility?.[0]?.type,
                "hierarchyType": "ADMIN",
                "tenantId": "mz",
                "fileStoreId": data?.uploadFacility?.[0]?.id,
                "action": "validate",
              }
        }
      }

    );
    const result = await response;
    return result;
  };
  