import { Button } from '@egovernments/digit-ui-react-components';
import React, { useState } from 'react';
import DynamicSchemaFormGenerator from './DynamicSchemaFormGenerator';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import { generateFieldsFromSchema, validateSchema } from '../../utils/schemaUtils';
import { colorsConfigJson, styleConfigJson } from '../../configs/JSONInputStyleConfig';




function EditSchemaHome() {
    const [schemaInput, setSchemaInput] = useState(''); // State to store the schema input
    const [schemaName, setSchemaName] = useState('');
    const [fields, setFields] = useState([]);
    const [uiOrder, setUiOrder] = useState([]);
    const [errors, setErrors] = useState([]);

    const handleSchemaInputChange = (event) => {
        if (!event.error && event.jsObject) {
            setSchemaInput(event.jsObject);
            setErrors(validateSchema(event.jsObject?.definition));
        }
    };
    const handleSchemaSubmit = () => {
        // You can add your schema processing logic here
        // For now, let's just display the parsed JSON
        if (errors.length == 0) {
            try {
                const newFields = generateFieldsFromSchema(schemaInput);
                setFields(newFields);
                const uiOrderNames = schemaInput.definition["ui:order"];
                const uiOrderFields = uiOrderNames.map((fieldName) => {
                    const matchingField = newFields.find((field) => field.name == fieldName);
                    return matchingField;
                });
                setUiOrder(uiOrderFields);
                setSchemaName(schemaInput?.definition?.schemaName)
            } catch (error) {
                alert('Invalid JSON Schema: ' + error.message);
            }
        }
    };

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
                        colors={colorsConfigJson}
                        style={styleConfigJson}
                    />
                    <div className='schemaInputError'>{(errors.length > 0) ? (errors[0]) : (null)}</div>
                    < Button onButtonClick={handleSchemaSubmit} label={"Submit Schema"} style={{ marginTop: "10px" }} />
                </div>

            )}
            {fields.length > 0 && <DynamicSchemaFormGenerator fields={fields} schemaName={schemaName} uiOrder={uiOrder} />}
        </div>
    );

}

export default EditSchemaHome;
