import React, { useState } from 'react';
import { Button } from "@egovernments/digit-ui-react-components"

function DynamicSchemaFormGenerator(props) {
    const [fields, setFields] = useState([]);
    const [generatedSchema, setGeneratedSchema] = useState(null);
    const [selectedProperty, setSelectedProperty] = useState('');
    const [addingFieldName, setAddingFieldName] = useState('');
    const [addingFieldType, setAddingFieldType] = useState('string');
    const [selectedFieldIndex, setSelectedFieldIndex] = useState(null); // Track the selected field index
    const [isAddingField, setIsAddingField] = useState(null);
    const [currentRequired, setCurrentRequired] = useState(false);
    const [currentUnique, setCurrentUnique] = useState(false);
    const [currentFieldName, setCurrentFieldName] = useState(''); // State for the current field name being edited
    const [currentFieldType, setCurrentFieldType] = useState('string'); // State for the current field type being edited
    const [currentOptions, setCurrentOptions] = useState({});
    const [showCurrentField, setShowCurrentField] = useState(false);
    const [updatingIndex, setUpdatingIndex] = useState(null);


    const fieldTypes = ['string', 'number', 'boolean', 'date', 'date-time'];
    const propertyMap = {
        'string': ['minLength', 'maxLength', 'pattern', 'format'],
        'number': ['multipleOf', 'minimum', 'maximum', 'exclusiveMinimum', 'exclusiveMaximum'],
        'date': ['minimum', 'maximum', 'exclusiveMinimum', 'exclusiveMaximum'],
        'date-time': ['minimum', 'maximum', 'exclusiveMinimum', 'exclusiveMaximum'],
        'boolean': [],
    };

    const addField = () => {
        setCurrentFieldName(addingFieldName);
        setCurrentFieldType(addingFieldType);
        setAddingFieldName('');
        setAddingFieldType('string')
        setSelectedProperty('')
        setIsAddingField(false);
        setShowCurrentField(true);
        setSelectedFieldIndex(null);
        setCurrentRequired(false);
        setCurrentUnique(false);
        setCurrentOptions({})
        setUpdatingIndex(null)
    };
    const saveField = () => {
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
        setIsAddingField(false);
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
    };

    const updateFieldName = (index, name) => {
        const updatedFields = [...fields];
        updatedFields[index].name = name;
        setFields(updatedFields);
    };

    const updateFieldType = (index, type) => {
        const updatedFields = [...fields];
        updatedFields[index].type = type;
        updatedFields[index].options = {};
        setFilledProperties([]); // Reset filled properties when the field type changes
        setSelectedProperty('');
        setFields(updatedFields);
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

        const schema = {
            schemaName: props.schemaName,
            type: 'object',
            properties: {},
            required: [],
            'x-unique': [],
        };
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
            }
        });

        setGeneratedSchema(schema);
    };


    return (
        <div className='app-container workbench'>
            <header class="h1 digit-form-composer-sub-header">Dynamic Schema Form Generator</header>
            <h1 style={{ fontWeight: "bolder", fontSize: "20px" }}>{props.schemaName + " config"}</h1>
            <div style={{ display: "flex" }}>
                <div style={{ flex: "33%", border: "1px solid #ccc", margin: "5px", padding: "10px" }}>
                    {isAddingField ? (
                        <div>
                            <div className='label-field-pair'>
                                <div style={{ backgroundColor: "#fff !important" }}>
                                    <h2 className="card-label undefined">Field Name</h2>
                                    <input
                                        type="text"
                                        value={addingFieldName}
                                        className='employee-card-input false focus-visible undefined undefined'
                                        onChange={(e) => setAddingFieldName(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className='label-field-pair'>
                                <h2 class="card-label">Type</h2>
                                <div>
                                    <select
                                        value={addingFieldType}
                                        className='workbench-schema-select employee-card-input'
                                        onChange={(e) => setAddingFieldType(e.target.value)}
                                    >
                                        {fieldTypes.map((type) => (
                                            <option value={type} key={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <Button onButtonClick={addField} label={"Add Field"} />
                            <Button onButtonClick={() => setIsAddingField(false)} label={"Cancel"} />
                        </div>

                    ) : null}
                    {!isAddingField ? (
                        <Button onButtonClick={() => setIsAddingField(true)} label={"Add a new field"} />
                    ) : null}
                </div>
                <div style={{ flex: "33%", border: "1px solid #ccc", margin: "5px", padding: "10px" }}>
                    {showCurrentField ? (
                        <div>
                            <div style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
                                <div style={{ display: "flex", flexDirection: "row" }}>
                                    <div>
                                        <input
                                            type="checkbox"
                                            checked={currentRequired}
                                            onChange={(e) => setCurrentRequired(e.target.checked)}
                                        />
                                        <label>Required</label>
                                    </div>
                                    <div>
                                        <input
                                            type="checkbox"
                                            checked={currentUnique}
                                            onChange={(e) => setCurrentUnique(e.target.checked)}
                                        />
                                        <label>Unique</label>
                                    </div>
                                </div>
                                <div className='workbench-space-between'>
                                    <div style={{ marginRight: "16px", width: "100%" }}>
                                        <div className='label-field-pair'>
                                            <div style={{ backgroundColor: "#fff !important" }}>
                                                <h2 class="card-label undefined">Field Name</h2>
                                                <input
                                                    type="text"
                                                    value={currentFieldName}
                                                    className='employee-card-input false focus-visible undefined undefined'
                                                    onChange={(e) => setCurrentFieldName(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className='label-field-pair'>
                                            <h2 class="card-label">Type</h2>
                                            <div>
                                                <select
                                                    value={currentFieldType}
                                                    className='workbench-schema-select employee-card-input'
                                                    onChange={(e) => setCurrentFieldType(e.target.value)}
                                                >
                                                    {fieldTypes.map((type) => (
                                                        <option value={type} key={type}>{type}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        {propertyMap[currentFieldType].length > 0 ? (
                                            <div className='label-field-pair'>
                                                <h2 className="card-label">Property</h2>
                                                <div>
                                                    <select
                                                        value={selectedProperty}
                                                        className='workbench-schema-select employee-card-input'
                                                        onChange={(e) => updateSelectedProperty(e.target.value)}
                                                    >
                                                        <option value=''>Select Property</option>
                                                        {propertyMap[currentFieldType].map((property) => (
                                                            <option value={property} key={property}>{property}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        ) : null}
                                        {selectedProperty && (
                                            <div style={{ width: "100%" }}>
                                                <div className='label-field-pair'>
                                                    <h2 className="card-label">{selectedProperty}</h2>
                                                    <input
                                                        type={currentFieldType === 'date-time' ? 'datetime-local' : (selectedProperty === 'pattern' || selectedProperty === 'format' ? 'text' : (currentFieldType.includes('date') ? 'date' : 'number'))}
                                                        value={currentOptions[selectedProperty] || ''}
                                                        className='employee-card-input'
                                                        onChange={(e) => updateFieldOption(selectedProperty, e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        <button
                                            onClick={() => saveField()}
                                            style={{ padding: "5px", background: "green", color: "white", border: "none", cursor: "pointer" }}
                                        >
                                            Save Field
                                        </button>
                                    </div>
                                    <div style={{ marginRight: "16px", width: "100%", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                        {Object.entries(currentOptions).map(([property, value], filledIndex) => (
                                            <div key={filledIndex} style={{ display: "flex", flexDirection: "row", alignItems: "center", marginBottom: "5px" }}>
                                                <span style={{ fontWeight: "bold", padding: "5px" }}>{property}:</span>
                                                <span style={{ padding: "5px" }}>{value}</span>
                                                <button
                                                    onClick={() => deleteFilledProperty(property)}
                                                    style={{ marginLeft: "10px", padding: "5px", background: "red", color: "white", border: "none", cursor: "pointer" }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>

                <div style={{ flex: "33%", border: "1px solid #ccc", margin: "5px", padding: "10px" }}>
                    <h2>Field List</h2>
                    {fields.map((field, index) => (
                        <div key={index} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                            <span>{field.name}</span>
                            <button
                                style={{ marginLeft: "10px", padding: "5px", background: "Blue", color: "white", border: "none", cursor: "pointer" }}
                                onClick={() => setFieldToUpdate(index)}
                            >Edit</button>
                            <button
                                style={{ marginLeft: "10px", padding: "5px", background: "red", color: "white", border: "none", cursor: "pointer" }}
                                onClick={() => removeField(index)}
                            >Delete</button>
                        </div>
                    ))}
                </div>

            </div>
            <Button onButtonClick={generateSchema} label={" Generate Schema "} />
            {
                generatedSchema && (
                    <div>
                        <h2>Generated Schema:</h2>
                        <pre>{JSON.stringify(generatedSchema, null, 2)}</pre>
                    </div>
                )
            }
        </div>
    );
}

export default DynamicSchemaFormGenerator;
