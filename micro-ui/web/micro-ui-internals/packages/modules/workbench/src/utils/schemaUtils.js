function generateFieldsFromSchema(schema) {
    const updateFieldOptions = (field, fieldOptions) => {

        if (field.minimum && !field.items) {
            fieldOptions.minimum = field.minimum;
        }

        if (field.maximum && !field.items) {
            fieldOptions.maximum = field.maximum;
        }

        if (field.exclusiveMinimum && !field.items) {
            fieldOptions.exclusiveMinimum = field.exclusiveMinimum;
        }

        if (field.exclusiveMaximum && !field.items) {
            fieldOptions.exclusiveMaximum = field.exclusiveMaximum;
        }

        if (field.maxLength && !field.items) {
            fieldOptions.maxLength = field.maxLength;
        }

        if (field.minLength && !field.items) {
            fieldOptions.minLength = field.minLength;
        }

        if (field.pattern && !field.items) {
            fieldOptions.pattern = field.pattern;
        }

        if (field.format && !field.items) {
            fieldOptions.format = field.format;
        }

        if (field.multipleOf && !field.items) {
            fieldOptions.multipleOf = field.multipleOf;
        }
        if (field.items) {
            updateFieldOptions(field.items, fieldOptions)
        }
    }
    const fields = [];

    // Helper function to recursively traverse the JSON schema
    function traverseSchema(properties, parentName = '') {
        for (const fieldName in properties) {
            const field = properties[fieldName];
            const fieldPath = parentName ? `${parentName}.${field.name}` : field.name;

            // Determine field type based on the JSON schema
            let fieldType;
            if (field.type === 'array') {
                fieldType = 'array';
            } else if (field.type === 'object') {
                fieldType = 'object';
            } else {
                fieldType = field.type;
            }

            // Extract field options
            const fieldOptions = {};
            if (field.items) {
                fieldOptions.arrayType = field.items.type;
                if (field.minLength) {
                    fieldOptions['minLength of Array'] = field.minLength.toString();
                }
                if (field.maxLength) {
                    fieldOptions['maxLength of Array'] = field.maxLength.toString();
                }
            }
            updateFieldOptions(field, fieldOptions)

            // Determine if the field is required and unique
            const required = schema?.definition?.required && schema?.definition?.required.includes(fieldName);
            const unique = schema?.definition['x-unique'] && schema?.definition['x-unique'].includes(fieldName);

            // Create the field object and add it to the fields array
            fields.push({
                name: fieldPath,
                type: fieldType,
                options: fieldOptions,
                required,
                unique,
            });

            // If the field is an object, recursively traverse its properties
            if (fieldType === 'object') {
                traverseSchema(field.properties, fieldPath);
            }
        }
    }

    // Start traversing the schema from the top-level properties
    traverseSchema(schema.definition.properties);

    return fields;
}

const deepClone = (obj) => {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (Array.isArray(obj)) {
        const copy = [];
        obj.forEach((item) => {
            copy.push(deepClone(item));
        });
        return copy;
    }

    const copy = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            copy[key] = deepClone(obj[key]);
        }
    }
    return copy;
};


const buildSchema = (field, schema) => {
    const formatSchema = (schema, fieldName, field) => {
        schema.properties[fieldName] = { ...field, ...field.options }
        delete schema.properties[fieldName].options;
        delete schema.properties[fieldName].required;
        delete schema.properties[fieldName].unique;
        if (field.type == 'object' || field.type == 'array') {
            delete schema.properties[fieldName].arrayType;
            delete schema.properties[fieldName].minLength;
            delete schema.properties[fieldName].maxLength;
            delete schema.properties[fieldName].exclusiveMaximum;
            delete schema.properties[fieldName].exclusiveMinimum;
            delete schema.properties[fieldName].pattern;
            delete schema.properties[fieldName].format;
            delete schema.properties[fieldName].minimum;
            delete schema.properties[fieldName].maximum;
            delete schema.properties[fieldName].multipleOf;
        }
        if (schema.properties[fieldName]["minLength of Array"]) {
            schema.properties[fieldName].minLength = schema.properties[fieldName]["minLength of Array"];
            delete schema.properties[fieldName]["minLength of Array"]
        }
        if (schema.properties[fieldName]["maxLength of Array"]) {
            schema.properties[fieldName].maxLength = schema.properties[fieldName]["maxLength of Array"];
            delete schema.properties[fieldName]["maxLength of Array"]
        }
        if (schema.properties[fieldName].type == 'array') {
            schema.properties[fieldName].items = { ...field.options };
            schema.properties[fieldName].items.type = field.options.arrayType;
            delete schema.properties[fieldName].items.arrayType;
            delete schema.properties[fieldName].items["minLength of Array"];
            delete schema.properties[fieldName].items["maxLength of Array"];
        }
    }
    const fieldNames = field.name.split('.');
    const fieldName = fieldNames[0];
    fieldNames.shift();
    if (fieldNames.length == 0) {
        if (schema.properties) {
            formatSchema(schema, fieldName, field);
        }
        else {
            schema.properties = {}
            formatSchema(schema, fieldName, field);
        }
    }
    else {
        if (schema.properties[fieldName]) {
            if (schema.properties[fieldName].items) {
                buildSchema({ ...field, name: fieldNames.join('.') }, schema.properties[fieldName].items);
            }
            else {
                buildSchema({ ...field, name: fieldNames.join('.') }, schema.properties[fieldName]);
            }
        }
        else {
            schema.properties[fieldName] = { type: 'object', properties: {} };
            buildSchema({ ...field, name: fieldNames.join('.') }, schema.properties[fieldName]);
        }
    }
};

