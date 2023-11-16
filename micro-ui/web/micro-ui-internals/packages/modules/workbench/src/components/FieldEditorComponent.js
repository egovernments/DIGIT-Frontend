import React, { useEffect, useState } from 'react';
import { CheckBox, Button, TextInput, Dropdown } from "@egovernments/digit-ui-react-components";
import { fieldTypes, propertyMap, arrayTypes } from '../configs/FieldVariable';
import { saveField, cancelSave } from '../utils/schemaUtils';
import { useTranslation } from "react-i18next";

const FieldEditorComponent = ({ state, dispatch }) => {
    const [requiredError, setRequiredError] = useState(null);
    const [fieldNameError, setFieldNameError] = useState(null);
    const { t } = useTranslation();
    fieldTypes.forEach((field) => {
        field.label = t(field.label);
    });
    arrayTypes.forEach((field) => {
        field.label = t(field.label);
    });

    useEffect(() => {
        setRequiredError(null);
        setFieldNameError(null);
    }, [state.currentVariables])

    const updateFieldOption = (optionName, optionValue) => {
        const updatedOptions = { ...state.currentVariables.options };
        if (optionValue === '' || optionValue === null || optionValue === undefined) {
            delete updatedOptions[optionName];
        } else {
            updatedOptions[optionName] = optionValue;
        }
        dispatch({ type: "SET_CURRENT_VARIABLES", payload: { ...state.currentVariables, options: updatedOptions, } })
    };

    const handleSaveField = () => {
        const currentName = state.currentVariables.objectName ? `${state.currentVariables.objectName}.${state.currentVariables.name}` : state.currentVariables.name;

        if (!state.currentVariables.name) {
            setFieldNameError(t("WORKBENCH_SCHEMA_FIELD_EMPTY_ERROR"));
        } else if (state.currentVariables.name.includes('.')) {
            setFieldNameError(t("WORKBENCH_SCHEMA_DOT_ERROR"));
        } else {
            const fieldExists = state.fields.some(field => field.name === currentName);

            if (fieldExists) {
                const matchingFieldIndex = state.fields.findIndex(field => field.name === currentName);
                if (state.updatingIndex === null || (matchingFieldIndex !== state.updatingIndex)) {
                    setFieldNameError(t("WORKBENCH_SCHEMA_NAME_EXISTS_ERROR"));
                } else {
                    saveField(state, dispatch, state.currentVariables);
                }
            } else {
                saveField(state, dispatch, state.currentVariables);
            }
        }
    };


    return (
        <div className='FieldEditorComponent'>
            {state.currentVariables.showField ? (
                <div>
                    {!state.objectMode ? (
                        <div className='checkBoxContainer'>
                            <CheckBox
                                label={t("WORKBENCH_SCHEMA_REQUIRED")}
                                checked={state.currentVariables.required}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        dispatch({ type: "SET_CURRENT_VARIABLES", payload: { ...state.currentVariables, required: true } })
                                        setRequiredError(null);
                                    } else {
                                        if (!state.currentVariables.unique) {
                                            dispatch({ type: 'SET_CURRENT_VARIABLES', payload: { ...state.currentVariables, required: false } });
                                            setRequiredError(null);
                                        } else {
                                            setRequiredError(t("WORKBENCH_SCHEMA_UNIQUE_ERROR"));
                                        }
                                    }
                                }}
                            />

                            <CheckBox
                                label={t("WORKBENCH_SCHEMA_UNIQUE")}
                                checked={state.currentVariables.unique}
                                onChange={(e) => {
                                    setRequiredError(null);
                                    if (e.target.checked) {
                                        dispatch({ type: 'SET_CURRENT_VARIABLES', payload: { ...state.currentVariables, unique: e.target.checked, required: e.target.checked } });
                                    }
                                    else {
                                        dispatch({ type: 'SET_CURRENT_VARIABLES', payload: { ...state.currentVariables, unique: e.target.checked } });
                                    }
                                }}
                            />
                        </div>
                    ) : null}

                    {requiredError && <span className='schemaInputError'>{requiredError}</span>}
                    <div className='workbench-space-between'>
                        <div className='label-field-pair'>
                            <div>
                                <h2 className="card-label undefined">{t("WORKBENCH_LABEL_FIELD_NAME_REQUIRED")}</h2>
                                <TextInput
                                    type="text"
                                    value={state.currentVariables.name}
                                    onChange={(e) => dispatch({ type: 'SET_CURRENT_VARIABLES', payload: { ...state.currentVariables, name: e.target.value } })}
                                    customClass="employee-card-input bg"
                                    className="bg-white"
                                />

                                {fieldNameError && <div className='schemaInputError'>{fieldNameError}</div>}
                            </div>
                        </div>
                        <div className='label-field-pair'>
                            <h2 className="card-label">{t("WORKBENCH_LABEL_TYPE")}</h2>
                            <Dropdown
                                selected={{
                                    label: state.currentVariables.type.charAt(0).toUpperCase() + state.currentVariables.type.slice(1),
                                    value: state.currentVariables.type,
                                }}
                                option={fieldTypes}
                                optionKey="label"
                                t={text => text}
                                className="dropdown-zIndex0"
                                disable={true}
                            />
                        </div>
                        {propertyMap[state.currentVariables.type].map(property => (
                            <div className='label-field-pair' key={property}>
                                <h2 className="card-label">{property}</h2>
                                {state.currentVariables.type === 'array' && property === 'arrayType' ? (
                                    <Dropdown
                                        selected={state.selectedArrayType}
                                        select={value => {
                                            dispatch({ type: 'SET_SELECTED_ARRAY_TYPE', payload: value });
                                            updateFieldOption(property, value.value);
                                        }}
                                        option={arrayTypes}
                                        optionKey="label"
                                        t={text => text}
                                        disable={state.updatingIndex !== null}
                                    />
                                ) : (
                                    <TextInput
                                        type={state.currentVariables.type === 'date-time' ? 'datetime-local' : property === 'pattern' || property === 'format' ? 'text' : state.currentVariables.type.includes('date') ? 'date' : 'number'}
                                        value={state.currentVariables.options[property] || ''}
                                        onChange={e => updateFieldOption(property, e.target.value)}
                                        customClass="employee-card-input"
                                        className="bg-white"
                                    />
                                )}
                            </div>
                        ))}

                        {state.currentVariables.type === 'array' &&
                            propertyMap[state.selectedArrayType.value] &&
                            propertyMap[state.selectedArrayType.value].map(property => (
                                <div className='label-field-pair' key={property}>
                                    <h2 className="card-label">{property}</h2>
                                    <TextInput
                                        type={state.selectedArrayType.value === 'date-time' ? 'datetime-local' : property === 'pattern' || property === 'format' ? 'text' : state.selectedArrayType.value.includes('date') ? 'date' : 'number'}
                                        value={state.currentVariables.options[property] || ''}
                                        onChange={e => updateFieldOption(property, e.target.value)}
                                        customClass="employee-card-input"
                                        className="bg-white"
                                    />
                                </div>
                            ))}
                    </div>
                    <div className='buttoncontainer'>
                        <Button
                            onButtonClick={handleSaveField}
                            label={t("WORKBENCH_LABEL_SAVE_FIELD")}
                            className="field-save-button"
                        />
                        <Button
                            onButtonClick={() => cancelSave(state, dispatch)}
                            label={t("WORKBENCH_LABEL_CANCEL")}
                            className="field-cancel-button"
                            variation={"secondary"}
                        />
                    </div>
                </div>
            ) : (
                <div className='schmema-note-container'>
                    <p>{t("WORKBENCH_SCHEMA_ADD_FIELD")}</p>
                </div>
            )}
        </div>
    );
};

export default FieldEditorComponent;
