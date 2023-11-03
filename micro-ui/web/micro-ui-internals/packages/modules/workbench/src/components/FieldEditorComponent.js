import React from 'react';
import { CheckBox, Button, TextInput, Dropdown } from "@egovernments/digit-ui-react-components";

const FieldEditorComponent = ({
    showCurrentField,
    currentRequired,
    currentUnique,
    requiredError,
    currentFieldName,
    setCurrentFieldName,
    nameError,
    currentFieldType,
    fieldTypes,
    propertyMap,
    currentOptions,
    updateFieldOption,
    saveField,
    cancelSave,
    setCurrentRequired,
    setCurrentUnique,
    setRequiredError
}) => {
    return (
        <div style={{ height: "100%" }}>
            {showCurrentField ? (
                <div>
                    <div style={{ marginLeft: "10px" }}>
                        <CheckBox
                            label="Required"
                            checked={currentRequired}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setCurrentRequired(true);
                                    setRequiredError(null);
                                } else {
                                    if (!currentUnique) {
                                        setCurrentRequired(false);
                                        setRequiredError(null);
                                    } else {
                                        setRequiredError("First make the 'Unique' checkbox unchecked.");
                                    }
                                }
                            }}
                        />

                        <CheckBox
                            label="Unique"
                            checked={currentUnique}
                            onChange={(e) => {
                                setCurrentUnique(e.target.checked);
                                setRequiredError(null);
                                if (e.target.checked) {
                                    setCurrentRequired(true);
                                }
                            }}
                        />
                    </div>

                    {requiredError && <span style={{ color: "red", margin: "5px", fontSize: "15px" }}>{requiredError}</span>}
                    <div className='workbench-space-between' style={{ marginRight: "10px", marginLeft: "10px", display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                        <div className='label-field-pair'>
                            <div style={{ backgroundColor: "#fff !important" }}>
                                <h2 className="card-label undefined">Field Name *</h2>
                                <TextInput
                                    type="text"
                                    value={currentFieldName}
                                    onChange={(e) => setCurrentFieldName(e.target.value)}
                                    customClass="employee-card-input"
                                    style={{ backgroundColor: "white" }}
                                />

                                {nameError.edit && <div style={{ fontSize: "15px", color: "red" }}>{nameError.edit}</div>}
                            </div>
                        </div>
                        <div className='label-field-pair'>
                            <h2 className="card-label">Type</h2>
                            <Dropdown
                                selected={{
                                    label: currentFieldType.charAt(0).toUpperCase() + currentFieldType.slice(1),
                                    value: currentFieldType,
                                }}
                                option={fieldTypes}
                                optionKey="label"
                                t={(text) => text}
                                style={{ width: '100%' }}
                                className="dropdown-zIndex0"
                                disable={true}
                            />
                        </div>
                        {propertyMap[currentFieldType].map((property) => (
                            <div className='label-field-pair' key={property}>
                                <h2 className="card-label">{property}</h2>
                                <TextInput
                                    type={currentFieldType === 'date-time' ? 'datetime-local' : (property === 'pattern' || property === 'format' ? 'text' : (currentFieldType.includes('date') ? 'date' : 'number'))}
                                    value={currentOptions[property] || ''}
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