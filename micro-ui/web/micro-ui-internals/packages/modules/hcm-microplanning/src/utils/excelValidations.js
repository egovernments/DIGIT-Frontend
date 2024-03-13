import Ajv from "ajv";
const ajv = new Ajv({ allErrors: true });
import validateSchema  from "../configs/validationSchemas.json";

const schemaData = validateSchema.validateSchemas.find((item)=>item.type="EXCEL").schema;
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
