import React, { useEffect, useState, useReducer } from 'react';
import { ActionBar, Button, SubmitBar } from "@egovernments/digit-ui-react-components"
import FieldView from '../../components/FieldView';
import FieldSelect from '../../components/FieldSelect';
import SchemaModalComponent from '../../components/SchemaModalComponent';
import FieldEditorComponent from '../../components/FieldEditorComponent';
import Confirmation from '../../../../engagement/src/components/Modal/Confirmation';
import { useTranslation } from 'react-i18next';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import CustomCheckbox from '../../components/Checbox';
import { generateFieldsFromSchema, deepClone, buildSchema } from '../../utils/schemaUtils';
import { colorsConfigJson, styleConfigJson } from '../../configs/JSONInputStyleConfig';

function DynamicSchemaFormGenerator(props) {
    const { t } = useTranslation();
    const [schemaName, setSchemaName] = useState(props.schemaName ? props.schemaName : null);
    const [generatedSchema, setGeneratedSchema] = useState(null);
    const [selectedFieldIndex, setSelectedFieldIndex] = useState(null); // Track the selected field index
    const [showModal, setShowModal] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [showGenerator, setShowGenerator] = useState(true);
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const initialState = {
        fields: props.fields || [],
        orderedFields: props.uiOrder || [],
        filteredObjectFields: [],
        nameError: { add: null, edit: null },
        uniqueError: false,
        currentRequired: false,
        currentUnique: false,
        currentFieldName: '',
        currentFieldType: 'string',
        currentOptions: {},
        showCurrentField: false,
        currentObjectName: '',
        addingFieldType: null,
        updatingIndex: null, // Add updatingIndex to initialState
        selectedArrayType: { label: 'String', value: 'string' }, // Add selectedArrayType to initialState
        objectMode: false,
        lastName: ''
    };

    const schemaReducer = (state, action) => {
        switch (action.type) {
            case 'SET_FIELDS':
                return { ...state, fields: action.payload };
            case 'SET_ORDERED_FIELDS':
                return { ...state, orderedFields: action.payload };
            case 'SET_FILTERED_OBJECTS_FIELDS':
                return { ...state, filteredObjectFields: action.payload };
            case 'SET_NAME_ERROR':
                return { ...state, nameError: action.payload };
            case 'SET_UNIQUE_ERROR':
                return { ...state, uniqueError: action.payload };
            case 'SET_CURRENT_REQUIRED':
                return { ...state, currentRequired: action.payload };
            case 'SET_CURRENT_UNIQUE':
                return { ...state, currentUnique: action.payload };
            case 'SET_CURRENT_FIELD_NAME':
                return { ...state, currentFieldName: action.payload };
            case 'SET_CURRENT_FIELD_TYPE':
                return { ...state, currentFieldType: action.payload };
            case 'SET_CURRENT_OPTIONS':
                return { ...state, currentOptions: action.payload };
            case 'SET_SHOW_CURRENT_FIELD':
                return { ...state, showCurrentField: action.payload };
            case 'SET_CURRENT_OBJECT_NAME':
                return { ...state, currentObjectName: action.payload };
            case 'SET_ADDING_FIELD_TYPE':
                return { ...state, addingFieldType: action.payload };
            case 'SET_UPDATING_INDEX':
                return { ...state, updatingIndex: action.payload }; // Dispatch action for updatingIndex
            case 'SET_SELECTED_ARRAY_TYPE':
                return { ...state, selectedArrayType: action.payload }; // Dispatch action for selectedArrayType
            case 'SET_OBJECT_MODE':
                return { ...state, objectMode: action.payload };
            case 'SET_LAST_NAME':
                return { ...state, lastName: action.payload };
            default:
                return state;
        }
    };
    const [state, dispatch] = useReducer(schemaReducer, initialState);

    const addField = () => {
        if (!state?.addingFieldType?.value) {
            dispatch({ type: 'SET_NAME_ERROR', payload: { add: "Select field type first", edit: null } });
        }
        else {
            dispatch({ type: 'SET_NAME_ERROR', payload: { add: null, edit: null } });
            dispatch({ type: 'SET_CURRENT_FIELD_NAME', payload: '' });
            dispatch({ type: 'SET_CURRENT_FIELD_TYPE', payload: state?.addingFieldType?.value });
            dispatch({ type: 'SET_ADDING_FIELD_TYPE', payload: null });
            dispatch({ type: 'SET_SHOW_CURRENT_FIELD', payload: true });
            setSelectedFieldIndex(null);
            dispatch({ type: 'SET_CURRENT_REQUIRED', payload: false });
            dispatch({ type: 'SET_CURRENT_UNIQUE', payload: false });
            dispatch({ type: 'SET_SELECTED_ARRAY_TYPE', payload: { label: 'String', value: 'string' } });
            if (state?.addingFieldType?.value == 'array') {
                dispatch({
                    type: 'SET_CURRENT_OPTIONS', payload: {
                        "arrayType": "string"
                    }
                });
            }
            else {
                dispatch({ type: 'SET_CURRENT_OPTIONS', payload: {} });
            }
            dispatch({ type: 'SET_UPDATING_INDEX', payload: null });
        }

    };
    const saveField = () => {
        var fieldName = state.currentObjectName ? state.currentObjectName + "." + state.currentFieldName : state.currentFieldName
        const nameExists = state.fields.some((field, index) => field.name == fieldName && index != state.updatingIndex);
        if (state.currentFieldName == '') {
            var error = { ...state.nameError };
            error.edit = "Field name Can't be empty";
            dispatch({ type: 'SET_NAME_ERROR', payload: error });
            return;
        }
        else if (nameExists) {
            var error = { ...state.nameError };
            error.edit = "Field name already exists";
            dispatch({ type: 'SET_NAME_ERROR', payload: error });
            return;
        }
        else if (state?.currentFieldName.includes('.')) {
            var error = { ...state.nameError };
            error.edit = "Field name should not contain dots";
            dispatch({ type: 'SET_NAME_ERROR', payload: error });
            return;
        }
        if (state.currentFieldType == 'object' || (state.currentFieldType == 'array' && state.selectedArrayType?.value == 'object')) {
            dispatch({ type: 'SET_OBJECT_MODE', payload: true });
            dispatch({ type: 'SET_CURRENT_OBJECT_NAME', payload: fieldName });
        }
        dispatch({ type: 'SET_NAME_ERROR', payload: { add: null, edit: null } });
        var newField = { name: state.currentFieldName, type: state.currentFieldType, options: state.currentOptions, required: state.currentRequired, unique: state.currentUnique };
        if (state.updatingIndex != null && state.updatingIndex != undefined) {
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
        }
        else {
            if (state.currentObjectName) {
                newField.name = state.currentObjectName + "." + state.currentFieldName;
            }
            var updatedFields = [...state.fields];
            updatedFields.push(newField);
            dispatch({ type: 'SET_FIELDS', payload: updatedFields });
        }
        setSelectedFieldIndex(null);
        dispatch({ type: 'SET_CURRENT_FIELD_NAME', payload: '' });
        dispatch({ type: 'SET_CURRENT_FIELD_TYPE', payload: 'string' });
        dispatch({ type: 'SET_CURRENT_REQUIRED', payload: false });
        dispatch({ type: 'SET_CURRENT_UNIQUE', payload: false });
        dispatch({ type: 'SET_SHOW_CURRENT_FIELD', payload: false });
        dispatch({ type: 'SET_SELECTED_ARRAY_TYPE', payload: { label: 'String', value: 'string' } });
        dispatch({ type: 'SET_CURRENT_OPTIONS', payload: {} });
    }
    const cancelSave = () => {
        dispatch({ type: 'SET_UPDATING_INDEX', payload: null });
        setSelectedFieldIndex(null);
        dispatch({ type: 'SET_CURRENT_FIELD_NAME', payload: '' });
        dispatch({ type: 'SET_CURRENT_FIELD_TYPE', payload: 'string' });
        dispatch({ type: 'SET_CURRENT_REQUIRED', payload: false });
        dispatch({ type: 'SET_CURRENT_UNIQUE', payload: false });
        dispatch({ type: 'SET_SHOW_CURRENT_FIELD', payload: false });
        dispatch({ type: 'SET_CURRENT_OPTIONS', payload: {} });
    }

    const removeField = (index) => {
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

        // Clear the selected field if it was removed
        if (selectedFieldIndex === index) {
            setSelectedFieldIndex(null);
        }
        if (state.updatingIndex === index) {
            dispatch({ type: 'SET_UPDATING_INDEX', payload: null });
            setSelectedFieldIndex(null);
            dispatch({ type: 'SET_CURRENT_FIELD_NAME', payload: '' });
            dispatch({ type: 'SET_CURRENT_FIELD_TYPE', payload: 'string' });
            dispatch({ type: 'SET_CURRENT_REQUIRED', payload: false });
            dispatch({ type: 'SET_CURRENT_UNIQUE', payload: false });
            dispatch({ type: 'SET_SHOW_CURRENT_FIELD', payload: false });
            dispatch({ type: 'SET_CURRENT_OPTIONS', payload: {} });
        }
    };


    const setFieldToUpdate = (index) => {

        dispatch({ type: 'SET_UPDATING_INDEX', payload: index });
        // Split the name by dots, and get the last element of the resulting array
        const nameParts = state.fields[index].name.split('.');
        const lastNamePart = nameParts[nameParts.length - 1];
        dispatch({ type: 'SET_CURRENT_FIELD_NAME', payload: lastNamePart });
        dispatch({ type: 'SET_CURRENT_FIELD_TYPE', payload: state.fields[index].type });
        dispatch({ type: 'SET_CURRENT_OPTIONS', payload: state.fields[index].options });
        if (state.fields[index].type == 'array') {
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
    };



    const updateFieldOption = (optionName, optionValue) => {
        var updatedOptions = { ...state.currentOptions };
        if (optionValue === '' || optionValue === null || optionValue === undefined) {
            // If optionValue is empty, null, or undefined, delete optionName from updatedOptions
            delete updatedOptions[optionName];
        } else {
            updatedOptions[optionName] = optionValue;
        }
        dispatch({ type: 'SET_CURRENT_OPTIONS', payload: updatedOptions });
    };




    const generateSchema = () => {

        if (state.fields.length === 0) {
            // If the fields array is empty, set an error message
            dispatch({ type: 'SET_UNIQUE_ERROR', payload: "At least one field is required to generate the schema." });
            setGeneratedSchema(null); // Reset the schema
            setShowModal(true);
        } else {
            // Deep clone the fields array
            const clonedFields = deepClone(state.fields);

            // Use the cloned fields for generating the schema
            const schema = {
                schemaName: props.schemaName,
                type: 'object',
                "$schema": "http://json-schema.org/draft-07/schema#",
                properties: {},
                required: [],
                'x-unique': [],
                'ui:order': [],
            };

            // Track whether at least one unique field is found
            let uniqueFound = false;

            clonedFields.forEach((field) => {
                buildSchema(field, schema);
                if (field.unique && !field.name.includes(".")) {
                    schema['x-unique'].push(field.name);
                    uniqueFound = true; // Mark that a unique field was found
                }
                if (field.required && !field.name.includes(".")) {
                    schema['required'].push(field.name);
                }
            });

            state.orderedFields.map((field) => {
                schema['ui:order'].push(field.name);
            })

            if (!uniqueFound) {
                dispatch({ type: 'SET_UNIQUE_ERROR', payload: "At least one unique field is required." });
                setGeneratedSchema(null); // Reset the schema
            } else {
                // No error, set the schema as generated
                dispatch({ type: 'SET_UNIQUE_ERROR', payload: null });
                setGeneratedSchema(
                    {
                        code: "MDMS_Schema." + props.schemaName,
                        tenantId: tenantId,
                        description: "Mdms schema " + props.schemaName,
                        definition: schema
                    }
                );
            }
            setShowModal(true);
        }
    };



    useEffect(() => {
        // Construct a new array of fields based on objectFields and currentObjectName
        const newFilteredObjectFields = state.fields.filter((field) => {
            if (state.currentObjectName) {
                // Check if the field name starts with the currentObjectName or its prefixes
                const prefix = state.currentObjectName + '.';
                if (field.name.startsWith(prefix)) {
                    // Check if the field name contains dots only in the prefix
                    const remainingName = field.name.substring(prefix.length);
                    if (!remainingName.includes('.')) {
                        return true;
                    }
                }
            }
            return false; // If no currentObjectName or not matching the criteria, exclude the field
        });
        // Pass the filtered fields to the FieldView component
        dispatch({ type: 'SET_FILTERED_OBJECTS_FIELDS', payload: newFilteredObjectFields });
    }, [state.fields, state.currentObjectName]);


    const renderButtons = () => {
        return (
            <div >
                <ActionBar style={{ display: "flex", flexDirection: "row", margin: "10px" }}>
                    <SubmitBar style={{ marginLeft: "auto", marginRight: "10px" }} label={t("Preview And Save")} onSubmit={generateSchema} />
                    <Button style={{ marginRight: "10px" }} onButtonClick={() => setShowConfirmationModal(true)} label={"Cancel"} variation={"secondary"} />
                </ActionBar>
                {showModal && <SchemaModalComponent generatedSchema={generatedSchema} state={state} setShowModal={setShowModal} />}
                {showConfirmationModal && <Confirmation
                    t={t}
                    heading={"Confirm Cancelation"}
                    docName={"Current Schema"}
                    closeModal={() => setShowConfirmationModal(false)}
                    actionCancelLabel="Cancel"
                    actionCancelOnSubmit={() => setShowConfirmationModal(false)}
                    actionSaveLabel="Delete"
                    actionSaveOnSubmit={() => { { props.setSchemaName(''); props.setShowDynamicForm(false) } }}
                />}
            </div>
        )
    }

    useEffect(() => {
        // Create a copy of orderedFields to avoid mutating state directly
        const newOrderedFields = [...state.orderedFields];
        debugger;

        // Iterate through the fields and check if their names are in orderedFields
        state.fields.forEach((field) => {
            // Find the index of the matching field in newOrderedFields
            const matchingFieldIndex = newOrderedFields.findIndex(item => item.name === field.name);

            if (matchingFieldIndex === -1 && !field.name.includes(".")) {
                // Add the missing field to the end of newOrderedFields
                newOrderedFields.push({ ...field });
            } else if (matchingFieldIndex !== -1) {
                // Update the matching field in newOrderedFields with the new field
                newOrderedFields[matchingFieldIndex] = field;
            }
        });


        // Remove fields from orderedFields that are not present in fields
        newOrderedFields.forEach((orderedField, index) => {
            const nameExistsInFields = state.fields.some(field => field.name === orderedField.name);
            if (!nameExistsInFields) {
                newOrderedFields.splice(index, 1);
            }
        });

        // Update the state with the new orderedFields
        dispatch({ type: 'SET_ORDERED_FIELDS', payload: newOrderedFields });
    }, [state.fields]);
    const handleSchemaSubmit = () => {
        // You can add your schema processing logic here
        // For now, let's just display the parsed JSON
        try {
            const newFields = generateFieldsFromSchema(generatedSchema);
            dispatch({ type: 'SET_FIELDS', payload: newFields });
            const uiOrderNames = generatedSchema.definition["ui:order"];
            const uiOrderFields = uiOrderNames.map((fieldName) => {
                const matchingField = newFields.find((field) => field.name == fieldName);
                return matchingField;
            });
            dispatch({ type: 'SET_ORDERED_FIELDS', payload: uiOrderFields });
            setShowGenerator(true);
            setSchemaName(generatedSchema?.definition?.schemaName)
        } catch (error) {
            alert('Invalid JSON Schema: ' + error.message);
        }
    };

    const toggleView = () => {
        if (showGenerator) {
            generateSchema();
            setShowGenerator(false);
            setShowModal(false);
        }
        else {
            handleSchemaSubmit();
            setShowGenerator(true);
            setGeneratedSchema(null);
            dispatch({ type: 'SET_UPDATING_INDEX', payload: null });
            setSelectedFieldIndex(null);
            dispatch({ type: 'SET_CURRENT_FIELD_NAME', payload: '' });
            dispatch({ type: 'SET_CURRENT_FIELD_TYPE', payload: 'string' });
            dispatch({ type: 'SET_CURRENT_REQUIRED', payload: false });
            dispatch({ type: 'SET_CURRENT_UNIQUE', payload: false });
            dispatch({ type: 'SET_SHOW_CURRENT_FIELD', payload: false });
            dispatch({ type: 'SET_CURRENT_OPTIONS', payload: {} });
            dispatch({ type: 'SET_CURRENT_OBJECT_NAME', payload: '' });
            dispatch({ type: 'SET_OBJECT_MODE', payload: false });
        }
    }

    const handleSchemaInputChange = (event) => {
        setGeneratedSchema(event.jsObject);
    };


    return (
        <div>
            <div>
                Toggle Editor
                <CustomCheckbox onChange={toggleView} label={"Schema Generator"} value={showGenerator} />
            </div>
            {showGenerator ? (
                <div>
                    {showGenerator ? (<div>
                        <header class="h1 digit-form-composer-sub-header">Dynamic Schema Form Generator</header>
                        <h1 style={{ fontWeight: "bolder", fontSize: "20px" }}>{schemaName + " config"}</h1>
                        <div style={{
                            display: "flex",
                            backgroundColor: "#fff",
                            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.16)",
                            padding: "16px",
                            borderRadius: "4px"
                        }}
                        >
                            <div style={{ flex: "25%", border: "1px solid #ccc", margin: "5px", padding: "10px" }}>
                                <FieldSelect
                                    state={state}
                                    addField={addField}
                                    dispatch={dispatch}
                                />
                            </div>
                            <div style={{ flex: "50%", border: "1px solid #ccc", margin: "5px" }}>
                                <FieldEditorComponent
                                    state={state}
                                    updateFieldOption={updateFieldOption}
                                    saveField={saveField}
                                    cancelSave={cancelSave}
                                    dispatch={dispatch}
                                />
                            </div>
                            <div style={{ flex: "25%", border: "1px solid #ccc", margin: "5px", padding: "10px", display: "flex", flexDirection: "column" }}>
                                {state.objectMode && state.currentObjectName &&
                                    <h2 style={{ fontSize: "1.5rem", marginBottom: "10px", borderBottom: "1px solid #ccc", paddingBottom: "10px", color: "#333" }}>
                                        <button onClick={() => {
                                            if (state.currentObjectName && state.currentObjectName.includes('.')) {
                                                const parts = state.currentObjectName.split('.');
                                                parts.pop(); // Remove the last part
                                                const newObjectName = parts.join('.');
                                                dispatch({ type: 'SET_CURRENT_OBJECT_NAME', payload: newObjectName });
                                            } else {
                                                dispatch({ type: 'SET_CURRENT_OBJECT_NAME', payload: '' });
                                                dispatch({ type: 'SET_OBJECT_MODE', payload: false });
                                            }
                                        }} style={{ border: "none", background: "none", cursor: "pointer", color: "blue", textDecoration: "underline" }}>Back</button>
                                        {`${state.currentObjectName.replace(/\./g, ' -> ')}`}
                                    </h2>
                                }
                                {!state.objectMode &&
                                    <h2 style={{ fontSize: "1.5rem", marginBottom: "10px", borderBottom: "1px solid #ccc", paddingBottom: "10px", color: "#333" }}>
                                        Field List
                                    </h2>
                                }
                                <FieldView
                                    state={state}
                                    dispatch={dispatch}
                                    setFieldToUpdate={setFieldToUpdate}
                                    removeField={removeField}
                                />
                            </div>
                        </div>
                        {renderButtons()}
                    </div>) : (null)}
                </div>
            ) : (
                <div>
                    <h2 className="card-label undefined">Paste your schema here:</h2>
                    <JSONInput
                        locale={locale}
                        height='50vh'
                        width='60vw'
                        placeholder={generatedSchema}
                        onChange={handleSchemaInputChange}
                        colors={colorsConfigJson}
                        style={styleConfigJson}
                    />
                </div>
            )}
        </div>
    );
}

export default DynamicSchemaFormGenerator;
