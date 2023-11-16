import { resetCurrentVariables, fieldTypes, arrayTypes } from "../configs/FieldVariable";


const updateFieldOptions = (field, fieldOptions) => {
    const conditions = [
        'minimum',
        'maximum',
        'exclusiveMinimum',
        'exclusiveMaximum',
        'maxLength',
        'minLength',
        'pattern',
        'format',
        'multipleOf'
    ];

    conditions.forEach(condition => {
        if (field[condition] && !field.items) {
            fieldOptions[condition] = field[condition];
        }
    });

    if (field.items) {
        updateFieldOptions(field.items, fieldOptions);
    }
};

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

function traverseSchema(properties, parentName, schema, fields) {
    for (const fieldName in properties) {
        const field = properties[fieldName];
        const fieldPath = parentName ? `${parentName}.${field.name}` : field.name;

        const fieldOptions = {};

        if (field.type === 'array' && field.items) {
            fieldOptions.arrayType = field.items.type;
            if (field.minLength) {
                fieldOptions['minLength of Array'] = field.minLength.toString();
            }
            if (field.maxLength) {
                fieldOptions['maxLength of Array'] = field.maxLength.toString();
            }
        } else {
            updateFieldOptions(field, fieldOptions);
        }
        const required = schema?.definition?.required?.includes(fieldName);
        const unique = schema?.definition['x-unique']?.includes(fieldName);

        fields.push({
            name: fieldPath,
            type: field.type,
            options: fieldOptions,
            required,
            unique,
        });

        if (field.type === 'object') {
            traverseSchema(field.properties, fieldPath, schema, fields);
        }
        if (field.type === 'array' && field.items && field.items.type === 'object' && field.items.properties) {
            traverseSchema(field.items.properties, fieldPath, schema, fields);
        }
    }
}


function generateFieldsFromSchema(schema) {
    const fields = [];
    traverseSchema(schema.definition.properties, '', schema, fields);
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
const buildSchema = (field, schema) => {
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

function traversalValidation(obj, path, errors) {
    for (const [key, value] of Object.entries(obj)) {
        const currentPath = path ? `${path}.${key}` : key;

        // Check keyname and keyname.name match
        if (key !== value.name) {
            errors.push(`Property ${currentPath} has different keyname and keyname.name.`);
        }
        // Check if field has empty name
        if (value.name == '') {
            errors.push(`Property ${currentPath} has empty keyname.name.`);
        }
        if (!value.type) {
            errors.push(`Property ${currentPath} does not have a type.`);
        }
        else {
            // Check if the field type is valid
            const validTypes = fieldTypes.map(type => type.value);
            if (!validTypes.includes(value.type)) {
                errors.push(`Property ${currentPath} has an invalid type.`);
            }

            // Check if it's an array and has an items type
            if (value.type === 'array' && value.items && value.items.type) {
                const validArrayTypes = arrayTypes.map(type => type.value);
                if (!validArrayTypes.includes(value.items.type)) {
                    errors.push(`Property ${currentPath} has an invalid array item type.`);
                }
            }
        }

        // Check array fields have an arrayType
        if (value.type === 'array' && !value.items.type) {
            errors.push(`Array property ${currentPath} does not have an arrayType.`);
        }

        // Check array fields have items
        if (value.type === 'array' && !value.items) {
            errors.push(`Array property ${currentPath} does not have items.`);
        }

        // Recursively validate nested properties
        if (value.properties) {
            traversalValidation(value.properties, currentPath, errors);
        }

        // Check items.type == object have properties
        if (value.type === 'array' && value.items && value.items.type === 'object') {
            if (value.items.properties) {
                traversalValidation(value.items.properties, currentPath, errors);
            }
        }
    }
}

function rootValidation(schema, errors) {
    // Check that all required properties are in the ui:order arrays.
    for (const requiredProperty of schema.required) {
        if (!schema['ui:order'].includes(requiredProperty)) {
            errors.push(`Required property ${requiredProperty} is not in the ui:order array.`);
        }
    }

    // Check that all unique fields are also required and are in ui:order array.
    for (const uniqueField of schema['x-unique']) {
        if (!schema.required.includes(uniqueField)) {
            errors.push(`Unique field ${uniqueField} is not also required.`);
        }
        if (!schema['ui:order'].includes(uniqueField)) {
            errors.push(`Unique field ${uniqueField} is not in the ui:order array`);
        }
    }

    // Check that all fields from schema.properties are in ui:order and vice versa
    const propertyNames = Object.keys(schema.properties);
    const uiOrderNames = schema['ui:order'];

    propertyNames.forEach(property => {
        if (!uiOrderNames.includes(property)) {
            errors.push(`Property '${property}' from schema.properties is not in 'ui:order'.`);
        }
    });

    uiOrderNames.forEach(uiOrderName => {
        if (!propertyNames.includes(uiOrderName)) {
            errors.push(`Name '${uiOrderName}' in 'ui:order' is not in schema.properties.`);
        }
    });
}

function uniqueValidation(schema) {
    const isUnique = arr => arr.length === new Set(arr).size;

    const uniqueElements = ['ui:order', 'required', 'x-unique'];
    const errors = [];

    uniqueElements.forEach(key => {
        if (schema[key] && !isUnique(schema[key])) {
            errors.push(`Array '${key}' contains duplicate elements.`);
        }
    });

    return errors;
}

function validateSchema(schema) {
    const errors = [];
    uniqueValidation(schema)
    traversalValidation(schema.properties, '', errors);
    rootValidation(schema, errors);
    return errors;
}


export { generateFieldsFromSchema, deepClone, buildSchema, addField, saveField, cancelSave, removeField, setFieldToUpdate, validateSchema };