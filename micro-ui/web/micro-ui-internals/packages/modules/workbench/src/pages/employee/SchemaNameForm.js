import { Button, TextInput, Loader } from '@egovernments/digit-ui-react-components';
import React, { useState, useEffect } from 'react';

const SchemaNameForm = ({ onSubmit }) => {
    const [schemaName, setSchemaName] = useState('');
    const [nameError, setNameError] = useState('');
    const [loading, setLoading] = useState(false);
    const tenantId = Digit.ULBService.getCurrentTenantId();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (schemaName.trim() === '') {
            setNameError("Schema Name cannot be empty");
        } else {
            setLoading(true); // Set loading to true before making the API call
            const body = { SchemaDefCriteria: { tenantId: tenantId, codes: ["MDMS_Schema." + schemaName] } }
            Digit.MdmsSchemaService.search(body)
                .then((result, err) => {
                    setLoading(false); // Set loading to false when the result is available
                    if (result && result.SchemaDefinitions && result.SchemaDefinitions.length > 0) {
                        // A schema with this name already exists
                        setNameError("Schema with this name already exists");
                    } else {
                        // No schema found with this name, so proceed
                        setNameError('');
                        onSubmit(schemaName);
                    }
                })
                .catch((e) => {
                    setLoading(false); // Set loading to false in case of an error
                    setNameError("Some error happened");
                });
        };
    };

    return (
        <div className='workbench-space-between'>
            <div style={{ marginRight: "16px", width: "100%" }}>
                <div className='label-field-pair'>
                    <div style={{ backgroundColor: "#fff !important" }}>
                        <h2 className="card-label undefined">Schema Name</h2>
                        <TextInput
                            type="text" // Set the type to "text"
                            value={schemaName}
                            onChange={(e) => {
                                setSchemaName(e.target.value);
                                setNameError(''); // Clear the error message when the user makes changes
                            }}
                            isMandatory={false} // Adjust as needed
                            name="schemaName" // Set the name as needed
                            id="schemaName" // Set the ID as needed
                            placeholder="Enter Schema Name" // Set the placeholder as needed
                            disable={false} // Set to true or false as needed
                            customClass="employee-card-input" // Add any custom classes as needed
                            ref={null} // Add a ref if needed
                            style={{ backgroundColor: "#fff" }} // Set the style as needed
                            autoComplete="off"
                            disabled={false} // Set to true or false as needed
                        />

                        {nameError && <div style={{ fontSize: "15px", paddingBottom: "10px", color: "red" }}>{nameError}</div>}
                        {loading ? (
                            <Loader /> // Show the loader while loading
                        ) : (
                            <Button onButtonClick={handleSubmit} label={"Submit"} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SchemaNameForm;
