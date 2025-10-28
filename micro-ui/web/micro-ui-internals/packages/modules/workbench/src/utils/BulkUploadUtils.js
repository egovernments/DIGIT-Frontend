import XLSX from 'xlsx';
export const onConfirm = (
    file,
    SchemaDefinitions,
    ajv,
    t,
    setShowBulkUploadModal,
    fileValidator,
    onSubmitBulk,
    setProgress
) => {
    SchemaDefinitions["$schema"] = "http://json-schema.org/draft-07/schema#"
    const validate = ajv.compile(SchemaDefinitions);

    try {
        if (file && file.type === 'application/json') {
            const reader = new FileReader();

            reader.onload = (event) => {
                var jsonContent = [];
                try {
                    jsonContent = JSON.parse(event.target.result);
                } catch (error) {
                    fileValidator(error.message)
                }
                var validationError = false;
                jsonContent.forEach((data, index) => {
                    const valid = validate(data);
                    if (!valid) {
                        validationError = true;
                        fileValidator((validate?.errors[0]?.instancePath ? "InctancePath : " + validate.errors[0].instancePath + " " : "") + validate.errors[0]?.message + " on index " + index);
                        setProgress(0);
                        return;
                    }
                });
                if (!validationError) {
                    // Call onSubmitBulk with setProgress
                    onSubmitBulk(jsonContent, setProgress);
                }
            };

            reader.readAsText(file);
        }
        else if (file && file.type ===
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            'application/vnd.ms-excel'
        ) {

            // Sheet would have first row as headings of columns and then each column contain values. Make array of objects from that sheet. Each object would have key as column name and value as column value
            const reader = new FileReader();

            reader.onload = (event) => {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0]; // Assuming you are interested in the first sheet
                const worksheet = workbook.Sheets[sheetName];
                const jsonArray = XLSX.utils.sheet_to_json(worksheet);
                var validationError = false;
                jsonArray.forEach((data, index) => {
                    const valid = validate(data);
                    if (!valid) {
                        validationError = true;
                        fileValidator(validate.errors[0]?.message + " on index " + index);
                        setProgress(0);
                        return;
                    }
                });
                if (!validationError) {
                    // Call onSubmitBulk with setProgress
                    onSubmitBulk(jsonArray, setProgress);
                }
            }
            reader.readAsArrayBuffer(file);
        }
        else {
            fileValidator(t('WBH_ERROR_FILE_NOT_SUPPORTED'));
            setProgress(0);
        }
        setShowBulkUploadModal(false);
    } catch (error) {
        fileValidator(error.message)
        setShowBulkUploadModal(false);
    }
};

export const generateJsonTemplate = (schema, isArray = true) => {
    var propertyTemplateObject = {}
    if (schema.properties) {
        propertyTemplateObject = Object.keys(schema.properties).reduce((acc, property) => {
            var isRequired = false;
            if (schema?.required) {
                isRequired = schema.required.includes(property);
            }
            if (schema.properties[property].type == "object") {
                acc[property] = generateJsonTemplate(schema.properties[property], false);
            }
            else if (schema.properties[property].type == "array") {
                if (schema.properties[property].items) {
                    if (Array.isArray(schema.properties[property].items) && schema.properties[property].items.length > 0 && schema.properties[property]?.items[0]) {
                        acc[property] = generateJsonTemplate(schema.properties[property].items[0], true);
                    }
                    else {
                        acc[property] = generateJsonTemplate(schema.properties[property].items, true);
                    }
                }
            }
            else {
                if (schema.properties[property].type) {
                    acc[property] = `${schema.properties[property].type}${isRequired ? " required" : ""}`;
                }
                else {
                    acc[property] = `${schema.type}${isRequired ? " required" : ""}`;
                }

            }
            return acc;
        }, {});
    }
    else {
        propertyTemplateObject = `${schema.type}`
    }
    return isArray ? [propertyTemplateObject] : propertyTemplateObject;
}

export const downloadTemplate = (template, isJson, fileValidator, t) => {
    try {
        if (template && Array.isArray(template) && template.length == 1) {
            if (isJson) {
                const blob = new Blob([JSON.stringify(template, null, 2)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "template.json";
                a.click();
                URL.revokeObjectURL(url);
            }
            else {
                // if any property of template is not string then fileValidator(t('WBH_ERROR_TEMPLATE')) and return
                for (const property in template[0]) {
                    if (typeof template[0][property] != "string") {
                        fileValidator(t('WBH_SCHEMA_NOT_SUITABLE'));
                        return;
                    }
                }
                const ws = XLSX.utils.json_to_sheet(template);
                ws['!cols'] = Array(XLSX.utils.decode_range(ws['!ref']).e.c + 1).fill({ width: 15 });
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
                XLSX.writeFile(wb, 'template.xlsx');
            }
        }
        else {
            fileValidator(t('WBH_ERROR_TEMPLATE'));
        }
    } catch (e) {
        fileValidator(e.message);
    }
}