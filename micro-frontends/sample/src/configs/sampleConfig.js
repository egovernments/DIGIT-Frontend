const schema ={
    "title": "Complex Form",
    "type": "object",
    "properties": {
      "personalInfo": {
        "type": "object",
        "title": "Personal Information",
        "properties": {
          "firstName": {
            "type": "string",
            "title": "First Name"
          },
          "lastName": {
            "type": "string",
            "title": "Last Name"
          },
          "age": {
            "type": "integer",
            "title": "Age"
          },
          "email": {
            "type": "string",
            "format": "email",
            "title": "Email"
          }
        }
      },
      "address": {
        "type": "object",
        "title": "Address",
        "properties": {
          "street": {
            "type": "string",
            "title": "Street"
          },
          "city": {
            "type": "string",
            "title": "City"
          },
          "state": {
            "type": "string",
            "title": "State"
          },
          "zipCode": {
            "type": "string",
            "title": "Zip Code"
          }
        }
      },
      "phones": {
        "type": "array",
        "title": "Phone Numbers",
        "items": {
          "type": "object",
          "properties": {
            "type": {
              "type": "string",
              "title": "Type",
              "enum": ["Home", "Work", "Mobile"]
            },
            "number": {
              "type": "string",
              "title": "Number"
            }
          }
        }
      },
      "preferences": {
        "type": "object",
        "title": "Preferences",
        "properties": {
          "newsletter": {
            "type": "boolean",
            "title": "Receive Newsletter"
          },
          "notifications": {
            "type": "object",
            "title": "Notifications",
            "properties": {
              "email": {
                "type": "boolean",
                "title": "Email"
              },
              "sms": {
                "type": "boolean",
                "title": "SMS"
              },
              "push": {
                "type": "boolean",
                "title": "Push Notifications"
              }
            }
          }
        }
      }
    },
    "required": ["personalInfo", "email"]
  }
  
  const uiSchema = {
    "ui:groups": {
      "personalInfo": ["firstName", "lastName", "age", "email"],
      "address": ["street", "city", "state", "zipCode"],
      "phones": ["phones"],
      "preferences": ["newsletter", "notifications"]
    },
    "firstName": {
      "ui:widget": "text"
    },
    "lastName": {
      "ui:widget": "text"
    },
    "age": {
      "ui:widget": "number"
    },
    "email": {
      "ui:widget": "email"
    },
    "street": {
      "ui:widget": "text"
    },
    "city": {
      "ui:widget": "text"
    },
    "state": {
      "ui:widget": "text"
    },
    "zipCode": {
      "ui:widget": "text"
    },
    "phones": {
      "items": {
        "type": {
          "ui:widget": "select"
        },
        "number": {
          "ui:widget": "text"
        }
      }
    },
    "newsletter": {
      "ui:widget": "checkbox"
    },
    "notifications": {
      "email": {
        "ui:widget": "checkbox"
      },
      "sms": {
        "ui:widget": "checkbox"
      },
      "push": {
        "ui:widget": "checkbox"
      }
    }
  }

  export const sampleConfig ={uiSchema,schema}