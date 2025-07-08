const createLocalisationService = async (req, tenantId, module, locale) => {
  try {
    const response = await Digit.CustomService.getResponse({
      url: "/localization/messages/v1/_upsert",
      body: {
        tenantId: tenantId,
        messages: req,
        module: module,
        // locale: locale
      },
    });
    return { success: true, data: response }; // Indicate success
  } catch (error) {
    const errorCode = error?.response?.data?.Errors[0]?.code || "Unknown error";
    const errorDescription = error?.response?.data?.Errors[0]?.description || "An error occurred";
    return { success: false, error: { code: errorCode, description: errorDescription } }; // Indicate failure
  }
};

export default createLocalisationService;
