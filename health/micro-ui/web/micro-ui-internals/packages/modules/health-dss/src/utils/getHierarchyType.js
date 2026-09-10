/**
 * The boundary hierarchy in play, resolved from one place so every consumer agrees.
 *
 * Previously this was derived three different ways: Module.js read globalConfigs and fell
 * back to "HIERARCHYTEST", while the maps components read campaignSelected and fell back to
 * "ADMIN". When those disagreed, Module.js loaded the wrong hcm-boundary-{hierarchyType}
 * localization bundle and every boundary code rendered untranslated.
 *
 * The selected campaign wins: it is what the boundary codes on screen actually belong to.
 */
export const getHierarchyType = () => {
  const campaignSelected = Digit.SessionStorage.get("campaignSelected");
  return (
    campaignSelected?.hierarchyType ||
    window?.globalConfigs?.getConfig("HIERARCHY_TYPE") ||
    "ADMIN"
  );
};
