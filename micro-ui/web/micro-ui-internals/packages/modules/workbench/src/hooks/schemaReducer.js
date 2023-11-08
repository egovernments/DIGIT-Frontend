import { useReducer } from 'react';

// Define your initial state here
function initializeState(props) {
    return {
        fields: props.fields || [],
        orderedFields: props.uiOrder || [],
        filteredObjectFields: [],
        nameError: { add: null, edit: null },
        uniqueError: false,
        currentRequired: false,
        currentUnique: false,
        currentFieldName: '',
        currentFieldType: 'string',
        currentOptions: {},
        showCurrentField: false,
        currentObjectName: '',
        addingFieldType: null,
        updatingIndex: null, // Add updatingIndex to initialState
        selectedArrayType: { label: 'String', value: 'string' }, // Add selectedArrayType to initialState
        objectMode: false,
        lastName: '',
        selectedFieldIndex: null
    };
}

// Define your action types and cases here
const schemaReducer = (state, action) => {
    switch (action.type) {
        case 'SET_FIELDS':
            return { ...state, fields: action.payload };
        case 'SET_ORDERED_FIELDS':
            return { ...state, orderedFields: action.payload };
        case 'SET_FILTERED_OBJECTS_FIELDS':
            return { ...state, filteredObjectFields: action.payload };
        case 'SET_NAME_ERROR':
            return { ...state, nameError: action.payload };
        case 'SET_UNIQUE_ERROR':
            return { ...state, uniqueError: action.payload };
        case 'SET_CURRENT_REQUIRED':
            return { ...state, currentRequired: action.payload };
        case 'SET_CURRENT_UNIQUE':
            return { ...state, currentUnique: action.payload };
        case 'SET_CURRENT_FIELD_NAME':
            return { ...state, currentFieldName: action.payload };
        case 'SET_CURRENT_FIELD_TYPE':
            return { ...state, currentFieldType: action.payload };
        case 'SET_CURRENT_OPTIONS':
            return { ...state, currentOptions: action.payload };
        case 'SET_SHOW_CURRENT_FIELD':
            return { ...state, showCurrentField: action.payload };
        case 'SET_CURRENT_OBJECT_NAME':
            return { ...state, currentObjectName: action.payload };
        case 'SET_ADDING_FIELD_TYPE':
            return { ...state, addingFieldType: action.payload };
        case 'SET_UPDATING_INDEX':
            return { ...state, updatingIndex: action.payload };
        case 'SET_SELECTED_ARRAY_TYPE':
            return { ...state, selectedArrayType: action.payload };
        case 'SET_OBJECT_MODE':
            return { ...state, objectMode: action.payload };
        case 'SET_LAST_NAME':
            return { ...state, lastName: action.payload };
        case 'SET_SELECTED_FIELD_INDEX':
            return { ...state, selectedFieldIndex: action.payload };
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