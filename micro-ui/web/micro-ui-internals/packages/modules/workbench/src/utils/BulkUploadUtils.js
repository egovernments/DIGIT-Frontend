export const validateJsonContent = (jsonContent, schemaDefinition) => {
    const errors = [];

    // Validate each object in the array
    jsonContent.forEach((obj, index) => {
        // Check if the required fields are present
        const requiredFields = schemaDefinition.required || [];
        for (const field of requiredFields) {
            if (!obj.hasOwnProperty(field)) {
                errors.push(`Object at index ${index}: Required field "${field}" is missing.`);
            }
        }

        // // Check if there are any extra fields not defined in the schema
        // const allowedFields = Object.keys(schemaDefinition.properties);
        // for (const field in obj) {
        //     if (!allowedFields.includes(field)) {
        //         errors.push(`Object at index ${index}: Field "${field}" is not allowed in this schema.`);
        //     }
        // }

        // Validate each field based on its schema definition
        for (const field in schemaDefinition.properties) {
            if (obj.hasOwnProperty(field)) {
                const fieldValue = obj[field];
                const fieldSchema = schemaDefinition.properties[field];

                if (fieldSchema.type === 'string' && typeof fieldValue !== 'string') {
                    errors.push(`Object at index ${index}: Field "${field}" must be a string.`);
                }

                if (fieldSchema.type === 'boolean' && typeof fieldValue !== 'boolean') {
                    errors.push(`Object at index ${index}: Field "${field}" must be a boolean.`);
                }
                if (fieldSchema.enum && !fieldSchema.enum.includes(fieldValue)) {
                    errors.push(`Object at index ${index}: Field "${field}" must have a value from the enum.`);
                }
            }
        }
        if (schemaDefinition.properties.hasOwnProperty('active') && schemaDefinition.properties.active?.type === 'boolean' && obj.hasOwnProperty('active') && obj.active !== true
        ) {
            errors.push(`Object at index ${index}: Field "isActive" must be true.`);
        }
    });

    return errors;
};

export const onConfirm = (file, SchemaDefinitions, ajv, setShowBulkUploadModal, fileValidator) => {
    const validate = ajv.compile(SchemaDefinitions)
    if (file && file.type === 'application/json') {
        const reader = new FileReader();
        reader.onload = (event) => {
            const jsonContent = JSON.parse(event.target.result);
            jsonContent.forEach((data) => {
                const valid = validate(data)
                if (!valid) {
                    fileValidator(validate.errors[0]?.message + "    instancePath = " + validate.errors[0]?.instancePath)
                    return;
                }
            });
            if (validate.errors.length == 0) {
                jsonContent.forEach((data, index) => {
                    setTimeout(() => {
                        onSubmit(data)
                    }, (index) * 2000);
                });
            }
        };
        reader.readAsText(file);
    } else {
        fileValidator('File Type is not supported')
    }
    setShowBulkUploadModal(false)
}