const searchLocalisationService = async ({ tenantId, module, locale, params = {}, isMultipleLocale = false }) => {
  try {
    if (isMultipleLocale && Array.isArray(locale)) {
      // Parallel API calls for multiple modules
      const promises = locale.map((loc) =>
        Digit.CustomService.getResponse({
          url: "/localization/messages/v1/_search",
          params: { ...params, tenantId: tenantId, module: module, locale: loc },
          body: {},
        }).then((response) => ({ locale: loc, response: response?.messages }))
      );

      // Wait for all API calls to complete
      const responses = await Promise.all(promises);

      const result = [];
      responses.forEach(({ locale, response: translations }) => {
        translations.forEach(({ code, message, module }) => {
          let item = result.find((obj) => obj.code === code);
          if (!item) {
            item = { code, module };
            result.push(item);
          }
          item[locale] = message; // Use "en", "pt", etc.
        });
      });
      // Merge data from all responses
      // const mergedData = responses.reduce((acc, response) => {
      // return acc.concat(response); // Assuming responses are arrays
      // }, []);

      return result; // Indicate success
    } else {
      const response = await Digit.CustomService.getResponse({
        url: "/localization/messages/v1/_search",
        params: { ...params, tenantId: tenantId, module: module, locale: locale },
        body: {},
      });

      const result = [];
      response?.messages?.forEach(({ code, message, module }) => {
        let item = { code, module };
        item[locale] = message; // mimic same format as multipleLocale
        result.push(item);
      });

      return result;
    }
  } catch (error) {
    const errorCode = error?.response?.data?.Errors[0]?.code || "Unknown error";
    const errorDescription = error?.response?.data?.Errors[0]?.description || "An error occurred";
    return { success: false, error: { code: errorCode, description: errorDescription } }; // Indicate failure
  }
};

export default searchLocalisationService;
