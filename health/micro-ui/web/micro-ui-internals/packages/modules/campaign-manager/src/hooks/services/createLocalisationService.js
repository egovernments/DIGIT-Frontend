const createLocalisationService = async (req, tenantId, module, locale) => {
  try {
    const response = await Digit.CustomService.getResponse({
      url: "/localization/messages/v1/_upsert",
      body: {
        tenantId: tenantId,
        messages: req,
        module: module,
        locale: locale
      },
    });
    console.log("the response of localisation is", response);
    return response;
  } catch (error) {
    if (!error?.response?.data?.Errors[0].description) {
      throw new Error(error?.response?.data?.Errors[0].code);
    } else {
      throw new Error(error?.response?.data?.Errors[0].description);
    }
  }
};

export default createLocalisationService;
