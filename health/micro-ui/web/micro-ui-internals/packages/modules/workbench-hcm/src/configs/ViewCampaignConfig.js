import { useTranslation } from "react-i18next";
import React from "react";

export const data = (project) => {
  const { t } = useTranslation();
  const ancestor = project?.Project?.[0]?.ancestors;
  // const lastAncestor = ancestor?.length > 0 ? ancestor[ancestor?.length - 1] : { projectNumber: "NA" };
  const isLink = ancestor?.length > 0 ? true : false;

  return {
    cards: [
      {
        sections: [
          {
            type: "DATA",
            values: [
                            {
                key: "CAMPAIGN_NAME",
                value: project?.Project?.[0]?.name || "NA",
              },
              {
                key: "WORKBENCH_CAMPAIGN_NUMBER",
                isLink: true,
                to:  `/${window?.contextPath}/employee/campaign/view-details?campaignNumber=${project?.Project?.[0]?.referenceID}&tenantId=${project?.Project?.[0]?.tenantId}` ,
                value: project?.Project?.[0]?.referenceID || "NA",
              },{
                key: "WORKBENCH_PROJECT_NUMBER",
                value: project?.Project?.[0]?.projectNumber || "NA",
              },

              {
                key: "WBH_BOUNDARY",
                value: t(project?.Project?.[0]?.address?.boundary) || "NA",
              },
              {
                key: "WORKBENCH_PROJECT_BOUNDARY_TYPE",
                value: project?.Project?.[0]?.address?.boundaryType || "NA",
              },
            ],
          },
        ],
      },
      // {
      //   navigationKey: "card1",
      //   sections: [
      //     {
      //       navigationKey: "card1",

      //       type: "COMPONENT",
      //       component: "TargetComponent",
      //       props: { targets: project?.Project?.[0]?.targets, project: project?.Project?.[0] },
      //     },
      //   ],
      // },
      {
        navigationKey: "card3",
        sections: [
          {
            navigationKey: "card3",

            type: "COMPONENT",
            component: "ProjectChildrenComponent",
            props: { projectId: project?.Project?.[0]?.id, ...project },
          },
        ],
      },
      
      // {
      //   navigationKey: "card2",
      //   sections: [
      //     {
      //       navigationKey: "card2",
      //       type: "COMPONENT",
      //       component: "ProjectBeneficiaryComponent",
      //       props: { projectId: project?.Project?.[0]?.id },
      //     },
      //   ],
      // },
      // {
      //   navigationKey: "card5",
      //   sections: [
      //     {
      //       navigationKey: "card5",

      //       type: "COMPONENT",
      //       component: "ProjectStaffComponent",
      //       props: { projectId: project?.Project?.[0]?.id, ...project },
      //     },
      //   ],
      // },

      // {
      //   navigationKey: "card4",
      //   sections: [
      //     {
      //       navigationKey: "card4",

      //       type: "COMPONENT",
      //       component: "FacilityComponent",
      //       props: { projectId: project?.Project?.[0]?.id },
      //     },
      //   ],
      // },{
      //   navigationKey: "card6",
      //   sections: [
      //     {
      //       navigationKey: "card6",

      //       type: "COMPONENT",
      //       component: "TaskComponent",
      //       props: { projectId: project?.Project?.[0]?.id },
      //     },
      //   ],
      // },
      // {
      //   navigationKey: "card7",
      //   sections: [
      //     {
      //       navigationKey: "card7",

      //       type: "COMPONENT",
      //       component: "ChecklistComponent",
      //       props: { projectId: project?.Project?.[0]?.id, projectName: project?.Project?.[0]?.name },
      //     },
      //   ],
      // },
      // {
      //   navigationKey: "card8",
      //   sections: [
      //     {
      //       navigationKey: "card8",

      //       type: "COMPONENT",
      //       component: "StockComponent",
      //       props: { projectId: project?.Project?.[0]?.id },
      //     },
      //   ],
      // },
      {
        navigationKey: "card9",
        sections: [
          {
            navigationKey: "card9",

            type: "COMPONENT",
            component: "MapComponent",
            props: { projectId: project?.Project?.[0]?.id,boundaryType:project?.Project?.[0]?.address?.boundaryType ,boundaryCode:project?.Project?.[0]?.address?.boundary },
          },
        ],
      },
      {
        navigationKey: "card10",
        sections: [
          {
            navigationKey: "card10",

            type: "COMPONENT",
            component: "EmployeesComponent",
            props: { 
              projectId: project?.Project?.[0]?.id,
              boundaryType: project?.Project?.[0]?.address?.boundaryType || "state",
              boundaryCode: project?.Project?.[0]?.address?.boundary || "OD_01_ONDO"
            },
          },
        ],
      }, 
    ],
    apiResponse: {},
    additionalDetails: {},
    horizontalNav: {
      showNav: true,
      configNavItems: [
        //  {
        //   name: "card6",
        //   active: true,
        //   code: "TASK_DETAILS",
        // },   
        //    {
        //   name: "card5",
        //   active: true,
        //   code: "USER_DETAILS",
        // },
        // {
        //   name: "card1",
        //   active: true,
        //   code: "TARGET_DETAILS",
        // },
        {
          name: "card3",
          active: true,
          code: "HCM_CHILDREN_MAPPED",
        },
        // {
        //   name: "card2",
        //   active: true,
        //   code: "CAMPAIGN_PRODUCT_LABEL",
        // },
     

        // {
        //   name: "card4",
        //   active: true,
        //   code: "FACILITY_DETAILS",
        // },   {
        //   name: "card7",
        //   active: true,
        //   code: "CHECKLIST_DETAILS",
        // },
        // {
        //   name: "card8",
        //   active: true,
        //   code: "STOCK_DETAILS",
        // },
        {
          name: "card9",
          active: true,
          code: "MAP_VIEW",
        },
         {
          name: "card10",
          active: true,
          code: "EMPLOYEES",
        },
        // {
        //   name: "card10",
        //   active: true,
        //   code: "DELIVERY_CYCLES",
        // },
        
        
      ],
      activeByDefault: "card9",
    },
  };
};
