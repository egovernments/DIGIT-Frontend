import React, { useState } from 'react';
import { DeleteIcon, EditIcon } from '@egovernments/digit-ui-react-components';

const FieldView = ({ objectMode, orderedFields, setOrderedFields, fields, setFieldToUpdate, removeField, setLastName, setCurrentObjectName, setObjectMode }) => {
    const [draggedIndex, setDraggedIndex] = useState(null);
    const handleDragStart = (event, index) => {
        event.dataTransfer.setData('text/plain', index);
        setDraggedIndex(index);
    };

    const handleDragOver = (event, index) => {
        event.preventDefault();
        if (draggedIndex === null) return;
        if (index !== draggedIndex) {
            const newOrderedFields = [...orderedFields];
            const draggedItem = newOrderedFields[draggedIndex];
            newOrderedFields.splice(draggedIndex, 1);
            newOrderedFields.splice(index, 0, draggedItem);
            setOrderedFields(newOrderedFields);
            setDraggedIndex(index);
        }
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };
    return (
        <div>
            {orderedFields.map((field, index) => (
                <div
                    key={index}
                    className="field-item"
                    data-index={index}
                    draggable={objectMode ? "false" : "true"}
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "10px",
                        alignItems: "center",
                        padding: "10px",
                        border: objectMode ? "" : "1px solid #ccc",
                        background: "#f5f5f5",
                        cursor: objectMode ? "" : "pointer",
                        position: "relative", // Add relative positioning
                    }}
                >
                    {objectMode ? (
                        <span style={
                            {
                                display: "flex",
                                alignItems: "center",
                                color: (field.type === 'object' || (field.type == 'array' && field?.options?.arrayType == 'object')) ? '#F47738' : 'black',
                                cursor: (field.type === 'object' || (field.type == 'array' && field?.options?.arrayType == 'object')) ? 'pointer' : 'default'
                            }
                        } onClick={() => {
                            if ((field.type === 'object' || (field.type == 'array' && field?.options?.arrayType == 'object'))) {
                                setCurrentObjectName(field.name);
                                setObjectMode(true);
                            }
                        }}>
                            {field.name.includes('.') ? field.name.split('.').pop() : field.name}
                        </span>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: "row" }}>
                            <span className="arrow-up">&#8593;</span>
                            <span className="arrow-down">&#8595;</span>
                            <span style={
                                {
                                    display: "flex",
                                    alignItems: "center",
                                    marginLeft: "5px",
                                    color: (field.type === 'object' || (field.type === 'array' && field?.options?.arrayType === 'object')) ? '#F47738' : 'black',
                                    cursor: (field.type === 'object' || (field.type === 'array' && field?.options?.arrayType === 'object')) ? 'pointer' : 'default'
                                }
                            } onClick={() => {
                                if ((field.type === 'object' || (field.type === 'array' && field?.options?.arrayType === 'object'))) {
                                    setCurrentObjectName(field.name);
                                    setObjectMode(true);
                                }
                            }}>
                                {field.name.includes('.') ? field.name.split('.').pop() : field.name}{field.required ? ' *' : ''}
                            </span>
                        </div>

                    )}


                    <div style={{ display: "flex" }}>
                        <div
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent the click event from bubbling
                                debugger;
                                const fieldIndex = fields.findIndex((f) => f.name === field.name);
                                if (fieldIndex !== -1) {
                                    setFieldToUpdate(fieldIndex);
                                }
                                setLastName(field.name)
                            }}
                            style={{ cursor: "pointer", marginRight: "16px" }}
                        >
                            <EditIcon />
                        </div>
                        <div
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent the click event from bubbling
                                const fieldIndex = fields.findIndex((f) => f.name === field.name);
                                if (fieldIndex !== -1) {
                                    removeField(fieldIndex);
                                }
                            }}
                            style={{ cursor: "pointer", marginRight: "16px" }}
                        >
                            <DeleteIcon fill={"red"} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FieldView;
