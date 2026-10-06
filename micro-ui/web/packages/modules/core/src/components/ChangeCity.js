import { CardText, Dropdown, Toast } from "@egovernments/digit-ui-components";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getIdpToken } from "../utils/idpToken";
import { getStoredSSOTenants, getSwitchableTenantIds, lookupTenants, storeSSOTenants, switchTenant } from "../utils/ssoTenants";

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

  /* SSO tenant switching, when the session came from an IdP. Everything else - citizen
     sidebars, password logins - keeps the original role-filter-and-reload behaviour below.
     The tenant list comes from /user/oauth/tenants rather than from the user's roles, because
     that endpoint is authoritative about what the subject may log in to whereas roles only
     describe the tenant currently exchanged for.

     Decided in the effect below rather than during render, and keyed on the session rather
     than on how many tenants came back. Previously a short list flipped the whole component
     to the role-derived data source, which silently showed a DIFFERENT and smaller set of
     tenants with nothing to indicate the switcher had been disabled. */
  const currentTenantId = Digit.SessionStorage.get("Employee.tenantId");
  const [ssoMode, setSsoMode] = useState(false);

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

  const toOptions = (tenantIds) =>
    tenantIds.map((tenantId) => ({
      label: `TENANT_TENANTS_${stringReplaceAll(tenantId, ".", "_")?.toUpperCase()}`,
      value: tenantId,
    }));

  useEffect(() => {
    let cancelled = false;

    const applySSOTenants = async () => {
      const isSSOSession = Digit?.UserService?.getType?.() === "employee" && Boolean(getIdpToken());
      if (!isSSOSession) return false;

      let tenantIds = getSwitchableTenantIds(currentTenantId);

      /* The list is written to sessionStorage at login, on whichever deployment handled the
         SSO callback. Switching tenant lands the user on a DIFFERENT deployment, and if that
         list did not come across the switcher would quietly collapse to the single tenant the
         new session has roles for. Re-fetch instead - the ID token is still valid, which is
         what makes the switch possible in the first place. Only when the list is genuinely
         absent, so the normal path costs no extra request. */
      if (!getStoredSSOTenants().length) {
        try {
          const tenants = await lookupTenants(getIdpToken());
          if (cancelled) return true;
          storeSSOTenants(tenants);
          tenantIds = getSwitchableTenantIds(currentTenantId);
        } catch (error) {
          console.warn("[sso] could not re-fetch the tenant list", error);
        }
      }

      if (cancelled) return true;

      if (tenantIds.length) {
        setSsoMode(true);
        setSelectCityData(toOptions(tenantIds));
        return true;
      }

      /* An SSO session with no usable tenant list at all. Falling through to roles is still
         better than an empty dropdown, but it is never expected - log the inputs so this does
         not have to be diagnosed from the symptom again. */
      console.warn("[sso] tenant switcher falling back to roles", {
        storedTenants: getStoredSSOTenants(),
        deploymentMapKeys: Object.keys(window?.globalConfigs?.getConfig("TENANT_DEPLOYMENT_MAP") || {}),
        currentTenantId,
      });
      return false;
    };

    applySSOTenants().then((handled) => {
      if (cancelled || handled) return;
      setSsoMode(false);
      buildRoleBasedOptions();
    });

    return () => {
      cancelled = true;
    };
  }, [dropDownData]);

  function buildRoleBasedOptions() {
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
  }

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
