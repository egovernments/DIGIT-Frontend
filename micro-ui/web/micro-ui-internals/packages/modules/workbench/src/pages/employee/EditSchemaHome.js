import { Button, TextArea } from '@egovernments/digit-ui-react-components';
import React, { useState } from 'react';
import DynamicSchemaFormGenerator from './DynamicSchemaFormGenerator';
import { JsonEditor as Editor } from 'jsoneditor-react';
import { JsonEditor } from "react-jsondata-editor";
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';


function EditSchemaHome() {
    const [schemaInput, setSchemaInput] = useState(''); // State to store the schema input
    const [schemaName, setSchemaName] = useState('');
    const [fields, setFields] = useState([]);
    const [uiOrder, setUiOrder] = useState([]);

    const handleSchemaInputChange = (event) => {
        setSchemaInput(event.jsObject);
    };
    function generateFieldsFromSchema(schema) {
        setSchemaName(schema?.definition?.schemaName)
        const fields = [];

        // Helper function to recursively traverse the JSON schema
        function traverseSchema(properties, parentName = '') {
            for (const fieldName in properties) {
                const field = properties[fieldName];
                const fieldPath = parentName ? `${parentName}.${fieldName}` : fieldName;

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
                if (field.items && field.items.type) {
                    fieldOptions.arrayType = field.items.type;
                }
                if (field.minItems) {
                    fieldOptions['minLength of Array'] = field.minItems.toString();
                }
                if (field.maxItems) {
                    fieldOptions['maxLength of Array'] = field.maxItems.toString();
                }

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
        traverseSchema(schema.definition.properties);

        return fields;
    }
    const handleSchemaSubmit = () => {
        // You can add your schema processing logic here
        // For now, let's just display the parsed JSON
        try {
            const newFields = generateFieldsFromSchema(schemaInput);
            setFields(newFields);
            const uiOrderNames = schemaInput.definition["ui:order"];
            const uiOrderFields = uiOrderNames.map((fieldName) => {
                const matchingField = newFields.find((field) => field.name == fieldName);
                return matchingField;
            });
            setUiOrder(uiOrderFields);
            console.log(uiOrderFields, " uiiioooooorrrrrrrrrr")
        } catch (error) {
            alert('Invalid JSON Schema: ' + error.message);
        }
    };
    console.log(schemaInput, " schhhhhhhhhhhhh")

    return (
        <div>
            <header class="h1 digit-form-composer-sub-header">Edit Schema</header>
            {fields.length === 0 && (
                <div>
                    <h2 className="card-label undefined">Paste your schema here:</h2>
                    <JSONInput
                        locale={locale}
                        height='50vh'
                        width='60vw'
                        value={schemaInput}
                        onChange={handleSchemaInputChange}
                        colors={{
                            default: "#000", // Default text color (black)
                            background: "#FFF", // Background color (white)
                            string: "#E91E63", // String values color (pink)
                            keys: "#795548", // Keys color (brown)
                            number: "#2196F3", // Number values color (blue)
                            colon: "#9C27B0", // Colon color (purple)
                            primitive: "#00BCD4", // Boolean values and null color (cyan)
                            error: "#FF5722", // Error color (amber)
                            keys_whiteSpace: "#607D8B", // Keys in quotes color (blue-grey)
                            background_warning: "#FFEB3B", // Background for warning message (yellow)
                        }}
                        style={{
                            outerBox: {
                                border: "1px solid #E0E0E0",
                                borderRadius: "5px",
                            },
                            container: {
                                border: "1px solid #E0E0E0",
                                borderRadius: "5px",
                            },
                            warningBox: {
                                backgroundColor: "#FFEB3B",
                                border: "1px solid #FFC107",
                                borderRadius: "5px",
                            },
                            errorMessage: {
                                color: "#D84315",
                            },
                            body: {
                                padding: "10px",
                            },
                            labels: {
                                fontWeight: "bold",
                            },
                            contentBox: {
                                display: "inline-block",
                            },
                        }}
                    />


                    < Button onButtonClick={handleSchemaSubmit} label={"Submit Schema"} style={{ marginTop: "10px" }} />
                </div>
            )}
            {fields.length > 0 && <DynamicSchemaFormGenerator fields={fields} schemaName={schemaName} uiOrder={uiOrder} />}
        </div>
    );

}

export default EditSchemaHome;
