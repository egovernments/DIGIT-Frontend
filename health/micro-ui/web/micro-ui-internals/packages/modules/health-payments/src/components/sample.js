// import { Dropdown, TextBlock } from "@egovernments/digit-ui-components";
// import React, { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";

// const Sample = ({ selectedProject, onChange }) => {
//   const { t } = useTranslation();
//   const tenantId = Digit.ULBService.getCurrentTenantId();

//   // selectedProject?.address?.boundary.split("_")[0]
//   const reqCriteriaResource = {
//     url: `/boundary-service/boundary-relationships/_search`,
//     params: {
//       tenantId: tenantId,
//       hierarchyType: selectedProject?.address?.boundary.split("_")[0],
//       includeChildren: true,
//       codes: selectedProject?.address?.boundary,
//       boundaryType: selectedProject?.address?.boundaryType,
//     },
//     config: {
//       enabled: true,
//       select: (data) => {
//         return data;
//       },
//     },
//   };

//   const { isLoading: childrenDataLoading, data: childrenData } = Digit.Hooks.payments.useAttendanceBoundarySearch(reqCriteriaResource);

//   useEffect(() => {}, [childrenData]);
//   const handleButtonClick = (value) => {
//     onChange(value);
//   };

//   return (
//     <React.Fragment>
//       <div>
//         {childrenData?.[0]?.boundary.length > 0 && <NestedDropdown data={childrenData?.[0]?.boundary} onLastSelectedIdChange={handleButtonClick} />}
//       </div>
//     </React.Fragment>
//   );
// };

// export default Sample;

// function NestedDropdown({ data, onLastSelectedIdChange }) {
//   const { t } = useTranslation();

//   const [selected, setSelected] = useState();
//   const [children, setChildren] = useState([]);

//   // Helper to generate labels based on boundaryType
//   const getLabelByBoundaryType = (boundaryType) => {
//     const labels = {
//       COUNTRY: "ATTENDANCE_COUNTRY",
//       PROVINCE: "ATTENDANCE_PROVINCE",
//       DISTRICT: "ATTENDANCE_DISTRICT",
//       ADMINISTRATIVEPOST: "ATTENDANCE_ADMINISTRATIVEPOST",
//       LOCALITY: "ATTENDANCE_LOCALITY",
//       VILLAGE: "ATTENDANCE_VILLAGE",
//     };
//     return labels[boundaryType] || "Select Option"; // Default label
//   };

//   const currentBoundaryType = data[0]?.boundaryType; // Assuming all options share the same boundaryType
//   const dropdownLabel = getLabelByBoundaryType(currentBoundaryType);

//   const handleChange = (event) => {
//     const value = event.id;
//     setSelected(event);
//     onLastSelectedIdChange(event);

//     // Reset children dropdown when parent changes
//     const selectedNode = data.find((item) => item.id === value);
//     setChildren(selectedNode?.children || []);
//     // setChildren(selectedNode?.boundaryType !== "DISTRICT" ? selectedNode?.children || [] : []);

//     Digit.SessionStorage.set(currentBoundaryType, selectedNode);
//   };

//   // useEffect(() => {
//   //   const data = Digit.SessionStorage.get(`Digit.${currentBoundaryType}`);
//   //   if (data) {
//   //     setSelected(data);
//   //     setChildren(data?.children||[])
//   //   }
//   // }, []);

//   useEffect(() => {
//     // Reset children and selected state whenever the data (parent value) changes
//     setSelected("");
//     setChildren([]);
//   }, [data]);

//   return (
//     <div style={{ width: "100%", marginTop: "14px" }}>
//       <TextBlock body={t(dropdownLabel)}></TextBlock>
//       <Dropdown
//         selected={selected}
//         t={t}
//         option={data}
//         optionKey={"code"}
//         select={(value) => {
//           handleChange(value);
//         }}
//       />

//       {/* Render child dropdowns recursively */}
//       {children.length > 0 && <NestedDropdown data={children} onLastSelectedIdChange={onLastSelectedIdChange} />}
//     </div>
//   );
// }

// import { Dropdown, TextBlock } from "@egovernments/digit-ui-components";
// import React, { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";

