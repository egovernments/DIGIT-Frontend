import React, { useEffect, useState } from 'react';
import { CheckBox, Button, TextInput, Dropdown } from "@egovernments/digit-ui-react-components";
import { fieldTypes, propertyMap, arrayTypes } from './FieldVariable';
import { saveField, cancelSave } from '../utils/schemaUtils';

const FieldEditorComponent = ({ state, dispatch }) => {

    const [requiredError, setRequiredError] = useState(null);
    const [fieldNameError, setFieldNameError] = useState(null);

    useEffect(() => {
        setRequiredError(null);
        setFieldNameError(null);
    }, [state.currentVariables])

    const updateFieldOption = (optionName, optionValue) => {
        const updatedOptions = { ...state.currentVariables.currentOptions };
        if (optionValue === '' || optionValue === null || optionValue === undefined) {
            delete updatedOptions[optionName];
        } else {
            updatedOptions[optionName] = optionValue;
        }
        dispatch({ type: "SET_CURRENT_VARIABLES", payload: { ...state.currentVariables, currentOptions: updatedOptions, } })
    };

    const handleSaveField = () => {
        const currentName = state.currentVariables.currentObjectName ? state.currentVariables.currentObjectName + '.' + state.currentVariables.currentFieldName : state.currentVariables.currentFieldName;
        if (!state.currentVariables.currentFieldName) {
            setFieldNameError("Field name Can't be empty");
        } else if (state.currentVariables.currentFieldName.includes('.')) {
            setFieldNameError("Field name cannot contain a dot (.)");
        } else if ((state.fieldState.fields.some(field => field.name == currentName) && state.updatingIndex == null)) {
            setFieldNameError("Field name already exists");
        } else {
            saveField(state, dispatch, state.currentVariables);
        }
    };

    return (
        <div className='FieldEditorComponent'>
            {state.currentVariables.showCurrentField ? (
                <div>
                    {!state.objectMode ? (
                        <div className='checkBoxContainer'>
                            <CheckBox
                                label="Required"
                                checked={state.currentVariables.currentRequired}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        dispatch({ type: "SET_CURRENT_VARIABLES", payload: { ...state.currentVariables, currentRequired: true } })
                                        setRequiredError(null);
                                    } else {
                                        if (!state.currentVariables.currentUnique) {
                                            dispatch({ type: 'SET_CURRENT_VARIABLES', payload: { ...state.currentVariables, currentRequired: false } });
                                            setRequiredError(null);
                                        } else {
                                            setRequiredError("First make the 'Unique' checkbox unchecked.");
                                        }
                                    }
                                }}
                            />

                            <CheckBox
                                label="Unique"
                                checked={state.currentVariables.currentUnique}
                                onChange={(e) => {
                                    setRequiredError(null);
                                    if (e.target.checked) {
                                        dispatch({ type: 'SET_CURRENT_VARIABLES', payload: { ...state.currentVariables, currentUnique: e.target.checked, currentRequired: e.target.checked } });
                                    }
                                    else {
                                        dispatch({ type: 'SET_CURRENT_VARIABLES', payload: { ...state.currentVariables, currentUnique: e.target.checked } });
                                    }
                                }}
                            />
                        </div>
                    ) : null}

                    {requiredError && <span className='schemaInputError'>{requiredError}</span>}
                    <div className='workbench-space-between'>
                        <div className='label-field-pair'>
                            <div>
                                <h2 className="card-label undefined">Field Name *</h2>
                                <TextInput
                                    type="text"
                                    value={state.currentVariables.currentFieldName}
                                    onChange={(e) => dispatch({ type: 'SET_CURRENT_VARIABLES', payload: { ...state.currentVariables, currentFieldName: e.target.value } })}
                                    customClass="employee-card-input bg"
                                    className="bg-white"
                                />

                                {fieldNameError && <div className='schemaInputError'>{fieldNameError}</div>}
                            </div>
                        </div>
                        <div className='label-field-pair'>
                            <h2 className="card-label">Type</h2>
                            <Dropdown
                                selected={{
                                    label: state.currentVariables.currentFieldType.charAt(0).toUpperCase() + state.currentVariables.currentFieldType.slice(1),
                                    value: state.currentVariables.currentFieldType,
                                }}
                                option={fieldTypes}
                                optionKey="label"
                                t={text => text}
                                className="dropdown-zIndex0"
                                disable={true}
                            />
                        </div>
                        {propertyMap[state.currentVariables.currentFieldType].map(property => (
                            <div className='label-field-pair' key={property}>
                                <h2 className="card-label">{property}</h2>
                                {state.currentVariables.currentFieldType === 'array' && property === 'arrayType' ? (
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
                                        type={state.currentVariables.currentFieldType === 'date-time' ? 'datetime-local' : property === 'pattern' || property === 'format' ? 'text' : state.currentVariables.currentFieldType.includes('date') ? 'date' : 'number'}
                                        value={state.currentVariables.currentOptions[property] || ''}
                                        onChange={e => updateFieldOption(property, e.target.value)}
                                        customClass="employee-card-input"
                                        className="bg-white"
                                    />
                                )}
                            </div>
                        ))}

                        {state.currentVariables.currentFieldType === 'array' &&
                            propertyMap[state.selectedArrayType.value] &&
                            propertyMap[state.selectedArrayType.value].map(property => (
                                <div className='label-field-pair' key={property}>
                                    <h2 className="card-label">{property}</h2>
                                    <TextInput
                                        type={state.selectedArrayType.value === 'date-time' ? 'datetime-local' : property === 'pattern' || property === 'format' ? 'text' : state.selectedArrayType.value.includes('date') ? 'date' : 'number'}
                                        value={state.currentVariables.currentOptions[property] || ''}
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
                            label={"Save Field"}
                            className="field-save-button"
                        />
                        <Button
                            onButtonClick={() => cancelSave(dispatch)}
                            label={"Cancel"}
                            className="field-cancel-button"
                            variation={"secondary"}
                        />
                    </div>
                </div>
            ) : (
                <div className='schmema-note-container'>
                    <p>Add a field or select a field to edit</p>
                </div>
            )}
        </div>
    );
};

export default FieldEditorComponent;
