import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export const data = (pgr) => {
  const { t } = useTranslation();
//   const ancestor = project?.Project?.[0]?.ancestors;
//   const lastAncestor = ancestor?.length  > 0 ? ancestor[ancestor?.length - 1] : { projectNumber: "NA" };
//   const isLink = ancestor?.length > 0 ? true: false;

  return {
    cards: [
      {
        sections: [
          {
            type: "DATA",
            values: [
              {
                "key": "TENANT ID",
                "value": pgr?.ServiceWrappers?.[0]?.service?.tenantId || "NA"
              },
              {
                "key": "NAME",
                "value": pgr?.ServiceWrappers?.[0]?.service?.citizen?.name || "NA"
              },
              {
                "key": "SERVICE REQUESTER ID",
                "value": pgr?.ServiceWrappers?.[0]?.service?.serviceRequestId || "NA"
              },
              {
                "key": "CREATION DATE",
                "value": Digit.DateUtils.ConvertEpochToDate(pgr?.ServiceWrappers?.[0]?.service?.auditDetails?.createdTime) || "NA"
              }
              // {
              //   key: "WORKBENCH_PROJECT_PARENT_PROJECT_NUMBER",
              //   value: ancestor?.length > 0 ? ancestor[ancestor?.length - 1]?.projectNumber : "NA",
              //   isLink: ancestor?.length > 0 ? true : false,
              //   to: isLink? `campaign-view?tenantId=mz&projectNumber=${ancestor[ancestor?.length - 1].projectNumber}` : undefined
              // },
              // {
              //   key: "WORKBENCH_PROJECT_PRIMARY_TARGET_NO",
              //   value: project?.Project?.[0]?.targets?.[0]?.targetNo || "NA",
              // },
              // {
              //   key: "WORKBENCH_PROJECT_PRIMARY_TOTAL_NO",
              //   value: project?.Project?.[0]?.targets?.[0]?.totalNo || "NA",
              // },
              // {
              //   key: "WORKBENCH_PROJECT_BOUNDARY",
              //   value: project?.Project?.[0]?.address?.boundary || "NA",
              // },
              // {
              //   key: "WORKBENCH_PROJECT_BOUNDARY_TYPE",
              //   value: project?.Project?.[0]?.address?.boundaryType || "NA",
              // },
            ],
          },
        ],
      },
    //   {
    //     navigationKey: "card2",
    //     sections: [
    //       {
    //         navigationKey: "card2",
    //         type: "COMPONENT",
    //         component: "ProjectBeneficiaryComponent",
    //         props: { projectId: project?.Project?.[0]?.id },
    //       },
    //     ],
    //   },
    //   {
    //     navigationKey: "card1",
    //     sections: [
    //       {
    //         navigationKey: "card1",

    //         type: "COMPONENT",
    //         component: "ProjectStaffComponent",
    //         props: { projectId: project?.Project?.[0]?.id, ...project },
    //       },
    //     ],
    //   },
    //   {
    //     navigationKey: "card3",
    //     sections: [
    //       {
    //         navigationKey: "card3",

    //         type: "COMPONENT",
    //         component: "ProjectChildrenComponent",
    //         props: { projectId: project?.Project?.[0]?.id, ...project },
    //       },
    //     ],
    //   },
    //   {
    //     navigationKey: "card4",
    //     sections: [
    //       {
    //         navigationKey: "card4",

    //         type: "COMPONENT",
    //         component: "FacilityComponent",
    //         props: { projectId: project?.Project?.[0]?.id },
    //       },
    //     ],
    //   },
    //   {
    //     navigationKey: "card5",
    //     sections: [
    //       {
    //         navigationKey: "card5",

    //         type: "COMPONENT",
    //         component: "TargetComponent",
    //         props: { targets: project?.Project?.[0]?.targets, project: project?.Project?.[0] },
    //       },
    //     ],
    //   },
    ],
    apiResponse: {},
    additionalDetails: {},
  };
};