function addField(state, dispatch) {
    if (!state?.addingFieldType?.value) {
        dispatch({ type: 'SET_NAME_ERROR', payload: { add: "Select field type first", edit: null } });
    } else {
        dispatch({ type: 'SET_NAME_ERROR', payload: { add: null, edit: null } });
        dispatch({ type: 'SET_CURRENT_FIELD_NAME', payload: '' });
        dispatch({ type: 'SET_CURRENT_FIELD_TYPE', payload: state?.addingFieldType?.value });
        dispatch({ type: 'SET_ADDING_FIELD_TYPE', payload: null });
        dispatch({ type: 'SET_SHOW_CURRENT_FIELD', payload: true });
        dispatch({ type: 'SET_CURRENT_REQUIRED', payload: false });
        dispatch({ type: 'SET_CURRENT_UNIQUE', payload: false });
        dispatch({ type: 'SET_SELECTED_ARRAY_TYPE', payload: { label: 'String', value: 'string' } });
        if (state?.addingFieldType?.value === 'array') {
            dispatch({
                type: 'SET_CURRENT_OPTIONS',
                payload: { "arrayType": "string" }
            });
        } else {
            dispatch({ type: 'SET_CURRENT_OPTIONS', payload: {} });
        }
        dispatch({ type: 'SET_UPDATING_INDEX', payload: null });
    }
}

function saveField(state, dispatch) {
    var fieldName = state.currentObjectName ? state.currentObjectName + "." + state.currentFieldName : state.currentFieldName;
    const nameExists = state.fields.some((field, index) => field.name === fieldName && index !== state.updatingIndex);
    if (state.currentFieldName === '') {
        var error = { ...state.nameError };
        error.edit = "Field name Can't be empty";
        dispatch({ type: 'SET_NAME_ERROR', payload: error });
        return;
    } else if (nameExists) {
        var error = { ...state.nameError };
        error.edit = "Field name already exists";
        dispatch({ type: 'SET_NAME_ERROR', payload: error });
        return;
    } else if (state?.currentFieldName.includes('.')) {
        var error = { ...state.nameError };
        error.edit = "Field name should not contain dots";
        dispatch({ type: 'SET_NAME_ERROR', payload: error });
        return;
    }
    if (state.currentFieldType === 'object' || (state.currentFieldType === 'array' && state.selectedArrayType?.value === 'object')) {
        dispatch({ type: 'SET_OBJECT_MODE', payload: true });
        dispatch({ type: 'SET_CURRENT_OBJECT_NAME', payload: fieldName });
    }
    dispatch({ type: 'SET_NAME_ERROR', payload: { add: null, edit: null } });
    var newField = { name: state.currentFieldName, type: state.currentFieldType, options: state.currentOptions, required: state.currentRequired, unique: state.currentUnique };
    if (state.updatingIndex != null && state.updatingIndex !== undefined) {
        if (state.currentObjectName) {
            newField.name = state.currentObjectName + "." + state.currentFieldName;
        }
        var updatedField = [...state.fields];
        updatedField[state.updatingIndex] = newField;
        updatedField.map(field => {
            // Check if the field name has the prefix "lastName."
            if (field.name.startsWith(state.lastName + ".")) {
                // Extract the part of the name after the prefix and append it to the newField.name
                const suffix = field.name.substring((state.lastName + ".").length);
                field.name = newField.name + "." + suffix;
            }
            return field;
        });
        dispatch({ type: 'SET_FIELDS', payload: updatedField });
        dispatch({ type: 'SET_UPDATING_INDEX', payload: null });
    } else {
        if (state.currentObjectName) {
            newField.name = state.currentObjectName + "." + state.currentFieldName;
        }
        var updatedFields = [...state.fields];
        updatedFields.push(newField);
        dispatch({ type: 'SET_FIELDS', payload: updatedFields });
    }
    dispatch({ type: 'SET_CURRENT_FIELD_NAME', payload: '' });
    dispatch({ type: 'SET_CURRENT_FIELD_TYPE', payload: 'string' });
    dispatch({ type: 'SET_CURRENT_REQUIRED', payload: false });
    dispatch({ type: 'SET_CURRENT_UNIQUE', payload: false });
    dispatch({ type: 'SET_SHOW_CURRENT_FIELD', payload: false });
    dispatch({ type: 'SET_SELECTED_ARRAY_TYPE', payload: { label: 'String', value: 'string' } });
    dispatch({ type: 'SET_CURRENT_OPTIONS', payload: {} });
}

