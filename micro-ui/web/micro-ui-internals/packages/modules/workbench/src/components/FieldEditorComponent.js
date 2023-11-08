import React, { useState } from 'react';
import { CheckBox, Button, TextInput, Dropdown } from "@egovernments/digit-ui-react-components";
import { fieldTypes, propertyMap } from './FieldVariable'


const FieldEditorComponent = ({
    state,
    updateFieldOption,
    saveField,
    cancelSave,
    dispatch,
}) => {
    const arrayTypes = [
        { label: 'String', value: 'string' },
        { label: 'Number', value: 'number' },
        { label: 'Boolean', value: 'boolean' },
        { label: 'Date', value: 'date' },
        { label: 'Date-Time', value: 'date-time' },
        { label: 'Object', value: 'object' },
    ];
    const [requiredError, setRequiredError] = useState(null)


    return (
        <div style={{ height: "100%" }}>
            {state.showCurrentField ? (
                <div>
                    {!state.objectMode ? (<div style={{ marginLeft: "10px" }}>
                        <CheckBox
                            label="Required"
                            checked={state.currentRequired}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    dispatch({ type: 'SET_CURRENT_REQUIRED', payload: true });
                                    setRequiredError(null);
                                } else {
                                    if (!state.currentUnique) {
                                        dispatch({ type: 'SET_CURRENT_REQUIRED', payload: false });
                                        setRequiredError(null);
                                    } else {
                                        setRequiredError("First make the 'Unique' checkbox unchecked.");
                                    }
                                }
                            }}
                        />

                        <CheckBox
                            label="Unique"
                            checked={state.currentUnique}
                            onChange={(e) => {
                                dispatch({ type: 'SET_CURRENT_UNIQUE', payload: e.target.checked });
                                setRequiredError(null);
                                if (e.target.checked) {
                                    dispatch({ type: 'SET_CURRENT_REQUIRED', payload: true });
                                }
                            }}
                        />
                    </div>) : (null)}


                    {requiredError && <span style={{ color: "red", margin: "5px", fontSize: "15px" }}>{requiredError}</span>}
                    <div className='workbench-space-between' style={{ marginRight: "10px", marginLeft: "10px", display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                        <div className='label-field-pair'>
                            <div style={{ backgroundColor: "#fff !important" }}>
                                <h2 className="card-label undefined">Field Name *</h2>
                                <TextInput
                                    type="text"
                                    value={state.currentFieldName}
                                    onChange={(e) => dispatch({ type: 'SET_CURRENT_FIELD_NAME', payload: e.target.value })}
                                    customClass="employee-card-input"
                                    style={{ backgroundColor: "white" }}
                                />

                                {state.nameError.edit && <div style={{ fontSize: "15px", color: "red" }}>{state.nameError.edit}</div>}
                            </div>
                        </div>
                        <div className='label-field-pair'>
                            <h2 className="card-label">Type</h2>
                            <Dropdown
                                selected={{
                                    label: state.currentFieldType.charAt(0).toUpperCase() + state.currentFieldType.slice(1),
                                    value: state.currentFieldType,
                                }}
                                option={fieldTypes}
                                optionKey="label"
                                t={(text) => text}
                                style={{ width: '100%' }}
                                className="dropdown-zIndex0"
                                disable={true}
                            />
                        </div>
                        {propertyMap[state.currentFieldType].map((property) => (
                            <div className='label-field-pair' key={property}>
                                <h2 className="card-label">{property}</h2>
                                {state.currentFieldType === 'array' && property === 'arrayType' ? (
                                    <Dropdown
                                        selected={state.selectedArrayType}
                                        select={(value) => { dispatch({ type: 'SET_SELECTED_ARRAY_TYPE', payload: value }); updateFieldOption(property, value.value) }}
                                        option={arrayTypes}
                                        optionKey="label"
                                        t={(text) => text}
                                        style={{ width: '100%' }}
                                        // className="dropdown-zIndex0"
                                        disable={state.updatingIndex !== null}
                                    />
                                ) : (
                                    <TextInput
                                        type={state.currentFieldType === 'date-time' ? 'datetime-local' : (property === 'pattern' || property === 'format' ? 'text' : (state.currentFieldType.includes('date') ? 'date' : 'number'))}
                                        value={state.currentOptions[property] || ''}
                                        onChange={(e) => updateFieldOption(property, e.target.value)}
                                        customClass="employee-card-input"
                                        style={{ backgroundColor: "white" }}
                                    />
                                )}
                            </div>
                        ))}

                        {state.currentFieldType === 'array' && propertyMap[state.selectedArrayType.value] && propertyMap[state.selectedArrayType.value].map((property) => (
                            <div className='label-field-pair' key={property}>
                                <h2 className="card-label">{property}</h2>
                                <TextInput
                                    type={state.selectedArrayType.value === 'date-time' ? 'datetime-local' : (property === 'pattern' || property === 'format' ? 'text' : (state.selectedArrayType.value.includes('date') ? 'date' : 'number'))}
                                    value={state.currentOptions[property] || ''}
                                    onChange={(e) => updateFieldOption(property, e.target.value)}
                                    customClass="employee-card-input"
                                    style={{ backgroundColor: "white" }}
                                />
                            </div>
                        ))}
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", marginLeft: "10px", marginBottom: "10px" }}>
                        <Button
                            onButtonClick={() => saveField()}
                            label={"Save Field"}
                            style={{ marginRight: "10px", marginLeft: "auto" }}
                        />
                        <Button
                            onButtonClick={() => cancelSave()}
                            label={"Cancel"}
                            style={{ marginRight: "10px" }}
                            variation={"secondary"}
                        />
                    </div>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
                    <p style={{ fontSize: "16px", fontWeight: "bold" }}>Add a field or select a field to edit</p>
                </div>
            )}
        </div>
    );
};

export default FieldEditorComponent;
