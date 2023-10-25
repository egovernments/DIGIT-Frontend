import React, { useState } from 'react';
import { Button } from "@egovernments/digit-ui-react-components"

function DynamicSchemaFormGenerator() {
    const [fields, setFields] = useState([]);
    const [generatedSchema, setGeneratedSchema] = useState(null);
    const [errors, setErrors] = useState([]);

    const addField = () => {
        setFields([...fields, { name: '', type: 'string', options: {}, required: false, unique: false }]);
    };

    const removeField = (index) => {
        const updatedFields = [...fields];
        updatedFields.splice(index, 1);
        setFields(updatedFields);
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
        setFields(updatedFields);
    };

    const updateFieldRequired = (index, optionValue) => {
        const updatedFields = [...fields];
        updatedFields[index].required = optionValue;
        setFields(updatedFields);
    };

    const updateFieldUnique = (index, optionValue) => {
        const updatedFields = [...fields];
        updatedFields[index].unique = optionValue;
        setFields(updatedFields);
    };

    const updateFieldOption = (index, optionName, optionValue) => {
        const updatedFields = [...fields];
        updatedFields[index].options[optionName] = optionValue;
        setFields(updatedFields);
    };

    const generateSchema = () => {
        const errorList = new Array(fields.length).fill(""); // Initialize an error array

        // Validate field names for emptiness and duplicates
        fields.forEach((field, index) => {
            if (!field.name.trim()) {
                errorList[index] = "Field name cannot be empty";
            }
            const duplicateFields = fields.filter((f, i) => f.name === field.name && i !== index);
            if (duplicateFields.length > 0) {
                errorList[index] = "Field name must be unique";
            }
        });

        // If there are errors, display them and prevent schema generation
        if (errorList.some((error) => error !== "")) {
            setErrors(errorList);
            setGeneratedSchema(null);
            return;
        }

        // If no errors, proceed with schema generation
        setErrors([]);

        const schema = {
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


    const render = () => {
        return (
            <div className='app-container workbench'>
                <header class="h1 digit-form-composer-sub-header">Dynamic Schema Form Generator</header>
                <div>
                    {fields.map((field, index) => (
                        <div style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
                            <div style={{ display: "flex", flexDirection: "row" }}>
                                <div>
                                    <input
                                        type="checkbox"
                                        checked={field.required}
                                        onChange={(e) => updateFieldRequired(index, e.target.checked)}
                                    />
                                    <label>Required</label>
                                </div>
                                <div>
                                    <input
                                        type="checkbox"
                                        checked={field.unique}
                                        onChange={(e) => updateFieldUnique(index, e.target.checked)}
                                    />
                                    <label>Unique</label>
                                </div>
                            </div>
                            <div key={index} className='workbench-space-between'>
                                <div className='label-field-pair'>
                                    <div style={{ backgroundColor: "#fff !important" }}>
                                        <h2 class="card-label undefined">Field Name</h2>
                                        <input
                                            type="text"
                                            value={field.name}
                                            className='employee-card-input false focus-visible undefined undefined'
                                            onChange={(e) => updateFieldName(index, e.target.value)}
                                        />
                                        {errors[index] && (
                                            <div style={{ color: "red", fontSize: "15px" }}>
                                                {errors[index]}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className='label-field-pair'>
                                    <h2 class="card-label">Type</h2>
                                    <div>
                                        <select
                                            value={field.type}
                                            className='workbench-schema-select employee-card-input'
                                            onChange={(e) => updateFieldType(index, e.target.value)}
                                        >
                                            <option value="string">String</option>
                                            <option value="number">Number</option>
                                            <option value="boolean">Boolean</option>
                                            <option value="date">Date</option>
                                            <option value="date-time">Date Time</option>
                                        </select>
                                    </div>
                                </div>
                                {field.type === 'string' && (
                                    <div style={{ width: "100%" }}>
                                        <div className='label-field-pair'>
                                            <h2 class="card-label">Minimum Length</h2>
                                            <input
                                                type="number"
                                                value={field.options.minLength}
                                                className='employee-card-input'
                                                onChange={(e) => updateFieldOption(index, 'minLength', e.target.value)} />
                                        </div>
                                        <div className='label-field-pair'>
                                            <h2 class="card-label">Maximum Length</h2>
                                            <input
                                                type="number"
                                                value={field.options.maxLength}
                                                className='employee-card-input'
                                                onChange={(e) => updateFieldOption(index, 'maxLength', e.target.value)} />
                                        </div>
                                    </div>
                                )}
                                {field.type === 'number' && (
                                    <div style={{ width: "100%" }}>
                                        <div className='label-field-pair'>
                                            <h2 class="card-label">Min</h2>
                                            <input
                                                type="number"
                                                value={field.options.min}
                                                className='employee-card-input'
                                                onChange={(e) => updateFieldOption(index, 'min', e.target.value)} />
                                        </div>
                                        <div className='label-field-pair'>
                                            <h2 class="card-label">Max</h2>
                                            <input
                                                type="number"
                                                value={field.options.max}
                                                className='employee-card-input'
                                                onChange={(e) => updateFieldOption(index, 'max', e.target.value)} />
                                        </div>
                                    </div>
                                )}

                                {field.type === 'date' && (
                                    <div style={{ width: "100%" }}>
                                        <div className='label-field-pair'>
                                            <h2 class="card-label">Minimum Date</h2>
                                            <input
                                                type="date"
                                                value={field.options.min}
                                                className='employee-card-input'
                                                onChange={(e) => updateFieldOption(index, 'min', e.target.value)} />
                                        </div>
                                        <div className='label-field-pair'>
                                            <h2 class="card-label">Maximum Date</h2>
                                            <input
                                                type="date"
                                                value={field.options.max}
                                                className='employee-card-input'
                                                onChange={(e) => updateFieldOption(index, 'max', e.target.value)} />
                                        </div>
                                    </div>)
                                }

                            </div>
                            <Button onButtonClick={() => removeField(index)} label={" Remove "} />
                        </div>
                    ))}
                </div>

                <Button onButtonClick={addField} label={" Add Field "} />
                <Button style={{ marginTop: "20px" }} onButtonClick={generateSchema} label={" Generate Schema "} />

                {
                    generatedSchema && (
                        <div>
                            <h2>Generated Schema:</h2>
                            <pre>{JSON.stringify(generatedSchema, null, 2)}</pre>
                        </div>
                    )
                }
            </div >
        );
    };

    return <div>{render()}</div>;
}

export default DynamicSchemaFormGenerator;