// const Sample = ({ selectedProject, onChange }) => {
//   const { t } = useTranslation();
//   const tenantId = Digit.ULBService.getCurrentTenantId();

//   const reqCriteriaResource = {
//     url: `/boundary-service/boundary-relationships/_search`,
//     params: {
//       tenantId: tenantId,
//       hierarchyType: selectedProject?.address?.boundary.split("_")[0],
//       includeChildren: true,
//       codes: selectedProject?.address?.boundary,
//       boundaryType: selectedProject?.address?.boundaryType,
//     },
//     config: {
//       enabled: true,
//       select: (data) => data,
//     },
//   };

//   const { isLoading: childrenDataLoading, data: childrenData } = Digit.Hooks.payments.useAttendanceBoundarySearch(reqCriteriaResource);

//   useEffect(() => {}, [childrenData]);

//   const handleButtonClick = (value) => {
//     onChange(value);
//   };

//   return (
//     <React.Fragment>
//       <div>
//         {childrenData?.[0]?.boundary.length > 0 && (
//           <BoundaryDropdowns data={childrenData?.[0]?.boundary} onLastSelectedIdChange={handleButtonClick} />
//         )}
//       </div>
//     </React.Fragment>
//   );
// };

// export default Sample;

// function BoundaryDropdowns({ data, onLastSelectedIdChange }) {
//   const { t } = useTranslation();

//   const [selectedValues, setSelectedValues] = useState({
//     COUNTRY: null,
//     PROVINCE: null,
//     DISTRICT: null,
//     ADMINISTRATIVEPOST: null,
//     LOCALITY: null,
//     VILLAGE: null,
//   });

//   const [boundaryData, setBoundaryData] = useState({
//     COUNTRY: data,
//     PROVINCE: [],
//     DISTRICT: [],
//     ADMINISTRATIVEPOST: [],
//     LOCALITY: [],
//     VILLAGE: [],
//   });

//   // Helper to generate labels based on boundaryType
//   const getLabelByBoundaryType = (boundaryType) => {
//     const labels = {
//       COUNTRY: "ATTENDANCE_COUNTRY",
//       PROVINCE: "ATTENDANCE_PROVINCE",
//       DISTRICT: "ATTENDANCE_DISTRICT",
//       ADMINISTRATIVEPOST: "ATTENDANCE_ADMINISTRATIVEPOST",
//       LOCALITY: "ATTENDANCE_LOCALITY",
//       VILLAGE: "ATTENDANCE_VILLAGE",
//     };
//     return labels[boundaryType] || "Select Option"; // Default label
//   };

//   const handleChange = (boundaryType, selectedOption) => {
//     setSelectedValues((prev) => ({
//       ...prev,
//       [boundaryType]: selectedOption,
//     }));

//     // Update child dropdown based on selected value
//     const selectedNode = boundaryData[boundaryType].find((item) => item.id === selectedOption.id);
//     const childBoundaryType = getNextBoundaryType(boundaryType);
//     setBoundaryData((prev) => ({
//       ...prev,
//       [childBoundaryType]: selectedNode?.children || [],
//     }));

//     // Save to sessionStorage
//     Digit.SessionStorage.set(boundaryType, selectedNode);
//     onLastSelectedIdChange(selectedOption);
//   };

//   // Helper to get next boundary type
//   const getNextBoundaryType = (currentType) => {
//     const boundaryOrder = [
//       "COUNTRY",
//       "PROVINCE",
//       "DISTRICT",
//       "ADMINISTRATIVEPOST",
//       "LOCALITY",
//       "VILLAGE",
//     ];
//     const currentIndex = boundaryOrder.indexOf(currentType);
//     return boundaryOrder[currentIndex + 1];
//   };

//   useEffect(() => {
//     // Load saved selections from sessionStorage on component mount
//     const storedSelections = {};
//     ["COUNTRY", "PROVINCE", "DISTRICT", "ADMINISTRATIVEPOST", "LOCALITY", "VILLAGE"].forEach((boundaryType) => {
//       const storedData = Digit.SessionStorage.get(boundaryType);
//       if (storedData) {
//         storedSelections[boundaryType] = storedData;
//       }
//     });
//     setSelectedValues(storedSelections);
//   }, []);

