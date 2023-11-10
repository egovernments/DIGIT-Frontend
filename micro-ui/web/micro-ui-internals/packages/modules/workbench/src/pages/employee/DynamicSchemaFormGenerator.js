import React, { useEffect, useState } from 'react';
import { ActionBar, Button, SubmitBar } from "@egovernments/digit-ui-react-components"
import FieldView from '../../components/FieldView';
import FieldSelect from '../../components/FieldSelect';
import SchemaModalComponent from '../../components/SchemaModalComponent';
import FieldEditorComponent from '../../components/FieldEditorComponent';
import Confirmation from '../../../../engagement/src/components/Modal/Confirmation';
import { useTranslation } from 'react-i18next';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import CustomCheckbox from '../../components/Checbox';
import { generateFieldsFromSchema, deepClone, buildSchema } from '../../utils/schemaUtils';
import { colorsConfigJson, styleConfigJson } from '../../configs/JSONInputStyleConfig';
import { resetCurrentVariables } from '../../components/FieldVariable'

function DynamicSchemaFormGenerator(props) {
    const { t } = useTranslation();
    const [schemaName, setSchemaName] = useState(props.schemaName ? props.schemaName : null);
    const [generatedSchema, setGeneratedSchema] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [showGenerator, setShowGenerator] = useState(true);
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const { state, dispatch } = Digit.Hooks.workbench.useSchemaReducer(props);
    const generateSchema = () => {


        // Deep clone the fields array
        const clonedFields = deepClone(state.fieldState.fields);

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
        });

        state.fieldState.orderedFields.map((field) => {
            schema['ui:order'].push(field.name);
        })
        setGeneratedSchema(
            {
                code: "MDMS_Schema." + props.schemaName,
                tenantId: tenantId,
                description: "Mdms schema " + props.schemaName,
                definition: schema
            }
        );

        setShowModal(true);

    };

    useEffect(() => {
        const newOrderedFields = [...state.fieldState.orderedFields];

        // Iterate through the fields and check if their names are in orderedFields
        state.fieldState.fields.forEach((field) => {
            // Find the index of the matching field in newOrderedFields
            const matchingFieldIndex = newOrderedFields.findIndex(item => item.name === field.name);

            if (matchingFieldIndex === -1 && !field.name.includes(".")) {
                // Add the missing field to the end of newOrderedFields
                newOrderedFields.push({ ...field });
            } else if (matchingFieldIndex !== -1) {
                // Update the matching field in newOrderedFields with the new field
                newOrderedFields[matchingFieldIndex] = field;
            }
        });


        // Remove fields from orderedFields that are not present in fields
        newOrderedFields.forEach((orderedField, index) => {
            const nameExistsInFields = state.fieldState.fields.some(field => field.name === orderedField.name);
            if (!nameExistsInFields) {
                newOrderedFields.splice(index, 1);
            }
        });

        const newFilteredObjectFields = state.fieldState.fields.filter((field) => {
            if (state.currentVariables.currentObjectName) {
                // Check if the field name starts with the currentObjectName or its prefixes
                const prefix = state.currentVariables.currentObjectName + '.';
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

        dispatch({ type: 'SET_FIELD_STATE', payload: { ...state.fieldState, filteredObjectFields: newFilteredObjectFields, orderedFields: newOrderedFields } });
    }, [state.fieldState.fields, state.currentVariables.currentObjectName]);


    const renderButtons = () => {
        return (
            <div >
                <ActionBar className="SchemaActionBar">
                    <SubmitBar label={t("Preview And Save")} className="SubmitBar" onSubmit={generateSchema} />
                    <Button className="Button" onButtonClick={() => setShowConfirmationModal(true)} label={"Cancel"} variation={"secondary"} />
                </ActionBar>
                {showModal && <SchemaModalComponent generatedSchema={generatedSchema} state={state} setShowModal={setShowModal} />}
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
    const handleSchemaSubmit = () => {
        // You can add your schema processing logic here
        // For now, let's just display the parsed JSON
        try {
            const newFields = generateFieldsFromSchema(generatedSchema);
            const uiOrderNames = generatedSchema.definition["ui:order"];
            const uiOrderFields = uiOrderNames.map((fieldName) => {
                const matchingField = newFields.find((field) => field.name == fieldName);
                return matchingField;
            });
            dispatch({ type: 'SET_FIELD_STATE', payload: { ...state.fieldState, fields: newFields, orderedFields: uiOrderFields } });
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
            handleSchemaSubmit();
            setShowGenerator(true);
            setGeneratedSchema(null);
            dispatch({ type: 'SET_CURRENT_VARIABLES', payload: resetCurrentVariables });
            dispatch({ type: 'SET_UPDATING_INDEX', payload: null });
            dispatch({ type: 'SET_OBJECT_MODE', payload: false });
        }
    }

    const handleSchemaInputChange = (event) => {
        setGeneratedSchema(event.jsObject);
    };


    return (
        <div>
            <div>
                Toggle Editor
                <CustomCheckbox onChange={toggleView} label={"Schema Generator"} value={showGenerator} />
            </div>
            {showGenerator ? (
                <div>
                    {showGenerator ? (<div>
                        <header class="h1 digit-form-composer-sub-header">Dynamic Schema Form Generator</header>
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
                                {state.objectMode && state.currentVariables.currentObjectName && (
                                    <h2 className='objectHeader'>
                                        <button
                                            onClick={() => {
                                                if (state.currentVariables.currentObjectName && state.currentVariables.currentObjectName.includes('.')) {
                                                    const parts = state.currentVariables.currentObjectName.split('.');
                                                    parts.pop(); // Remove the last part
                                                    const newObjectName = parts.join('.');
                                                    dispatch({ type: 'SET_CURRENT_VARIABLES', payload: { ...resetCurrentVariables, currentObjectName: newObjectName } });
                                                } else {
                                                    dispatch({ type: 'SET_CURRENT_VARIABLES', payload: { resetCurrentVariables } });
                                                    dispatch({ type: 'SET_OBJECT_MODE', payload: false });
                                                }
                                            }}
                                        >
                                            Back
                                        </button>
                                        {`${state.currentVariables.currentObjectName.replace(/\./g, ' -> ')}`}
                                    </h2>
                                )}
                                {!state.objectMode && (
                                    <h2 className='fieldListHeader'>
                                        Field List
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
                    <h2 className="card-label undefined">Paste your schema here:</h2>
                    <JSONInput
                        locale={locale}
                        height='50vh'
                        width='60vw'
                        placeholder={generatedSchema}
                        onChange={handleSchemaInputChange}
                        colors={colorsConfigJson}
                        style={styleConfigJson}
                    />
                </div>
            )}
        </div>
    );
}

export default DynamicSchemaFormGenerator;
