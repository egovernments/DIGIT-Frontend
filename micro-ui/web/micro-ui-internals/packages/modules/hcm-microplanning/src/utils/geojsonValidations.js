import gjv from "geojson-validation";
import Ajv from "ajv";
const ajv = new Ajv({ allErrors: true });

//the postion must be valid point on the earth, x between -180 and 180
gjv.define("Position", (position) => {
  let errors = [];
  if (position[0] < -180 || position[0] > 180) {
    errors.push("Location Coordinates Error: the x must be between -180 and 180");
  }
  if (position[1] < -90 || position[1] > 90) {
    errors.push("Location Coordinates Error: the y must be between -90 and 90");
  }
  return errors;
});

// Main functino for geojson validation that includes structural and property validations
export const geojsonValidations = (data, schemaData, t) => {
  let { valid, trace } = geojsonStructureValidation(data);
  if (valid) {
    const response = geojsonPropetiesValidation(data, schemaData, t);
    if (!response.valid) {
      return response;
    }
    return { valid: true };
  } else {
    return { valid: false, message: "ERROR_INVALID_GEOJSON" };
  }
};

// Funciton responsible for structural verification of geojson data
export const geojsonStructureValidation = (data) => {
  let valid = true;
  let trace = {};
  for (let i = 0; i < data["features"].length; i++) {
    const check = gjv.valid(data["features"][i]);
    valid = valid && check;
    const errors = gjv.isFeature(data["features"][i], true);
    // check if the location coordinates are according to the provided guidlines
    if (errors.some((str) => str.includes("Location Coordinates Error:"))) return { valid: false, message: "ERROR_INCORRECT_LOCATION_COORDINATES" };
    if (!check) trace[i] = [errors];
  }
  return { valid, trace };
};

// Function responsible for property verification of geojson data
export const geojsonPropetiesValidation = (data, schemaData, t) => {
  const schema = {
    type: "object",
    properties: {
      type: { const: "FeatureCollection" },
    },
    patternProperties: {
      "^features$": {
        type: "array",
        items: {
          type: "object",
          patternProperties: {
            "^properties$": {
              type: "object",
              properties: schemaData.Properties,
              required: schemaData.required,
              additionalProperties: true,
            },
          },
        },
      },
    },
    additionalProperties: true,
  };
  const validateGeojson = ajv.compile(schema);
  const valid = validateGeojson(data);
  if (!valid) {
    let columns = new Set();
    // Sorting out the Specific errors
    for (let i = 0; i < validateGeojson.errors.length; i++) {
      switch (validateGeojson.errors[i].keyword) {
        case "type":
          const instancePathType = validateGeojson.errors[i].instancePath.split("/");
          columns.add(instancePathType[instancePathType.length - 1]);
          break;

        case "required":
          columns.add(validateGeojson.errors[i].params.missingProperty);
          break;

        case "pattern":
          const instancePathPattern = validateGeojson.errors[i].instancePath.split("/");
          columns.add(instancePathPattern[instancePathPattern.length - 1]);
          break;

        default:
          break;
      }
    }
    const columnList = [...columns];
    console.log({ valid, columnList, error: validateGeojson.errors });
    const message = t("ERROR_COLUMNS_DO_NOT_MATCH_TEMPLATE_PLACEHOLDER").replace(
      "PLACEHOLDER",
      columnList.length > 1
        ? `${columnList.slice(0, columnList.length - 1).join(", ")} ${t("AND")} ${columnList[columnList.length - 1]}`
        : `${columnList[columnList.length - 1]}`
    );
    ajv.removeSchema();

    return { valid, columnList, message, error: validateGeojson.errors };
  }
  ajv.removeSchema();
  return { valid: true };
};
