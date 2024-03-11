const facilityTemplateSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "FacilityTemplateSchema",
    "type": "object",
    "properties": {
        "Facility Name": {
            "type": "string",
            "maxLength": 2000,
            "minLength": 1
        },
        "Facility Type": {
            "type": "string",
            "enum": ["Storing Resource"]
        },
        "Facility Status": {
            "type": "string",
            "enum": ["Temp", "Perm"]
        },
        "Facility Capacity": {
            "type": "number",
            "minimum": 0,
            "maximum": 9223372036854775807
        }
    },
    "required": [
        "Facility Name",
        "Facility Type",
        "Facility Status",
        "Facility Capacity"
    ]
}

export default facilityTemplateSchema