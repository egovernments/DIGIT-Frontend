import React from 'react'
// import { ViewComposer } from '@egovernments/digit-ui-react-components'

// This is the format of data to be returned from the hook call and passed to this component as data prop
const data = {
  cards: [
    {
      sections: [
        // {
        //   type:"WFHISTORY"
        // },
        // {
        //   type:"DOCUMENTS"
        // },
        {
          type: "DATA",
          sectionHeader: { value: "Section 1", inlineStyles: {} },
          cardHeader: { value: "Card TOP", inlineStyles: {} },
          values: [
            {
              key: "key 1",
              value: "value 1",
            },
            {
              key: "key 2",
              value: "value 2",
            },
            {
              key: "key 3",
              value: "value 3",
            },
          ],
        },
        // {
        //   type:"WFACTIONS"
        // }
      ],
    },
    {
      navigationKey:"card1",
      sections: [
        {
          type: "DATA",
          sectionHeader: { value: "Section 1", inlineStyles: {} },
          cardHeader: { value: "Card 1", inlineStyles: {} },
          values: [
            {
              key: "key 1",
              value: "value 1",
            },
            {
              key: "key 2",
              value: "value 2",
            },
            {
              key: "key 3",
              value: "value 3",
            },
          ],
        },
        {
          type: "DATA",
          sectionHeader: { value: "Section 2", inlineStyles: { marginTop: "2rem" } },
          // cardHeader:{value:"Card 1",inlineStyles:{}},
          values: [
            {
              key: "key 1",
              value: "value 1",
            },
            {
              key: "key 2",
              value: "value 2",
            },
            {
              key: "key 3",
              value: "value 3",
            },
          ],
        },
        {
          type: "DOCUMENTS",
          documents: [
            {
              title: "WORKS_RELEVANT_DOCUMENTS",
              BS: "Works",
              values: [
                {
                  title: "Proposal document",
                  documentType: "PROJECT_PROPOSAL",
                  documentUid: "cfed582b-31b0-42e9-985f-fb9bb4543670",
                  fileStoreId: "cfed582b-31b0-42e9-985f-fb9bb4543670",
                },
                {
                  title: "Finalised worklist",
                  documentType: "FINALIZED_WORKLIST",
                  documentUid: "f7543894-d3a1-4263-acb2-58b1383eebec",
                  fileStoreId: "f7543894-d3a1-4263-acb2-58b1383eebec",
                },
                {
                  title: "Feasibility analysis",
                  documentType: "FEASIBILITY_ANALYSIS",
                  documentUid: "c4fb4f5d-a4c3-472e-8991-e05bc2d671f5",
                  fileStoreId: "c4fb4f5d-a4c3-472e-8991-e05bc2d671f5",
                },
              ],
            },
          ],
          inlineStyles: {
            marginTop: "1rem",
          },
        },
        {
          type: "WFHISTORY",
          businessService: "ESTIMATE",
          applicationNo: "ES/2023-24/000828",
          tenantId: "pg.citya",
          timelineStatusPrefix: "TEST",
        },
        {
          type: "WFACTIONS",
          forcedActionPrefix: "TEST",
          businessService: "ESTIMATE",
          applicationNo: "ES/2023-24/000828",
          tenantId: "pg.citya",
          applicationDetails: {
            id: "9d5fd241-f39e-43bc-ab38-9acd76d092fc",
            tenantId: "pg.citya",
            estimateNumber: "ES/2023-24/000828",
            projectId: "ddc1886d-554a-4431-b29b-cceb34bb5378",
            proposalDate: 1695391084539,
            status: "INWORKFLOW",
            wfStatus: "PENDINGFORTECHNICALSANCTION",
            name: "PRJ - 22-09",
            referenceNumber: null,
            description: "DESC",
            executingDepartment: "WRK",
            address: {
              id: "95283d85-c045-473c-8919-af26c8b2792c",
              tenantId: "pg.citya",
              doorNo: null,
              latitude: 0,
              longitude: 0,
              locationAccuracy: null,
              type: null,
              addressNumber: null,
              addressLine1: null,
              addressLine2: null,
              landmark: null,
              city: "pg.citya",
              pincode: null,
              detail: null,
              buildingName: null,
              street: null,
              boundaryType: null,
              boundary: null,
              auditDetails: null,
            },
            estimateDetails: [
              {
                id: "51b68815-2ea2-4486-9fa5-2f2bd40fc4cf",
                sorId: "45",
                category: "NON-SOR",
                name: "LI1",
                description: "LI1",
                unitRate: 200,
                noOfunit: 10,
                uom: "KG",
                uomValue: 0,
                amountDetail: [
                  {
                    id: "afeeab37-a87f-4220-b00c-05249dd4df55",
                    type: "EstimatedAmount",
                    amount: 2000,
                    isActive: true,
                    additionalDetails: null,
                  },
                ],
                isActive: true,
                additionalDetails: null,
              },
              {
                id: "ce855472-7587-4cc5-bf4c-9cb1fc473314",
                sorId: "45",
                category: "NON-SOR",
                name: "LI@",
                description: "LI@",
                unitRate: 300,
                noOfunit: 43,
                uom: "SQM",
                uomValue: 0,
                amountDetail: [
                  {
                    id: "7a0e88c8-d0a0-4c30-b018-e0a081255d12",
                    type: "EstimatedAmount",
                    amount: 12900,
                    isActive: true,
                    additionalDetails: null,
                  },
                ],
                isActive: true,
                additionalDetails: null,
              },
              {
                id: "9d6905c4-48b1-4948-ab25-cebc6aeb0460",
                sorId: null,
                category: "OVERHEAD",
                name: "SC",
                description: "Supervision Charge",
                unitRate: 0,
                noOfunit: 0,
                uom: null,
                uomValue: 0,
                amountDetail: [
                  {
                    id: "fabd19ac-e056-49ef-825a-6f82e0404505",
                    type: "SC",
                    amount: 1117.5,
                    isActive: true,
                    additionalDetails: null,
                  },
                ],
                isActive: true,
                additionalDetails: {
                  row: {
                    name: {
                      id: "1",
                      code: "SC",
                      name: "ES_COMMON_OVERHEADS_SC",
                      type: "percentage",
                      value: "7.5",
                      active: true,
                      description: "Supervision Charge",
                      effectiveTo: null,
                      effectiveFrom: 1682164954037,
                      isAutoCalculated: true,
                      isWorkOrderValue: true,
                    },
                    amount: "1117.50",
                    percentage: "7.5 %",
                  },
                },
              },
              {
                id: "94eecdbd-3049-4ce8-9f32-cb9f52b0b636",
                sorId: null,
                category: "OVERHEAD",
                name: "GST",
                description: "Goods and Service Tax",
                unitRate: 0,
                noOfunit: 0,
                uom: null,
                uomValue: 0,
                amountDetail: [
                  {
                    id: "43e7932f-f075-4dfb-b0b2-004c9403c6e6",
                    type: "GST",
                    amount: 2682,
                    isActive: true,
                    additionalDetails: null,
                  },
                ],
                isActive: true,
                additionalDetails: {
                  row: {
                    name: {
                      id: "2",
                      code: "GST",
                      name: "ES_COMMON_OVERHEADS_GST",
                      type: "percentage",
                      value: "18",
                      active: true,
                      description: "Goods and Service Tax",
                      effectiveTo: null,
                      effectiveFrom: 1682164954037,
                      isAutoCalculated: true,
                      isWorkOrderValue: true,
                    },
                    amount: "2682.00",
                    percentage: "18 %",
                  },
                },
              },
            ],
            auditDetails: {
              createdBy: "bff9c3f6-6a25-45c4-b7ae-dddc016598fd",
              lastModifiedBy: "be56be64-6aa8-46e8-8a00-4794fb5e1170",
              createdTime: 1695391084539,
              lastModifiedTime: 1695555231460,
            },
            additionalDetails: {
              ward: "B1",
              creator: "SMS QA testing",
              locality: "SUN01",
              location: {
                city: "pg.citya",
                ward: "B1",
                locality: "B1",
              },
              tenantId: "pg.citya",
              documents: [
                {
                  fileName: "",
                  fileType: "Others",
                },
                {
                  fileName: "Project-PJ_2023-24_05_002144 (1).pdf",
                  fileType: "ESTIMATE_DOC_DETAILED_ESTIMATE",
                  tenantId: "pg.citya",
                  documentUid: "450dbb64-4159-45ad-b5b4-cd2237a40d84",
                  fileStoreId: "450dbb64-4159-45ad-b5b4-cd2237a40d84",
                },
                {
                  fileName: "Project-PJ_2023-24_05_000246.pdf",
                  fileType: "ESTIMATE_DOC_LABOUR_ANALYSIS",
                  tenantId: "pg.citya",
                  documentUid: "86d299ef-2d7d-4af7-8beb-685bf283a6b2",
                  fileStoreId: "86d299ef-2d7d-4af7-8beb-685bf283a6b2",
                },
                {
                  fileName: "WorkOrder-WO_2023-24_000713 (1).pdf",
                  fileType: "ESTIMATE_DOC_MATERIAL_ANALYSIS",
                  tenantId: "pg.citya",
                  documentUid: "3f389115-e5ab-4e27-9d2f-20c3c7cab534",
                  fileStoreId: "3f389115-e5ab-4e27-9d2f-20c3c7cab534",
                },
                {
                  fileType: "ESTIMATE_DOC_DESIGN_DOCUMENT",
                },
                {
                  fileName: "",
                  fileType: "Others",
                },
              ],
              projectName: "PRJ - 22-09",
              projectNumber: "PJ/2023-24/09/000936",
              totalEstimatedAmount: 18699.5,
              labourMaterialAnalysis: {
                labour: "2000",
                material: "16000",
              },
            },
            project: null,
            ProcessInstances: null,
          },
          url: "/estimate/v1/_update",
          moduleCode: "Estimate",
          editApplicationNumber: undefined,
        },
      ],
    },
    {
      navigationKey:"card2",
      sections: [
        // {
        //   type:"WFHISTORY"
        // },
        // {
        //   type:"DOCUMENTS"
        // },
        {
          type: "DATA",
          sectionHeader: { value: "Section 1", inlineStyles: {} },
          cardHeader: { value: "Card 2", inlineStyles: {} },
          values: [
            {
              key: "key 1",
              value: "value 1",
            },
            {
              key: "key 2",
              value: "value 2",
              caption:"thisiscaption"
            },
            {
              key: "key 3",
              value:"thisislink",
              isLink:true,
              // localeprefix:pre
              //id {card[1]scection[]0+key}
              //classname
              // type:"link"/string/number/date/amount/
              to:"/works-ui/employee/estimate/estimate-details?tenantId=pg.citya&estimateNumber=ES/2023-24/000828",
            },
          ],
        },
        {
          type: "COMPONENT",
          component:"GenericViewTestComp",
          props:{
            name:"customcomp",
            details:"sdf"
          }

        },
        // {
        //   type:"WFACTIONS"
        // }
      ],
    },
    {
      navigationKey:"card3",
      sections: [
        // {
        //   type:"WFHISTORY"
        // },
        // {
        //   type:"DOCUMENTS"
        // },
        {
          type: "DATA",
          sectionHeader: { value: "Section 1", inlineStyles: {} },
          cardHeader: { value: "Card 3", inlineStyles: {} },
          values: [
            {
              key: "key 1",
              value: "value 1",
            },
            {
              key: "key 2",
              value: "value 2",
              caption:"thisiscaption"
            },
            {
              key: "key 3",
              value:"thisislink",
              isLink:true,
              to:"/works-ui/employee/estimate/estimate-details?tenantId=pg.citya&estimateNumber=ES/2023-24/000828",
            },
          ],
        },
        {
          type: "COMPONENT",
          component:"GenericViewTestComp",
          props:{
            name:"customcomp",
            details:"sdf"
          }

        },
        // {
        //   type:"WFACTIONS"
        // }
      ],
    },
  ],
  apiResponse:{

  },
  additionalDetails:{

  },
  horizontalNav:{
    showNav:true,
    configNavItems:[
      {
        name:"card1",
        active:true,
        code:"CARD_1"
      },
      {
        name:"card2",
        active:true,
        code:"CARD_2"
      },
      {
        name:"card3",
        active:true,
        code:"CARD_3"
      }
    ],
    activeByDefault:"card2"
  }
};
const SampleComp = () => {
  return (
    // <ViewComposer data={data} isLoading={false} />
    <div>SampleComp</div>
  )
}

export default SampleComp