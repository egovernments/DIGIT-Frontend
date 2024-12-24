import { Dropdown } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const Sample = (props) => {
  const { t } = useTranslation();
  const s = props;
  const [lastSelectedId, setLastSelectedId] = useState("");
  console.log(props);

  const reqCriteriaResource = {
    url: `/boundary-service/boundary-relationships/_search`,
    params: {
      tenantId: "mz",
      hierarchyType: "HIERARCHYTEST",
      includeChildren: true,
      codes: "HIERARCHYTEST_MO_13_02_MOSSURILEE",
      boundaryType: "DISTRICT",
      //tenantId=mz&codes=HIERARCHYTEST_MO_13_02_MOSSURILEE&boundaryType=DISTRICT
    },
    config: {
      enabled: true,
      select: (data) => {
        //return data?.["TenantBoundary"]?.[0]?.boundary;
        return data;
      },
    },
  };

  const { isLoading: childrenDataLoading, data: childrenData } = Digit.Hooks.payments.useAttendanceBoundarySearch(reqCriteriaResource);

  useEffect(() => {}, [childrenData]);
  const handleButtonClick = () => {
    alert(`Last Selected ID: ${lastSelectedId}`);
  };

  return (
    <React.Fragment>
      <div>
        <h2>Boundary</h2>
        {childrenData?.[0]?.boundary.length > 0 && <NestedDropdown data={childrenData?.[0]?.boundary} onLastSelectedIdChange={setLastSelectedId} />}
      </div>
    </React.Fragment>
  );
};

export default Sample;

function NestedDropdown({ data, onLastSelectedIdChange }) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState("");
  const [children, setChildren] = useState([]);

  const handleChange = (event) => {
    const value = event.id;
    setSelected(value);
    onLastSelectedIdChange(value);

    // Reset children dropdown when parent changes
    const selectedNode = data.find((item) => item.id === value);
    setChildren(selectedNode?.children || []);
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
      <Dropdown
        t={t}
        option={data}
        optionKey={"code"}
        select={(value) => {
          handleChange(value);
        }}
        disabled={false}
        style={{ display: "flex", justifyContent: "space-between", width: "300px" }}
      />

      {/* Render child dropdowns recursively */}
      {children.length > 0 && <NestedDropdown data={children} onLastSelectedIdChange={onLastSelectedIdChange} />}
    </div>
  );
}
