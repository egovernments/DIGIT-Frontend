import React, { useState } from 'react';
import { DeleteIcon, EditIcon } from '@egovernments/digit-ui-react-components';

const FieldView = ({ orderedFields, setOrderedFields, fields, setFieldToUpdate, removeField }) => {
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
                    draggable="true"
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "10px",
                        alignItems: "center",
                        padding: "10px",
                        border: "1px solid #ccc",
                        background: "#f5f5f5",
                        cursor: "pointer",
                    }}
                >
                    <span style={{ display: "flex", alignItems: "center" }}>
                        <div
                            style={{
                                backgroundColor: "#007bff",
                                color: "#fff",
                                borderRadius: "50%",
                                width: "30px",
                                height: "30px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                marginRight: "10px",
                            }}
                        >
                            {index + 1}
                        </div>
                        {field.name}
                    </span>
                    <div style={{ display: "flex" }}>
                        <div
                            onClick={() => {
                                const fieldIndex = fields.findIndex((f) => f.name === field.name);
                                if (fieldIndex !== -1) {
                                    setFieldToUpdate(fieldIndex);
                                }
                            }}
                            style={{ cursor: "pointer", marginRight: "16px" }}
                        >
                            <EditIcon />
                        </div>
                        <div
                            onClick={() => {
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
