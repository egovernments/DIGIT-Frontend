export const ViewConfig = [
    {
        head: "",
        key: "OpenViewComponent",
        body: [
            {
                isMandatory: false,
                key: "OpenViewComponent",
                type: "component",
                component: "OpenViewComponent",
                withoutLabel: true,
                disable: false,
                customProps: {},
                populators: {
                    name: "OpenViewComponent",
                    required: true
                },
            },
        ],
    },
    {
        head: "Payer Details",
        body: [
            {
                isMandatory: true,
                type: "dropdown",
                key: "paidby",
                label: "Paid By",
                disable: false,
                populators: {
                    name: "paidby",
                    optionsKey: "name",
                    error: "This Field is Required",
                    required: true,
                    options: [
                        {
                            code: "OWNER",
                            name: "OWNER",
                        },
                        {
                            code: "OTHER",
                            name: "OTHER",
                        }
                    ],
                },
            },
            {
                "type": "text",
                "label": "Payer Name",
                "isMandatory": true,
                "populators": {
                    "name": "payername",
                    "optionsKey": "name",
                    required: true,
                    error: "This Field is Required",
                }
            },
            {
                "type": "number",
                "label": "Payer Mobile No",
                "isMandatory": true,
                "populators": {
                    error: "mobile number length should be 10",
                    "name": "payermob",
                    "optionsKey": "name",
                    required: true,
                    validation: { maxlength: 10 },
                }
            },
        ]
    },
    {
        head: "Payment Details",
        body: [
            {
                isMandatory: false,
                type: "radio",
                label: "Payment Mode",
                disable: false,
                populators: {
                    name: "mode",
                    optionsKey: "name",
                    required: false,
                    options: [
                        {
                            code: "CASH",
                            name: "CASH",
                        },
                        {
                            code: "CHEQUE",
                            name: "CHEQUE",
                        },
                        {
                            code: "CARD",
                            name: "Credit/Debit Card",
                        },
                    ],
                },
            },
        ]
    },
]

export const ChequeConfig = [
    {
        head: "",
        key: "OpenViewComponent",
        body: [
            {
                isMandatory: false,
                key: "OpenViewComponent",
                type: "component",
                component: "OpenViewComponent",
                withoutLabel: true,
                disable: false,
                customProps: {},
                populators: {
                    name: "OpenViewComponent",
                    required: true
                },
            },
        ],
    },
    {
        head: "Payer Details",
        body: [
            {
                isMandatory: true,
                type: "dropdown",
                key: "paidby",
                label: "Paid By",
                disable: false,
                populators: {
                    name: "paidby",
                    optionsKey: "name",
                    error: "This Field is Required",
                    required: true,
                    options: [
                        {
                            code: "OWNER",
                            name: "OWNER",
                        },
                        {
                            code: "OTHER",
                            name: "OTHER",
                        }
                    ],
                },
            },
            {
                "type": "text",
                "label": "Payer Name",
                "isMandatory": true,
                "populators": {
                    "name": "payername",
                    "optionsKey": "name",
                    required: true,
                    error: "This Field is Required",
                }
            },
            {
                "type": "number",
                "label": "Payer Mobile No",
                "isMandatory": true,
                "populators": {
                    error: "mobile number length should be 10",
                    "name": "payermob",
                    "optionsKey": "name",
                    required: true,
                    validation: { maxlength: 10 },
                }
            },
        ]
    },
    {
        head: "Payment Details",
        body: [
            {
                isMandatory: false,
                type: "radio",
                label: "Payment Mode",
                disable: false,
                populators: {
                    name: "mode",
                    optionsKey: "name",
                    required: false,
                    options: [
                        {
                            code: "CASH",
                            name: "CASH",
                        },
                        {
                            code: "CHEQUE",
                            name: "CHEQUE",
                        },
                        {
                            code: "CARD",
                            name: "Credit/Debit Card",
                        },
                    ],
                },
            },
        ]
    },
    {
        head: "Cheque Details",
        body: [
            {
                "type": "number",
                "label": "Cheque No",
                "isMandatory": true,
                "populators": {
                    "name": "chequeno",
                    error: "This Field is Required",
                }
            },
            {
                label: "Cheque Date",
                isMandatory: true,
                type: "date",
                disable: false,
                populators: {
                    name: "chequedata",
                    error: "This Field is Required",
                },
            },
            {
                label: "IFSC Code",
                isMandatory: true,
                type: "search",
                disable: false,
                populators: {
                    name: "ifsc",
                    error: "This Field is Required",
                },
            },
            {
                "type": "text",
                "label": "Bank Name",
                "isMandatory": false,
                disable: true,
                "populators": {
                    "name": "bankname",
                }
            },
            {
                "type": "text",
                "label": "Bank Branch",
                "isMandatory": false,
                disable: true,
                "populators": {
                    "name": "bankb",
                }
            },
        ]
    },
]

export const CardConfig = [
    {
        head: "",
        key: "OpenViewComponent",
        body: [
            {
                isMandatory: false,
                key: "OpenViewComponent",
                type: "component",
                component: "OpenViewComponent",
                withoutLabel: true,
                disable: false,
                customProps: {},
                populators: {
                    name: "OpenViewComponent",
                    required: true
                },
            },
        ],
    },
    {
        head: "Payer Details",
        body: [
            {
                isMandatory: true,
                type: "dropdown",
                key: "paidby",
                label: "Paid By",
                disable: false,
                populators: {
                    name: "paidby",
                    optionsKey: "name",
                    error: "This Field is Required",
                    required: true,
                    options: [
                        {
                            code: "OWNER",
                            name: "OWNER",
                        },
                        {
                            code: "OTHER",
                            name: "OTHER",
                        }
                    ],
                },
            },
            {
                "type": "text",
                "label": "Payer Name",
                "isMandatory": true,
                "populators": {
                    "name": "payername",
                    "optionsKey": "name",
                    required: true,
                    error: "This Field is Required",
                }
            },
            {
                "type": "number",
                "label": "Payer Mobile No",
                "isMandatory": true,
                "populators": {
                    error: "mobile number length should be 10",
                    "name": "payermob",
                    "optionsKey": "name",
                    required: true,
                    validation: { maxlength: 10 },
                }
            },
        ]
    },
    {
        head: "Payment Details",
        body: [
            {
                isMandatory: false,
                type: "radio",
                label: "Payment Mode",
                disable: false,
                populators: {
                    name: "mode",
                    optionsKey: "name",
                    required: false,
                    options: [
                        {
                            code: "CASH",
                            name: "CASH",
                        },
                        {
                            code: "CHEQUE",
                            name: "CHEQUE",
                        },
                        {
                            code: "CARD",
                            name: "Credit/Debit Card",
                        },
                    ],
                },
            },
        ]
    },
    {
        head: "Payment Details",
        body: [
            {
                "type": "number",
                "label": "Last 4 digits",
                "isMandatory": true,
                "populators": {
                    "name": "digit",
                    error: "Length should be 4",
                    validation: {
                        maxlength: 4,

                    },
                }
            },
            {
                "type": "number",
                "label": "Transaction No",
                "isMandatory": true,
                disable: false,
                "populators": {
                    "name": "transactionno",
                    error: "This Field is Required",
                }
            },
            {
                "type": "number",
                "label": "Re-Enter Transaction No",
                "isMandatory": true,
                disable: false,
                "populators": {
                    "name": "ReTransactionno",
                    error: "This Field is Required",
                    "customStyle": {
                        "flexDirection": "vertical"
                    }
                }
            },
        ]
    },
];