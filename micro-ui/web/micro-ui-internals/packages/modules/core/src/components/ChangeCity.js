import { Dropdown } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const stringReplaceAll = (str = "", searcher = "", replaceWith = "") =>
 {
  if (searcher == "") return str;
  while (str?.includes(searcher)) {
    str = str?.replace(searcher, replaceWith);
  }
  return str;
};

const ChangeCity = (prop) => {
  const [dropDownData, setDropDownData] = useState({
    label: `TENANT_TENANTS_${stringReplaceAll(Digit.SessionStorage.get("Employee.tenantId"), ".", "_")?.toUpperCase()}`,
    value: Digit.SessionStorage.get("Employee.tenantId"),
  });
  const [selectCityData, setSelectCityData] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State to store search query
  const history = useHistory();
  const isDropdown = prop.dropdown || false;
  let selectedCities = [];

  const { data: data = {}, isLoading } =
    Digit.Hooks.hrms.useHrmsMDMS(Digit.ULBService.getCurrentTenantId(), "egov-hrms", "HRMSRolesandDesignation") || {};

  const handleChangeCity = (city) => {
    const loggedInData = Digit.SessionStorage.get("citizen.userRequestObject");
    const filteredRoles = Digit.SessionStorage.get("citizen.userRequestObject")?.info?.roles?.filter((role) => role.tenantId === city.value);
    if (filteredRoles?.length > 0) {
      loggedInData.info.roles = filteredRoles;
      loggedInData.info.tenantId = city?.value;
    }
    Digit.SessionStorage.set("Employee.tenantId", city?.value);
    Digit.UserService.setUser(loggedInData);
    setDropDownData(city);
    if (window.location.href.includes(`/${window?.contextPath}/employee/`)) {
      const redirectPath = location.state?.from || `/${window?.contextPath}/employee`;
      history.replace(redirectPath);
    }
    window.location.reload();
  };

  useEffect(() => {
    const userloggedValues = Digit.SessionStorage.get("citizen.userRequestObject");
    let teantsArray = [],
      filteredArray = [];
    userloggedValues?.info?.roles?.forEach((role) => teantsArray.push(role.tenantId));
    let unique = teantsArray.filter((item, i, ar) => ar.indexOf(item) === i);

    unique?.forEach((uniCode) => {
      data?.MdmsRes?.["tenant"]["tenants"]?.map((items) => {
        if (items?.code !== "pb" && items?.code === uniCode) {
          filteredArray.push({
            label: `${prop?.t(Digit.Utils.locale.convertToLocale(items?.divisionCode, "EGOV_LOCATION_DIVISION"))} - ${prop?.t(
              `TENANT_TENANTS_${stringReplaceAll(uniCode, ".", "_")?.toUpperCase()}`
            )}`,
            value: uniCode,
          });
        } else if (items?.code === "pb" && items?.code === uniCode) {
          filteredArray.push({
            label: `TENANT_TENANTS_${stringReplaceAll(uniCode, ".", "_")?.toUpperCase()}`,
            value: uniCode,
          });
        }
      });
    });
    selectedCities = filteredArray?.filter((select) => select.value == Digit.SessionStorage.get("Employee.tenantId"));
    setSelectCityData(filteredArray);
  }, [dropDownData, data?.MdmsRes]);

  // Filter options based on search query
  const filteredOptions = selectCityData.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={prop?.mobileView ? { color: "#767676" } : {}}>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Dropdown
        t={prop?.t}
        style={{ width: "150px" }}
        option={filteredOptions}
        selected={dropDownData}
        optionKey={"label"}
        select={handleChangeCity}
        optionCardStyles={{ overflow: "revert", display: "table" }}
      />
    </div>
  );
};

export default ChangeCity;
