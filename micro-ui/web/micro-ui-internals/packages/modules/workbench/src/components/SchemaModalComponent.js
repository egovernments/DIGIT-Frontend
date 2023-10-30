import React from 'react';
import { Close, Button } from "@egovernments/digit-ui-react-components";

const SchemaModalComponent = ({ generatedSchema, uniqueError, setShowModal }) => {
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
                <div style={{ overflow: "auto", maxHeight: "500px" }}>
                    {generatedSchema && (
                        <div>
                            <h2 style={{ fontWeight: "bold" }}>Schema : </h2>
                            <pre>{JSON.stringify(generatedSchema, null, 2)}</pre>
                        </div>
                    )}
                    {uniqueError && (
                        <div>
                            <span style={{ color: "red" }}>{uniqueError}</span>
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
                    />
                )}
            </div>
        </div>
    );
};

export default SchemaModalComponent;
