import gjv from "geojson-validation";
import Ajv from "ajv";
const ajv = new Ajv({ allErrors: true });

gjv.define("Position", (position) => {
  //the postion must be valid point on the earth, x between -180 and 180
  let errors = [];
  if (position[0] < -180 || position[0] > 180) {
    errors.push("Location Coordinates Error: the x must be between -180 and 180");
  }
  if (position[1] < -90 || position[1] > 90) {
    errors.push("Location Coordinates Error: the y must be between -90 and 90");
  }
  return errors;
});

export const geojsonValidations = (data, schemaData, t) => {
  let valid = true;
  let trace = {};
  for (let i = 0; i < data["features"].length; i++) {
    const check = gjv.valid(data["features"][i]);
    console.log(check);
    valid = valid && check;
    const errors = gjv.isFeature(data["features"][i], true)
    console.log(errors,errors.includes("Location Coordinates Error:"))
    
    // check if the location coordinates are according to the provided guidlines
    if(errors.some(str => str.includes("Location Coordinates Error:")))
    return { valid:false, message: "ERROR_INCORRECT_LOCATION_COORDINATES" };
    if (!check) trace[i] = [errors];
  }
  console.log(valid, trace, data);
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
    for (let i = 0; i < validateGeojson.errors.length; i++) {
      if (validateGeojson.errors[i].keyword == "type") {
        const instancePath = validateGeojson.errors[i].instancePath.split("/");
        columns.add(instancePath[instancePath.length - 1]);
      } else if (validateGeojson.errors[i].keyword == "required") {
        columns.add(validateGeojson.errors[i].params.missingProperty);
      } else if (validateGeojson.errors[i].keyword == "pattern") {
        const instancePath = validateGeojson.errors[i].instancePath.split("/");
        columns.add(instancePath[instancePath.length - 1]);
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
