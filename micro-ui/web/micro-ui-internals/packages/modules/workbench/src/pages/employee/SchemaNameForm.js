import { Button } from '@egovernments/digit-ui-react-components';
import React, { useState } from 'react';

const SchemaNameForm = ({ onSubmit }) => {
    const [schemaName, setSchemaName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(schemaName);
    };

    return (
        <div className='workbench-space-between'>
            <div style={{ marginRight: "16px", width: "100%" }}>
                <div className='label-field-pair'>
                    <div style={{ backgroundColor: "#fff !important" }}>
                        <h2 class="card-label undefined">Schema Name</h2>
                        <input
                            type="text"
                            value={schemaName}
                            className='employee-card-input false focus-visible undefined undefined'
                            onChange={(e) => setSchemaName(e.target.value)}
                        />
                        <Button onButtonClick={handleSubmit} label={"Submit"} />
                    </div>
                </div>
            </div>
        </div>
        // <div className="schema-name-form">
        //     <form className='label-field-pair' onSubmit={handleSubmit}>
        //         <label>
        //             Schema Name:
        //             <input
        //                 type="text"
        //                 value={schemaName}
        //                 onChange={(e) => setSchemaName(e.target.value)}
        //             />
        //         </label>
        //         <button type="submit">Submit</button>
        //     </form>
        // </div>
    );
};

export default SchemaNameForm;
