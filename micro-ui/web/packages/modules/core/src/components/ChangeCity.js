import { CardText, Dropdown, Toast } from "@egovernments/digit-ui-components";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getIdpToken } from "../utils/idpToken";
import { getStoredSSOTenants, getSwitchableTenantIds, lookupTenants, storeSSOTenants, switchTenant } from "../utils/ssoTenants";

/**
 * Diagnostics that survive a production build.
 *
 * The app's webpack.prod.js sets terser `drop_console: true`, so every console.* call - and
 * the string literals inside it - is removed from the deployed bundle. Anything written for
 * diagnosis therefore has to be state, not logging. Read it in the browser as
 * `window.__ssoDebug`.
 */
const ssoDebug = (event, data) => {
  try {
    if (typeof window === "undefined") return;
    window.__ssoDebug = window.__ssoDebug || [];
    window.__ssoDebug.push({ at: new Date().toISOString(), event, ...data });
  } catch (e) {
    /* diagnostics must never break the component */
  }
};

let mountCounter = 0;

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
  /* Mirrored in a ref because handleChangeCity is handed to <Dropdown> as a prop. If that
     component holds on to the callback it received on its first render, the closure it calls
     still sees the INITIAL ssoMode (false) however many times the state has updated since -
     which routes an SSO session down the legacy reload path. Reading the ref makes the
     handler independent of which render it was captured in. */
  const ssoModeRef = useRef(false);

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
    ssoDebug("click", { selected: city?.value, ssoModeState: ssoMode, ssoModeRef: ssoModeRef.current, currentTenantId });
    if (ssoModeRef.current) return handleSwitchTenant(city);
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
    /* Identifies which mount each entry came from, so a remount (which resets ssoMode to its
       initial false) is distinguishable from a single mount that simply decided wrongly. */
    const mountId = ++mountCounter;
    ssoDebug("effect:mount", { mount: mountId });

    const applySSOTenants = async () => {
      const userType = Digit?.UserService?.getType?.();
      const hasToken = Boolean(getIdpToken());
      const stored = getStoredSSOTenants();

      /**
       * Do NOT gate on getType() alone.
       *
       * It is `Storage.get("userType") || "citizen"`, so "citizen" is equally its value for
       * "an actual citizen" and for "nobody has set this yet". On a cold boot of a tenant
       * deployment - which is exactly how switchTenant arrives, via location.replace - this
       * effect runs before the session type is established and gets the default, so an
       * employee was treated as a citizen and the switcher silently fell back to the
       * role-derived list. Arriving on the login deployment hid it, because there the app is
       * already booted (client-side navigate) or sessionStorage survived an F5.
       *
       * These keys are written only for an employee session, so their presence is positive
       * evidence rather than an absence-of-evidence default.
       */
      const employeeMarkers = {
        userTypeIsEmployee: userType === "employee",
        hasEmployeeTenantId: Boolean(currentTenantId),
        hasEmployeeToken: Boolean(window?.localStorage?.getItem?.("Employee.token")),
      };
      const isEmployeeSession = Object.values(employeeMarkers).some(Boolean);
      const isSSOSession = isEmployeeSession && hasToken;

      /* Everything is computed BEFORE the gates so the snapshot shows why a gate rejected,
         not merely that it did. chaduat and chad run identical code against what looks like
         identical state, so the difference has to be in one of these values. */
      ssoDebug("effect:start", {
        mount: mountId,
        deployment: { stateId: Digit?.ULBService?.getStateId?.(), contextPath: window?.contextPath },
        userType,
        hasToken,
        employeeMarkers,
        isEmployeeSession,
        isSSOSession,
        currentTenantId,
        storedCount: stored?.length,
        storedTenants: stored?.map?.((tenant) => tenant?.tenantId),
        storedRaw: stored,
        deploymentMapKeys: Object.keys(window?.globalConfigs?.getConfig("TENANT_DEPLOYMENT_MAP") || {}),
        switchableIds: getSwitchableTenantIds(currentTenantId),
      });

      if (!isSSOSession) {
        ssoDebug("effect:gate-failed", { mount: mountId, reason: "not an SSO session", userType, hasToken, employeeMarkers });
        return false;
      }

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
          ssoDebug("effect:refetch-failed", { mount: mountId, status: error?.status, message: error?.message });
        }
      }

      if (cancelled) return true;

      if (tenantIds.length) {
        ssoModeRef.current = true;
        setSsoMode(true);
        setSelectCityData(toOptions(tenantIds));
        ssoDebug("effect:sso-mode", { mount: mountId, tenantIds });
        return true;
      }

      /* An SSO session with no usable tenant list at all. Falling through to roles is still
         better than an empty dropdown, but it is never expected - log the inputs so this does
         not have to be diagnosed from the symptom again. */
      ssoDebug("effect:fallback-to-roles", {
        mount: mountId,
        storedTenants: getStoredSSOTenants()?.map?.((tenant) => tenant?.tenantId),
        deploymentMapKeys: Object.keys(window?.globalConfigs?.getConfig("TENANT_DEPLOYMENT_MAP") || {}),
        currentTenantId,
      });
      return false;
    };

    applySSOTenants()
      .then((handled) => {
        if (cancelled || handled) return;
        ssoModeRef.current = false;
        setSsoMode(false);
        buildRoleBasedOptions();
      })
      /* An exception here used to leave the component with neither list - silently, because
         an unhandled rejection in an effect shows nothing in production. */
      .catch((error) => {
        ssoDebug("effect:threw", { mount: mountId, message: error?.message, stack: error?.stack });
      });

    return () => {
      cancelled = true;
      ssoDebug("effect:cleanup", { mount: mountId });
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
    /* data-sso-* are diagnostics: readable in the Elements panel on a production build,
       where console output is stripped. Harmless to leave, trivial to remove. */
    <div
      style={prop?.mobileView ? { color: "#767676" } : {}}
      data-sso-mode={String(ssoMode)}
      data-sso-options={selectCityData.map((option) => option?.value).join(",")}
    >
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
