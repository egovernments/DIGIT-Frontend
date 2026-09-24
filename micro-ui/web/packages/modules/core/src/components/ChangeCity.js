import { CardText, Dropdown, Toast } from "@egovernments/digit-ui-components";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getIdpToken } from "../utils/idpToken";
import { getSwitchableTenantIds, switchTenant } from "../utils/ssoTenants";

const stringReplaceAll = (str = "", searcher = "", replaceWith = "") => {
  if (searcher == "") return str;
  while (str?.includes(searcher)) {
    str = str?.replace(searcher, replaceWith);
  }
  return str;
};

const ChangeCity = (prop) => {
  const [dropDownData, setDropDownData] = useState(null);
  const [selectCityData, setSelectCityData] = useState([]);
  const [selectedCity, setSelectedCity] = useState([]); 
  const navigate = useNavigate();
  const isDropdown = prop.dropdown || false;
  let selectedCities = [];
  const isMultiRootTenant = Digit.Utils.getMultiRootTenant();
  const [switchError, setSwitchError] = useState(null);

  /* SSO tenant switching, when the session came from an IdP and the subject is mapped to more
     than one deployable tenant. Everything else - citizen sidebars, password logins, single
     tenant users - keeps the original role-filter-and-reload behaviour below.
     The tenant list comes from /user/oauth/tenants (stored at login) rather than from the
     user's roles, because that endpoint is authoritative about what the subject may log in to
     whereas roles only describe the tenant currently exchanged for. */
  const currentTenantId = Digit.SessionStorage.get("Employee.tenantId");
  const ssoTenantIds = getSwitchableTenantIds(currentTenantId);
  const ssoMode = Digit?.UserService?.getType?.() === "employee" && Boolean(getIdpToken()) && ssoTenantIds.length > 1;

  const handleSwitchTenant = async (city) => {
    if (!city?.value || city.value === currentTenantId) return;
    try {
      /* Navigates on success, so nothing after this runs. */
      await switchTenant(city.value);
    } catch (error) {
      console.error("[sso] tenant switch failed", error);
      setSwitchError(error?.code || "SSO_TENANT_SWITCH_FAILED");
      if (error?.code === "SSO_SESSION_EXPIRED") {
        /* The ID token is gone or rejected, so there is no way to re-exchange. Let the toast
           be read, then send the user back through login. */
        setTimeout(() => Digit.UserService.logout(), 4000);
      }
    }
  };

  const handleChangeCity = (city) => {
    if (ssoMode) return handleSwitchTenant(city);
    const loggedInData = Digit.SessionStorage.get("citizen.userRequestObject");
    const filteredRoles = Digit.SessionStorage.get("citizen.userRequestObject")?.info?.roles?.filter((role) => role.tenantId === city.value);
    if (filteredRoles?.length > 0) {
      loggedInData.info.roles = filteredRoles;
      loggedInData.info.tenantId = city?.value;
    }
    Digit.SessionStorage.set("Employee.tenantId", city?.value);
    Digit.UserService.setUser(loggedInData);
    setDropDownData(city);
    if (typeof window !== 'undefined' && window.location?.href?.includes(`/${window?.contextPath}/employee/`)) {
      const redirectPath = location.state?.from || `/${window?.contextPath}/employee`;
      navigate(redirectPath, { replace: true });
    }
    // Safe reload with error handling
    try {
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    } catch (error) {
      console.warn('Failed to reload page:', error);
    }
  };

  useEffect(() => {
    if (ssoMode) {
      setSelectCityData(
        ssoTenantIds.map((tenantId) => ({
          label: `TENANT_TENANTS_${stringReplaceAll(tenantId, ".", "_")?.toUpperCase()}`,
          value: tenantId,
        }))
      );
      return;
    }
    const userloggedValues = Digit.SessionStorage.get("citizen.userRequestObject");
    let teantsArray = [],
      filteredArray = [];
    userloggedValues?.info?.roles?.forEach((role) => teantsArray.push(role.tenantId));
    let unique = teantsArray.filter((item, i, ar) => ar.indexOf(item) === i);
    unique?.forEach((uniCode) => {
      filteredArray.push({
        label: `TENANT_TENANTS_${stringReplaceAll(uniCode, ".", "_")?.toUpperCase()}`,
        value: uniCode,
      });
    });
    selectedCities = filteredArray?.filter((select) => select.value == Digit.SessionStorage.get("Employee.tenantId"));
    setSelectCityData(filteredArray);
  }, [dropDownData]);

  // if (isDropdown) {
  return (
    <div style={prop?.mobileView ? { color: "#767676" } : {}}>
      {
        (isMultiRootTenant && selectCityData.length==1) ? 
        <CardText style={{color:"#363636"}}>{selectCityData?.[0]?.value}</CardText>
        :
      <Dropdown
        t={prop?.t}
        option={selectCityData}
        selected={selectCityData.find((cityValue) => cityValue.value === dropDownData?.value)}
        optionKey={"label"}
        showArrow={true}
        select={handleChangeCity}
        freeze={true}
        customSelector={
          <label className="cp">
            {prop?.t(`TENANT_TENANTS_${stringReplaceAll(Digit.SessionStorage.get("Employee.tenantId"), ".", "_")?.toUpperCase()}`)}
          </label>
        }
      />
}
      {switchError && <Toast type="error" label={prop?.t(switchError)} onClose={() => setSwitchError(null)} />}
    </div>
  );
  // } else {
  //   return (
  //     <React.Fragment>
  //       <div style={{ marginBottom: "5px" }}>City</div>
  //       <div className="language-selector" style={{display: "flex", flexWrap: "wrap"}}>
  //         {selectCityData?.map((city, index) => (
  //           <div className="language-button-container" key={index}>
  //             <CustomButton
  //               selected={city.value === Digit.SessionStorage.get("Employee.tenantId")}
  //               text={city.label}
  //               onClick={() => handleChangeCity(city)}
  //             ></CustomButton>
  //           </div>
  //         ))}
  //       </div>
  //     </React.Fragment>
  //   );
  // }
};

export default ChangeCity;
