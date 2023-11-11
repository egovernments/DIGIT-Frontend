const fieldTypes = [
    { label: 'String', value: 'string' },
    { label: 'Number', value: 'number' },
    { label: 'Boolean', value: 'boolean' },
    { label: 'Date', value: 'date' },
    { label: 'Date-Time', value: 'date-time' },
    { label: 'Object', value: 'object' },
    { label: 'Array', value: 'array' },
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
    { label: 'String', value: 'string' },
    { label: 'Number', value: 'number' },
    { label: 'Boolean', value: 'boolean' },
    { label: 'Date', value: 'date' },
    { label: 'Date-Time', value: 'date-time' },
    { label: 'Object', value: 'object' },
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