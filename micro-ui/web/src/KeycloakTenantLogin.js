// Rendered instead of the normal DIGIT app (see index.js) when the URL is
// /<contextPath>/<TENANT>/employee/user/login or
// /<contextPath>/<TENANT>/citizen/user/login — a tenant-prefixed Keycloak
// entry point, kept deliberately outside digit-ui-module-core's router so
// adding a new tenant never requires touching that shared, external package.
// `userType` picks the Keycloak client (and, on citizen's realm, the
// "citizen mobile login" browser flow — mobile number then SMS OTP, both
// hosted by Keycloak itself, same as employee's own multi-step flow).
//
// Two things happen here, both outside the heavy module-loading path:
//   1. Fresh visit (no code/state in the URL yet) -> redirect straight to
//      Keycloak for this tenant's realm. No DIGIT login form is ever shown.
//   2. Keycloak's callback (code/state present) -> exchange the code, build a
//      DIGIT-shaped session, store it, and hard-navigate into the real app.
import React, { useEffect, useState } from "react";
import { initLibraries } from "@egovernments/digit-ui-libraries";
import { loginWithKeycloak, completeKeycloakLogin, hasOAuthCallback } from "./auth/keycloakClient";
import { buildDigitSessionFromKeycloak } from "./auth/buildDigitSession";

// `?from=` is where the user was headed before login (same contract the old DIGIT login used).
// Only a path inside this app's own area for this user type (and, for citizens, this tenant) is
// followed — never another site or another tenant.
const safeReturnTo = (from, contextPath, userType, tenant) => {
  if (!from || typeof from !== "string" || from.startsWith("//")) return null;
  const areas = [`/${contextPath}/${userType}`, `/${contextPath}/${tenant}/${userType}`].map((a) => a.toLowerCase());
  const target = from.toLowerCase();
  return areas.some((a) => target === a || target.startsWith(`${a}/`)) ? from : null;
};

const KeycloakTenantLogin = ({ contextPath, tenant, userType = "employee" }) => {
  const [error, setError] = useState(null);
  const isCitizen = userType === "citizen";

  useEffect(() => {
    (async () => {
      try {
        if (!hasOAuthCallback()) {
          const from = new URLSearchParams(window.location.search).get("from");
          await loginWithKeycloak(contextPath, tenant, userType, safeReturnTo(from, contextPath, userType, tenant));
          return; // page is navigating away
        }

        const result = await completeKeycloakLogin(contextPath);
        const session = buildDigitSessionFromKeycloak(result);

        // window.Digit.UserService/SessionStorage only exist after this runs —
        // normally done inside MainApp's effect, which this page never mounts.
        await initLibraries();
        window.Digit.SessionStorage.set(isCitizen ? "Citizen.tenantId" : "Employee.tenantId", session.info.tenantId);
        window.Digit.UserService.setUser(session);

        // The redirect below is a full page reload, not client-side navigation.
        // index.js's initTokens() runs on every fresh load and unconditionally
        // REBUILDS the session from these specific localStorage keys — it has
        // no idea Digit.SessionStorage was just set above, that's wiped by the
        // reload. Without writing these too, initTokens() overwrites our
        // session with null (JSON.parse(null) doesn't throw) the instant this
        // page reloads. Same keys the old password-login flow's
        // setEmployeeDetail() writes, for the same reason.
        localStorage.setItem("token", session.access_token);
        if (isCitizen) {
          localStorage.setItem("Citizen.token", session.access_token);
          localStorage.setItem("Citizen.user-info", JSON.stringify(session.info));
          localStorage.setItem("Citizen.tenant-id", session.info.tenantId);
        } else {
          localStorage.setItem("Employee.token", session.access_token);
          localStorage.setItem("Employee.user-info", JSON.stringify(session.info));
          localStorage.setItem("Employee.tenant-id", session.info.tenantId);
        }
        localStorage.setItem("tenant-id", session.info.tenantId);
        // initTokens() only rebuilds the employee session for a userType other
        // than the literal string "CITIZEN" (its check is case-sensitive) — see
        // src/index.js's own citizen branch added alongside this file.
        sessionStorage.setItem("userType", isCitizen ? "CITIZEN" : "employee");

        // Citizen pages live under the tenant (/<base>/<TENANT>/citizen); employees keep /<base>/employee.
        const home = isCitizen ? `/${contextPath}/${tenant}/citizen` : `/${contextPath}/${userType}`;
        window.location.href = safeReturnTo(result.returnTo, contextPath, userType, tenant) || home;
      } catch (err) {
        setError(err?.message || "Keycloak login failed");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", gap: "12px" }}>
        <div style={{ color: "#c53030", fontWeight: 600 }}>Keycloak login failed</div>
        <div>{error}</div>
        <a href={`/${contextPath}/${tenant}/${userType}/user/login`}>Try again</a>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      Redirecting to {tenant} sign-in…
    </div>
  );
};

export default KeycloakTenantLogin;
