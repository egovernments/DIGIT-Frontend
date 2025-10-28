import { useMutation } from "@tanstack/react-query";

const useUpsertLocalisation = (tenantId, module, locale) => {
  const createLocalisationService = async (req) => {
    try {
      const response = await Digit.CustomService.getResponse({
        url: "/localization/messages/v1/_upsert",
        body: {
          tenantId: tenantId,
          messages: req,
          module: module,
          // locale: locale // Uncomment if needed
        },
      });
      return { success: true, data: response };
    } catch (error) {
      const errorCode = error?.response?.data?.Errors?.[0]?.code || "Unknown error";
      const errorDescription = error?.response?.data?.Errors?.[0]?.description || "An error occurred";
      return {
        success: false,
        error: { code: errorCode, description: errorDescription },
      };
    }
  };

  return useMutation({
    mutationFn: createLocalisationService,
  });
};

export default useUpsertLocalisation;
