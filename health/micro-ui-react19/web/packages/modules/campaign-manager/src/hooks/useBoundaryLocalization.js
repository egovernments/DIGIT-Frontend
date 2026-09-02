import { useQuery } from "@tanstack/react-query";

/**
 * Loads the boundary localizations for a hierarchy (`hcm-boundary-<hierarchyType>`) into i18n.
 *
 * Boundary codes are used directly as translation keys (e.g. `t("ITN_NI")`), but the campaign
 * module only preloads the campaign-level localization modules — the boundary module name depends
 * on the campaign's hierarchyType, which is only known at runtime. Any screen that renders
 * boundary names must therefore pull the module in itself.
 *
 * This mirrors `Digit.Services.useStore({ moduleCode: [`boundary-${hierarchyType}`], modulePrefix: "hcm" })`
 * — same query key and same prefix/lowercase transform — so it shares react-query's cache with the
 * boundary selection screens instead of refetching. The reason for not calling useStore directly is
 * that it has no `enabled` option, so it would fire a `module=` request before hierarchyType resolves.
 *
 * @param {string} hierarchyType hierarchy type of the campaign (e.g. "ITN"); falsy skips the fetch
 * @returns {{ isLoading: boolean, isFetched: boolean }} query state — `isLoading` is false when skipped
 */
const useBoundaryLocalization = (hierarchyType) => {
  const stateCode = Digit.ULBService.getStateId();
  const language = Digit.StoreData.getCurrentLanguage();
  const modulePrefix = "hcm";
  const moduleCode = hierarchyType ? [`boundary-${hierarchyType}`] : [];

  return useQuery({
    // Same key shape as Digit.Services.useStore so both dedupe to one request
    queryKey: ["store", stateCode, moduleCode, language, modulePrefix],
    queryFn: () =>
      Digit.LocalizationService.getLocale({
        modules: moduleCode.map((code) => `${modulePrefix}-${code.toLowerCase()}`),
        locale: language,
        tenantId: stateCode,
      }),
    enabled: moduleCode.length > 0 && !!language && !!stateCode,
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
  });
};

export default useBoundaryLocalization;