function cancelSave(dispatch) {
    dispatch({ type: 'SET_UPDATING_INDEX', payload: null });
    dispatch({ type: 'SET_CURRENT_FIELD_NAME', payload: '' });
    dispatch({ type: 'SET_CURRENT_FIELD_TYPE', payload: 'string' });
    dispatch({ type: 'SET_CURRENT_REQUIRED', payload: false });
    dispatch({ type: 'SET_CURRENT_UNIQUE', payload: false });
    dispatch({ type: 'SET_SHOW_CURRENT_FIELD', payload: false });
    dispatch({ type: 'SET_CURRENT_OPTIONS', payload: {} });
}

function removeField(index, state, dispatch) {
    const updatedFields = [...state.fields];
    const fieldToRemove = updatedFields[index];

    // Remove the field at the specified index
    updatedFields.splice(index, 1);

    // Remove all fields with names having the `field.name` as a prefix
    const prefix = fieldToRemove.name + '.';
    const fieldsToRemove = updatedFields.filter((field) => field.name.startsWith(prefix));
    fieldsToRemove.forEach((field) => {
        const removeIndex = updatedFields.findIndex((f) => f === field);
        if (removeIndex !== -1) {
            updatedFields.splice(removeIndex, 1);
        }
    });
    dispatch({ type: 'SET_FIELDS', payload: updatedFields });

    if (state.updatingIndex === index) {
        dispatch({ type: 'SET_UPDATING_INDEX', payload: null });
        dispatch({ type: 'SET_CURRENT_FIELD_NAME', payload: '' });
        dispatch({ type: 'SET_CURRENT_FIELD_TYPE', payload: 'string' });
        dispatch({ type: 'SET_CURRENT_REQUIRED', payload: false });
        dispatch({ type: 'SET_CURRENT_UNIQUE', payload: false });
        dispatch({ type: 'SET_SHOW_CURRENT_FIELD', payload: false });
        dispatch({ type: 'SET_CURRENT_OPTIONS', payload: {} });
    }
}

function setFieldToUpdate(index, state, dispatch) {
    dispatch({ type: 'SET_UPDATING_INDEX', payload: index });
    // Split the name by dots, and get the last element of the resulting array
    const nameParts = state.fields[index].name.split('.');
    const lastNamePart = nameParts[nameParts.length - 1];
    dispatch({ type: 'SET_CURRENT_FIELD_NAME', payload: lastNamePart });
    dispatch({ type: 'SET_CURRENT_FIELD_TYPE', payload: state.fields[index].type });
    dispatch({ type: 'SET_CURRENT_OPTIONS', payload: state.fields[index].options });
    if (state.fields[index].type === 'array') {
        dispatch({
            type: 'SET_SELECTED_ARRAY_TYPE', payload: {
                label: state.fields[index].options.arrayType.charAt(0).toUpperCase() + state.fields[index].options.arrayType.slice(1),
                value: state.fields[index].options.arrayType
            }
        });
    }
    dispatch({ type: 'SET_CURRENT_REQUIRED', payload: state.fields[index].required });
    dispatch({ type: 'SET_CURRENT_UNIQUE', payload: state.fields[index].unique });
    dispatch({ type: 'SET_SHOW_CURRENT_FIELD', payload: true });
}

function updateFieldOption(optionName, optionValue, state, dispatch) {
    var updatedOptions = { ...state.currentOptions };
    if (optionValue === '' || optionValue === null || optionValue === undefined) {
        // If optionValue is empty, null, or undefined, delete optionName from updatedOptions
        delete updatedOptions[optionName];
    } else {
        updatedOptions[optionName] = optionValue;
    }
    dispatch({ type: 'SET_CURRENT_OPTIONS', payload: updatedOptions });
}


export { generateFieldsFromSchema, deepClone, buildSchema, addField, saveField, cancelSave, removeField, setFieldToUpdate, updateFieldOption };