import Ajv from "ajv";

const ajv = new Ajv({ allErrors: true });

const schema = {
  type: "object",
  properties: {},
  patternProperties: {
    ".*": {
      type: "array",
      items: {
        type: "object",
        patternProperties: {
          "Boundary code": { type: "string" },
          "Total population": { type: "number" },
          "Target population": { type: "number" },
          "Total households": { type: "number" },
          "Target households": { type: "number" },
          Latitude: { type: "number" },
          Longitude: { type: "number" },
        },
        required: ["Boundary code", "Total population", "Target population", "Total households", "Target households", "Latitude", "Longitude"],
        additionalProperties: true,
      },
    },
  },
  additionalProperties: true,
};

const validate = ajv.compile(schema);
export const excelValidations = (data) => {
  const valid = validate(data);
  if (!valid) {
    let columns = new Set();
    for (let i = 0; i < validate.errors.length; i++) {
      if (validate.errors[i].keyword == "type") {
        const instancePath = validate.errors[i].instancePath.split("/");
        columns.add(instancePath[instancePath.length - 1]);
      } else if (validate.errors[i].keyword == "required") {
        columns.add(validate.errors[i].params.missingProperty);
      }
    }
    const columnList = [...columns];
    return { valid,columnList, error: validate.errors };
  }
  return { valid };
};
