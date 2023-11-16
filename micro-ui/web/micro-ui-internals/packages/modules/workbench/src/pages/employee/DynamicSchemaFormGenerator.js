import React, { useState } from 'react';
import { ActionBar, Button, SubmitBar } from "@egovernments/digit-ui-react-components"
import FieldView from '../../components/FieldView';
import FieldSelect from '../../components/FieldSelect';
import SchemaModalComponent from '../../components/SchemaModalComponent';
import FieldEditorComponent from '../../components/FieldEditorComponent';
import Confirmation from '../../../../engagement/src/components/Modal/Confirmation';
import { useTranslation } from 'react-i18next';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import { generateFieldsFromSchema, deepClone, buildSchema, validateSchema } from '../../utils/schemaUtils';
import { colorsConfigJson, styleConfigJson } from '../../configs/JSONInputStyleConfig';
import { resetCurrentVariables } from '../../configs/FieldVariable'
import ToggleSchema from '../../components/toggleSchema';

function DynamicSchemaFormGenerator(props) {
    const { t } = useTranslation();
    const [schemaName, setSchemaName] = useState(props.schemaName ? props.schemaName : null);
    const [generatedSchema, setGeneratedSchema] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [showGenerator, setShowGenerator] = useState(true);
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const [errors, setErrors] = useState([]);
    const [schemaJsError, setSchemaJsError] = useState(null);
    const { state, dispatch } = Digit.Hooks.workbench.useSchemaReducer(props);

    const generateSchema = () => {


        // Deep clone the fields array
        const clonedFields = deepClone(state.fields);

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


        clonedFields.forEach((field) => {
            buildSchema(field, schema);
            if (field.unique && !field.name.includes(".")) {
                schema['x-unique'].push(field.name);
            }
            if (field.required && !field.name.includes(".")) {
                schema['required'].push(field.name);
            }
            if (field.order !== undefined) {
                schema['ui:order'].push(field.name);
            }
        });
        schema['ui:order'].sort((a, b) => {
            const orderA = clonedFields.find(field => field.name === a).order;
            const orderB = clonedFields.find(field => field.name === b).order;
            return orderA - orderB;
        });

        setGeneratedSchema(
            {
                code: "MDMS_Schema." + props.schemaName,
                tenantId: tenantId,
                description: "Mdms schema " + props.schemaName,
                definition: schema
            }
        );
        setErrors(validateSchema(schema));
        setShowModal(true);

    };


    const renderButtons = () => {
        return (
            <div >
                <ActionBar className="SchemaActionBar">
                    <SubmitBar label={t("WORKBENCH_LABEL_PREVIEW_SAVE")} className="SubmitBar" onSubmit={generateSchema} />
                    <Button className="Button" onButtonClick={() => setShowConfirmationModal(true)} label={t("WORKBENCH_LABEL_CANCEL")} variation={"secondary"} />
                </ActionBar>
                {showModal && <SchemaModalComponent generatedSchema={generatedSchema} state={state} setShowModal={setShowModal} />}
                {showConfirmationModal && <Confirmation
                    t={t}
                    heading={t("Confirm Cancellation")}
                    docName={t("WORKBENCH_SCHEMA_DOCNAME")}
                    closeModal={() => setShowConfirmationModal(false)}
                    actionCancelLabel={t("WORKBENCH_LABEL_CANCEL")}
                    actionCancelOnSubmit={() => setShowConfirmationModal(false)}
                    actionSaveLabel={t("WORKBENCH_LABEL_DELETE")}
                    actionSaveOnSubmit={() => { { props.setSchemaName(''); props.setShowDynamicForm(false) } }}
                />}
            </div>
        )
    }
    const handleSchemaSubmit = () => {
        try {
            const newFields = generateFieldsFromSchema(generatedSchema);
            dispatch({ type: 'SET_FIELDS', payload: newFields });
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
            if (validateSchema(generatedSchema.definition).length == 0 && !schemaJsError) {
                handleSchemaSubmit();
                setShowGenerator(true);
                setGeneratedSchema(null);
                dispatch({ type: 'SET_CURRENT_VARIABLES', payload: resetCurrentVariables });
                dispatch({ type: 'SET_UPDATING_INDEX', payload: null });
                dispatch({ type: 'SET_OBJECT_MODE', payload: false });
            }
        }
    }

    const handleSchemaInputChange = (event) => {
        if (!event.error) {
            setGeneratedSchema(event.jsObject);
            setErrors(validateSchema(event.jsObject?.definition));
            setSchemaJsError(null);
        }
        else {
            setSchemaJsError(event.error)
        }
    };
    return (
        <div>
            <div className="toggle-schema-wrapper">
                <ToggleSchema onChange={toggleView} label={t("WORKBENCH_LABEL_TOGGLE_EDITOR")} value={!showGenerator} />
            </div>
            {showGenerator ? (
                <div>
                    {showGenerator ? (<div>
                        <header class="h1 digit-form-composer-sub-header">{t("WORKBENCH_HEADING_DYNAMIC_GENERATOR")}</header>
                        <h1 className='schemaNameContainer'>{schemaName + " config"}</h1>
                        <div className='schemaGeneratorContainer'>
                            <div className='fieldSelect'>
                                <FieldSelect
                                    state={state}
                                    dispatch={dispatch}
                                />
                            </div>
                            <div className='fieldEditor'>
                                <FieldEditorComponent
                                    state={state}
                                    dispatch={dispatch}
                                />
                            </div>
                            <div className='fieldView'>
                                {state.objectMode && state.currentVariables.objectName && (
                                    <h2 className='objectHeader'>
                                        <button
                                            onClick={() => {
                                                if (state.currentVariables.objectName && state.currentVariables.objectName.includes('.')) {
                                                    const parts = state.currentVariables.objectName.split('.');
                                                    parts.pop(); // Remove the last part
                                                    const newObjectName = parts.join('.');
                                                    dispatch({ type: 'SET_CURRENT_VARIABLES', payload: { ...resetCurrentVariables, objectName: newObjectName } });
                                                } else {
                                                    dispatch({ type: 'SET_CURRENT_VARIABLES', payload: { resetCurrentVariables } });
                                                    dispatch({ type: 'SET_OBJECT_MODE', payload: false });
                                                }
                                            }}
                                        >
                                            {t("WORKBENCH_LABEL_BACK")}
                                        </button>
                                        {`${state.currentVariables.objectName.replace(/\./g, ' -> ')}`}
                                    </h2>
                                )}
                                {!state.objectMode && (
                                    <h2 className='fieldListHeader'>
                                        {t("WORKBENCH_HEADING_FIELD_LIST")}
                                    </h2>
                                )}
                                <FieldView
                                    state={state}
                                    dispatch={dispatch}
                                />
                            </div>
                        </div>

                        {renderButtons()}
                    </div>) : (null)}
                </div>
            ) : (
                <div>
                    <header class="h1 digit-form-composer-sub-header">{t("WORKBENCH_HEADING_DYNAMIC_EDITOR")}</header>
                    <h1 className='schemaNameContainer'>{schemaName + " config"}</h1>
                    <JSONInput
                        locale={locale}
                        height='50vh'
                        width='60vw'
                        placeholder={generatedSchema}
                        onChange={handleSchemaInputChange}
                        colors={colorsConfigJson}
                        style={styleConfigJson}
                    />
                    <div className='schemaInputError'>{(errors.length > 0) ? (errors[0]) : (null)}</div>
                </div>
            )}
        </div>
    );
}

export default DynamicSchemaFormGenerator;
