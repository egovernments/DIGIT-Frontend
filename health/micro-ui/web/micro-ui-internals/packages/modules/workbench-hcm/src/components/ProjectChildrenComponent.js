import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import getProjectServiceUrl from "../utils/getProjectServiceUrl";
import ReusableTableWrapper from "./ReusableTableWrapper";


const ProjectChildrenComponent = (props) => {
  const { t } = useTranslation();

  const url = getProjectServiceUrl();
  const requestCriteria = {
    url: `${url}/v1/_search`,
    changeQueryName: props.projectId,
    params: {
      tenantId: "mz",
      offset: 0,
      limit: 100,
      includeDescendants: true,
    },
    body: {
      Projects: [
        {
          tenantId: "mz",
          id: props.projectId,
        },
      ],
      apiOperation: "SEARCH",
    },
    config: {
      enabled: props.projectId ? true : false,
    },
  };

  const { isLoading, data: projectChildren } = Digit.Hooks.useCustomAPIHook(requestCriteria);

  const projectsArray = projectChildren?.Project || [];

  //converts the descendant array into the object
  const descendantsObject = {};

  projectsArray.forEach((project) => {
    const descendantsArray = project.descendants || [];

    descendantsArray.forEach((descendant) => {
      descendantsObject[descendant.id] = descendant;
    });
  });

  //converts the epoch to date
  Object.values(descendantsObject).forEach((descendant) => {
    descendant.formattedStartDate = Digit.DateUtils.ConvertEpochToDate(descendant.startDate);
    descendant.formattedEndDate = Digit.DateUtils.ConvertEpochToDate(descendant.endDate);
  });

  // Flatten descendants for table display
  const flattenedDescendants = [];
  projectsArray.forEach((project) => {
    const descendantsArray = project.descendants || [];
    descendantsArray.forEach((descendant) => {
      flattenedDescendants.push(descendant);
    });
  });

  const columns = [
    { label: t("DESCENDANTS_PROJECT_NUMBER"), key: "projectNumber" },
    { label: t("WBH_BOUNDARY"), key: "address.boundary" },
    { label: t("DESCENDANTS_PROJECT_BOUNDARY_TYPE"), key: "address.boundaryType" },
    { label: t("CAMPAIGN_START_DATE"), key: "formattedStartDate" },
    { label: t("CAMPAIGN_END_DATE"), key: "formattedEndDate" },
  ];

  const customCellRenderer = {
    projectNumber: (row) => {
      if (row.projectNumber) {
        return (
          <Link
            to={{
              pathname: window.location.pathname,
              search: `?tenantId=${row.tenantId}&projectNumber=${row.projectNumber}`,
            }}
            style={{ color: "#f37f12", textDecoration: "none" }}
          >
            {row.projectNumber}
          </Link>
        );
      }
      return "NA";
    },
    "address.boundary": (row) => t(row.address?.boundary) || "NA",
    "address.boundaryType": (row) => t(row.address?.boundaryType) || "NA",
  };

  if (isLoading) {
    return <ReusableTableWrapper
      title="PROJECT_CHILDREN"
      data={[]}
      columns={columns}
      isLoading={true}
      noDataMessage="NO_PROJECT_CHILDREN"
    />;
  }

  if (!projectChildren?.Project[0]?.descendants) {
    return (
      <ReusableTableWrapper
        title="PROJECT_CHILDREN"
        data={[]}
        columns={columns}
        isLoading={false}
        noDataMessage="NO_PROJECT_CHILDREN"
      />
    );
  }

  return (
    <ReusableTableWrapper
      title="PROJECT_CHILDREN"
      data={flattenedDescendants}
      columns={columns}
      isLoading={false}
      noDataMessage="NO_PROJECT_CHILDREN"
      customCellRenderer={customCellRenderer}
    />
  );
};

export default ProjectChildrenComponent;
