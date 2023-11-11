import React, { useEffect, useState } from 'react';
import { CheckBox, Button, TextInput, Dropdown } from "@egovernments/digit-ui-react-components";
import { fieldTypes, propertyMap, arrayTypes } from '../configs/FieldVariable';
import { saveField, cancelSave } from '../utils/schemaUtils';

const FieldEditorComponent = ({ state, dispatch }) => {

    const [requiredError, setRequiredError] = useState(null);
    const [fieldNameError, setFieldNameError] = useState(null);

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
            setFieldNameError("Field name can't be empty");
        } else if (state.currentVariables.name.includes('.')) {
            setFieldNameError("Field name cannot contain a dot (.)");
        } else {
            const fieldExists = state.fields.some(field => field.name === currentName);

            if (fieldExists) {
                const matchingField = state.fields.find(field => field.name === currentName);

                if (state.updatingIndex === null || (matchingField && matchingField.index !== state.updatingIndex)) {
                    setFieldNameError("Field name already exists");
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
                                label="Required"
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
                                            setRequiredError("First make the 'Unique' checkbox unchecked.");
                                        }
                                    }
                                }}
                            />

                            <CheckBox
                                label="Unique"
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
                                <h2 className="card-label undefined">Field Name *</h2>
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
                            <h2 className="card-label">Type</h2>
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
                            label={"Save Field"}
                            className="field-save-button"
                        />
                        <Button
                            onButtonClick={() => cancelSave(state, dispatch)}
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
