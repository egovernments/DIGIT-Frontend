const fieldTypes = [
    { label: 'WORKBENCH_DROPDOWN_STRING', value: 'string' },
    { label: 'WORKBENCH_DROPDOWN_NUMBER', value: 'number' },
    { label: 'WORKBENCH_DROPDOWN_BOOLEAN', value: 'boolean' },
    { label: 'WORKBENCH_DROPDOWN_DATE', value: 'date' },
    { label: 'WORKBENCH_DROPDOWN_DATE_TIME', value: 'date-time' },
    { label: 'WORKBENCH_DROPDOWN_OBJECT', value: 'object' },
    { label: 'WORKBENCH_DROPDOWN_ARRAY', value: 'array' },
];

const propertyMap = {
    'string': ['minLength', 'maxLength', 'pattern', 'format'],
    'number': ['multipleOf', 'minimum', 'maximum', 'exclusiveMinimum', 'exclusiveMaximum'],
    'date': ['minimum', 'maximum', 'exclusiveMinimum', 'exclusiveMaximum'],
    'date-time': ['minimum', 'maximum', 'exclusiveMinimum', 'exclusiveMaximum'],
    'boolean': [],
    'object': [],
    'array': ['arrayType', 'minLength of Array', 'maxLength of Array']
};

const arrayTypes = [
    { label: 'WORKBENCH_DROPDOWN_STRING', value: 'string' },
    { label: 'WORKBENCH_DROPDOWN_NUMBER', value: 'number' },
    { label: 'WORKBENCH_DROPDOWN_NUMBER', value: 'boolean' },
    { label: 'WORKBENCH_DROPDOWN_DATE', value: 'date' },
    { label: 'WORKBENCH_DROPDOWN_DATE_TIME', value: 'date-time' },
    { label: 'WORKBENCH_DROPDOWN_OBJECT', value: 'object' },
];

const resetCurrentVariables = {
    name: '',
    type: 'string',
    options: {},
    showField: false,
    required: false,
    unique: false,
    objectName: '',
    lastName: '',
    order: undefined
}

export { fieldTypes, propertyMap, arrayTypes, resetCurrentVariables }