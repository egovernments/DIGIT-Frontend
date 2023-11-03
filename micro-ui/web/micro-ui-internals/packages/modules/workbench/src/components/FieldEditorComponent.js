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
                    <TextInput
                        id="currentFieldName"
                        label="Name"
                        onChange={({ target: { value } }) => {
                            setCurrentFieldName(value);
                        }}
                        value={currentFieldName}
                    />
                    {nameError.edit && <span className="field-error-message">{nameError.edit}</span>}
                    <Dropdown
                        id="currentFieldType"
                        label="Type"
                        selected={currentFieldType}
                        onChange={({ target: { id, selected } }) => {
                            setCurrentFieldType(selected);
                        }}
                        options={fieldTypes}
                    />
                    <CheckBox
                        id="currentRequired"
                        label="Required"
                        checked={currentRequired}
                        onChange={({ target: { id, checked } }) => {
                            setCurrentRequired(checked);
                        }}
                    />
                    <CheckBox
                        id="currentUnique"
                        label="Unique"
                        checked={currentUnique}
                        onChange={({ target: { id, checked } }) => {
                            setCurrentUnique(checked);
                        }}
                    />
                    {/* Rendering input fields for field-specific properties based on the field type */}
                    {propertyMap[currentFieldType].map((property) => (
                        <TextInput
                            id={`currentOptions.${property}`}
                            label={property}
                            onChange={({ target: { id, value } }) => {
                                updateFieldOption(property, value);
                            }}
                            value={currentOptions[property]}
                        />
                    ))}
                    {requiredError && <span style={{ color: "red", margin: "5px", fontSize: "15px" }}>{requiredError}</span>}
                    <div className="field-save-button">
                        <Button
                            fullWidth={true}
                            onClick={() => saveField()}
                        >
                            Save Field
                        </Button>
                    </div>
                    <div className="field-cancel-button">
                        <Button
                            fullWidth={true}
                            onClick={() => cancelSave()}
                        >
                            Cancel
                        </Button>
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
