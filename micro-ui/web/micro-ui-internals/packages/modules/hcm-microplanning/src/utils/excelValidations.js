import Ajv from "ajv";
const ajv = new Ajv({ allErrors: true });

// Function responsible for excel data validation with respect to the template/schema provided
export const excelValidations = (data, schemaData, t) => {
  const translate = () => {
    const required = schemaData.required.map((item) => t(item));
    const properties = prepareProperties(schemaData.Properties, t);
    return { required, properties };
  };
  const { required, properties } = translate();
  const schema = {
    type: "object",
    patternProperties: {
      ".*": {
        type: "array",
        items: {
          type: "object",
          patternProperties: properties,
          required: required,
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
          let instancePathType = validateExcel.errors[i].dataPath;
          var matches = instancePathType.match(/\'([a-zA-Z]+)\'/g);
          var parts = matches ? matches[matches.length - 1].replace(/'/g, "") : null;
          if (schemaData["locationDataColumns"].includes(parts)) {
            return { valid, message: "ERROR_INCORRECT_LOCATION_COORDINATES", error: validateExcel.errors };
          }
          columns.add(parts);
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
          let instancePathMinMax = validateExcel.errors[i].dataPath;
          var matches = instancePathMinMax.match(/\'([a-zA-Z]+)\'/g);
          var parts = matches ? matches[matches.length - 1].replace(/'/g, "") : null;
          if (schemaData["locationDataColumns"].includes(parts[parts.length - 1])) {
            return { valid, message: "ERROR_INCORRECT_LOCATION_COORDINATES", error: validateExcel.errors };
          }
          columns.add(parts);
          break;

        case "pattern":
          const instancePathPattern = validateExcel.errors[i].dataPath;
          var matches = instancePathPattern.match(/\'([a-zA-Z]+)\'/g);
          var parts = matches ? matches[matches.length - 1].replace(/'/g, "") : null;
          columns.add(parts);
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

function filterOutWordAndLocalise(inputString, operation) {
  // Define a regular expression to match the string parts
  var regex = /(\w+)/g; // Matches one or more word characters

  // Replace each match using the provided function
  var replacedString = inputString.replace(regex, function (match) {
    // Apply the function to each matched string part
    return operation(match);
  });

  return replacedString;
}

const prepareProperties = (properties, t) => {
  let newProperties = {};
  Object.keys(properties).forEach((item) => (newProperties[filterOutWordAndLocalise(item, t)] = properties[item]));
  return newProperties;
};

export const checkForErrorInUploadedFileExcel = async (fileInJson, schemaData, t) => {
  try {
    const valid = excelValidations(fileInJson, schemaData, t);
    if (valid.valid) {
      return { valid: true };
    } else {
      if (valid["message"] !== undefined) {
        return { valid: false, message: valid.message };
      }
      const columnList = valid.columnList;
      const message = t("ERROR_COLUMNS_DO_NOT_MATCH_TEMPLATE", {
        columns:
          columnList.length > 1
            ? `${columnList.slice(0, columnList.length - 1).join(", ")} ${t("AND")} ${columnList[columnList.length - 1]}`
            : `${columnList[columnList.length - 1]}`,
      });
      return { valid: false, message };
    }
  } catch (error) {
    return { valid: false, message: "ERROR_PARSING_FILE" };
  }
};
