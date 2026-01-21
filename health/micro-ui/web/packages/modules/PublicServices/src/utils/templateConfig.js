export const AddressFields = [
    {
      "name": "address",
      "label": "Address ",
      "type": "object",
        "properties": [
          //below is the way to use mdms dropdown, by sending schemacode, mdmsmodule, parentkey etc
          //Visibility expression is used to show hide the field based on some other field value
          // {
          //   "name": "category",
          //   "label": "Category",
          //   "type": "component",
          //   "format": "component",
          //   "component": "MDMSDependentDropdown",
          //   "populators": {
          //     "name": "category",
          //     "schemaCode": "Category",
          //     "mdmsModule": "masterDemo",
          //     "optionKey": "name",
          //     "valueKey": "code",
          //     "parentKey": "parent",
          //     "placeholder": "Select Category"
          //   },
          //   "required": false,
          //   "orderNumber": 1
          // },
          // {
          //   "name": "material",
          //   "label": "Material",
          //   "type": "component",
          //   "format": "component",
          //   "component": "MDMSDependentDropdown",
          //   "populators": {
          //     "name": "material",
          //     "schemaCode": "Material",
          //     "mdmsModule": "masterDemo",
          //     "optionKey": "name",
          //     "valueKey": "code",
          //     "parentKey": "parent",
          //     "placeholder": "Select Material",
          //     "dependsOn": "category.code"
          //   },
          //   "visibilityExpression": "values?.category?.code === 'PUCCA'",
          //   "required": false,
          //   "orderNumber": 2
          // },
          {
            "name": "pincode",
            "label": "Pincode ",
            "disable" : false,
            "type": "string",
            "format": "number",
            "maxLength": 6,
            "minLength": 0,
            "validation": {
              "regex": "^[1-9][0-9]{5}$",
              "message": "Only 6 numbers allowed",
              "maxLength": 6,
              "minLength": 0,
            },
            "required": false,
            "orderNumber": 1
          },
          {
            "key": "city",
            "type": "boundary",
            "name":"city",
            "inline": true,
            "label": "city",
            "disable": false,
            "populators": {
                "name":"city",
                "levelConfig":  window?.location.href.includes("unified-uat") || window?.location.href.includes("localhost") ? {lowestLevel:"LGA",highestLevel:"LGA", isSingleSelect:["LGA"]} : {lowestLevel:"LOCALITY",highestLevel:"LOCALITY", isSingleSelect:["LOCALITY"]} ,
                "hierarchyType": window?.location.href.includes("unified-uat") || window?.location.href.includes("localhost") ? "ADMIN" : "NEWTEST00222" ,
                "noCardStyle":true,
                layoutConfig: {
                  // isDropdownLayoutHorizontal: true,
                  // isLabelFieldLayoutHorizontal: true,
                  isLabelNotNeeded:true
                },
                //"preSelected":["NEWTEST00222_MO","NEWTEST00222_MO_11_MARYLAND","NEWTEST00222_MO_11_06_PLEEBO"],
                
                // "frozenData":
                // [{
                //     code: "NEWTEST00222_MO",
                //     name: "NEWTEST00222_MO"
                //   },
                //   {
                //     code: "NEWTEST00222_MO.NEWTEST00222_MO_11_MARYLAND",
                //     name: "NEWTEST00222_MO_11_MARYLAND"
                //   },
                //   {
                //     code: "NEWTEST00222_MO.NEWTEST00222_MO_11_MARYLAND.NEWTEST00222_MO_11_06_PLEEBO",
                //     name: "NEWTEST00222_MO_11_06_PLEEBO"
                //   }]
            },
          },
          //below example is to show how to use value expression to calculate field value based on other field values - valueExpression
          // {
          //   "name": "length",
          //   "label": "Length (in meters)",
          //   "disable": false,
          //   "type": "string",
          //   "format": "number",
          //   "maxLength": 10,
          //   "minLength": 0,
          //   "validation": {
          //     "regex": "^[0-9]+(\\.[0-9]+)?$",
          //     "message": "Only numbers allowed"
          //   },
          //   "required": false,
          //   "orderNumber": 3
          // },
          // {
          //   "name": "width",
          //   "label": "Width (in meters)",
          //   "disable": false,
          //   "type": "string",
          //   "format": "number",
          //   "maxLength": 10,
          //   "minLength": 0,
          //   "validation": {
          //     "regex": "^[0-9]+(\\.[0-9]+)?$",
          //     "message": "Only numbers allowed"
          //   },
          //   "required": false,
          //   "orderNumber": 4
          // },
          // {
          //   "name": "area",
          //   "label": "Area (in square meters)",
          //   "disable": false,
          //   "type": "string",
          //   "format": "number",
          //   "maxLength": 10,
          //   "minLength": 0,
          //   "valueExpression": "(parseFloat(values?.length) || 0) * (parseFloat(values?.width) || 0)",
          //   "required": false,
          //   "orderNumber": 5
          // },
          {
            "name": "streetName",
            "label": "Street Name ",
            "disable" : false,
            "type": "string",
            "format": "text",
            "maxLength": 256,
            "minLength": 0,
            "validation": {
              "regex": "^[a-zA-Z0-9\\s\\.,\\-\\/]*$",
              "message": "Invalid street name format"
            },
            //this is how you can prefill value based on selection of other field
            //"valueExpression": "values?.material?.parent || ''",
            //"readOnlyWhenAutoFilled": false,
            "required": false,
            "orderNumber": 1
          },
          {
            "name": "mapcoord",
            "label": "Map Coord",
            "component": "MapWithInput",
            "disable" : false,
            "type": "component",
            "format": "component",
            // "maxLength": 256,
            // "minLength": 0,
            // "validation": {
            //   "regex": "^[6-9]\\d{9}$",
            //   "message": "Only 9 numbers allowed"
            // },
            // "prefix":"+253",
            // "populators":{
            //   hideSpan:false
            // },
            // "required": false,
            // "orderNumber": 1
          }
        ]
    }
  ]

