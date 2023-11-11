import { resetCurrentVariables } from "../configs/FieldVariable";

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
    function orderFields(fields, uiOrder) {
        const fieldOrderMap = uiOrder.reduce((acc, fieldName, index) => {
            acc[fieldName] = index;
            return acc;
        }, {});

        fields.forEach(field => {
            const fieldName = field.name;
            if (fieldOrderMap[fieldName] !== undefined) {
                field.order = fieldOrderMap[fieldName];
            }
        });
    }

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
    const fields = [];
    traverseSchema(schema.definition.properties);
    orderFields(fields, schema.definition["ui:order"])
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
        delete schema.properties[fieldName].order;
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
    var currentVariables = {
        name: '',
        type: state?.addingFieldType?.value,
        options: state?.addingFieldType?.value === 'array' ? { "arrayType": "string" } : {},
        showField: true,
        required: false,
        unique: false,
        objectName: state.currentVariables.objectName,
        order: state.fields.reduce((count, field) => count + (!field.name.includes('.') ? 1 : 0), 0)
    };
    dispatch({ type: 'SET_CURRENT_VARIABLES', payload: currentVariables });
    dispatch({ type: 'SET_ADDING_FIELD_TYPE', payload: null });
    dispatch({ type: 'SET_SELECTED_ARRAY_TYPE', payload: { label: 'String', value: 'string' } });
    dispatch({ type: 'SET_UPDATING_INDEX', payload: null });
}


function saveField(state, dispatch) {
    var fieldName = state.currentVariables.objectName
        ? state.currentVariables.objectName + "." + state.currentVariables.name
        : state.currentVariables.name;

    if (state.currentVariables.type == 'object' || (state.currentVariables.type == 'array' && state.selectedArrayType?.value == 'object')) {
        dispatch({ type: 'SET_OBJECT_MODE', payload: true });
        dispatch({ type: 'SET_CURRENT_VARIABLES', payload: { ...state.currentVariables, objectName: fieldName } });
    }
    const newField = {
        name: state.currentVariables.name,
        type: state.currentVariables.type,
        options: state.currentVariables.options,
        required: state.currentVariables.required,
        unique: state.currentVariables.unique,
        order: state.currentVariables.order
    };
    if (state.currentVariables.objectName) {
        delete newField.order;
    }
    if (state.updatingIndex != null && state.updatingIndex !== undefined) {
        if (state.currentVariables.objectName) {
            newField.name = state.currentVariables.objectName + "." + state.currentVariables.name;
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
        if (state.currentVariables.objectName) {
            newField.name = state.currentVariables.objectName + "." + state.currentVariables.name;
        }
        var updatedFields = [...state.fields];
        updatedFields.push(newField);
        dispatch({ type: 'SET_FIELDS', payload: updatedFields });
    }
    if (!(state.currentVariables.type == 'object' || (state.currentVariables.type == 'array' && state.selectedArrayType?.value == 'object'))) {
        fieldName = state.currentVariables.objectName;
    }

    dispatch({ type: 'SET_CURRENT_VARIABLES', payload: { ...resetCurrentVariables, objectName: fieldName } });
    dispatch({ type: 'SET_SELECTED_ARRAY_TYPE', payload: { label: 'String', value: 'string' } });
}



function cancelSave(state, dispatch) {
    dispatch({ type: 'SET_CURRENT_VARIABLES', payload: { ...resetCurrentVariables, objectName: state.currentVariables.objectName } });
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

    // Get fields that have order and assign new order values
    const fieldsWithOrder = updatedFields.filter(field => field.order !== undefined);
    fieldsWithOrder.sort((a, b) => a.order - b.order);
    fieldsWithOrder.forEach((field, idx) => {
        field.order = idx;
    });

    dispatch({ type: 'SET_FIELDS', payload: updatedFields });

    if (state.updatingIndex === index) {
        dispatch({ type: 'SET_UPDATING_INDEX', payload: null });
        dispatch({ type: 'SET_CURRENT_VARIABLES', payload: { ...resetCurrentVariables, objectName: state.currentVariables.objectName } });
    }
}


function setFieldToUpdate(index, state, dispatch, lastName) {
    dispatch({ type: 'SET_UPDATING_INDEX', payload: index });
    // Split the name by dots, and get the last element of the resulting array
    const nameParts = state.fields[index].name.split('.');
    const lastNamePart = nameParts[nameParts.length - 1];
    dispatch({
        type: 'SET_CURRENT_VARIABLES', payload: {
            ...state.currentVariables,
            name: lastNamePart,
            type: state.fields[index].type,
            options: state.fields[index].options,
            required: state.fields[index].required,
            unique: state.fields[index].unique,
            showField: true,
            lastName: lastName,
            order: state.fields[index].order
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