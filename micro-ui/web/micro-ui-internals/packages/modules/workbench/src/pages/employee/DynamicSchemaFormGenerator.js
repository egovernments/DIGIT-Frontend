import React, { useEffect, useState } from 'react';
import { Button } from "@egovernments/digit-ui-react-components"
import FieldView from '../../components/FieldView';
import FieldSelect from '../../components/FieldSelect';
import SchemaModalComponent from '../../components/SchemaModalComponent';
import FieldEditorComponent from '../../components/FieldEditorComponent';

function DynamicSchemaFormGenerator(props) {
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
    const tenantId = Digit.ULBService.getCurrentTenantId();


    const fieldTypes = [
        { label: 'String', value: 'string' },
        { label: 'Number', value: 'number' },
        { label: 'Boolean', value: 'boolean' },
        { label: 'Date', value: 'date' },
        { label: 'Date-Time', value: 'date-time' },
    ];

    const propertyMap = {
        'string': ['minLength', 'maxLength', 'pattern', 'format'],
        'number': ['multipleOf', 'minimum', 'maximum', 'exclusiveMinimum', 'exclusiveMaximum'],
        'date': ['minimum', 'maximum', 'exclusiveMinimum', 'exclusiveMaximum'],
        'date-time': ['minimum', 'maximum', 'exclusiveMinimum', 'exclusiveMaximum'],
        'boolean': [],
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
        var newField = { name: currentFieldName, type: currentFieldType, options: currentOptions, required: currentRequired, unique: currentUnique };
        if (updatingIndex != null && updatingIndex != undefined) {
            var updatedField = [...fields];
            updatedField[updatingIndex] = newField;
            setFields(updatedField)
            setUpdatingIndex(null);
        }
        else {
            setFields([...fields, newField]);
            setUpdatingIndex(null);
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
        setUpdatingIndex(index);
        setCurrentFieldName(fields[index].name)
        setCurrentFieldType(fields[index].type)
        setCurrentOptions(fields[index].options)
        setCurrentRequired(fields[index].required)
        setCurrentUnique(fields[index].unique)
        setShowCurrentField(true)
    };


    const updateFieldOption = (optionName, optionValue) => {
        var updatedOptions = { ...currentOptions };
        updatedOptions[optionName] = optionValue;
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
                    <h2 style={{ fontSize: "1.5rem", marginBottom: "10px", borderBottom: "1px solid #ccc", paddingBottom: "10px", color: "#333" }}>Field List</h2>
                    <FieldView
                        orderedFields={orderedFields}
                        setOrderedFields={setOrderedFields}
                        fields={fields}
                        setFieldToUpdate={setFieldToUpdate}
                        removeField={removeField}
                    />
                </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", margin: "10px" }}>
                <div style={{ marginLeft: "auto", marginRight: "10px" }}>
                    <Button onButtonClick={generateSchema} label={"Preview And Save"} />
                </div>
                {showModal && <SchemaModalComponent generatedSchema={generatedSchema} uniqueError={uniqueError} setShowModal={setShowModal} />}
            </div>
        </div>
    );
}

export default DynamicSchemaFormGenerator;
