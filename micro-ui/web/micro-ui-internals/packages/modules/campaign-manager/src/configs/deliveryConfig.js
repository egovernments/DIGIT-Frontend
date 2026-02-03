//migrated to mdms
export const deliveryConfig = [
  {
    projectType: "LLIN-mz",
    attrAddDisable: true,
    deliveryAddDisable: true,
    customAttribute: true,
    cycleConfig: {
      cycle: 1,
      deliveries: 1,
      IsDisable: true
    },
    deliveryConfig: [
      {
        attributeConfig: [
          {
            key: 1,
            label: "Custom",
            attrType: "text",
            attrValue: "CAMPAIGN_BEDNET_INDIVIDUAL_LABEL",
            operatorValue: "LESS_THAN_EQUAL_TO",
            value: 3,
          },
          {
            key: 2,
            label: "Custom",
            attrType: "text",
            attrValue: "CAMPAIGN_BEDNET_HOUSEHOLD_LABEL",
            operatorValue: "LESS_THAN_EQUAL_TO",
            value: 1.8,
          },
        ],
        productConfig: [
          {
            key: 1,
            count: 1,
            value: "PVAR-2024-03-15-000043",
            name: "SP 500mg",
          },
        ],
      },
    ],
  },
  {
    projectType: "MR-DN",
    attrAddDisable: false,
    deliveryAddDisable: false,
    customAttribute: true,
    cycleConfig: {
      cycle: 3,
      deliveries: 3,
    },
    deliveryConfig: [
      {
        delivery: 1,
        conditionConfig: [
          {
            deliveryType: "DIRECT",
            attributeConfig: [
              {
                key: 1,
                label: "Custom",
                attrType: "dropdown",
                attrValue: "Age",
                operatorValue: "IN_BETWEEN",
                fromValue: 3,
                toValue: 11,
              },
            ],
            productConfig: [
              {
                key: 1,
                count: 1,
                value: "PVAR-2024-03-15-000043",
                name: "SP 500mg",
              },
              {
                key: 2,
                count: 1,
                value: "PVAR-2024-03-15-000044",
                name: "AQ 75mg",
              },
            ],
          },
          {
            deliveryType: "DIRECT",
            attributeConfig: [
              {
                key: 1,
                label: "Custom",
                attrType: "dropdown",
                attrValue: "Age",
                operatorValue: "IN_BETWEEN",
                fromValue: 12,
                toValue: 59,
              },
            ],
            productConfig: [
              {
                key: 1,
                count: 1,
                value: "PVAR-2024-03-15-000043",
                name: "SP 500mg",
              },
            ],
          },
        ],
      },
      {
        delivery: 2,
        conditionConfig: [
          {
            deliveryType: "INDIRECT",
            attributeConfig: [
              {
                key: 1,
                label: "Custom",
                attrType: "dropdown",
                attrValue: "Age",
                operatorValue: "IN_BETWEEN",
                fromValue: 3,
                toValue: 11,
              },
            ],
            productConfig: [
              {
                key: 1,
                count: 1,
                value: "PVAR-2024-03-15-000043",
                name: "SP 500mg",
              },
            ],
          },
          {
            deliveryType: "INDIRECT",
            attributeConfig: [
              {
                key: 1,
                label: "Custom",
                attrType: "dropdown",
                attrValue: "Age",
                operatorValue: "IN_BETWEEN",
                fromValue: 12,
                toValue: 59,
              },
            ],
            productConfig: [
              {
                key: 1,
                count: 1,
                value: "PVAR-2024-03-15-000043",
                name: "SP 500mg",
              },
            ],
          },
        ],
      },
      {
        delivery: 3,
        conditionConfig: [
          {
            deliveryType: "INDIRECT",
            attributeConfig: [
              {
                key: 1,
                label: "Custom",
                attrType: "dropdown",
                attrValue: "Age",
                operatorValue: "IN_BETWEEN",
                fromValue: 3,
                toValue: 11,
              },
            ],
            productConfig: [
              {
                key: 1,
                count: 1,
                value: "PVAR-2024-03-15-000043",
                name: "SP 500mg",
              },
            ],
          },
          {
            deliveryType: "INDIRECT",
            attributeConfig: [
              {
                key: 1,
                label: "Custom",
                attrType: "dropdown",
                attrValue: "Age",
                operatorValue: "IN_BETWEEN",
                fromValue: 12,
                toValue: 59,
              },
            ],
            productConfig: [
              {
                key: 1,
                count: 1,
                value: "PVAR-2024-03-15-000043",
                name: "SP 500mg",
              },
            ],
          },
        ],
      },
    ],
  },
    {
      projectType: "IRS-mz",
      attrAddDisable: true,
      deliveryAddDisable: false,
      customAttribute: true,
      productCountHide: true,
      cycleConfig: {
        cycle: 1,
        deliveries: 1,
        IsDisable: true
      },
      deliveryConfig: [
        {
          attributeConfig: [
            {
              key: 1,
              label: "Custom",
              attrType: "text",
              attrValue: "TYPE_OF_STRUCTURE",
              operatorValue: "EQUAL_TO",
              value: "CEMENT",
            },
          ],
          productConfig: [
            {
              key: 1,
              count: 1,
              value: "PVAR-2024-03-15-000043",
              name: "SP 500mg",
            },
          ],
        },
      ],
    },
];
