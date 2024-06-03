import Ajv from "ajv";
const ajv = new Ajv({ allErrors: true });
ajv.addKeyword("isRequired");
ajv.addKeyword("isLocationDataColumns");
ajv.addKeyword("isRuleConfigureInputs");
ajv.addKeyword("isFilterPropertyOfMapSection");
ajv.addKeyword("isVisualizationPropertyOfMapSection");
ajv.addKeyword("toShowInMicroplanPreview");

// Function responsible for excel data validation with respect to the template/schema provided
export const excelValidations = (data, schemaData, t) => {
  const translate = () => {
    const required = Object.entries(schemaData?.Properties || {})
      .reduce((acc, [key, value]) => {
        if (value?.isRequired) {
          acc.push(key);
        }
        return acc;
      }, [])
      .map((item) => item);
    return { required, properties: schemaData.Properties };
  };
  const { required, properties } = translate();
  const schema = {
    type: "object",
    patternProperties: {
      ".*": {
        type: "array",
        items: {
          type: "object",
          properties: properties,
          required: required,
          additionalProperties: true,
        },
      },
    },
    additionalProperties: true,
  };
  const validateExcel = ajv.compile(schema);
  const valid = validateExcel(data);
  let locationDataColumns = Object.entries(schemaData?.Properties || {}).reduce((acc, [key, value]) => {
    if (value?.isLocationDataColumns) {
      acc.push(key);
    }
    return acc;
  }, []);
  if (!valid) {
    let errors = {};
    let hasDataErrors = "false"; // true, false, missing_properties, unknown
    let missingColumnsList = new Set();
    let errorMessages = {};

    for (let i = 0; i < validateExcel.errors.length; i++) {
      let tempErrorStore = "";
      const instancePathType = validateExcel.errors[i].instancePath.split("/");
      switch (validateExcel.errors[i].keyword) {
        case "additionalProperties":
          tempErrorStore = "ERROR_ADDITIONAL_PROPERTIES";
          hasDataErrors = "true";
          break;
        case "type":
          {
            const instancePathType = validateExcel.errors[i].instancePath.split("/");
            tempErrorStore = locationDataColumns.includes(instancePathType[instancePathType.length - 1])
              ? "ERROR_INCORRECT_LOCATION_COORDINATES"
              : "ERROR_DATA_TYPE";
            hasDataErrors = "true";
          }
          break;
        case "required":
          const missing = validateExcel.errors[i].params.missingProperty;
          missingColumnsList.add(missing);
          hasDataErrors = "missing_properties";
          break;

        case "maximum":
        case "minimum":
          const instancePathMinMax = validateExcel.errors[i].instancePath.split("/");
          tempErrorStore = locationDataColumns.includes(instancePathMinMax[instancePathType.length - 1])
            ? "ERROR_INCORRECT_LOCATION_COORDINATES"
            : "ERROR_DATA_EXCEEDS_LIMIT_CONSTRAINTS";
          hasDataErrors = "true";
          break;
        case "pattern":
          tempErrorStore = "ERROR_VALUE_NOT_ALLOWED";
          hasDataErrors = "true";
          break;
        default:
          hasDataErrors = "unknown";
      }
      if (tempErrorStore)
        errors[instancePathType[1]] = {
          ...(errors[instancePathType[1]] ? errors[instancePathType[1]] : {}),
          [instancePathType[2]]: {
            ...(errors?.[instancePathType[1]]?.[instancePathType[2]] ? errors?.[instancePathType[1]]?.[instancePathType[2]] : {}),
            [instancePathType[3]]: [
              ...new Set(
                ...(errors?.[instancePathType[1]]?.[instancePathType[2]]?.[instancePathType[3]]
                  ? errors?.[instancePathType[1]]?.[instancePathType[2]]?.[instancePathType[3]]
                  : [])
              ),
              tempErrorStore,
            ],
          },
        };

      switch (hasDataErrors) {
        case "true":
          errorMessages = { dataError: t("ERROR_REFER_UPLOAD_PREVIEW_TO_SEE_THE_ERRORS") };
          break;
        case "unknown":
          errorMessages = { unkown: t("ERROR_UNKNOWN") };
          break;
        case "missing_properties":
          errorMessages = { missingProperty: t("ERROR_MISSING_PROPERTY", { properties: [...missingColumnsList].map((item) => t(item)).join(", ") }) };
          break;
        case "false":
          break;
      }
    }

    ajv.removeSchema();

    return {
      valid: !hasDataErrors,
      message: errorMessages ? [...new Set(Object.values(errorMessages))] : [],
      errors,
      validationError: validateExcel.errors,
    };
  }
  ajv.removeSchema();
  return { valid };
};

export const checkForErrorInUploadedFileExcel = async (fileInJson, schemaData, t) => {
  try {
    const valid = excelValidations(fileInJson, schemaData, t);
    if (valid.valid) {
      return { valid: true };
    } else {
      return {
        valid: false,
        message: valid.message,
        errors: valid.errors,
      };
    }
  } catch (error) {
    return { valid: false, message: "ERROR_PARSING_FILE" };
  }
};
