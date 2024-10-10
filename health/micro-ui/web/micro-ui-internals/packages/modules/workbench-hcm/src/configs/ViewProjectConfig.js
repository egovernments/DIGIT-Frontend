import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export const data = (project) => {
  const { t } = useTranslation();
  const ancestor = project?.Project?.[0]?.ancestors;
  const lastAncestor = ancestor?.length  > 0 ? ancestor[ancestor?.length - 1] : { projectNumber: "NA" };
  const isLink = ancestor?.length > 0 ? true: false;

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
                key: "WORKBENCH_PROJECT_NAME",
                value: project?.Project?.[0]?.name || "NA",
              },
              {
                key: "WORKBENCH_PROJECT_TYPE",
                value: project?.Project?.[0]?.projectType || "NA",
              },
              {
                key: "WORKBENCH_PROJECT_START_DATE",
                value: Digit.DateUtils.ConvertEpochToDate(project?.Project?.[0]?.startDate) || "NA",
              },
              {
                key: "WORKBENCH_PROJECT_END_DATE",
                value: Digit.DateUtils.ConvertEpochToDate(project?.Project?.[0]?.endDate) || "NA",
              },
              {
                key: "WORKBENCH_PROJECT_PRIMARY",
                value: project?.Project?.[0]?.targets?.[0]?.beneficiaryType || "NA",
              },
              {
                key: "WORKBENCH_PROJECT_PARENT_PROJECT_NUMBER",
                value: ancestor?.length > 0 ? ancestor[ancestor?.length - 1]?.projectNumber : "NA",
                isLink: ancestor?.length > 0 ? true : false,
                to: isLink? `campaign-view?tenantId=mz&projectNumber=${ancestor[ancestor?.length - 1].projectNumber}` : undefined
              },
              {
                key: "WORKBENCH_PROJECT_PRIMARY_TARGET_NO",
                value: project?.Project?.[0]?.targets?.[0]?.targetNo || "NA",
              },
              {
                key: "WORKBENCH_PROJECT_PRIMARY_TOTAL_NO",
                value: project?.Project?.[0]?.targets?.[0]?.totalNo || "NA",
              },
              {
                key: "WORKBENCH_PROJECT_BOUNDARY",
                value: project?.Project?.[0]?.address?.boundary || "NA",
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
        navigationKey: "card1",
        sections: [
          {
            navigationKey: "card1",

            type: "COMPONENT",
            component: "ProjectStaffComponent",
            props: { projectId: project?.Project?.[0]?.id, ...project },
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
        navigationKey: "card4",
        sections: [
          {
            navigationKey: "card4",

            type: "COMPONENT",
            component: "FacilityComponent",
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
            component: "TargetComponent",
            props: { targets: project?.Project?.[0]?.targets, project: project?.Project?.[0] },
          },
        ],
      },
    ],
    apiResponse: {},
    additionalDetails: {},
    horizontalNav: {
      showNav: true,
      configNavItems: [
        {
          name: "card2",
          active: true,
          code: "Project Resource",
        },
        {
          name: "card1",
          active: true,
          code: "Project Staff",
        },
        {
          name: "card3",
          active: true,
          code: "Children",
        },
        {
          name: "card4",
          active: true,
          code: "Facility",
        },
        {
          name: "card5",
          active: true,
          code: "Targets",
        },
      ],
      activeByDefault: "card1",
    },
  };
};
