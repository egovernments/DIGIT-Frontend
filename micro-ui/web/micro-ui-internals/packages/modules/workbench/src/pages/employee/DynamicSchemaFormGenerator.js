import React, { useEffect, useState } from 'react';
import { ActionBar, Button, SubmitBar } from "@egovernments/digit-ui-react-components"
import FieldView from '../../components/FieldView';
import FieldSelect from '../../components/FieldSelect';
import SchemaModalComponent from '../../components/SchemaModalComponent';
import FieldEditorComponent from '../../components/FieldEditorComponent';
import Confirmation from '../../../../engagement/src/components/Modal/Confirmation';
import { useTranslation } from 'react-i18next';

function DynamicSchemaFormGenerator(props) {
    const { t } = useTranslation();
    const [fields, setFields] = useState([]);
    const [orderedFields, setOrderedFields] = useState([]);
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
    const [nameError, setNameError] = useState({ add: null, edit: null });
    const [uniqueError, setUniqueError] = useState(false);
    const [requiredError, setRequiredError] = useState(null)
    const [showModal, setShowModal] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [objectMode, setObjectMode] = useState(false);
    const [currentObjectName, setCurrentObjectName] = useState("")
    const [objectFields, setObjectFields] = useState([]);
    const [filteredObjectFields, setFilteredObjectFields] = useState([]);
    const tenantId = Digit.ULBService.getCurrentTenantId();


    const fieldTypes = [
        { label: 'String', value: 'string' },
        { label: 'Number', value: 'number' },
        { label: 'Boolean', value: 'boolean' },
        { label: 'Date', value: 'date' },
        { label: 'Date-Time', value: 'date-time' },
        { label: 'Object', value: 'object' },
    ];

    const propertyMap = {
        'string': ['minLength', 'maxLength', 'pattern', 'format'],
        'number': ['multipleOf', 'minimum', 'maximum', 'exclusiveMinimum', 'exclusiveMaximum'],
        'date': ['minimum', 'maximum', 'exclusiveMinimum', 'exclusiveMaximum'],
        'date-time': ['minimum', 'maximum', 'exclusiveMinimum', 'exclusiveMaximum'],
        'boolean': [],
        'object': []
    };

    const addField = () => {
        if (!addingFieldType?.value) {
            setNameError({ add: "Select field type first", edit: null });
        }
        else {
            setNameError({ add: null, edit: null });
            setCurrentFieldName('');
            setCurrentFieldType(addingFieldType?.value);
            setAddingFieldType(null)
            setShowCurrentField(true);
            setSelectedFieldIndex(null);
            setCurrentRequired(false);
            setCurrentUnique(false);
            setCurrentOptions({})
            setUpdatingIndex(null)
        }

    };
    const saveField = () => {
        const nameExists = fields.some((field, index) => field.name == currentFieldName && index != updatingIndex);
        if (currentFieldName == '') {
            var error = { ...nameError };
            error.edit = "Field name Can't be empty";
            setNameError(error);
            return;
        }
        else if (nameExists) {
            var error = { ...nameError };
            error.edit = "Field name already exists";
            setNameError(error);
            return;
        }
        setNameError({ add: null, edit: null });
        var fieldName = currentFieldName;
        if (currentFieldType == 'object') {
            setObjectMode(true);
            if (currentObjectName == '') {
                setCurrentObjectName(currentFieldName);
            }
            else {
                fieldName = currentObjectName + "." + currentFieldName;
                setCurrentObjectName(fieldName)
            }
        }
        var newField = { name: fieldName, type: currentFieldType, options: currentOptions, required: currentRequired, unique: currentUnique };
        if (currentFieldType == 'object') {
            var updatedObjectFields = [...objectFields];
            updatedObjectFields.push(newField);
            setObjectFields(updatedObjectFields);
            if (!fieldName.includes('.')) {
                setFields([...fields, newField]);
                setUpdatingIndex(null);
            }
        }
        else {
            if (currentObjectName) {
                if (updatingIndex != null && updatingIndex != undefined) {
                    newField.name = currentObjectName + "." + currentFieldName;
                    var updatedField = [...filteredObjectFields];
                    updatedField[updatingIndex] = newField;
                    setFilteredObjectFields(updatedField)
                    setUpdatingIndex(null);
                }
                else {
                    newField.name = currentObjectName + "." + currentFieldName;
                    var updatedObjectFields = [...objectFields];
                    updatedObjectFields.push(newField);
                    setObjectFields(updatedObjectFields);
                }
            }
            if (updatingIndex != null && updatingIndex != undefined) {
                var updatedField = [...fields];
                updatedField[updatingIndex] = newField;
                setFields(updatedField)
                setUpdatingIndex(null);
            }
            else {
                if (!newField.name.includes('.')) {
                    setFields([...fields, newField]);
                    setUpdatingIndex(null);
                }
            }
        }
        setSelectedFieldIndex(null);
        setCurrentFieldName('');
        setCurrentFieldType('string');
        setCurrentRequired(false);
        setCurrentUnique(false);
        setShowCurrentField(false);
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
        updatedFields.splice(index, 1);
        setFields(updatedFields);

        // Clear the selected field if it was removed
        if (selectedFieldIndex === index) {
            setSelectedFieldIndex(null);
        }
        if (updatingIndex == index) {
            setUpdatingIndex(null);
            setSelectedFieldIndex(null);
            setCurrentFieldName('');
            setCurrentFieldType('string');
            setCurrentRequired(false);
            setCurrentUnique(false);
            setShowCurrentField(false);
            setCurrentOptions({})
        }
    };

    const setFieldToUpdate = (index) => {
        console.log(" sssssssssss")
        setUpdatingIndex(index);
        if (objectMode) {
            setCurrentFieldName(filteredObjectFields[index].name.lastIndexOf('.') > -1 ? filteredObjectFields[index].name.substring(filteredObjectFields[index].name.lastIndexOf('.') + 1) : filteredObjectFields[index].name);
            setCurrentFieldType(filteredObjectFields[index].type)
            setCurrentOptions(filteredObjectFields[index].options)
            setCurrentRequired(filteredObjectFields[index].required)
            setCurrentUnique(filteredObjectFields[index].unique)
            setShowCurrentField(true)
            console.log(filteredObjectFields[index], " ffffffffffffff");
        }
        else {
            setCurrentFieldName(fields[index].name)
            setCurrentFieldType(fields[index].type)
            setCurrentOptions(fields[index].options)
            setCurrentRequired(fields[index].required)
            setCurrentUnique(fields[index].unique)
            setShowCurrentField(true)
        }
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
            setUniqueError("At least one field is required to generate the schema.");
            setGeneratedSchema(null); // Reset the schema
            setShowModal(true);
        } else {
            const schema = {
                schemaName: props.schemaName,
                type: 'object',
                "$schema": "http://json-schema.org/draft-07/schema#",
                properties: {},
                required: [],
                'x-unique': [],
                'ui:order': [], // Initialize ui:order array
            };

            // Track whether at least one unique field is found
            let uniqueFound = false;

            fields.forEach((field) => {
                const typeSchema = {
                    type: field.type,
                    required: field.required,
                };

                schema.properties[field.name] = typeSchema;
                for (const [optionName, optionValue] of Object.entries(field.options)) {
                    schema.properties[field.name][optionName] = optionValue;
                }

                if (field.required) {
                    schema.required.push(field.name);
                }

                if (field.unique) {
                    schema['x-unique'].push(field.name);
                    uniqueFound = true; // Mark that a unique field was found
                }
            });
            orderedFields.map((field) => {
                schema['ui:order'].push(field.name);
            })

            if (!uniqueFound) {
                setUniqueError("At least one unique field is required.");
                setGeneratedSchema(null); // Reset the schema
            } else {
                // No error, set the schema as generated
                setUniqueError(null); // Clear any previous error
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
        const newFilteredObjectFields = objectFields.filter((field) => {
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
        setFilteredObjectFields(newFilteredObjectFields);
    }, [objectFields, currentObjectName]);

    const renderButtons = () => {
        return (
            <div >
                <ActionBar style={{ display: "flex", flexDirection: "row", margin: "10px" }}>
                    <SubmitBar style={{ marginLeft: "auto", marginRight: "10px" }} label={t("Preview And Save")} onSubmit={generateSchema} />
                    <Button style={{ marginRight: "10px" }} onButtonClick={() => setShowConfirmationModal(true)} label={"Cancel"} variation={"secondary"} />
                </ActionBar>
                {showModal && <SchemaModalComponent generatedSchema={generatedSchema} uniqueError={uniqueError} setShowModal={setShowModal} />}
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
        fields.forEach((field, index) => {
            const nameExistsInOrderedFields = newOrderedFields.some(item => item.name === field.name);
            if (!nameExistsInOrderedFields) {
                // Add the missing field to the end of orderedFields
                newOrderedFields.push({
                    ...field, // Add all keys of the field element
                });
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
        setOrderedFields(newOrderedFields);
    }, [fields]);


    return (
        <div>
            <header class="h1 digit-form-composer-sub-header">Dynamic Schema Form Generator</header>
            <h1 style={{ fontWeight: "bolder", fontSize: "20px" }}>{props.schemaName + " config"}</h1>
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
                        nameError={nameError}
                        addField={addField}
                        fieldTypes={fieldTypes}
                    />
                </div>
                <div style={{ flex: "50%", border: "1px solid #ccc", margin: "5px" }}>
                    <FieldEditorComponent
                        showCurrentField={showCurrentField}
                        currentRequired={currentRequired}
                        currentUnique={currentUnique}
                        requiredError={requiredError}
                        currentFieldName={currentFieldName}
                        setCurrentFieldName={setCurrentFieldName}
                        nameError={nameError}
                        currentFieldType={currentFieldType}
                        fieldTypes={fieldTypes}
                        propertyMap={propertyMap}
                        currentOptions={currentOptions}
                        updateFieldOption={updateFieldOption}
                        saveField={saveField}
                        cancelSave={cancelSave}
                        setCurrentRequired={setCurrentRequired}
                        setCurrentUnique={setCurrentUnique}
                        setRequiredError={setRequiredError}
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
                        orderedFields={objectMode ? filteredObjectFields : orderedFields}
                        setOrderedFields={setOrderedFields}
                        fields={objectMode ? filteredObjectFields : fields}
                        setFieldToUpdate={setFieldToUpdate}
                        removeField={removeField}
                    />
                </div>
            </div>
            {renderButtons()}
        </div>
    );
}

export default DynamicSchemaFormGenerator;
