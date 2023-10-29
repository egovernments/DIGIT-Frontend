import { Button, TextInput } from '@egovernments/digit-ui-react-components';
import React, { useState } from 'react';

const SchemaNameForm = ({ onSubmit }) => {
    const [schemaName, setSchemaName] = useState('');
    const [nameError, setNameError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (schemaName.trim() === '') {
            setNameError("Schema Name cannot be empty");
        } else {
            setNameError('');
            onSubmit(schemaName);
        }
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
                        <Button onButtonClick={handleSubmit} label={"Submit"} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SchemaNameForm;
