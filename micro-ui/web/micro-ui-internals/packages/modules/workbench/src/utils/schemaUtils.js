import { resetCurrentVariables } from "../configs/FieldVariable";

function updateFieldOptions(field, fieldOptions) {
    const { items, minimum, maximum, exclusiveMinimum, exclusiveMaximum, maxLength, minLength, pattern, format, multipleOf } = field;
    if (!items) {
        Object.assign(fieldOptions, {
            minimum,
            maximum,
            exclusiveMinimum,
            exclusiveMaximum,
            maxLength,
            minLength,
            pattern,
            format,
            multipleOf
        });
    } else {
        updateFieldOptions(field.items, fieldOptions);
    }
}

function orderFields(fields, uiOrder) {
    const fieldOrderMap = uiOrder.reduce((acc, fieldName, index) => {
        acc[fieldName] = index;
        return acc;
    }, {});

    fields.forEach((field) => {
        const fieldName = field.name;
        if (fieldOrderMap[fieldName] !== undefined) {
            field.order = fieldOrderMap[fieldName];
        }
    });
}

function traverseSchema(properties, parentName = '', schema) {
    const fields = [];

    for (const fieldName in properties) {
        const field = properties[fieldName];
        const fieldPath = parentName ? `${parentName}.${field.name}` : field.name;

        let fieldType = field.type === 'array' ? 'array' : field.type === 'object' ? 'object' : field.type;
        const fieldOptions = {};

        if (field.items) {
            fieldOptions.arrayType = field.items.type;
            fieldOptions['minLength of Array'] = field.minLength?.toString();
            fieldOptions['maxLength of Array'] = field.maxLength?.toString();
        }

        updateFieldOptions(field, fieldOptions);

        const required = schema?.definition?.required?.includes(fieldName);
        const unique = schema?.definition['x-unique']?.includes(fieldName);

        const newField = {
            name: fieldPath,
            type: fieldType,
            options: fieldOptions,
            required,
            unique
        };

        fields.push(newField);

        if (fieldType === 'object') {
            newField.properties = traverseSchema(field.properties, fieldPath, schema);
        }
    }
    return fields;
}

function generateFieldsFromSchema(schema) {
    const fields = traverseSchema(schema.definition.properties, '', schema);
    orderFields(fields, schema.definition["ui:order"]);
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
    const formatSchema = (targetSchema, fieldName, field) => {
        const { options, type, arrayType } = field;
        const { unique, required, arrayType: arrType, ...restOptions } = options;

        const fieldProps = {
            ...field,
            ...restOptions,
        };

        if (type === 'array') {
            fieldProps.items = { ...options, type: arrayType };
            delete fieldProps.items.arrayType;
            delete fieldProps.items['minLength of Array'];
            delete fieldProps.items['maxLength of Array'];
        }

        if (['object', 'array'].includes(type)) {
            delete fieldProps.arrayType;
            delete fieldProps['minLength of Array'];
            delete fieldProps['maxLength of Array'];
            delete fieldProps.exclusiveMaximum;
            delete fieldProps.exclusiveMinimum;
            delete fieldProps.pattern;
            delete fieldProps.format;
            delete fieldProps.minimum;
            delete fieldProps.maximum;
            delete fieldProps.multipleOf;
        }

        targetSchema.properties[fieldName] = fieldProps;
    };

    const fieldNames = field.name.split('.');
    const fieldName = fieldNames[0];
    fieldNames.shift();

    if (!schema.properties) schema.properties = {};

    if (fieldNames.length === 0) {
        formatSchema(schema, fieldName, field);
    } else {
        const fieldProp = schema.properties[fieldName];
        const isItemsPresent = fieldProp && fieldProp.items;

        if (fieldProp) {
            const nextField = { ...field, name: fieldNames.join('.') };
            buildSchema(isItemsPresent ? nextField : nextField, isItemsPresent ? fieldProp.items : fieldProp);
        } else {
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