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
  let valid = geojsonStructureValidation(data);
  if (valid.valid) {
    return { valid: true };
  } else if (valid.message) {
    return { valid: false, message: valid.message };
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
    let error;
    Object.keys(data["features"][i]["properties"]).forEach((j) => {
      if (j.length > 10) error = { valid: false, trace, message: "ERROR_FIELD_NAME" };
      return j;
    });
    if (error) return error;
  }
  return { valid, trace };
};

const geometryValidation = (data) => {
  let firstType;
  for (const feature of data.features) {
    if (!feature.geometry || !feature.geometry.type) {
      return false; // Missing geometry or geometry type
    }
    if (!firstType) {
      firstType = feature.geometry.type;
    } else {
      // Check if the current geometry type matches the first one
      if (feature.geometry.type !== firstType) {
        return false; // Different geometry types found
      }
    }
  }
  return true;
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
              patternProperties: schemaData.Properties,
              required: schemaData.required,
              additionalProperties: false,
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
        case "additionalProperties":
          return { valid, message: "ERROR_ADDITIONAL_PROPERTIES " };
        case "type":
          const instancePathType = validateGeojson.errors[i].instancePath.split("/");
          columns.add(t(instancePathType[instancePathType.length - 1]));
          break;
        case "const":
          if (validateGeojson.errors[i].params.allowedValue === "FeatureCollection") return { valid, message: "ERROR_FEATURECOLLECTION" };
          break;
        case "required":
          columns.add(t(validateGeojson.errors[i].params.missingProperty));
          break;
        case "pattern":
          const instancePathPattern = validateGeojson.errors[i].instancePath.split("/");
          columns.add(t(instancePathPattern[instancePathPattern.length - 1]));
          break;

        default:
          break;
      }
    }
    const columnList = [...columns];
    // if(column)
    console.log(validateGeojson.errors,columnList)
    const message = t("ERROR_COLUMNS_DO_NOT_MATCH_TEMPLATE", {
      columns:
        columnList.length > 1
          ? `${columnList.slice(0, columnList.length - 1).join(", ")} ${t("AND")} ${columnList[columnList.length - 1]}`
          : `${columnList[columnList.length - 1]}`,
    });
    // .replace(
    //   "PLACEHOLDER",
    //   columnList.length > 1
    //     ? `${columnList.slice(0, columnList.length - 1).join(", ")} ${t("AND")} ${columnList[columnList.length - 1]}`
    //     : `${columnList[columnList.length - 1]}`
    // );
    ajv.removeSchema();

    return { valid, columnList, message, error: validateGeojson.errors };
  }
  ajv.removeSchema();
  if (!geometryValidation(data)) return { valid: false, message: t("ERROR_MULTIPLE_GEOMETRY_TYPES") };
  return { valid: true };
};
