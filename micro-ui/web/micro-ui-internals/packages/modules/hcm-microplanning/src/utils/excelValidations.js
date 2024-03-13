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


export const checkForErrorInUploadedFileExcel = async (fileInJson, setUploadedFileError, t) => {
  try {
    const valid = excelValidations(fileInJson);
    if (valid.valid) {
      setUploadedFileError(null);
      return true;
    } else {
      const columnList = valid.columnList;
      const message = t("ERROR_COLUMNS_DO_NOT_MATCH_TEMPLATE_PLACEHOLDER").replace(
        "PLACEHOLDER",
        `${columnList.slice(0, columnList.length - 1).join(", ")} ${t("AND")} ${columnList[columnList.length - 1]}`
      );
      setUploadedFileError(message);
      return false;
    }
  } catch (error) {
    setUploadedFileError("ERROR_PARSING_FILE");
  }
};