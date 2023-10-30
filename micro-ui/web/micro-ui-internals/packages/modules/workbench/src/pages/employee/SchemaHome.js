import React, { useState } from 'react';
import SchemaNameForm from './SchemaNameForm';
import DynamicSchemaFormGenerator from './DynamicSchemaFormGenerator';

function SchemaHome() {
    const [schemaName, setSchemaName] = useState('');
    const [showDynamicForm, setShowDynamicForm] = useState(false);

    const handleSchemaNameSubmit = (name) => {
        setSchemaName(name);
        setShowDynamicForm(true);
    };

    return (
        <div className="app-container">
            {showDynamicForm ? (
                <DynamicSchemaFormGenerator schemaName={schemaName} setSchemaName={setSchemaName} setShowDynamicForm={setShowDynamicForm} />
            ) : (
                <SchemaNameForm onSubmit={handleSchemaNameSubmit} />
            )}
        </div>
    );
}

export default SchemaHome;