import { Dropdown, TextBlock } from "@egovernments/digit-ui-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const Sample = ({ selectedProject, onChange }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [lastSelectedId, setLastSelectedId] = useState("");
  const [boundary, setBoundary] = useState([]);
  console.log(selectedProject, "project data in sample");
  // selectedProject?.address?.boundary.split("_")[0]
  const reqCriteriaResource = {
    url: `/boundary-service/boundary-relationships/_search`,
    params: {
      tenantId: tenantId,
      hierarchyType: selectedProject?.address?.boundary.split("_")[0],
      includeChildren: true,
      codes: selectedProject?.address?.boundary,
      boundaryType: selectedProject?.address?.boundaryType,
    },
    config: {
      enabled: true,
      select: (data) => {
        return data;
      },
    },
  };

  const { isLoading: childrenDataLoading, data: childrenData } = Digit.Hooks.payments.useAttendanceBoundarySearch(reqCriteriaResource);

  useEffect(() => { }, [childrenData]);
  const handleButtonClick = (value) => {

    onChange(value);
  };

  return (
    <React.Fragment>
      <div>
        {childrenData?.[0]?.boundary.length > 0 && <NestedDropdown data={childrenData?.[0]?.boundary} onLastSelectedIdChange={handleButtonClick} />}
      </div>
    </React.Fragment>
  );
};

export default Sample;

function NestedDropdown({ data, onLastSelectedIdChange }) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState("");
  const [children, setChildren] = useState([]);

  // Helper to generate labels based on boundaryType
  const getLabelByBoundaryType = (boundaryType) => {
    const labels = {
      DISTRICT: "ATTENDANCE_DISTRICT",
      ADMINISTRATIVEPOST: "ATTENDANCE_ADMINISTRATIVEPOST",
      LOCALITY: "ATTENDANCE_LOCALITY",
      VILLAGE: "ATTENDANCE_VILLAGE",
    };
    return labels[boundaryType] || "Select Option"; // Default label
  };

  const currentBoundaryType = data[0]?.boundaryType; // Assuming all options share the same boundaryType
  const dropdownLabel = getLabelByBoundaryType(currentBoundaryType);

  const handleChange = (event) => {
    const value = event.id;
    setSelected(value);
    onLastSelectedIdChange(event);

    // Reset children dropdown when parent changes
    const selectedNode = data.find((item) => item.id === value);
    // setChildren(selectedNode?.children || []);
    setChildren(selectedNode?.boundaryType !== "DISTRICT" ? selectedNode?.children || [] : []);
  };
  useEffect(() => {
    // Reset children and selected state whenever the data (parent value) changes
    setSelected("");
    setChildren([]);
  }, [data]);

  return (
    <div style={{ width: "100%" }}>
      {/*<select value={selected} onChange={handleChange}>
        <option value="">-- Select an Option --</option>
        {data.map((item) => (
          <option key={item.id} value={item.id}>
            {item.code} ({item.boundaryType})
          </option>
        ))}
      </select>*/}
      <TextBlock body={t(dropdownLabel)}></TextBlock>
      <Dropdown
        t={t}
        option={data}
        optionKey={"code"}
        select={(value) => {
          handleChange(value);
        }}
      />

      {/* Render child dropdowns recursively */}
      {children.length > 0 && children[0]?.boundaryType !== "DISTRICT" && (
        <NestedDropdown data={children} onLastSelectedIdChange={onLastSelectedIdChange} />
      )}
    </div>
  );
}
