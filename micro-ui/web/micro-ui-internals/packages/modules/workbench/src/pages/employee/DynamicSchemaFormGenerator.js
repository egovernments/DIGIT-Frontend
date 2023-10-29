import React, { useEffect, useState } from 'react';
import { Button, Close, DeleteIcon, Dropdown, EditIcon, TextInput, CheckBox } from "@egovernments/digit-ui-react-components"
import FieldView from '../../components/FieldView';

function DynamicSchemaFormGenerator(props) {
    const [fields, setFields] = useState([]);
    const [orderedFields, setOrderedFields] = useState([]);
    const [generatedSchema, setGeneratedSchema] = useState(null);
    const [selectedProperty, setSelectedProperty] = useState('');
    // const [addingFieldName, setAddingFieldName] = useState('');
    const [addingFieldType, setAddingFieldType] = useState(null);
    const [selectedFieldIndex, setSelectedFieldIndex] = useState(null); // Track the selected field index
    // const [isAddingField, setIsAddingField] = useState(null);
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
            // setAddingFieldName('');
            setAddingFieldType(null)
            setSelectedProperty('')
            // setIsAddingField(false);
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
        setSelectedProperty('')
        // setIsAddingField(false);
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
        setSelectedProperty('')
        // setIsAddingField(false);
        setShowCurrentField(false);
        setCurrentOptions({})
    }

    const removeField = (index) => {
        console.log(index, " iiiiiiiiiiii")
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
            setSelectedProperty('')
            // setIsAddingField(false);
            setShowCurrentField(false);
            setCurrentOptions({})
        }
    };

    const updateSelectedProperty = (property) => {
        setSelectedProperty(property);
    };

    const deleteFilledProperty = (property) => {
        var updatedOptions = { ...currentOptions };
        delete updatedOptions[property];
        setCurrentOptions(updatedOptions);
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
        if (fields.length == 0) {
            // If the fields array is empty, set an error message
            setUniqueError("At least one field is required to generate the schema.");
            setGeneratedSchema(null); // Reset the schema
            setShowModal(true);
        } else {
            const schema = {
                schemaName: props.schemaName,
                type: 'object',
                properties: {},
                required: [],
                'x-unique': [],
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

            if (!uniqueFound) {
                // Show an error or take the appropriate action for no unique fields
                // For example, you can set an error message or prevent schema generation
                // Here, I'm just setting an error message to state
                setUniqueError("At least one unique field is required.");
                setGeneratedSchema(null); // Reset the schema
            } else {
                // No error, set the schema as generated
                setUniqueError(null); // Clear any previous error
                setGeneratedSchema(schema);
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
                    <div className='label-field-pair'>
                        <h2 className="card-label">Type</h2>
                        <Dropdown
                            selected={addingFieldType}
                            option={fieldTypes}
                            optionKey="label" // Replace with the correct key for the options
                            select={(value) => { setAddingFieldType(value) }}
                            showArrow={true}
                            t={(text) => text} // Replace with your translation function
                            style={{ width: '100%' }} // Add your desired styles
                            showSearchIcon={false} // Adjust this as needed
                            disable={false} // Set to true or false based on your requirements
                            autoComplete="off"
                            placeholder="Select a Type"
                        />
                    </div>
                    {nameError?.add && (
                        <div>
                            <span style={{ color: "red" }}>{nameError.add}</span>
                        </div>
                    )}
                    <div style={{ display: "grid" }}>
                        <Button style={{ justifySelf: "flex-end" }} onButtonClick={addField} label={"Add Field"} />
                    </div>

                </div>
                <div style={{ flex: "50%", border: "1px solid #ccc", margin: "5px" }}>
                    {showCurrentField ? (
                        <div>
                            <div style={{ marginLeft: "10px" }}>
                                <CheckBox
                                    label="Required"
                                    checked={currentRequired}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setCurrentRequired(true);
                                            setRequiredError(null);
                                        } else {
                                            if (!currentUnique) {
                                                setCurrentRequired(false);
                                                setRequiredError(null);
                                            } else {
                                                setRequiredError("First make the 'Unique' checkbox unchecked.");
                                            }
                                        }
                                    }}
                                />

                                <CheckBox
                                    label="Unique"
                                    checked={currentUnique}
                                    onChange={(e) => {
                                        setCurrentUnique(e.target.checked);
                                        setRequiredError(null);
                                        if (e.target.checked) {
                                            setCurrentRequired(true);
                                        }
                                    }}
                                />
                            </div>

                            {requiredError && <span style={{ color: "red", margin: "5px", fontSize: "15px" }}>{requiredError}</span>}
                            <div className='workbench-space-between' style={{ marginRight: "10px", marginLeft: "10px", display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                                <div className='label-field-pair'>
                                    <div style={{ backgroundColor: "#fff !important" }}>
                                        <h2 class="card-label undefined">Field Name *</h2>
                                        <TextInput
                                            type="text"
                                            value={currentFieldName}
                                            onChange={(e) => setCurrentFieldName(e.target.value)}
                                            customClass="employee-card-input"
                                            style={{ backgroundColor: "white" }}
                                        />

                                        {nameError.edit && <div style={{ fontSize: "15px", color: "red" }}>{nameError.edit}</div>}
                                    </div>
                                </div>
                                <div className='label-field-pair'>
                                    <h2 class="card-label">Type</h2>
                                    <Dropdown
                                        selected={{
                                            label: currentFieldType.charAt(0).toUpperCase() + currentFieldType.slice(1),
                                            value: currentFieldType,
                                        }}
                                        option={fieldTypes}
                                        optionKey="label"
                                        t={(text) => text}
                                        style={{ width: '100%' }}
                                        className="dropdown-zIndex0"
                                        disable={true}
                                    />
                                </div>
                                {propertyMap[currentFieldType].map((property) => (
                                    <div className='label-field-pair' key={property}>
                                        <h2 className="card-label">{property}</h2>
                                        <TextInput
                                            type={currentFieldType === 'date-time' ? 'datetime-local' : (property === 'pattern' || property === 'format' ? 'text' : (currentFieldType.includes('date') ? 'date' : 'number'))}
                                            value={currentOptions[property] || ''}
                                            onChange={(e) => updateFieldOption(property, e.target.value)}
                                            customClass="employee-card-input"
                                            style={{ backgroundColor: "white" }}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: "flex", flexDirection: "row", marginLeft: "10px", marginBottom: "10px" }}>
                                {/* <div style={{ marginLeft: "auto" }}> */}
                                <Button
                                    onButtonClick={() => saveField()}
                                    label={"Save Field"}
                                    style={{ marginRight: "10px", marginLeft: "auto" }}
                                />
                                <Button
                                    onButtonClick={() => cancelSave()}
                                    label={"Cancel"}
                                    style={{ marginRight: "10px" }}
                                    variation={"secondary"}
                                />
                                {/* </div> */}
                            </div>
                        </div>

                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
                            <p style={{ fontSize: "16px", fontWeight: "bold" }}>Add a field or select a field to edit</p>
                        </div>
                    )}
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
                {showModal && (
                    <div
                        style={{
                            position: "fixed",
                            top: "0",
                            left: "0",
                            width: "100%",
                            height: "100%",
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <div
                            style={{
                                position: "absolute",
                                backgroundColor: "#fff",
                                boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
                                maxWidth: "80%",
                                textAlign: "left",
                                padding: "20px",
                                minWidth: "500px",
                                zIndex: "999"
                            }}
                        >
                            <div
                                style={{
                                    position: "absolute",
                                    top: "0px",
                                    right: "0px",
                                    backgroundColor: "white",
                                    border: "none",
                                    textAlign: "center",
                                    textDecoration: "none",
                                    display: "inline-block",
                                    fontSize: "16px",
                                    cursor: "pointer",
                                    zIndex: "999"
                                }}
                                onClick={() => setShowModal(false)}
                            >
                                <Close />
                            </div>
                            <div style={{ overflow: "auto", maxHeight: "500px" }}>
                                {generatedSchema && (
                                    <div>
                                        <h2 style={{ fontWeight: "bold" }}>Schema : </h2>
                                        <pre>{JSON.stringify(generatedSchema, null, 2)}</pre>
                                    </div>
                                )}
                                {uniqueError && (
                                    <div>
                                        <span style={{ color: "red" }}>{uniqueError}</span>
                                    </div>
                                )}
                            </div>
                            {generatedSchema ? (
                                <Button
                                    // onButtonClick={} // Add your save function here
                                    style={{
                                        padding: "10px 20px",
                                        cursor: "pointer",
                                        marginTop: "20px",
                                        zIndex: "999"
                                    }}
                                    label={"Save"}
                                />
                            ) : (null)}
                        </div>
                    </div>
                )}



            </div>
        </div>
    );
}

export default DynamicSchemaFormGenerator;
