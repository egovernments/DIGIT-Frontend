import { useMutation } from "react-query";

const createLocalisationService = async (req, tenantId, module, locale) => {
  try {
    const promises = Object.entries(req)
      .filter(([_, messages]) => Array.isArray(messages) && messages.length > 0)
      .map(([locale, messages]) =>
        Digit.CustomService.getResponse({
          url: "/localization/messages/v1/_upsert",
          body: {
            tenantId,
            messages,
            module,
          },
        })
          .then((response) => ({ locale, success: true, data: response }))
          .catch((error) => {
            const errorCode = error?.response?.data?.Errors?.[0]?.code || "Unknown error";
            const errorDescription = error?.response?.data?.Errors?.[0]?.description || "An error occurred";
            return { locale, success: false, error: { code: errorCode, description: errorDescription } };
          })
      );

    const results = await Promise.all(promises);
    return results;
  } catch (outerError) {
    // Only happens if Promise.all fails unexpectedly (rare)
    const errorCode = outerError?.response?.data?.Errors?.[0]?.code || "Unknown error";
    const errorDescription = outerError?.response?.data?.Errors?.[0]?.description || "An unexpected error occurred during parallel processing.";
    throw { code: errorCode, description: errorDescription };
  }
};

const useUpsertLocalisationParallel = (tenantId, module, locale) => {
  return useMutation((reqData) => {
    return createLocalisationService(reqData, tenantId, module, locale);
  });
};

export default useUpsertLocalisationParallel;
