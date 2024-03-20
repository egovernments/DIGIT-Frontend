import Ajv from "ajv";
const ajv = new Ajv({ allErrors: true });

// Function responsible for excel data validation with respect to the template/schema provided
export const excelValidations = (data, schemaData) => {
  const schema = {
    type: "object",
    patternProperties: {
      ".*": {
        type: "array",
        items: {
          type: "object",
          patternProperties: schemaData.Properties,
          required: schemaData.required,
          additionalProperties: false,
        },
      },
    },
    additionalProperties: true,
  };
  const validateExcel = ajv.compile(schema);
  const valid = validateExcel(data);
  if (!valid) {
    let columns = new Set();
    for (let i = 0; i < validateExcel.errors.length; i++) {
      switch (validateExcel.errors[i].keyword) {
        case "additionalProperties":
          return { valid, message: "ERROR_ADDITIONAL_PROPERTIES " };
        case "type":
          const instancePathType = validateExcel.errors[i].instancePath.split("/");
          if (schemaData["locationDataColumns"].includes(instancePathType[instancePathType.length - 1])) {
            return { valid, message: "ERROR_INCORRECT_LOCATION_COORDINATES", error: validateExcel.errors };
          }
          columns.add(instancePathType[instancePathType.length - 1]);
          break;

        case "required":
          const missing = validateExcel.errors[i].params.missingProperty;
          if (schemaData["locationDataColumns"].includes(missing)) {
            return { valid, message: "ERROR_MISSING_LOCATION_COORDINATES", error: validateExcel.errors };
          }
          columns.add(missing);
          break;

        case "maximum":
        case "minimum":
          const instancePathMinMax = validateExcel.errors[i].instancePath.split("/");
          if (schemaData["locationDataColumns"].includes(instancePathMinMax[instancePathMinMax.length - 1])) {
            return { valid, message: "ERROR_INCORRECT_LOCATION_COORDINATES", error: validateExcel.errors };
          }
          columns.add(instancePathMinMax[instancePathMinMax.length - 1]);
          break;

        case "pattern":
          const instancePathPattern = validateExcel.errors[i].instancePath.split("/");
          columns.add(instancePathPattern[instancePathPattern.length - 1]);
          break;

        default:
          return { valid, message: "ERROR_UNKNOWN" };
      }
    }
    const columnList = [...columns];
    return { valid, columnList, error: validateExcel.errors };
  }
  ajv.removeSchema();
  return { valid };
};

export const checkForErrorInUploadedFileExcel = async (fileInJson, schemaData, t) => {
  try {
    const valid = excelValidations(fileInJson, schemaData);
    if (valid.valid) {
      return { valid: true };
    } else {
      if (valid["message"] !== undefined) {
        return { valid: false, message: valid.message };
      }
      const columnList = valid.columnList;
      const message = t("ERROR_COLUMNS_DO_NOT_MATCH_TEMPLATE_PLACEHOLDER",{
        columns: columnList.length > 1
          ? `${columnList.slice(0, columnList.length - 1).join(", ")} ${t("AND")} ${columnList[columnList.length - 1]}`
          : `${columnList[columnList.length - 1]}`
      })
      // .replace(
      //   "PLACEHOLDER",
        // columnList.length > 1
        //   ? `${columnList.slice(0, columnList.length - 1).join(", ")} ${t("AND")} ${columnList[columnList.length - 1]}`
        //   : `${columnList[columnList.length - 1]}`
      // );
      return { valid: false, message };
    }
  } catch (error) {
    return { valid: false, message: "ERROR_PARSING_FILE" };
  }
};
