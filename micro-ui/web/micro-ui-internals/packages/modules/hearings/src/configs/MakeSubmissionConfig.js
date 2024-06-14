export const configs = [
    {
   head: "Create Individual",   
    body: [
        {
          inline: true,
          label: "Submission Type",
          isMandatory: false,
          key: "applicantname",
          type: "text",
          disable: false,
          populators: { name: "applicantname", error: "Required", validation: { pattern: /^[A-Za-z]+$/i } },
        },
        {
            inline: true,
            label: "Application Type",
            isMandatory: false,
            key: "applicantname",
            type: "text",
            disable: false,
            populators: { name: "applicantname", error: "Required", validation: { pattern: /^[A-Za-z]+$/i } },
        },
        {
            inline: true,
            label: "Submission Title",
            isMandatory: false,
            key: "applicantname",
            type: "text",
            disable: false,
            populators: { name: "applicantname", error: "Required", validation: { pattern: /^[A-Za-z]+$/i } },
        },
        {
            inline: true,
            label: "previous hearing date",
            isMandatory: false,
            key: "dob",
            type: "date",
            disable: false,
            populators: { name: "dob", error: "Required"},
          },
          {
            inline: true,
            label: "proposed hearing date",
            isMandatory: false,
            key: "dob",
            type: "date",
            disable: false,
            populators: { name: "dob", error: "Required"},
          },
        {
          isMandatory: true,
          key: "genders",
          type: "dropdown",
          label: "Enter Gender",
          disable: false,
          populators: {
            name: "genders",
            optionsKey: "name",
            error: "required ",
            mdmsConfig: {
              masterName: "GenderType",
              moduleName: "common-masters",
              localePrefix: "COMMON_GENDER",
            },
          },
        },

        {
          label: "Phone number",
          isMandatory: true,
          key: "phno",
          type: "number",
          disable: false,
          populators: { name: "phno", error: "Required", validation: { min: 0, max: 9999999999 } },
        },
      ],
    },
    {
      head: "Residential Details",
      body: [
        {
          inline: true,
          label: "Pincode",
          isMandatory: true,
          key: "pincode",
          type: "number",
          disable: false,
          populators: { name: "pincode", error: "Required " },
        },
        {
          inline: true,
          label: "City",
          isMandatory: true,
          key: "city",
          type: "text",
          disable: false,
          populators: { name: "city", error: " Required ", validation: { pattern: /^[A-Za-z]+$/i } },
        },
        {
          isMandatory: false,
          key: "locality",
          type: "dropdown",
          label: "Enter locality",
          disable: false,
          populators: {
            name: "locality",
            optionsKey: "name",
            error: " Required",
            required: true,

            options: [
              {
                  "code": "SUN01",
                  "name": "Ajit Nagar - Area1",
                  "label": "Locality",
                  "latitude": "31.63089",
                  "longitude": "74.871552",
                  "area": "Area1",
                  "pincode": [
                      143001
                  ],
                  "boundaryNum": 1,
                  "children": []
              },
              {
                  "code": "SUN02",
                  "name": "Back Side 33 KVA Grid Patiala Road",
                  "label": "Locality",
                  "latitude": null,
                  "longitude": null,
                  "area": "Area1",
                  "pincode": [
                      143001
                  ],
                  "boundaryNum": 1,
                  "children": []
              },
              {
                  "code": "SUN03",
                  "name": "Bharath Colony",
                  "label": "Locality",
                  "latitude": null,
                  "longitude": null,
                  "area": "Area1",
                  "pincode": [
                      143001
                  ],
                  "boundaryNum": 1,
                  "children": []
              },
              {
                  "code": "SUN10",
                  "name": "Backside Brijbala Hospital - Area3",
                  "label": "Locality",
                  "latitude": null,
                  "longitude": null,
                  "area": "Area3",
                  "pincode": null,
                  "boundaryNum": 1,
                  "children": []
              },
              {
                  "code": "SUN11",
                  "name": "Bigharwal Chowk to Railway Station - Area2",
                  "label": "Locality",
                  "latitude": null,
                  "longitude": null,
                  "area": "Area2",
                  "pincode": null,
                  "boundaryNum": 1,
                  "children": []
              },
              {
                  "code": "SUN12",
                  "name": "Chandar Colony Biggarwal Road - Area2",
                  "label": "Locality",
                  "latitude": null,
                  "longitude": null,
                  "area": "Area2",
                  "pincode": [
                      143001
                  ],
                  "boundaryNum": 1,
                  "children": []
              },
              {
                  "code": "SUN20",
                  "name": "Aggarsain Chowk to Mal Godown - Both Sides - Area3",
                  "label": "Locality",
                  "latitude": null,
                  "longitude": null,
                  "area": "Area3",
                  "pincode": null,
                  "boundaryNum": 1,
                  "children": []
              },
              {
                  "code": "SUN21",
                  "name": "ATAR SINGH COLONY - Area2",
                  "label": "Locality",
                  "latitude": null,
                  "longitude": null,
                  "area": "Area2",
                  "pincode": null,
                  "boundaryNum": 1,
                  "children": []
              },
              {
                  "code": "SUN22",
                  "name": "Back Side Naina Devi Mandir - Area2",
                  "label": "Locality",
                  "latitude": null,
                  "longitude": null,
                  "area": "Area2",
                  "pincode": null,
                  "boundaryNum": 1,
                  "children": []
              },
              {
                  "code": "SUN30",
                  "name": "Bakhtaur Nagar - Area1",
                  "label": "Locality",
                  "latitude": null,
                  "longitude": null,
                  "area": "Area1",
                  "pincode": null,
                  "boundaryNum": 1,
                  "children": []
              },
              {
                  "code": "SUN31",
                  "name": "Bhai Mool Chand Sahib Colony - Area1",
                  "label": "Locality",
                  "latitude": null,
                  "longitude": null,
                  "area": "Area1",
                  "pincode": null,
                  "boundaryNum": 1,
                  "children": []
              },
              {
                  "code": "SUN32",
                  "name": "College Road (Southern side) - Area2",
                  "label": "Locality",
                  "latitude": null,
                  "longitude": null,
                  "area": "Area2",
                  "pincode": null,
                  "boundaryNum": 1,
                  "children": []
              },
              {
                  "code": "SUN33",
                  "name": "Ekta Colony (Southern Side) - Area1",
                  "label": "Locality",
                  "latitude": null,
                  "longitude": null,
                  "area": "Area1",
                  "pincode": null,
                  "boundaryNum": 1,
                  "children": []
              }
          ],
          },
        },

        {
          inline: true,
          label: "Street",
          isMandatory: false,
          key: "street",
          type: "text",
          disable: false,
          populators: { name: "street", error: "Required ", validation: { pattern: /^[A-Za-z]+$/i } },
        },
        {
          inline: true,
          label: "Door Number",
          isMandatory: true,
          key: "doorno",
          type: "number",
          disable: false,
          populators: { name: "doorno", error: " Required ", validation: { min: 0, max: 9999999999 } },
        },
        {
          inline: true,
          label: "Landmark",
          isMandatory: false,
          key: "landmark",
          type: "text",
          disable: false,
          populators: { name: "landmark", error: " Required", validation: { pattern: /^[A-Za-z]+$/i } },
        },
      ],
    },
  ];