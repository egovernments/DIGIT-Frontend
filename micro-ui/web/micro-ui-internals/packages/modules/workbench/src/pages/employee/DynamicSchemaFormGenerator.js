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
    const [addingFieldType, setAddingFieldType] = useState(null);
    const [selectedFieldIndex, setSelectedFieldIndex] = useState(null); // Track the selected field index
    const [currentRequired, setCurrentRequired] = useState(false);
    const [currentUnique, setCurrentUnique] = useState(false);
    const [currentFieldName, setCurrentFieldName] = useState(''); // State for the current field name being edited
    const [currentFieldType, setCurrentFieldType] = useState('string'); // State for the current field type being edited
    const [currentOptions, setCurrentOptions] = useState({});
    const [showCurrentField, setShowCurrentField] = useState(false);
    const [updatingIndex, setUpdatingIndex] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [objectMode, setObjectMode] = useState(false);
    const [currentObjectName, setCurrentObjectName] = useState("")
    const [lastName, setLastName] = useState("");
    const [selectedArrayType, setSelectedArrayType] = useState({ label: 'String', value: 'string' })
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
        showCurrentField: false
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
            case 'SET_UPDATING_INDEX':
            default:
                return state;
        }
    };
    const [state, dispatch] = useReducer(schemaReducer, initialState);
    const { fields, orderedFields, nameError } = state;

    const addField = () => {
        if (!addingFieldType?.value) {
            dispatch({ type: 'SET_NAME_ERROR', payload: { add: "Select field type first", edit: null } });
        }
        else {
            dispatch({ type: 'SET_NAME_ERROR', payload: { add: null, edit: null } });
            setCurrentFieldName('');
            setCurrentFieldType(addingFieldType?.value);
            setAddingFieldType(null)
            setShowCurrentField(true);
            setSelectedFieldIndex(null);
            setCurrentRequired(false);
            setCurrentUnique(false);
            setSelectedArrayType({ label: 'String', value: 'string' });
            if (addingFieldType?.value == 'array') {
                setCurrentOptions({
                    "arrayType": "string"
                })
            }
            else {
                setCurrentOptions({})
            }
            setUpdatingIndex(null)
        }

    };
    const saveField = () => {
        var fieldName = currentObjectName ? currentObjectName + "." + currentFieldName : currentFieldName
        const nameExists = fields.some((field, index) => field.name == fieldName && index != updatingIndex);
        if (currentFieldName == '') {
            var error = { ...nameError };
            error.edit = "Field name Can't be empty";
            dispatch({ type: 'SET_NAME_ERROR', payload: error });
            return;
        }
        else if (nameExists) {
            var error = { ...nameError };
            error.edit = "Field name already exists";
            dispatch({ type: 'SET_NAME_ERROR', payload: error });
            return;
        }
        else if (currentFieldName.includes('.')) {
            var error = { ...nameError };
            error.edit = "Field name should not contain dots";
            dispatch({ type: 'SET_NAME_ERROR', payload: error });
            return;
        }
        if (currentFieldType == 'object' || (currentFieldType == 'array' && selectedArrayType?.value == 'object')) {
            setObjectMode(true);
            setCurrentObjectName(fieldName);
        }
        dispatch({ type: 'SET_NAME_ERROR', payload: { add: null, edit: null } });
        var newField = { name: currentFieldName, type: currentFieldType, options: currentOptions, required: currentRequired, unique: currentUnique };
        if (updatingIndex != null && updatingIndex != undefined) {
            if (currentObjectName) {
                newField.name = currentObjectName + "." + currentFieldName;
            }
            var updatedField = [...fields];
            updatedField[updatingIndex] = newField;
            updatedField.map(field => {
                // Check if the field name has the prefix "lastName."
                if (field.name.startsWith(lastName + ".")) {
                    // Extract the part of the name after the prefix and append it to the newField.name
                    const suffix = field.name.substring((lastName + ".").length);
                    field.name = newField.name + "." + suffix;
                }
                return field;
            });
            dispatch({ type: 'SET_FIELDS', payload: updatedField });
            setUpdatingIndex(null);
        }
        else {
            if (currentObjectName) {
                newField.name = currentObjectName + "." + currentFieldName;
            }
            var updatedFields = [...fields];
            updatedFields.push(newField);
            dispatch({ type: 'SET_FIELDS', payload: updatedFields });
        }
        setSelectedFieldIndex(null);
        setCurrentFieldName('');
        setCurrentFieldType('string');
        setCurrentRequired(false);
        setCurrentUnique(false);
        setShowCurrentField(false);
        setSelectedArrayType({ label: 'String', value: 'string' });
        setCurrentOptions({})
    }
    const cancelSave = () => {
        setUpdatingIndex(null);
        setSelectedFieldIndex(null);
        setCurrentFieldName('');
        setCurrentFieldType('string');
        setCurrentRequired(false);
        setCurrentUnique(false);
        setShowCurrentField(false);
        setCurrentOptions({})
    }

    const removeField = (index) => {
        const updatedFields = [...fields];
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
        if (updatingIndex === index) {
            setUpdatingIndex(null);
            setSelectedFieldIndex(null);
            setCurrentFieldName('');
            setCurrentFieldType('string');
            setCurrentRequired(false);
            setCurrentUnique(false);
            setShowCurrentField(false);
            setCurrentOptions({});
        }
    };


    const setFieldToUpdate = (index) => {

        setUpdatingIndex(index);
        // Split the name by dots, and get the last element of the resulting array
        const nameParts = fields[index].name.split('.');
        const lastNamePart = nameParts[nameParts.length - 1];
        setCurrentFieldName(lastNamePart);
        setCurrentFieldType(fields[index].type);
        setCurrentOptions(fields[index].options);
        if (fields[index].type == 'array') {
            setSelectedArrayType({
                label: fields[index].options.arrayType.charAt(0).toUpperCase() + fields[index].options.arrayType.slice(1),
                value: fields[index].options.arrayType
            });
        }
        setCurrentRequired(fields[index].required);
        setCurrentUnique(fields[index].unique);
        setShowCurrentField(true);
    };



    const updateFieldOption = (optionName, optionValue) => {
        var updatedOptions = { ...currentOptions };
        if (optionValue === '' || optionValue === null || optionValue === undefined) {
            // If optionValue is empty, null, or undefined, delete optionName from updatedOptions
            delete updatedOptions[optionName];
        } else {
            updatedOptions[optionName] = optionValue;
        }
        setCurrentOptions(updatedOptions);
    };




    const generateSchema = () => {

        if (fields.length === 0) {
            // If the fields array is empty, set an error message
            dispatch({ type: 'SET_UNIQUE_ERROR', payload: "At least one field is required to generate the schema." });
            setGeneratedSchema(null); // Reset the schema
            setShowModal(true);
        } else {
            // Deep clone the fields array
            const clonedFields = deepClone(fields);

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

            orderedFields.map((field) => {
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
        const newFilteredObjectFields = fields.filter((field) => {
            if (currentObjectName) {
                // Check if the field name starts with the currentObjectName or its prefixes
                const prefix = currentObjectName + '.';
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
    }, [fields, currentObjectName]);


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
        const newOrderedFields = [...orderedFields];

        // Iterate through the fields and check if their names are in orderedFields
        fields.forEach((field) => {
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
            const nameExistsInFields = fields.some(field => field.name === orderedField.name);
            if (!nameExistsInFields) {
                newOrderedFields.splice(index, 1);
            }
        });

        // Update the state with the new orderedFields
        dispatch({ type: 'SET_ORDERED_FIELDS', payload: newOrderedFields });
    }, [fields]);
    const handleSchemaSubmit = () => {
        // You can add your schema processing logic here
        // For now, let's just display the parsed JSON
        try {
            const newFields = generateFieldsFromSchema(generatedSchema);
            dispatch({ type: 'SET_FIELDS', payload: newFields });
            const uiOrderNames = generatedSchema.definition["ui:order"];
            debugger;
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
            setUpdatingIndex(null);
            setSelectedFieldIndex(null);
            setCurrentFieldName('');
            setCurrentFieldType('string');
            setCurrentRequired(false);
            setCurrentUnique(false);
            setShowCurrentField(false);
            setCurrentOptions({})
            setObjectMode(false);
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
                                    addingFieldType={addingFieldType}
                                    setAddingFieldType={setAddingFieldType}
                                    state={state}
                                    addField={addField}
                                />
                            </div>
                            <div style={{ flex: "50%", border: "1px solid #ccc", margin: "5px" }}>
                                <FieldEditorComponent
                                    objectMode={objectMode}
                                    updatingIndex={updatingIndex}
                                    showCurrentField={showCurrentField}
                                    currentRequired={currentRequired}
                                    currentUnique={currentUnique}
                                    currentFieldName={currentFieldName}
                                    setCurrentFieldName={setCurrentFieldName}
                                    state={state}
                                    currentFieldType={currentFieldType}
                                    currentOptions={currentOptions}
                                    updateFieldOption={updateFieldOption}
                                    saveField={saveField}
                                    cancelSave={cancelSave}
                                    setCurrentRequired={setCurrentRequired}
                                    setCurrentUnique={setCurrentUnique}
                                    selectedArrayType={selectedArrayType}
                                    setSelectedArrayType={setSelectedArrayType}
                                />
                            </div>
                            <div style={{ flex: "25%", border: "1px solid #ccc", margin: "5px", padding: "10px", display: "flex", flexDirection: "column" }}>
                                {objectMode && currentObjectName &&
                                    <h2 style={{ fontSize: "1.5rem", marginBottom: "10px", borderBottom: "1px solid #ccc", paddingBottom: "10px", color: "#333" }}>
                                        <button onClick={() => {
                                            if (currentObjectName && currentObjectName.includes('.')) {
                                                const parts = currentObjectName.split('.');
                                                parts.pop(); // Remove the last part
                                                const newObjectName = parts.join('.');
                                                setCurrentObjectName(newObjectName);
                                            } else {
                                                setCurrentObjectName('');
                                                setObjectMode(false);
                                            }
                                        }} style={{ border: "none", background: "none", cursor: "pointer", color: "blue", textDecoration: "underline" }}>Back</button>
                                        {`${currentObjectName.replace(/\./g, ' -> ')}`}
                                    </h2>
                                }
                                {!objectMode &&
                                    <h2 style={{ fontSize: "1.5rem", marginBottom: "10px", borderBottom: "1px solid #ccc", paddingBottom: "10px", color: "#333" }}>
                                        Field List
                                    </h2>
                                }
                                <FieldView
                                    objectMode={objectMode}
                                    state={state}
                                    dispatch={dispatch}
                                    setFieldToUpdate={setFieldToUpdate}
                                    removeField={removeField}
                                    setLastName={setLastName}
                                    setCurrentObjectName={setCurrentObjectName}
                                    setObjectMode={setObjectMode}
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
