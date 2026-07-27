// Tenant colour overrides — fetched from MDMS (Studio.UIThemeConfig) and applied
// as CSS custom properties so every module (ServiceDesigner, PublicServices, core)
// picks them up through the existing var(--digitv2-lightTheme-*) usage, with no
// per-module changes required.
const SCHEMA_CODE = "Studio.UIThemeConfig";

const DEFAULT_OVERRIDES = {
  primaryColor: "#008080",
  secondaryColor: "#0b4b66",
  textColor: "#0B0C0C",
  fontFamily: "Roboto",
  buttonRadius: "6px",
  cardRadius: "12px",
};

// Each user-facing knob drives every --digitv2-* var listed here.
// Extend this map (not module call sites) when a new var needs to follow one
// of these knobs. fontFamily maps to BOTH the sans and rc (Roboto Condensed)
// tokens — the UI only exposes a single font choice, so the whole app adopts
// one uniform family rather than keeping body/heading fonts independent.
// buttonRadius/cardRadius reuse the library's OWN existing border-radius
// tokens (buttonsV2.scss / cardV2.scss already read these — not a new var,
// no hardcoded-value sweep needed like colours/fonts required). radius2
// drives small/medium buttons, radius3 drives large buttons — both get the
// same value so every button size is uniformly rounded, not just one size.
const CSS_VAR_MAP = {
  primaryColor: ["--digitv2-lightTheme-primary", "--digitv2-lightTheme-primary-1"],
  secondaryColor: ["--digitv2-lightTheme-primary-2", "--digitv2-lightTheme-header-sidenav"],
  textColor: ["--digitv2-lightTheme-text-color-primary", "--digitv2-lightTheme-text-primary"],
  fontFamily: ["--digitv2-fontFamily-sans", "--digitv2-fontFamily-rc"],
  buttonRadius: ["--digitv2-borderRadius-radius2", "--digitv2-borderRadius-radius3"],
  cardRadius: ["--digitv2-borderRadius-radius5"],
};

// "important" priority is required to win over the `!important` theme <style>
// block some environments inject via nginx sub_filter, and over the separate
// --digitv2-lightTheme-* values shipped inside the CDN-loaded
// @egovernments/digit-ui-components-css stylesheet.
export const applyThemeOverrides = (overrides = DEFAULT_OVERRIDES) => {
  const root = document.documentElement;
  Object.entries(CSS_VAR_MAP).forEach(([key, cssVars]) => {
    const value = overrides?.[key];
    if (!value) return;
    cssVars.forEach((cssVar) => root.style.setProperty(cssVar, value, "important"));
  });
};

// Fetches the active theme record for the current tenant and applies it.
// Anonymous-friendly (mirrors useCitizenLandingConfigAPI's env-level lookup) —
// falls back to DEFAULT_OVERRIDES on any error so a broken/unreachable MDMS
// never blocks first paint.
export const fetchAndApplyThemeOverrides = async () => {
  try {
    const mdmsContextPath = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";
    const tenantId = window?.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID") || "mz";

    const response = await window.Digit.CustomService.getResponse({
      url: `/${mdmsContextPath}/v2/_search`,
      body: {
        MdmsCriteria: { tenantId, schemaCode: SCHEMA_CODE, isActive: true },
      },
    });

    const records = (response?.mdms || []).filter((r) => r?.isActive !== false);
    records.sort(
      (a, b) =>
        (b?.auditDetails?.lastModifiedTime || b?.auditDetails?.createdTime || 0) -
        (a?.auditDetails?.lastModifiedTime || a?.auditDetails?.createdTime || 0)
    );

    applyThemeOverrides({ ...DEFAULT_OVERRIDES, ...(records[0]?.data || {}) });
  } catch (error) {
    console.warn("Theme override fetch failed, applying defaults:", error);
    applyThemeOverrides(DEFAULT_OVERRIDES);
  }
};
