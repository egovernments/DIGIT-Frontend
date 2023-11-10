import React, { useState } from 'react';
import { DeleteIcon, EditIcon } from '@egovernments/digit-ui-react-components';
import { setFieldToUpdate, removeField } from '../utils/schemaUtils';

const FieldView = ({ state, dispatch }) => {
    const [draggedIndex, setDraggedIndex] = useState(null);
    var orderedFields = state.objectMode ? state.fieldState.filteredObjectFields : state.fieldState.orderedFields;
    const fields = state.fieldState.fields;
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
            dispatch({ type: 'SET_FIELD_STATE', payload: { ...state.fieldState, orderedFields: newOrderedFields } });
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
                    data-index={index}
                    draggable={state.objectMode ? "false" : "true"}
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className='field-view-container flex-container'
                    style={{
                        border: state.objectMode ? "" : "1px solid #ccc",
                        cursor: state.objectMode ? "" : "pointer",
                    }}
                >
                    {state.objectMode ? (
                        <span
                            className='field-name'
                            style={
                                {
                                    color: (field.type === 'object' || (field.type == 'array' && field?.options?.arrayType == 'object')) ? '#F47738' : 'black',
                                    cursor: (field.type === 'object' || (field.type == 'array' && field?.options?.arrayType == 'object')) ? 'pointer' : 'default'
                                }
                            } onClick={() => {
                                if ((field.type === 'object' || (field.type == 'array' && field?.options?.arrayType == 'object'))) {
                                    dispatch({ type: 'SET_CURRENT_VARIABLES', payload: { ...state.currentVariables, currentObjectName: field.name } });
                                    dispatch({ type: 'SET_OBJECT_MODE', payload: true });
                                }
                            }}>
                            {field.name.includes('.') ? field.name.split('.').pop() : field.name}
                        </span>
                    ) : (
                        <div className='flex-container'>
                            <span className="arrow-up">&#8593;</span>
                            <span className="arrow-down">&#8595;</span>
                            <span
                                className='field-name'
                                style={
                                    {
                                        color: (field.type === 'object' || (field.type === 'array' && field?.options?.arrayType === 'object')) ? '#F47738' : 'black',
                                        cursor: (field.type === 'object' || (field.type === 'array' && field?.options?.arrayType === 'object')) ? 'pointer' : 'default'
                                    }
                                } onClick={() => {
                                    if ((field.type === 'object' || (field.type === 'array' && field?.options?.arrayType === 'object'))) {
                                        dispatch({ type: 'SET_CURRENT_VARIABLES', payload: { ...state.currentVariables, currentObjectName: field.name } });
                                        dispatch({ type: 'SET_OBJECT_MODE', payload: true });
                                    }
                                }}>
                                {field.name.includes('.') ? field.name.split('.').pop() : field.name}{field.required ? ' *' : ''}
                            </span>
                        </div>

                    )}


                    <div className='flex-container'>
                        <div
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent the click event from bubbling
                                const fieldIndex = fields.findIndex((f) => f.name === field.name);
                                if (fieldIndex !== -1) {
                                    setFieldToUpdate(fieldIndex, state, dispatch, field.name);
                                }
                                else {
                                    dispatch({ type: 'SET_CURRENT_VARIABLES', payload: { ...state.currentVariables, lastName: field.name } });
                                }
                            }}
                            className='icon-pointer'
                        >
                            <EditIcon />
                        </div>
                        <div
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent the click event from bubbling
                                const fieldIndex = fields.findIndex((f) => f.name === field.name);
                                if (fieldIndex !== -1) {
                                    removeField(fieldIndex, state, dispatch);
                                }
                            }}
                            className='icon-pointer'
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
