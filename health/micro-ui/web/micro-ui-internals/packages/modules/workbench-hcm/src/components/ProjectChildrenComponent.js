import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import getProjectServiceUrl from "../utils/getProjectServiceUrl";
import ReusableTableWrapper from "./ReusableTableWrapper";
import { TextInput, DatePicker } from "@egovernments/digit-ui-react-components";


const ProjectChildrenComponent = (props) => {
  const { t } = useTranslation();
  const url = getProjectServiceUrl();
  const tenantId = Digit?.ULBService?.getCurrentTenantId();

  // State for filters
  const [filters, setFilters] = useState({
    projectNumber: "",
    boundary: "",
    boundaryType: "",
    startDateFrom: null,
    startDateTo: null,
    endDateFrom: null,
    endDateTo: null,
  });
  const requestCriteria = {
    url: `${url}/v1/_search`,
    changeQueryName: `${props.projectId}-${tenantId}`,
    params: {
      tenantId: tenantId,
      offset: 0,
      limit: 100,
      includeDescendants: true,
    },
    body: {
      Projects: [
        {
          tenantId: tenantId,
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

  // Filter logic
  const filteredData = useMemo(() => {
    return flattenedDescendants.filter((row) => {
      // Project Number filter
      if (filters.projectNumber && !row.projectNumber?.toLowerCase().includes(filters.projectNumber.toLowerCase())) {
        return false;
      }

      // Boundary filter
      if (filters.boundary && (!row.address?.boundary?.toLowerCase().includes(filters.boundary.toLowerCase()) || !t(row.address?.boundary)?.toLowerCase().includes(filters.boundary.toLowerCase()) )) {
        return false;
      }

      // Boundary Type filter
      if (filters.boundaryType && !row.address?.boundaryType?.toLowerCase().includes(filters.boundaryType.toLowerCase())) {
        return false;
      }

      // Start Date filter
      if (filters.startDateFrom || filters.startDateTo) {
        const rowStartDate = row.startDate;
        if (filters.startDateFrom && rowStartDate < filters.startDateFrom) {
          return false;
        }
        if (filters.startDateTo && rowStartDate > filters.startDateTo) {
          return false;
        }
      }

      // End Date filter
      if (filters.endDateFrom || filters.endDateTo) {
        const rowEndDate = row.endDate;
        if (filters.endDateFrom && rowEndDate < filters.endDateFrom) {
          return false;
        }
        if (filters.endDateTo && rowEndDate > filters.endDateTo) {
          return false;
        }
      }

      return true;
    });
  }, [flattenedDescendants, filters]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      projectNumber: "",
      boundary: "",
      boundaryType: "",
      startDateFrom: null,
      startDateTo: null,
      endDateFrom: null,
      endDateTo: null,
    });
  };

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
    <div>
      {/* Filter Section */}
      <div style={{ 
        padding: "16px", 
        backgroundColor: "#f5f5f5", 
        borderRadius: "8px", 
        marginBottom: "16px",
        border: "1px solid #e0e0e0"
      }}>
        <h3 style={{ marginBottom: "16px", color: "#333" }}>{t("FILTER_OPTIONS")}</h3>
        
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
          gap: "16px",
          marginBottom: "16px"
        }}>
          <TextInput
            label={t("DESCENDANTS_PROJECT_NUMBER")}
            value={filters.projectNumber}
            onChange={(e) => handleFilterChange("projectNumber", e.target.value)}
            placeholder={t("ENTER_PROJECT_NUMBER")}
            style={{ width: "100%" }}
          />
          
          <TextInput
            label={t("WBH_BOUNDARY")}
            value={filters.boundary}
            onChange={(e) => handleFilterChange("boundary", e.target.value)}
            placeholder={t("ENTER_BOUNDARY")}
            style={{ width: "100%" }}
          />
          
          <TextInput
            label={t("DESCENDANTS_PROJECT_BOUNDARY_TYPE")}
            value={filters.boundaryType}
            onChange={(e) => handleFilterChange("boundaryType", e.target.value)}
            placeholder={t("ENTER_BOUNDARY_TYPE")}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
          gap: "16px",
          marginBottom: "16px"
        }}>
          <div>
            <label style={{ display: "block", marginBottom: "8px", color: "#555" }}>
              {t("START_DATE_FROM")}
            </label>
            <DatePicker
              date={filters.startDateFrom ? new Date(filters.startDateFrom) : null}
              onDateChange={(date) => handleFilterChange("startDateFrom", date ? date.getTime() : null)}
            />
          </div>
          
          <div>
            <label style={{ display: "block", marginBottom: "8px", color: "#555" }}>
              {t("START_DATE_TO")}
            </label>
            <DatePicker
              date={filters.startDateTo ? new Date(filters.startDateTo) : null}
              onDateChange={(date) => handleFilterChange("startDateTo", date ? date.getTime() : null)}
            />
          </div>
          
          <div>
            <label style={{ display: "block", marginBottom: "8px", color: "#555" }}>
              {t("END_DATE_FROM")}
            </label>
            <DatePicker
              date={filters.endDateFrom ? new Date(filters.endDateFrom) : null}
              onDateChange={(date) => handleFilterChange("endDateFrom", date ? date.getTime() : null)}
            />
          </div>
          
          <div>
            <label style={{ display: "block", marginBottom: "8px", color: "#555" }}>
              {t("END_DATE_TO")}
            </label>
            <DatePicker
              date={filters.endDateTo ? new Date(filters.endDateTo) : null}
              onDateChange={(date) => handleFilterChange("endDateTo", date ? date.getTime() : null)}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <button 
            onClick={clearFilters}
            style={{
              padding: "8px 16px",
              backgroundColor: "#f37f12",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500"
            }}
          >
            {t("CLEAR_FILTERS")}
          </button>
          <span style={{ color: "#666", fontSize: "14px" }}>
            {t("SHOWING")} {filteredData.length} {t("OF")} {flattenedDescendants.length} {t("RECORDS")}
          </span>
        </div>
      </div>

      {/* Table */}
      <ReusableTableWrapper
        title="PROJECT_CHILDREN"
        data={filteredData}
        columns={columns}
        manualPagination={true}
        isLoading={false}
        paginationTotalRows={filteredData.length}
        paginationPerPage={15}
        noDataMessage="NO_PROJECT_CHILDREN"
        customCellRenderer={customCellRenderer}
      />
    </div>
  );
};

export default ProjectChildrenComponent;
