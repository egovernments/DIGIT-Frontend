import Ajv from "ajv";
const ajv = new Ajv({ allErrors: true });
import validateSchema  from "../configs/validationSchemas.json";

const schemaData = validateSchema.validateSchemas.find((item)=>item.type=="EXCEL").schema;
console.log(schemaData)
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

export const excelValidations = (data) => {
  const validateExcel = ajv.compile(schema);
  const valid = validateExcel(data);
  if (!valid) {
    let columns = new Set();
    for (let i = 0; i < validateExcel.errors.length; i++) {
      if (validateExcel.errors[i].keyword == "type") {
        const instancePath = validateExcel.errors[i].instancePath.split("/");
        columns.add(instancePath[instancePath.length - 1]);
      } else if (validateExcel.errors[i].keyword == "required") {
        columns.add(validateExcel.errors[i].params.missingProperty);
      }
    }
    const columnList = [...columns];
    return { valid,columnList, error: validateExcel.errors };
  }
  ajv.removeSchema()
  return { valid };
};


export const checkForErrorInUploadedFileExcel = async (fileInJson,t) => {
  try {
    const valid = excelValidations(fileInJson);
    console.log(valid)
    if (valid.valid) {
      return {valid:true};
    } else {
      const columnList = valid.columnList;
      const message = t("ERROR_COLUMNS_DO_NOT_MATCH_TEMPLATE_PLACEHOLDER").replace(
        "PLACEHOLDER",columnList.length>1?
        `${columnList.slice(0, columnList.length - 1).join(", ")} ${t("AND")} ${columnList[columnList.length - 1]}`:
        `${columnList[columnList.length - 1]}`
      );
      return {valid:false,message};
    }
  } catch (error) {
    console.log(error)
    return {valid:false,message:"ERROR_PARSING_FILE"}
  }
};