import { Dropdown, TextBlock } from "@egovernments/digit-ui-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const BoundaryComponent = ({ selectedProject, onChange }) => {
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

        setDistrict([childrenData[0]?.boundary[0]]);
        setBoundaryData({ ...formattedData });
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
        setSelectedValues((prev) => ({ ...prev, ADMINISTRATIVEPOST: null, LOCALITY: null, VILLAGE: null, DISTRICT: value }));
        break;
      case "COUNTRY":
        setProvince(value?.children || []);
        setSelectedValues((prev) => ({ ...prev, PROVINCE: null, DISTRICT: null, LOCALITY: null, VILLAGE: null, COUNTRY: value }));
        break;
      case "ADMINISTRATIVEPOST":
        setLocality(value?.children || []);
        setSelectedValues((prev) => ({ ...prev, LOCALITY: null, VILLAGE: null, ADMINISTRATIVEPOST: value }));
        break;
      case "LOCALITY":
        setVillage(value?.children || []);
        setSelectedValues((prev) => ({ ...prev, VILLAGE: null, LOCALITY: value }));
        break;
      case "VILLAGE":
        break;
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

export default BoundaryComponent;
