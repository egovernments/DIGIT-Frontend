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
        var currentVariables = {
            currentFieldName: '',
            currentFieldType: state?.addingFieldType?.value,
            currentOptions: state?.addingFieldType?.value === 'array' ? { "arrayType": "string" } : {},
            showCurrentField: true,
            currentRequired: false,
            currentUnique: false,
            currentObjectName: state.currentVariables.currentObjectName,
        };
        dispatch({ type: 'SET_CURRENT_VARIABLES', payload: currentVariables });
        dispatch({ type: 'SET_ADDING_FIELD_TYPE', payload: null });
        dispatch({ type: 'SET_SELECTED_ARRAY_TYPE', payload: { label: 'String', value: 'string' } });
        dispatch({ type: 'SET_UPDATING_INDEX', payload: null });
    }
}


function saveField(state, dispatch) {
    var fieldName = state.currentVariables.currentObjectName
        ? state.currentVariables.currentObjectName + "." + state.currentVariables.currentFieldName
        : state.currentVariables.currentFieldName;

    if (state.currentVariables.currentFieldType == 'object' || (state.currentVariables.currentFieldType == 'array' && state.selectedArrayType?.value == 'object')) {
        dispatch({ type: 'SET_OBJECT_MODE', payload: true });
        dispatch({ type: 'SET_CURRENT_VARIABLES', payload: { ...state.currentVariables, currentObjectName: fieldName } });
    }

    dispatch({ type: 'SET_NAME_ERROR', payload: { add: null, edit: null } });

    var newField = {
        name: state.currentVariables.currentFieldName,
        type: state.currentVariables.currentFieldType,
        options: state.currentVariables.currentOptions,
        required: state.currentVariables.currentRequired,
        unique: state.currentVariables.currentUnique
    };

    if (state.updatingIndex != null && state.updatingIndex !== undefined) {
        if (state.currentVariables.currentObjectName) {
            newField.name = state.currentVariables.currentObjectName + "." + state.currentVariables.currentFieldName;
        }
        var updatedField = [...state.fields];
        updatedField[state.updatingIndex] = newField;

        updatedField.map(field => {
            if (field.name.startsWith(state.currentVariables.lastName + ".")) {
                const suffix = field.name.substring((state.currentVariables.lastName + ".").length);
                field.name = newField.name + "." + suffix;
            }
            return field;
        });

        dispatch({ type: 'SET_FIELDS', payload: updatedField });
        dispatch({ type: 'SET_UPDATING_INDEX', payload: null });
    } else {
        if (state.currentVariables.currentObjectName) {
            newField.name = state.currentVariables.currentObjectName + "." + state.currentVariables.currentFieldName;
        }
        var updatedFields = [...state.fields];
        updatedFields.push(newField);
        dispatch({ type: 'SET_FIELDS', payload: updatedFields });
    }
    if (!(state.currentVariables.currentFieldType == 'object' || (state.currentVariables.currentFieldType == 'array' && state.selectedArrayType?.value == 'object'))) {
        fieldName = state.currentVariables.currentObjectName;
    }

    // Reset currentVariables
    const resetCurrentVariables = {
        currentFieldName: '',
        currentFieldType: 'string',
        currentOptions: {},
        showCurrentField: false,
        currentRequired: false,
        currentUnique: false,
        currentObjectName: fieldName,
    };
    dispatch({ type: 'SET_CURRENT_VARIABLES', payload: resetCurrentVariables });
    dispatch({ type: 'SET_SELECTED_ARRAY_TYPE', payload: { label: 'String', value: 'string' } });
}



function cancelSave(dispatch) {
    const resetCurrentVariables = {
        currentFieldName: '',
        currentFieldType: 'string',
        currentOptions: {},
        showCurrentField: false,
        currentRequired: false,
        currentUnique: false,
        currentObjectName: state.currentVariables.currentObjectName,
    };
    dispatch({ type: 'SET_CURRENT_VARIABLES', payload: resetCurrentVariables });
    dispatch({ type: 'SET_UPDATING_INDEX', payload: null });
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
        const currentVariables = {
            currentFieldName: '',
            currentFieldType: 'string',
            currentRequired: false,
            currentUnique: false,
            showCurrentField: false,
            currentOptions: {},
            currentObjectName: state.currentVariables.currentObjectName
        };
        dispatch({ type: 'SET_UPDATING_INDEX', payload: null });
        dispatch({ type: 'SET_CURRENT_VARIABLES', payload: currentVariables });
    }
}

function setFieldToUpdate(index, state, dispatch) {
    dispatch({ type: 'SET_UPDATING_INDEX', payload: index });
    // Split the name by dots, and get the last element of the resulting array
    const nameParts = state.fields[index].name.split('.');
    const lastNamePart = nameParts[nameParts.length - 1];
    dispatch({
        type: 'SET_CURRENT_VARIABLES', payload: {
            ...state.currentVariables,
            currentFieldName: lastNamePart,
            currentFieldType: state.fields[index].type,
            currentOptions: state.fields[index].options,
            currentRequired: state.fields[index].required,
            currentUnique: state.fields[index].unique,
            showCurrentField: true
        }
    });
    if (state.fields[index].type === 'array') {
        dispatch({
            type: 'SET_SELECTED_ARRAY_TYPE', payload: {
                label: state.fields[index].options.arrayType.charAt(0).toUpperCase() + state.fields[index].options.arrayType.slice(1),
                value: state.fields[index].options.arrayType
            }
        });
    }
}


export { generateFieldsFromSchema, deepClone, buildSchema, addField, saveField, cancelSave, removeField, setFieldToUpdate };