//   return (
//     <div style={{ width: "100%", marginTop: "14px" }}>
//       {Object.keys(boundaryData).map((boundaryType) => {
//         const boundaryLabel = getLabelByBoundaryType(boundaryType);
//         return (
//           <div key={boundaryType}>
//             <TextBlock body={t(boundaryLabel)}></TextBlock>
//             <Dropdown
//               selected={selectedValues[boundaryType]}
//               t={t}
//               option={boundaryData[boundaryType]}
//               optionKey={"code"}
//               select={(value) => handleChange(boundaryType, value)}
//             />
//           </div>
//         );
//       })}
//     </div>
//   );
// }

//===========

import { Dropdown, TextBlock } from "@egovernments/digit-ui-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const Sample = ({ selectedProject, onChange }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [boundaryData, setBoundaryData] = useState({
    COUNTRY: false,
    PROVINCE: false,
    DISTRICT: false,
    ADMINISTRATIVEPOST: false,
    LOCALITY: false,
    VILLAGE: false,
  });

  const [country, setCountry] = useState([]);
  const [province, setProvince] = useState([]);
  const [district, setDistrict] = useState([]);
  const [administrative, setAdminstrative] = useState([]);
  const [locality, setLocality] = useState([]);
  const [village, setVillage] = useState([]);

  const [selectedValues, setSelectedValues] = useState({
    COUNTRY: null,
    PROVINCE: null,
    DISTRICT: null,
    ADMINISTRATIVEPOST: null,
    LOCALITY: null,
    VILLAGE: null,
  });

  // Retrieve selected values from sessionStorage if available
  useEffect(() => {
    const storedValues = sessionStorage.getItem("selectedValues");
    if (storedValues) {
      setSelectedValues(JSON.parse(storedValues));
    }
  }, []);

  // Store selected values in sessionStorage whenever they change
  useEffect(() => {
    sessionStorage.setItem("selectedValues", JSON.stringify(selectedValues));
  }, [selectedValues]);

  // Request criteria for the API
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
      select: (data) => data,
    },
  };

  const { isLoading: childrenDataLoading, data: childrenData } = Digit.Hooks.payments.useAttendanceBoundarySearch(reqCriteriaResource);

  const handleButtonClick = (value) => {
    onChange(value);
    handleDropdownOptions(value);
  };

  // Process the boundary data
  useEffect(() => {
    if (childrenData && childrenData.length > 0) {
      // Format data based on boundary type
      if (childrenData[0]?.boundary[0].boundaryType == "COUNTRY") {
        const formattedData = {
          COUNTRY: true,
          PROVINCE: true,
          DISTRICT: true,
          ADMINISTRATIVEPOST: true,
          LOCALITY: true,
          VILLAGE: true,
        };
        setBoundaryData({ ...formattedData });

        setCountry([childrenData[0]?.boundary[0]]);
      } else if (childrenData[0]?.boundary[0].boundaryType == "PROVINCE") {
        const formattedData = {
          COUNTRY: false,
          PROVINCE: true,
          DISTRICT: true,
          ADMINISTRATIVEPOST: true,
          LOCALITY: true,
          VILLAGE: true,
        };
        setBoundaryData({ ...formattedData });
        setProvince([childrenData[0]?.boundary[0]]);
      } else if (childrenData[0]?.boundary[0].boundaryType == "DISTRICT") {
        const formattedData = {
          COUNTRY: false,
          PROVINCE: false,
          DISTRICT: true,
          ADMINISTRATIVEPOST: true,
          LOCALITY: true,
          VILLAGE: true,
        };
        setBoundaryData({ ...formattedData });
        setDistrict([childrenData[0]?.boundary[0]]);
      } else if (childrenData[0]?.boundary[0].boundaryType == "ADMINISTRATIVEPOST") {
        const formattedData = {
          COUNTRY: false,
          PROVINCE: false,
          DISTRICT: false,
          ADMINISTRATIVEPOST: true,
          LOCALITY: true,
          VILLAGE: true,
        };
        setBoundaryData({ ...formattedData });
        setAdminstrative([childrenData[0]?.boundary[0]]);
      }
    }
  }, [childrenData]);

  useEffect(() => {}, [locality, administrative, village, district, country, province]);

  const handleDropdownOptions = (value) => {
    switch (value.boundaryType) {
      case "DISTRICT":
        setAdminstrative(value?.children || []);
        setSelectedValues((prev) => ({ ...prev, ADMINISTRATIVEPOST: null, LOCALITY: null, VILLAGE: null }));
      case "COUNTRY":
        setProvince(value?.children || []);
        setSelectedValues((prev) => ({ ...prev, PROVINCE: null, DISTRICT: null, LOCALITY: null, VILLAGE: null }));
      case "ADMINISTRATIVEPOST":
        setLocality(value?.children || []);
        setSelectedValues((prev) => ({ ...prev, LOCALITY: null, VILLAGE: null }));
      case "LOCALITY":
        setVillage(value?.children || []);
        setSelectedValues((prev) => ({ ...prev, VILLAGE: null }));
      case "VILLAGE":
    }
  };

  return (
    <React.Fragment>
      <div>
        {/* Render Country dropdown if available */}
        {boundaryData.COUNTRY && (
          <BoundaryDropdown
            label="ATTENDANCE_COUNTRY"
            data={country}
            onChange={(value) => handleButtonClick(value)}
            selected={selectedValues.COUNTRY}
            setSelected={(value) => setSelectedValues((prev) => ({ ...prev, COUNTRY: value }))}
          />
        )}

        {/* Render Province dropdown if available */}
        {boundaryData.PROVINCE && (
          <BoundaryDropdown
            label="ATTENDANCE_PROVINCE"
            data={province}
            onChange={(value) => handleButtonClick(value)}
            selected={selectedValues.PROVINCE}
            setSelected={(value) => setSelectedValues((prev) => ({ ...prev, PROVINCE: value }))}
          />
        )}

        {/* Render District dropdown if available */}
        {boundaryData.DISTRICT && (
          <BoundaryDropdown
            label="ATTENDANCE_DISTRICT"
            data={district}
            onChange={(value) => handleButtonClick(value)}
            selected={selectedValues.DISTRICT}
            setSelected={(value) => {
              setSelectedValues((prev) => ({ ...prev, DISTRICT: value }));
            }}
          />
        )}

        {/* Render Administrative Post dropdown if available */}
        {boundaryData.ADMINISTRATIVEPOST && (
          <BoundaryDropdown
            label="ATTENDANCE_ADMINISTRATIVEPOST"
            data={administrative}
            onChange={(value) => handleButtonClick(value)}
            selected={selectedValues.ADMINISTRATIVEPOST}
            setSelected={(value) => setSelectedValues((prev) => ({ ...prev, ADMINISTRATIVEPOST: value }))}
          />
        )}

        {/* Render Locality dropdown if available */}
        {boundaryData.LOCALITY && (
          <BoundaryDropdown
            label="ATTENDANCE_LOCALITY"
            data={locality}
            onChange={(value) => handleButtonClick(value)}
            selected={selectedValues.LOCALITY}
            setSelected={(value) => setSelectedValues((prev) => ({ ...prev, LOCALITY: value }))}
          />
        )}

        {/* Render Village dropdown if available */}
        {boundaryData.VILLAGE && (
          <BoundaryDropdown
            label="ATTENDANCE_VILLAGE"
            data={village}
            onChange={(value) => handleButtonClick(value)}
            selected={selectedValues.VILLAGE}
            setSelected={(value) => setSelectedValues((prev) => ({ ...prev, VILLAGE: value }))}
          />
        )}
      </div>
    </React.Fragment>
  );
};

const BoundaryDropdown = ({ label, data, onChange, selected, setSelected }) => {
  const { t } = useTranslation();

  return (
    <div style={{ width: "100%", marginTop: "14px" }}>
      <TextBlock body={t(label)} />
      <Dropdown
        selected={selected}
        t={t}
        option={data}
        optionKey={"code"}
        select={(value) => {
          setSelected(value);
          onChange(value);
        }}
      />
    </div>
  );
};

export default Sample;
