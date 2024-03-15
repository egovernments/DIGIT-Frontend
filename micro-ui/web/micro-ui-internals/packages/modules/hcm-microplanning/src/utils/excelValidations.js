import Ajv from "ajv";
const ajv = new Ajv({ allErrors: true });

export const excelValidations = (data, schemaData) => {
  const schema = {
    type: "object",
    patternProperties: {
      ".*": {
        type: "array",
        items: {
          type: "object",
          properties: schemaData.Properties,
          required: schemaData.required,
          additionalProperties: true,
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
      if (validateExcel.errors[i].keyword == "type") {
        const instancePath = validateExcel.errors[i].instancePath.split("/");
        if (schemaData["locationDataColumns"].includes(instancePath[instancePath.length - 1])) {
          return { valid, message: "ERROR_INCORRECT_LOCATION_COORDINATES", error: validateExcel.errors };
        }
        columns.add(instancePath[instancePath.length - 1]);
      } else if (validateExcel.errors[i].keyword == "required") {
        const missing = validateExcel.errors[i].params.missingProperty;
        if (schemaData["locationDataColumns"].includes(missing)) {
          return { valid, message: "ERROR_MISSING_LOCATION_COORDINATES", error: validateExcel.errors };
        }
        columns.add(missing);
      } else if (validateExcel.errors[i].keyword == "maximum" || validateExcel.errors[i].keyword == "minimum") {
        const instancePath = validateExcel.errors[i].instancePath.split("/");
        if (schemaData["locationDataColumns"].includes(instancePath[instancePath.length - 1])) {
          return { valid, message: "ERROR_INCORRECT_LOCATION_COORDINATES", error: validateExcel.errors };
        }
        columns.add(instancePath[instancePath.length - 1]);
      } else if (validateExcel.errors[i].keyword == "pattern") {
        const instancePath = validateExcel.errors[i].instancePath.split("/");
        columns.add(instancePath[instancePath.length - 1]);
      }
      else {
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
    console.log(valid);
    if (valid.valid) {
      return { valid: true };
    } else {
      if (valid["message"] !== undefined) {
        return { valid: false, message: valid.message };
      }
      const columnList = valid.columnList;
      const message = t("ERROR_COLUMNS_DO_NOT_MATCH_TEMPLATE_PLACEHOLDER").replace(
        "PLACEHOLDER",
        columnList.length > 1
          ? `${columnList.slice(0, columnList.length - 1).join(", ")} ${t("AND")} ${columnList[columnList.length - 1]}`
          : `${columnList[columnList.length - 1]}`
      );
      return { valid: false, message };
    }
  } catch (error) {
    console.log(error);
    return { valid: false, message: "ERROR_PARSING_FILE" };
  }
};