export const ApplicantFields =  [{
    "name": "applicantDetails",
    "label": "Applicant Details ",
    // "type": "array",
    // "items":{
      "type": "object",
      "properties": [
        {
          "name": "name",
          "label": "Owner Name ",
          "disable" : false,
          "type": "string",
          "format": "text",
          "maxLength": 256,
          "minLength": 0,
          "validation": {
            "regex": "^[a-zA-Z\\s]*$",
            "message": "Only alphabetic characters allowed"
          },
          "required": false,
          "orderNumber": 1
        },
        {
          "name": "mobileNumber",
          "label": "Mobile Number ",
          "disable" : false,
          "type": "mobileNumber",
          "format": "mobileNumber",
          "maxLength": 256,
          "minLength": 0,
          "validation": {
            "regex": "^[6-9]\\d{9}$",
            "message": "Only 9 numbers allowed"
          },
          "prefix":"+253",
          // "populators":{
          //   hideSpan:false
          // },
          "required": false,
          "orderNumber": 1
        },
        {
          "name": "email",
          "label": "Email",
          "disable" : false,
          "type": "string",
          "format": "text",
          "maxLength": 256,
          "minLength": 0,
          "validation": {
            "regex": "^[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}$",
            "message": "invalid email"
          },
          "required": false,
          "orderNumber": 1
        },
        {
          "name": "gender",
          "label": "Gender ",
          "disable" : false,
          "type": "string",
          "format": "radioordropdown",
          "reference": "mdms",
          "required": false,
          "schema": "common-masters.GenderType" 
        },
      ]
    //}
  }]

export const documentFields = [
  {
    "head": "documents",
    "body": [
        {
            "type": "documentUploadAndDownload",
            "withoutLabel": true,
            "mdmsModuleName": "DigitStudio",
            "module": "TradeLicense.NewTL",
            "error": "WORKS_REQUIRED_ERR",
            "name": "uploadedDocs",
            "populators": {
                "name": "uploaded",
                "action": "APPLY"  
            },
            //"customClass": "input-emp",
            "localePrefix": "TL_DOC"
        }
    ]
  }
]