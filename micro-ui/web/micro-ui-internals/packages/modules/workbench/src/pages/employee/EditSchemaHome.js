import { Button } from '@egovernments/digit-ui-react-components';
import React, { useState } from 'react';
import DynamicSchemaFormGenerator from './DynamicSchemaFormGenerator';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import { generateFieldsFromSchema } from '../../utils/schemaUtils';



function EditSchemaHome() {
    const [schemaInput, setSchemaInput] = useState(''); // State to store the schema input
    const [schemaName, setSchemaName] = useState('');
    const [fields, setFields] = useState([]);
    const [uiOrder, setUiOrder] = useState([]);

    const handleSchemaInputChange = (event) => {
        setSchemaInput(event.jsObject);
    };
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
            setSchemaName(schemaInput?.definition?.schemaName)
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
