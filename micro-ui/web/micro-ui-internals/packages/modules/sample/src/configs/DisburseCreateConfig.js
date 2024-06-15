export const newConfig = [
    {
   head: "Create Disburse",   
    body: [
      {
        inline: true,
        label: "Program Code",
        isMandatory: false,
        key: "program_code",
        type: "text",
        disable: false,
        populators: { name: "program_code", error: "Required", validation: { pattern: /^[A-Za-z]+$/i } },
      },
      {
        inline: true,
        label: "Project Code",
        isMandatory: false,
        key: "project_code",
        type: "text",
        disable: false,
        populators: { name: "project_code", error: "Required", validation: { pattern: /^[A-Za-z]+$/i } },
      },
      {
        inline: true,
        label: "Target Id",
        isMandatory: false,
        key: "target_id",
        type: "text",
        disable: false,
        populators: { name: "target_id", error: "Required", validation: { pattern: /^[A-Za-z]+$/i } },
      },
      {
        inline: true,
        label: "Transaction Id",
        isMandatory: false,
        key: "transaction_id",
        type: "text",
        disable: false,
        populators: { name: "transaction_id", error: "Required", validation: { pattern: /^[A-Za-z]+$/i } },
      },
      {
        inline: true,
        label: "Sanction Id",
        isMandatory: false,
        key: "sanction_id",
        type: "text",
        disable: false,
        populators: { name: "sanction_id", error: "Required", validation: { pattern: /^[A-Za-z]+$/i } },
      },
      {
        inline: true,
        label: "Account Code",
        isMandatory: false,
        key: "account_code",
        type: "text",
        disable: false,
        populators: { name: "account_code", error: "Required", validation: { pattern: /^[A-Za-z]+$/i } },
      },
      {
        inline: true,
        label: "Net Amount",
        isMandatory: false,
        key: "net_amount",
        type: "number",
        disable: false,
        populators: { name: "net_amount", error: "Required", validation: { pattern: /^[A-Za-z]+$/i } },
      },
      {
        inline: true,
        label: "Gross Amount",
        isMandatory: false,
        key: "gross_amount",
        type: "number",
        disable: false,
        populators: { name: "gross_amount", error: "Required", validation: { pattern: /^[A-Za-z]+$/i } },
      },
      {
        inline: true,
        label: "Status Code",
        isMandatory: false,
        key: "status_code",
        type: "text",
        disable: false,
        populators: { name: "status_code", error: "Required", validation: { pattern: /^[A-Za-z]+$/i } },
      },

      ],
    },
    {
      head: "Individual Details",
      body: [
        {
          inline: true,
          label: "Name",
          isMandatory: false,
          key: "name",
          type: "text",
          disable: false,
          populators: { name: "name", error: "Required", validation: { pattern: /^[A-Za-z]+$/i } },
        },
        {
          inline: true,
          label: "Email",
          isMandatory: false,
          key: "email",
          type: "text",
          disable: false,
          populators: { name: "email", error: "Required", validation: { pattern: /^[A-Za-z]+$/i } },
        },
        {
          inline: true,
          label: "Phone",
          isMandatory: false,
          key: "phone",
          type: "text",
          disable: false,
          populators: { name: "phone", error: "Required", validation: { pattern: /^[A-Za-z]+$/i } },
        },
        {
          inline: true,
          label: "Pin",
          isMandatory: false,
          key: "pin",
          type: "text",
          disable: false,
          populators: { name: "pin", error: "Required", validation: { pattern: /^[A-Za-z]+$/i } },
        },
        {
          inline: true,
          label: "Address",
          isMandatory: false,
          key: "address",
          type: "text",
          disable: false,
          populators: { name: "address", error: "Required", validation: { pattern: /^[A-Za-z]+$/i } },
        },
        
        // {
        //   isMandatory: false,
        //   key: "locality",
        //   type: "dropdown",
        //   label: "Enter locality",
        //   disable: false,
        //   populators: {
        //     name: "locality",
        //     optionsKey: "name",
        //     error: " Required",
        //     required: true,

        //     options: [
        //       {
        //           "code": "SUN01",
        //           "name": "Ajit Nagar - Area1",
        //           "label": "Locality",
        //           "latitude": "31.63089",
        //           "longitude": "74.871552",
        //           "area": "Area1",
        //           "pincode": [
        //               143001
        //           ],
        //           "boundaryNum": 1,
        //           "children": []
        //       },
        //       {
        //           "code": "SUN02",
        //           "name": "Back Side 33 KVA Grid Patiala Road",
        //           "label": "Locality",
        //           "latitude": null,
        //           "longitude": null,
        //           "area": "Area1",
        //           "pincode": [
        //               143001
        //           ],
        //           "boundaryNum": 1,
        //           "children": []
        //       },
        //       {
        //           "code": "SUN03",
        //           "name": "Bharath Colony",
        //           "label": "Locality",
        //           "latitude": null,
        //           "longitude": null,
        //           "area": "Area1",
        //           "pincode": [
        //               143001
        //           ],
        //           "boundaryNum": 1,
        //           "children": []
        //       },
        //       {
        //           "code": "SUN10",
        //           "name": "Backside Brijbala Hospital - Area3",
        //           "label": "Locality",
        //           "latitude": null,
        //           "longitude": null,
        //           "area": "Area3",
        //           "pincode": null,
        //           "boundaryNum": 1,
        //           "children": []
        //       },
        //       {
        //           "code": "SUN11",
        //           "name": "Bigharwal Chowk to Railway Station - Area2",
        //           "label": "Locality",
        //           "latitude": null,
        //           "longitude": null,
        //           "area": "Area2",
        //           "pincode": null,
        //           "boundaryNum": 1,
        //           "children": []
        //       },
        //       {
        //           "code": "SUN12",
        //           "name": "Chandar Colony Biggarwal Road - Area2",
        //           "label": "Locality",
        //           "latitude": null,
        //           "longitude": null,
        //           "area": "Area2",
        //           "pincode": [
        //               143001
        //           ],
        //           "boundaryNum": 1,
        //           "children": []
        //       },
        //       {
        //           "code": "SUN20",
        //           "name": "Aggarsain Chowk to Mal Godown - Both Sides - Area3",
        //           "label": "Locality",
        //           "latitude": null,
        //           "longitude": null,
        //           "area": "Area3",
        //           "pincode": null,
        //           "boundaryNum": 1,
        //           "children": []
        //       },
        //       {
        //           "code": "SUN21",
        //           "name": "ATAR SINGH COLONY - Area2",
        //           "label": "Locality",
        //           "latitude": null,
        //           "longitude": null,
        //           "area": "Area2",
        //           "pincode": null,
        //           "boundaryNum": 1,
        //           "children": []
        //       },
        //       {
        //           "code": "SUN22",
        //           "name": "Back Side Naina Devi Mandir - Area2",
        //           "label": "Locality",
        //           "latitude": null,
        //           "longitude": null,
        //           "area": "Area2",
        //           "pincode": null,
        //           "boundaryNum": 1,
        //           "children": []
        //       },
        //       {
        //           "code": "SUN30",
        //           "name": "Bakhtaur Nagar - Area1",
        //           "label": "Locality",
        //           "latitude": null,
        //           "longitude": null,
        //           "area": "Area1",
        //           "pincode": null,
        //           "boundaryNum": 1,
        //           "children": []
        //       },
        //       {
        //           "code": "SUN31",
        //           "name": "Bhai Mool Chand Sahib Colony - Area1",
        //           "label": "Locality",
        //           "latitude": null,
        //           "longitude": null,
        //           "area": "Area1",
        //           "pincode": null,
        //           "boundaryNum": 1,
        //           "children": []
        //       },
        //       {
        //           "code": "SUN32",
        //           "name": "College Road (Southern side) - Area2",
        //           "label": "Locality",
        //           "latitude": null,
        //           "longitude": null,
        //           "area": "Area2",
        //           "pincode": null,
        //           "boundaryNum": 1,
        //           "children": []
        //       },
        //       {
        //           "code": "SUN33",
        //           "name": "Ekta Colony (Southern Side) - Area1",
        //           "label": "Locality",
        //           "latitude": null,
        //           "longitude": null,
        //           "area": "Area1",
        //           "pincode": null,
        //           "boundaryNum": 1,
        //           "children": []
        //       }
        //   ],
        //   },
        // },
      ],
    },
  ];