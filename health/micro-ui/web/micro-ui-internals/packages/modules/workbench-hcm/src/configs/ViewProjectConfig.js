import { useTranslation } from "react-i18next";
import React from "react";

export const data = (project) => {
  const { t } = useTranslation();
  const ancestor = project?.Project?.[0]?.ancestors;
  const lastAncestor = ancestor?.length > 0 ? ancestor[ancestor?.length - 1] : { projectNumber: "NA" };
  const isLink = ancestor?.length > 0 ? true : false;

  return {
    cards: [
      {
        sections: [
          {
            type: "DATA",
            values: [
              {
                key: "WORKBENCH_PROJECT_NUMBER",
                value: project?.Project?.[0]?.projectNumber || "NA",
              },
              {
                key: "CAMPAIGN_NAME",
                value: project?.Project?.[0]?.name || "NA",
              },
              {
                key: "CAMPAIGN_TYPE",
                value: (project?.Project?.[0]?.projectType && t(`CAMPAIGN_PROJECT_${project?.Project?.[0]?.projectType}`)) || "NA",
              },
              {
                key: "CAMPAIGN_START_DATE",
                value: Digit.DateUtils.ConvertEpochToDate(project?.Project?.[0]?.startDate) || "NA",
              },
              {
                key: "CAMPAIGN_END_DATE",
                value: Digit.DateUtils.ConvertEpochToDate(project?.Project?.[0]?.endDate) || "NA",
              },
              {
                key: "WORKBENCH_PROJECT_PRIMARY",
                value: t(project?.Project?.[0]?.targets?.[0]?.beneficiaryType) || "NA",
              },
              {
                key: "WORKBENCH_PROJECT_PARENT_PROJECT_NUMBER",
                value: ancestor?.length > 0 ? ancestor[ancestor?.length - 1]?.projectNumber : "NA",
                isLink: ancestor?.length > 0 ? true : false,
                to: isLink ? `campaign-view?tenantId=mz&projectNumber=${ancestor[ancestor?.length - 1].projectNumber}` : undefined,
              },
              {
                key: "WBH_TARGET_NO_LABEL",
                value: project?.Project?.[0]?.targets?.[0]?.targetNo || "NA",
              },
              {
                key: "WORKBENCH_PROJECT_PRIMARY_TOTAL_NO",
                value: project?.Project?.[0]?.targets?.[0]?.totalNo || "NA",
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
      {
        navigationKey: "card1",
        sections: [
          {
            navigationKey: "card1",

            type: "COMPONENT",
            component: "TargetComponent",
            props: { targets: project?.Project?.[0]?.targets, project: project?.Project?.[0] },
          },
        ],
      },
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
      {
        navigationKey: "card2",
        sections: [
          {
            navigationKey: "card2",
            type: "COMPONENT",
            component: "ProjectBeneficiaryComponent",
            props: { projectId: project?.Project?.[0]?.id },
          },
        ],
      },
      {
        navigationKey: "card5",
        sections: [
          {
            navigationKey: "card5",

            type: "COMPONENT",
            component: "ProjectStaffComponent",
            props: { projectId: project?.Project?.[0]?.id, ...project },
          },
        ],
      },

      {
        navigationKey: "card4",
        sections: [
          {
            navigationKey: "card4",

            type: "COMPONENT",
            component: "FacilityComponent",
            props: { projectId: project?.Project?.[0]?.id },
          },
        ],
      },{
        navigationKey: "card6",
        sections: [
          {
            navigationKey: "card6",

            type: "COMPONENT",
            component: "TaskComponent",
            props: { projectId: project?.Project?.[0]?.id },
          },
        ],
      }
    ],
    apiResponse: {},
    additionalDetails: {},
    horizontalNav: {
      showNav: true,
      configNavItems: [
        {
          name: "card1",
          active: true,
          code: "TARGET_DETAILS",
        },
        {
          name: "card3",
          active: true,
          code: "HCM_CHILDREN_MAPPED",
        },
        {
          name: "card2",
          active: true,
          code: "CAMPAIGN_PRODUCT_LABEL",
        },
        {
          name: "card5",
          active: true,
          code: "USER_DETAILS",
        },

        {
          name: "card4",
          active: true,
          code: "FACILITY_DETAILS",
        },    {
          name: "card6",
          active: true,
          code: "TASK_DETAILS",
        },
        
        
      ],
      activeByDefault: "card1",
    },
  };
};
