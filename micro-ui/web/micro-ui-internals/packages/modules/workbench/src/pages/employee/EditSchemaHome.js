import { Button } from '@egovernments/digit-ui-react-components';
import React, { useState } from 'react';
import DynamicSchemaFormGenerator from './DynamicSchemaFormGenerator';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import { generateFieldsFromSchema, validateSchema } from '../../utils/schemaUtils';
import { colorsConfigJson, styleConfigJson } from '../../configs/JSONInputStyleConfig';
import { useTranslation } from "react-i18next";

function EditSchemaHome() {
    const [schemaInput, setSchemaInput] = useState('');
    const [schemaName, setSchemaName] = useState('');
    const [fields, setFields] = useState([]);
    const [errors, setErrors] = useState([]);
    const [jsError, setJsError] = useState(null);
    const { t } = useTranslation();

    const handleSchemaInputChange = (event) => {
        if (!event.error && event.jsObject) {
            setSchemaInput(event.jsObject);
            setErrors(validateSchema(event.jsObject?.definition));
            setJsError(null)
        }
        else if (event.error) {
            setJsError(event.error);
        }
    };
    const handleSchemaSubmit = () => {
        if (errors.length == 0 && !jsError) {
            try {
                const newFields = generateFieldsFromSchema(schemaInput);
                setFields(newFields);
                setSchemaName(schemaInput?.definition?.schemaName)
            } catch (error) {
                alert('Invalid JSON Schema: ' + error.message);
            }
        }
    };

    return (
        <div>
            <header class="h1 digit-form-composer-sub-header">{t("WORKBENCH_HEADING_EDIT_SCHEMA")}</header>
            {fields.length === 0 && (
                <div>
                    <h2 className="card-label undefined">{t("WORKBENCH_HEADING_PASTE_SCHEMA")}</h2>
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
                    < Button onButtonClick={handleSchemaSubmit} label={t("WORKBENCH_LABEL_SUBMIT_SCHEMA")} style={{ marginTop: "10px" }} />
                </div>

            )}
            {fields.length > 0 && <DynamicSchemaFormGenerator fields={fields} schemaName={schemaName} />}
        </div>
    );
}

export default EditSchemaHome;
