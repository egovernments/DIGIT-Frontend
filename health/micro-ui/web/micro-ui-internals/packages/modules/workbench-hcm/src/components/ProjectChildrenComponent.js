import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import getProjectServiceUrl from "../utils/getProjectServiceUrl";
import ReusableTableWrapper from "./ReusableTableWrapper";
import { TextInput, DatePicker } from "@egovernments/digit-ui-react-components";
import { Button } from "@egovernments/digit-ui-components";


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
  
  // State to control filter visibility
  const [showFilters, setShowFilters] = useState(false);
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

      // Boundary filter - search in both raw code and translated value
      if (filters.boundary) {
        const rawBoundary = row.address?.boundary?.toLowerCase() || "";
        const translatedBoundary = t(row.address?.boundary)?.toLowerCase() || "";
        const searchTerm = filters.boundary.toLowerCase();
        
        if (!rawBoundary.includes(searchTerm) && !translatedBoundary.includes(searchTerm)) {
          return false;
        }
      }

      // Boundary Type filter - search in both raw code and translated value
      if (filters.boundaryType) {
        const rawBoundaryType = row.address?.boundaryType?.toLowerCase() || "";
        const translatedBoundaryType = t(row.address?.boundaryType)?.toLowerCase() || "";
        const searchTerm = filters.boundaryType.toLowerCase();
        
        if (!rawBoundaryType.includes(searchTerm) && !translatedBoundaryType.includes(searchTerm)) {
          return false;
        }
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
      {/* CSS for animation */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      
      {/* Advanced Filter Toggle Button */}
      <div style={{ marginBottom: "16px" }}>
        <Button
          variation="primary"
          label={showFilters ? t("HIDE_ADVANCED_FILTERS") : t("SHOW_ADVANCED_FILTERS")}
          onClick={() => setShowFilters(!showFilters)}
          style={{
            padding: "0.5rem 1rem",
            fontSize: "0.9rem"
          }}
        />
        {filteredData.length < flattenedDescendants.length && (
          <span style={{ marginLeft: "16px", color: "#666", fontSize: "14px" }}>
            {t("FILTERS_APPLIED")}: {t("SHOWING")} {filteredData.length} {t("OF")} {flattenedDescendants.length} {t("RECORDS")}
          </span>
        )}
      </div>

      {/* Filter Section - Only shown when showFilters is true */}
      {showFilters && (
        <div style={{ 
          padding: "16px", 
          backgroundColor: "#f5f5f5", 
          borderRadius: "8px", 
          marginBottom: "16px",
          border: "1px solid #e0e0e0",
          animation: "slideDown 0.3s ease-in-out"
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
            <Button
              variation="secondary"
              label={t("CLEAR_FILTERS")}
              onClick={() => clearFilters()}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem"
              }}
            />
            <span style={{ color: "#666", fontSize: "14px" }}>
              {t("SHOWING")} {filteredData.length} {t("OF")} {flattenedDescendants.length} {t("RECORDS")}
            </span>
          </div>
        </div>
      )}

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
