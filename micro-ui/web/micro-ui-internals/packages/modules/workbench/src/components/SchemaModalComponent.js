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


    return (
        <div
            style={{
                position: "fixed",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    backgroundColor: "#fff",
                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
                    maxWidth: "80%",
                    textAlign: "left",
                    padding: "20px",
                    minWidth: "500px",
                    zIndex: "999",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: "0px",
                        right: "0px",
                        backgroundColor: "white",
                        border: "none",
                        textAlign: "center",
                        textDecoration: "none",
                        display: "inline-block",
                        fontSize: "16px",
                        cursor: "pointer",
                        zIndex: "999",
                        margin: "5px"
                    }}
                    onClick={() => setShowModal(false)}
                >
                    <Close />
                </div>
                <div style={{ overflow: "auto", maxHeight: "500px", zIndex: "999", }}>
                    {generatedSchema && (
                        <div>
                            <h2 style={{ fontWeight: "bold" }}>Schema : </h2>
                            <pre>{JSON.stringify(generatedSchema, null, 2)}</pre>
                        </div>
                    )}
                    {state.uniqueError && (
                        <div>
                            <span style={{ color: "red" }}>{state.uniqueError}</span>
                        </div>
                    )}
                </div>
                {generatedSchema && (
                    <Button
                        style={{
                            padding: "10px 20px",
                            cursor: "pointer",
                            marginTop: "20px",
                            zIndex: "999",
                        }}
                        label={"Save"}
                        onButtonClick={handleSave}
                    />
                )}
            </div>
        </div>
    );
};

export default SchemaModalComponent;
