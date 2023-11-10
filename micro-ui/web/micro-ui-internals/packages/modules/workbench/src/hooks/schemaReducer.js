import { useReducer } from 'react';

// Define your initial state here
function initializeState(props) {
    return {
        fieldState: { fields: props.fields || [], orderedFields: props.uiOrder || [], filteredObjectFields: [] },
        addingFieldType: null,
        updatingIndex: null, // Add updatingIndex to initialState
        selectedArrayType: { label: 'String', value: 'string' }, // Add selectedArrayType to initialState
        objectMode: false,
        currentVariables: {
            currentFieldName: '',
            currentFieldType: 'string',
            currentOptions: {},
            showCurrentField: false,
            currentRequired: false,
            currentUnique: false,
            currentObjectName: '',
            lastName: '',
        },
    };
}

// Define your action types and cases here
const schemaReducer = (state, action) => {
    switch (action.type) {
        case 'SET_FIELD_STATE':
            return { ...state, fieldState: action.payload };
        case 'SET_CURRENT_VARIABLES':
            return { ...state, currentVariables: action.payload };
        case 'SET_ADDING_FIELD_TYPE':
            return { ...state, addingFieldType: action.payload };
        case 'SET_UPDATING_INDEX':
            return { ...state, updatingIndex: action.payload };
        case 'SET_SELECTED_ARRAY_TYPE':
            return { ...state, selectedArrayType: action.payload };
        case 'SET_OBJECT_MODE':
            return { ...state, objectMode: action.payload };
        default:
            return state;
    }
};

function useSchemaReducer(props) {
    const initialState = initializeState(props);
    const [state, dispatch] = useReducer(schemaReducer, initialState);
    return { state, dispatch };
}

export { useSchemaReducer };