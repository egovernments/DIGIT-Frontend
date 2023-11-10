import React from 'react';
import { Close, Button } from "@egovernments/digit-ui-react-components";
import { useHistory } from "react-router-dom";

const SchemaModalComponent = ({ generatedSchema, state, setShowModal }) => {
    const history = useHistory(); // Initialize the useHistory hook

    const handleSave = () => {
        if (generatedSchema) {
            const schema = { SchemaDefinition: generatedSchema };
            Digit.MdmsSchemaService.create(schema)
                .then((result, err) => {
                    if (result && result.ResponseInfo.status === 'successful') {
                        // Pass the result to the SchemaResponsePage
                        history.push('schema-response-page', { result });
                    } else {
                        history.push('schema-response-page', {});
                    }
                })
                .catch((e) => {
                    // Handle the error case
                    history.push('schema-response-page', {});
                });
        }
    };

    const validateSchema = (schema) => {
        return schema && schema["ui:order"] && schema["x-unique"] && schema["ui:order"].length > 0 && schema["x-unique"].length > 0;
    };



    return (
        <div className="schema-modal-overlay">
            <div className='schema-modal-container'>
                <div
                    className='schema-modal-close'
                    onClick={() => setShowModal(false)}
                >
                    <Close />
                </div>
                <div className="modal-content">
                    {validateSchema(generatedSchema.definition) && (
                        <div>
                            <h2 style={{ fontWeight: "bold" }}>Schema:</h2>
                            <pre>{JSON.stringify(generatedSchema, null, 2)}</pre>
                        </div>

                    )}
                    {validateSchema(generatedSchema.definition) || (
                        <div>
                            {(generatedSchema.definition["ui:order"].length == 0) && (
                                <div className='schemaInputError'>Add at least one field should be there in schema</div>
                            )}

                            {(generatedSchema.definition["ui:order"].length > 0 && generatedSchema.definition["x-unique"].length == 0) && (
                                <div className='schemaInputError'>At least one field should be unique</div>
                            )}
                        </div>
                    )}
                </div>
                {validateSchema(generatedSchema.definition) &&
                    (<Button
                        className="save-button"
                        label={"Save"}
                        onButtonClick={handleSave}
                        disabled={!validateSchema(generatedSchema)}
                    />)}
            </div>

        </div>
    );
};

export default SchemaModalComponent;
