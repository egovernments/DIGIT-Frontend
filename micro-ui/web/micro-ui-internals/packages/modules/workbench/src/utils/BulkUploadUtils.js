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
                        fileValidator(validate.errors[0]?.message + " on index " + index);
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

export const generateJsonTemplate = (schema) => {
    const template = {
        type: "object",
        title: schema.title,
        $schema: schema.$schema,
        required: schema.required || [],
        "x-unique": schema["x-unique"] || [],
        properties: {},
        "x-ref-schema": schema["x-ref-schema"] || [],
    };

    for (const propertyKey in schema.properties) {
        const property = schema.properties[propertyKey];
        template.properties[propertyKey] = {
            type: property.type,
        };

        if (property.enum) {
            template.properties[propertyKey].enum = property.enum;
        }
    }

    const propertyTemplateObject = Object.keys(template.properties).reduce((acc, property) => {
        const isRequired = template.required.includes(property);
        acc[property] = `${template.properties[property].type}${isRequired ? " required" : ""}`;
        return acc;
    }, {});

    return [propertyTemplateObject];
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