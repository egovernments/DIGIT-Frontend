import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Card,
  Loader,
  Toast,
  PopUp,
  Panels,
  CheckBox,
  RadioButtons,
  Dropdown,
} from "@egovernments/digit-ui-components";
import BulkUpload from "../BulkUpload";
import XLSX from "xlsx";
import ExcelJS from "exceljs";

const CONSOLE_MDMS_MODULENAME = "HCM-ADMIN-CONSOLE";

const NewShipmentPopup = ({
  campaignNumber,
  campaignId,
  tenantId,
  projectId: projectIdProp,
  userBoundary,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const moduleName = Digit.Utils.campaign.getModuleName();

  const [fromFacilityId, setFromFacilityId] = useState("");
  const [selectedFacilityIds, setSelectedFacilityIds] = useState(new Set());
  const [fromSearchQuery, setFromSearchQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [fromHierarchyFilters, setFromHierarchyFilters] = useState({});
  const [toHierarchyFilters, setToHierarchyFilters] = useState({});
  const [uploadedFileData, setUploadedFileData] = useState([]);
  const [showToast, setShowToast] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [viewState, setViewState] = useState("form"); // "form" | "error"

  // Fetch BOUNDARY_HIERARCHY_TYPE from MDMS
  const {
    data: BOUNDARY_HIERARCHY_TYPE,
    isLoading: hierarchyTypeLoading,
  } = Digit.Hooks.useCustomMDMS(
    tenantId,
    CONSOLE_MDMS_MODULENAME,
    [{ name: "HierarchySchema", filter: `[?(@.type=='${moduleName}')]` }],
    {
      select: (data) =>
        data?.[CONSOLE_MDMS_MODULENAME]?.HierarchySchema?.[0]?.hierarchy,
    },
    { schemaCode: "HierarchySchema" },
  );

  const hierarchyDefinitionReqCriteria = useMemo(
    () => ({
      url: `/boundary-service/boundary-hierarchy-definition/_search`,
      changeQueryName: `${BOUNDARY_HIERARCHY_TYPE}`,
      body: {
        BoundaryTypeHierarchySearchCriteria: {
          tenantId,
          limit: 2,
          offset: 0,
          hierarchyType: BOUNDARY_HIERARCHY_TYPE,
        },
      },
      config: { enabled: !!BOUNDARY_HIERARCHY_TYPE },
    }),
    [tenantId, BOUNDARY_HIERARCHY_TYPE],
  );

  const {
    data: hierarchyDefinition,
    isLoading: hierarchyLoading,
  } = Digit.Hooks.useCustomAPIHook(hierarchyDefinitionReqCriteria);

  // Fetch boundary relationships (full tree) for cascading boundary dropdowns
  const boundaryRelationshipCriteria = useMemo(() => ({
    url: `/boundary-service/boundary-relationships/_search`,
    params: {
      tenantId,
      hierarchyType: BOUNDARY_HIERARCHY_TYPE,
      includeChildren: true,
    },
    body: {},
    config: {
      enabled: !!BOUNDARY_HIERARCHY_TYPE,
      cacheTime: 1000000,
    },
  }), [tenantId, BOUNDARY_HIERARCHY_TYPE]);

  const { data: boundaryRelationships, isLoading: boundaryRelLoading } = Digit.Hooks.useCustomAPIHook(boundaryRelationshipCriteria);

  // Build boundary code -> ancestor path map
  const boundaryAncestorMap = useMemo(() => {
    const boundaries = boundaryRelationships?.TenantBoundary?.[0]?.boundary || [];
    const map = {};
    const traverse = (node, ancestors) => {
      const currentPath = { ...ancestors };
      if (node?.boundaryType && node?.code) {
        currentPath[node.boundaryType] = node.code;
      }
      map[node?.code] = currentPath;
      if (node?.children) {
        node.children.forEach((child) => traverse(child, currentPath));
      }
    };
    boundaries.forEach((root) => traverse(root, {}));
    return map;
  }, [boundaryRelationships]);

  // Fetch campaign data to get projectId and product variants
  const campaignReqCriteria = useMemo(() => ({
    url: `/project-factory/v1/project-type/search`,
    body: {
      CampaignDetails: {
        tenantId,
        campaignNumber,
        isOverrideDatesFromProject: true,
      },
    },
    config: {
      enabled: !!campaignNumber,
      staleTime: 0,
      cacheTime: 0,
      select: (data) => data?.CampaignDetails?.[0],
    },
  }), [tenantId, campaignNumber]);

  const { data: campaignData, isLoading: campaignLoading } = Digit.Hooks.useCustomAPIHook(campaignReqCriteria);

  const projectId = campaignData?.projectId || projectIdProp;
  const campaignName = campaignData?.campaignName || "";

  // Extract product variants from campaign delivery rules
  const productVariants = useMemo(() => {
    if (!campaignData?.deliveryRules) return [];
    const variants = [];
    const seen = new Set();
    campaignData.deliveryRules.forEach((rule) => {
      rule?.resources?.forEach((r) => {
        if (r?.productVariantId && !seen.has(r.productVariantId)) {
          seen.add(r.productVariantId);
          variants.push({
            productVariantId: r.productVariantId,
            name: r.name || r.productVariantId,
          });
        }
      });
    });
    return variants;
  }, [campaignData]);

  const projectSearchCriteria = useMemo(
    () => ({
      url: `/project/v1/_search`,
      params: { tenantId, limit: 1000, offset: 0, includeDescendants: true },
      body: { Projects: [{ id: projectId, tenantId }] },
      config: {
        enabled: !!projectId,
        select: (data) => {
          const projects = data?.Project || [];
          const ids = [];
          const boundaryMap = {};
          const collectProject = (proj) => {
            if (proj?.id) {
              ids.push(proj.id);
              if (proj?.address?.boundary) {
                boundaryMap[proj.id] = {
                  boundary: proj.address.boundary,
                  boundaryType: proj.address.boundaryType,
                };
              }
            }
          };
          projects.forEach((proj) => {
            collectProject(proj);
            if (proj?.descendants) proj.descendants.forEach(collectProject);
          });
          if (ids.length === 0 && projectId) ids.push(projectId);
          return { ids, boundaryMap };
        },
      },
    }),
    [tenantId, projectId],
  );

  const {
    data: projectData,
    isLoading: projectsLoading,
  } = Digit.Hooks.useCustomAPIHook(projectSearchCriteria);
  const allProjectIds = projectData?.ids || [];
  const projectBoundaryMap = projectData?.boundaryMap || {};

  const sortedHierarchy = useMemo(() => {
    const boundaryHierarchy =
      hierarchyDefinition?.BoundaryHierarchy?.[0]?.boundaryHierarchy || [];
    if (!boundaryHierarchy.length) return [];
    const sorted = [];
    let current = boundaryHierarchy.find((item) => !item?.parentBoundaryType);
    while (current) {
      sorted.push(current);
      const next = boundaryHierarchy.find(
        (item) => item?.parentBoundaryType === current?.boundaryType,
      );
      if (!next) break;
      current = next;
    }
    return sorted;
  }, [hierarchyDefinition]);

  // Compute user's level index in the hierarchy and create effective hierarchy starting from that level
  const userLevelIndex = useMemo(() => {
    if (!userBoundary?.boundaryType || !sortedHierarchy.length) return 0;
    const idx = sortedHierarchy.findIndex((h) => h.boundaryType === userBoundary.boundaryType);
    return idx >= 0 ? idx : 0;
  }, [userBoundary, sortedHierarchy]);

  const effectiveHierarchy = useMemo(
    () => sortedHierarchy.slice(userLevelIndex),
    [sortedHierarchy, userLevelIndex]
  );

  // Pre-fill user's boundary level on mount
  useEffect(() => {
    if (userBoundary?.boundaryType && userBoundary?.boundary && effectiveHierarchy.length > 0) {
      setFromHierarchyFilters((prev) => {
        if (prev[userBoundary.boundaryType]) return prev;
        return { ...prev, [userBoundary.boundaryType]: userBoundary.boundary };
      });
    }
  }, [userBoundary, effectiveHierarchy]);

  // Build hierarchy filter options from boundary tree
  const hierarchyFilterOptions = useMemo(() => {
    const boundaries = boundaryRelationships?.TenantBoundary?.[0]?.boundary || [];
    const options = {};
    const traverse = (node) => {
      if (node?.boundaryType && node?.code) {
        if (!options[node.boundaryType]) options[node.boundaryType] = [];
        if (!options[node.boundaryType].includes(node.code)) {
          options[node.boundaryType].push(node.code);
        }
      }
      (node?.children || []).forEach(traverse);
    };
    boundaries.forEach(traverse);
    return options;
  }, [boundaryRelationships]);

  // Get cascading options: filter by parent selections (only levels above current)
  const getAvailableOptions = useCallback((boundaryType, filters) => {
    const allOptions = hierarchyFilterOptions[boundaryType] || [];
    const currentLevelIdx = sortedHierarchy.findIndex((h) => h.boundaryType === boundaryType);
    return allOptions.filter((code) => {
      const ancestors = boundaryAncestorMap[code] || {};
      return Object.entries(filters).every(([type, value]) => {
        if (!value || type === boundaryType) return true;
        const filterLevelIdx = sortedHierarchy.findIndex((h) => h.boundaryType === type);
        if (filterLevelIdx >= currentLevelIdx) return true; // skip same-level and lower-level filters
        return ancestors[type] === value;
      });
    });
  }, [hierarchyFilterOptions, boundaryAncestorMap, sortedHierarchy]);

  // Determine the deepest "From" hierarchy level with a selection (index relative to effectiveHierarchy)
  const fromSelectedLevel = useMemo(() => {
    let level = -1;
    effectiveHierarchy.forEach((h, idx) => {
      if (fromHierarchyFilters[h.boundaryType]) level = idx;
    });
    return level;
  }, [fromHierarchyFilters, effectiveHierarchy]);

  // "To" hierarchy levels: below the "From" selected level (within effectiveHierarchy)
  const toHierarchyLevels = useMemo(() => {
    if (fromSelectedLevel < 0) return [];
    return effectiveHierarchy.slice(fromSelectedLevel + 1);
  }, [effectiveHierarchy, fromSelectedLevel]);

  // Determine the deepest "To" hierarchy level with a selection (index relative to effectiveHierarchy)
  const toSelectedLevel = useMemo(() => {
    let level = -1;
    toHierarchyLevels.forEach((h) => {
      if (toHierarchyFilters[h.boundaryType]) {
        const idx = effectiveHierarchy.findIndex((s) => s.boundaryType === h.boundaryType);
        if (idx > level) level = idx;
      }
    });
    return level;
  }, [toHierarchyFilters, toHierarchyLevels, effectiveHierarchy]);

  // Visible "From" levels: show up to one level beyond the deepest selection
  const fromVisibleLevels = useMemo(() => {
    if (!effectiveHierarchy.length) return [];
    if (fromSelectedLevel < 0) return effectiveHierarchy.slice(0, 1);
    return effectiveHierarchy.slice(0, Math.min(fromSelectedLevel + 2, effectiveHierarchy.length));
  }, [effectiveHierarchy, fromSelectedLevel]);

  // Visible "To" levels: show up to one level beyond the deepest To selection
  const toVisibleLevels = useMemo(() => {
    if (!toHierarchyLevels.length) return [];
    let deepestRelIdx = -1;
    toHierarchyLevels.forEach((h, idx) => {
      if (toHierarchyFilters[h.boundaryType]) deepestRelIdx = idx;
    });
    if (deepestRelIdx < 0) return toHierarchyLevels.slice(0, 1);
    return toHierarchyLevels.slice(0, Math.min(deepestRelIdx + 2, toHierarchyLevels.length));
  }, [toHierarchyLevels, toHierarchyFilters]);

  // Filter project IDs for "From" — projects matching all From filters at the selected level
  const fromFilteredProjectIds = useMemo(() => {
    if (!allProjectIds.length || fromSelectedLevel < 0) return [];
    const targetBoundaryType = effectiveHierarchy[fromSelectedLevel]?.boundaryType;
    if (!targetBoundaryType) return [];
    return allProjectIds.filter((pid) => {
      const bInfo = projectBoundaryMap[pid];
      if (!bInfo?.boundary) return false;
      if (bInfo.boundaryType !== targetBoundaryType) return false;
      const ancestors = boundaryAncestorMap[bInfo.boundary] || {};
      return Object.entries(fromHierarchyFilters).every(([type, value]) => {
        if (!value) return true;
        return ancestors[type] === value;
      });
    });
  }, [allProjectIds, fromHierarchyFilters, fromSelectedLevel, effectiveHierarchy, projectBoundaryMap, boundaryAncestorMap]);

  // Filter project IDs for "To" — projects matching all combined filters at the selected To level
  const toFilteredProjectIds = useMemo(() => {
    if (!allProjectIds.length) return [];
    const hasToFilters = Object.values(toHierarchyFilters).some((v) => !!v);
    if (!hasToFilters) return [];
    const targetBoundaryType = toSelectedLevel >= 0
      ? effectiveHierarchy[toSelectedLevel]?.boundaryType
      : null;
    if (!targetBoundaryType) return [];
    const combinedFilters = { ...fromHierarchyFilters, ...toHierarchyFilters };
    return allProjectIds.filter((pid) => {
      const bInfo = projectBoundaryMap[pid];
      if (!bInfo?.boundary) return false;
      if (bInfo.boundaryType !== targetBoundaryType) return false;
      const ancestors = boundaryAncestorMap[bInfo.boundary] || {};
      return Object.entries(combinedFilters).every(([type, value]) => {
        if (!value) return true;
        return ancestors[type] === value;
      });
    });
  }, [allProjectIds, fromHierarchyFilters, toHierarchyFilters, toSelectedLevel, effectiveHierarchy, projectBoundaryMap, boundaryAncestorMap]);

  // Fetch "From" facilities using filtered project IDs
  const fromFacilityReqCriteria = useMemo(
    () => ({
      url: `/project/facility/v1/_search`,
      params: { tenantId, limit: 1000, offset: 0 },
      body: { ProjectFacility: { projectId: fromFilteredProjectIds } },
      config: {
        enabled: !!fromFilteredProjectIds?.length,
        select: (data) => {
          const projectFacilities = data?.ProjectFacilities || [];
          const seen = new Set();
          const unique = [];
          projectFacilities.forEach((pf) => {
            if (!seen.has(pf.facilityId)) {
              seen.add(pf.facilityId);
              unique.push({ id: pf.facilityId, name: pf.facilityId, projectId: pf.projectId });
            }
          });
          return unique;
        },
      },
    }),
    [tenantId, fromFilteredProjectIds],
  );

  const {
    data: fromFacilityList,
    isLoading: fromFacilitiesLoading,
  } = Digit.Hooks.useCustomAPIHook(fromFacilityReqCriteria);

  // Fetch "To" facilities using filtered project IDs
  const toFacilityReqCriteria = useMemo(
    () => ({
      url: `/project/facility/v1/_search`,
      params: { tenantId, limit: 1000, offset: 0 },
      body: { ProjectFacility: { projectId: toFilteredProjectIds } },
      config: {
        enabled: !!toFilteredProjectIds?.length,
        select: (data) => {
          const projectFacilities = data?.ProjectFacilities || [];
          const seen = new Set();
          const unique = [];
          projectFacilities.forEach((pf) => {
            if (!seen.has(pf.facilityId)) {
              seen.add(pf.facilityId);
              unique.push({ id: pf.facilityId, name: pf.facilityId, projectId: pf.projectId });
            }
          });
          return unique;
        },
      },
    }),
    [tenantId, toFilteredProjectIds],
  );

  const {
    data: rawToFacilityList,
    isLoading: toFacilitiesLoading,
  } = Digit.Hooks.useCustomAPIHook(toFacilityReqCriteria);

  // Collect all unique facility IDs from both lists for name resolution
  const allFacilityIds = useMemo(() => {
    const ids = new Set();
    (fromFacilityList || []).forEach((f) => ids.add(f.id));
    (rawToFacilityList || []).forEach((f) => ids.add(f.id));
    return [...ids];
  }, [fromFacilityList, rawToFacilityList]);

  // Fetch facility details to get names
  const facilityNameSearchCriteria = useMemo(() => ({
    url: `/facility/v1/_search`,
    params: { tenantId, limit: allFacilityIds.length || 10, offset: 0 },
    body: { Facility: { id: allFacilityIds } },
    config: {
      enabled: !!allFacilityIds.length && !!tenantId,
      select: (data) => {
        const nameMap = {};
        (data?.Facilities || []).forEach((f) => {
          if (f.id) nameMap[f.id] = f.name || f.id;
        });
        return nameMap;
      },
    },
  }), [tenantId, allFacilityIds]);

  const { data: facilityNameMap = {}, isLoading: facilityNamesLoading } = Digit.Hooks.useCustomAPIHook(facilityNameSearchCriteria);

  // Enrich facility lists with resolved names
  const enrichedFromFacilityList = useMemo(() => {
    if (!fromFacilityList?.length) return fromFacilityList;
    return fromFacilityList.map((f) => ({
      ...f,
      name: facilityNameMap[f.id] || f.id,
    }));
  }, [fromFacilityList, facilityNameMap]);

  const toFacilityList = useMemo(() => {
    if (!rawToFacilityList?.length) return rawToFacilityList;
    return rawToFacilityList.map((f) => ({
      ...f,
      name: facilityNameMap[f.id] || f.id,
    }));
  }, [rawToFacilityList, facilityNameMap]);

  const filteredFromFacilities = useMemo(() => {
    if (!enrichedFromFacilityList?.length) return [];
    if (!fromSearchQuery?.trim()) return enrichedFromFacilityList;
    const q = fromSearchQuery.toLowerCase();
    return enrichedFromFacilityList.filter(
      (f) =>
        (f.id && f.id.toLowerCase().includes(q)) ||
        (f.name && f.name.toLowerCase().includes(q)),
    );
  }, [enrichedFromFacilityList, fromSearchQuery]);

  const fromFacility = useMemo(
    () => enrichedFromFacilityList?.find((f) => f.id === fromFacilityId) || null,
    [enrichedFromFacilityList, fromFacilityId],
  );

  const filteredFacilities = useMemo(() => {
    if (!toFacilityList?.length) return [];
    // Exclude the selected From facility so a user can't dispatch to itself
    const available = fromFacilityId
      ? toFacilityList.filter((f) => f.id !== fromFacilityId)
      : toFacilityList;
    if (!searchQuery?.trim()) return available;
    const q = searchQuery.toLowerCase();
    return available.filter(
      (f) =>
        (f.id && f.id.toLowerCase().includes(q)) ||
        (f.name && f.name.toLowerCase().includes(q)),
    );
  }, [toFacilityList, searchQuery, fromFacilityId]);

  const selectedFacilities = useMemo(
    () =>
      toFacilityList?.length
        ? toFacilityList.filter((f) => selectedFacilityIds.has(f.id))
        : [],
    [toFacilityList, selectedFacilityIds],
  );

  const stockMutation = Digit.Hooks.useCustomAPIMutationHook({
    url: `/stock/v1/bulk/_create`,
    params: {},
    body: {},
    config: { enabled: false },
  });

  // Handle "From" hierarchy filter change (cascading + clear To filters)
  const handleFromHierarchyChange = useCallback((boundaryType, value) => {
    // Don't allow changing the locked user boundary level
    if (userBoundary?.boundaryType === boundaryType) return;
    setFromHierarchyFilters((prev) => {
      const next = { ...prev };
      next[boundaryType] = value;
      let foundCurrent = false;
      effectiveHierarchy.forEach((h) => {
        if (h.boundaryType === boundaryType) {
          foundCurrent = true;
        } else if (foundCurrent) {
          delete next[h.boundaryType];
        }
      });
      return next;
    });
    setToHierarchyFilters({});
    setSelectedFacilityIds(new Set());
    setFromFacilityId("");
  }, [effectiveHierarchy, userBoundary]);

  // Handle "To" hierarchy filter change (cascading)
  const handleToHierarchyChange = useCallback((boundaryType, value) => {
    setToHierarchyFilters((prev) => {
      const next = { ...prev };
      next[boundaryType] = value;
      let foundCurrent = false;
      toHierarchyLevels.forEach((h) => {
        if (h.boundaryType === boundaryType) {
          foundCurrent = true;
        } else if (foundCurrent) {
          delete next[h.boundaryType];
        }
      });
      return next;
    });
    setSelectedFacilityIds(new Set());
  }, [toHierarchyLevels]);

  const toggleFacility = useCallback((facilityId) => {
    setSelectedFacilityIds((prev) => {
      const next = new Set(prev);
      if (next.has(facilityId)) next.delete(facilityId);
      else next.add(facilityId);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedFacilityIds((prev) => {
      const allVisibleIds = filteredFacilities.map((f) => f.id);
      const allSelected = allVisibleIds.every((id) => prev.has(id));
      const next = new Set(prev);
      if (allSelected) allVisibleIds.forEach((id) => next.delete(id));
      else allVisibleIds.forEach((id) => next.add(id));
      return next;
    });
  }, [filteredFacilities]);

  const getTemplateHeaders = useCallback(() => {
    const boundaryHeaders = effectiveHierarchy.map((item) => item.boundaryType);
    const productHeaders = productVariants.map((pv) => pv.name || pv.productVariantId);
    return {
      boundaryHeaders,
      stockHeaders: [
        ...boundaryHeaders,
        "Campaign Number",
        "Project Name",
        "From (Facility Code)",
        "From (Facility Name)",
        "To (Facility Code)",
        "To (Facility Name)",
        ...productHeaders,
      ],
    };
  }, [effectiveHierarchy, productVariants]);

  const handleDownloadTemplate = useCallback(async () => {
    setIsDownloading(true);
    try {
      const { boundaryHeaders, stockHeaders } = getTemplateHeaders();
      const projectName = campaignName || "";

      // Collect facility IDs and names for Options sheet
      const fromFacs = (enrichedFromFacilityList || []).map((f) => ({ id: f.id, name: f.name || f.id }));
      const toFacs = (toFacilityList || []).map((f) => ({ id: f.id, name: f.name || f.id }));
      const fromFacIds = fromFacs.map((f) => f.id);
      const fromFacNames = fromFacs.map((f) => f.name);
      const toFacIds = toFacs.map((f) => f.id);
      const toFacNames = toFacs.map((f) => f.name);

      // Helper: convert column index (1-based) to Excel column letter
      const colLetter = (idx) => {
        let letter = "";
        let n = idx;
        while (n > 0) {
          const rem = (n - 1) % 26;
          letter = String.fromCharCode(65 + rem) + letter;
          n = Math.floor((n - 1) / 26);
        }
        return letter;
      };

      const wb = new ExcelJS.Workbook();

      // --- Stock Data sheet ---
      const ws = wb.addWorksheet("Stock Data");
      ws.addRow(stockHeaders); // Row 1: headers
      // Row 2: hidden variant ID row
      const variantIdRow = [];
      boundaryHeaders.forEach(() => variantIdRow.push(""));
      variantIdRow.push(""); // Campaign Number
      variantIdRow.push(""); // Project Name
      variantIdRow.push(""); // From (Facility Code)
      variantIdRow.push(""); // From (Facility Name)
      variantIdRow.push(""); // To (Facility Code)
      variantIdRow.push(""); // To (Facility Name)
      productVariants.forEach((pv) => variantIdRow.push(pv.productVariantId));
      ws.addRow(variantIdRow);
      ws.getRow(2).hidden = true;

      // Data rows (row 3+) — one row per selected To facility
      selectedFacilities.forEach((facility) => {
        const row = [];
        boundaryHeaders.forEach((bType) => {
          const code = fromHierarchyFilters[bType] || toHierarchyFilters[bType] || "";
          row.push(code ? t(code) : "");
        });
        row.push(campaignNumber || "");
        row.push(projectName);
        row.push(fromFacility?.id || "");
        row.push(fromFacility?.name || "");
        row.push(facility?.id || "");
        row.push(facility?.name || facility?.id || "");
        productVariants.forEach(() => row.push(""));
        ws.addRow(row);
      });

      const dataRowCount = Math.max(selectedFacilities.length, 100);

      // Set column widths
      ws.columns = stockHeaders.map(() => ({ width: 30 }));
      // Bold header row
      ws.getRow(1).font = { bold: true };

      // --- Options sheet (hidden) — 4 columns: From Codes, From Names, To Codes, To Names ---
      const optionsWs = wb.addWorksheet("Options", { state: "hidden" });
      optionsWs.addRow(["From Facility Codes", "From Facility Names", "To Facility Codes", "To Facility Names"]);
      const maxOptionsRows = Math.max(1, fromFacIds.length, toFacIds.length);
      for (let r = 0; r < maxOptionsRows; r++) {
        optionsWs.addRow([
          r < fromFacIds.length ? fromFacIds[r] : "",
          r < fromFacNames.length ? fromFacNames[r] : "",
          r < toFacIds.length ? toFacIds[r] : "",
          r < toFacNames.length ? toFacNames[r] : "",
        ]);
      }
      optionsWs.columns = [{ width: 30 }, { width: 30 }, { width: 30 }, { width: 30 }];

      // Column indices in Stock Data sheet (0-based for stockHeaders, 1-based for Excel)
      const fromCodeColIdx = stockHeaders.indexOf("From (Facility Code)");
      const fromNameColIdx = stockHeaders.indexOf("From (Facility Name)");
      const toCodeColIdx = stockHeaders.indexOf("To (Facility Code)");
      const toNameColIdx = stockHeaders.indexOf("To (Facility Name)");

      // From Facility Name dropdown (Options column B = names)
      if (fromNameColIdx >= 0 && fromFacNames.length > 0) {
        const nameCol = colLetter(fromNameColIdx + 1);
        for (let r = 3; r <= dataRowCount + 2; r++) {
          ws.getCell(`${nameCol}${r}`).dataValidation = {
            type: "list",
            allowBlank: true,
            formulae: [`Options!$B$2:$B$${fromFacNames.length + 1}`],
            showErrorMessage: true,
            errorTitle: "Invalid facility",
            error: "Please select a valid From Facility Name",
          };
        }
      }

      // From Facility Code auto-fill via INDEX/MATCH from name
      if (fromCodeColIdx >= 0 && fromNameColIdx >= 0 && fromFacIds.length > 0) {
        const codeCol = colLetter(fromCodeColIdx + 1);
        const nameCol = colLetter(fromNameColIdx + 1);
        for (let r = 3; r <= dataRowCount + 2; r++) {
          ws.getCell(`${codeCol}${r}`).value = {
            formula: `IFERROR(INDEX(Options!$A$2:$A$${fromFacIds.length + 1},MATCH(${nameCol}${r},Options!$B$2:$B$${fromFacNames.length + 1},0)),"")`,
          };
        }
      }

      // To Facility Name dropdown (Options column D = names)
      if (toNameColIdx >= 0 && toFacNames.length > 0) {
        const nameCol = colLetter(toNameColIdx + 1);
        for (let r = 3; r <= dataRowCount + 2; r++) {
          ws.getCell(`${nameCol}${r}`).dataValidation = {
            type: "list",
            allowBlank: true,
            formulae: [`Options!$D$2:$D$${toFacNames.length + 1}`],
            showErrorMessage: true,
            errorTitle: "Invalid facility",
            error: "Please select a valid To Facility Name",
          };
        }
      }

      // To Facility Code auto-fill via INDEX/MATCH from name
      if (toCodeColIdx >= 0 && toNameColIdx >= 0 && toFacIds.length > 0) {
        const codeCol = colLetter(toCodeColIdx + 1);
        const nameCol = colLetter(toNameColIdx + 1);
        for (let r = 3; r <= dataRowCount + 2; r++) {
          ws.getCell(`${codeCol}${r}`).value = {
            formula: `IFERROR(INDEX(Options!$C$2:$C$${toFacIds.length + 1},MATCH(${nameCol}${r},Options!$D$2:$D$${toFacNames.length + 1},0)),"")`,
          };
        }
      }

      // --- Lock cells & protect sheet ---
      // Unlock: Facility Name + Facility Code columns + product quantity cells
      const firstProductCol = boundaryHeaders.length + 6 + 1; // 1-based col index (6 fixed: CampaignNumber, ProjectName, FromCode, FromName, ToCode, ToName)
      const lastProductCol = firstProductCol + productVariants.length - 1;

      for (let r = 3; r <= dataRowCount + 2; r++) {
        // Unlock facility name and code columns
        if (fromCodeColIdx >= 0) ws.getCell(r, fromCodeColIdx + 1).protection = { locked: false };
        if (fromNameColIdx >= 0) ws.getCell(r, fromNameColIdx + 1).protection = { locked: false };
        if (toCodeColIdx >= 0) ws.getCell(r, toCodeColIdx + 1).protection = { locked: false };
        if (toNameColIdx >= 0) ws.getCell(r, toNameColIdx + 1).protection = { locked: false };
        // Unlock product quantity cells
        for (let c = firstProductCol; c <= lastProductCol; c++) {
          ws.getCell(r, c).protection = { locked: false };
        }
      }

      // --- Quantity validation on product cells ---
      for (let r = 3; r <= dataRowCount + 2; r++) {
        for (let c = firstProductCol; c <= lastProductCol; c++) {
          const cell = ws.getCell(r, c);
          cell.dataValidation = {
            type: 'whole',
            operator: 'greaterThanOrEqual',
            formulae: [0],
            allowBlank: true,
            showErrorMessage: true,
            errorTitle: 'Invalid quantity',
            error: 'Please enter a whole number (0 or greater)',
          };
        }
      }

      // --- ReadMe sheet ---
      const readmeWs = wb.addWorksheet("ReadMe");
      const readmeLines = [
        "Instructions",
        "",
        "1. Product quantity columns and facility columns are editable — all other columns are locked.",
        "2. Select a facility name from the dropdown in the Facility Name columns; the Facility Code will auto-fill.",
        "3. Boundary and Project Name columns have been pre-filled based on your selection and cannot be modified.",
        "4. 'From' is the source warehouse and 'To' is the destination facility.",
        "5. Each row represents one shipment between a From and To facility pair.",
        "6. Enter a whole number (0 or greater) for each product quantity.",
        "7. Leave a product quantity empty or 0 to skip that product for the row.",
        "8. Do NOT modify or delete the hidden row (row 2) — it contains product variant IDs.",
        "9. Do NOT add, delete, or rearrange columns — the sheet structure is protected.",
        "10. Do NOT add new rows — only the pre-filled rows will be processed on upload.",
        "11. Save the file and upload it back on the stock upload screen.",
      ];
      readmeLines.forEach((line) => readmeWs.addRow([line]));
      readmeWs.getColumn(1).width = 80;

      // Protect the Stock Data sheet (must be after all cell operations)
      await ws.protect('', {
        selectLockedCells: true,
        selectUnlockedCells: true,
        formatCells: false,
        formatColumns: false,
        formatRows: false,
        insertColumns: false,
        insertRows: false,
        insertHyperlinks: false,
        deleteColumns: false,
        deleteRows: false,
        sort: false,
        autoFilter: false,
      });

      // Write and download
      const buffer = await wb.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Stock_Template_${campaignNumber || "campaign"}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      setShowToast({ key: "success", label: t("HCM_DOWNLOAD_STOCK_TEMPLATE") });
    } catch (error) {
      console.error("Error downloading template:", error);
      setShowToast({ key: "error", label: t("HCM_STOCK_VALIDATION_ERROR") });
    } finally {
      setIsDownloading(false);
    }
  }, [
    selectedFacilities,
    fromFacility,
    getTemplateHeaders,
    productVariants,
    enrichedFromFacilityList,
    toFacilityList,
    fromHierarchyFilters,
    toHierarchyFilters,
    campaignNumber,
    campaignName,
    t,
  ]);

  const handleFileUpload = useCallback((files) => {
    try {
      let file = Array.isArray(files)
        ? files[0]
        : files instanceof FileList
        ? files[0]
        : files instanceof File
        ? files
        : files?.[0];
      if (!file) return;
      setUploadedFileData([
        { filename: file.name, url: URL.createObjectURL(file), file },
      ]);
    } catch (err) {
      setShowToast({
        key: "error",
        label: err?.message || "File upload failed",
      });
    }
  }, []);

  const handleFileDelete = useCallback(() => setUploadedFileData([]), []);

  const handleFileDownload = useCallback((file) => {
    if (file?.url) {
      const link = document.createElement("a");
      link.href = file.url;
      link.download = file.filename || "download.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!uploadedFileData?.length) {
      setShowToast({ key: "error", label: t("PLEASE_UPLOAD_FILE") });
      return;
    }
    setIsSubmitting(true);
    try {
      const file = uploadedFileData[0]?.file;
      if (!file) {
        setShowToast({ key: "error", label: t("PLEASE_UPLOAD_FILE") });
        setIsSubmitting(false);
        return;
      }
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      // Parse all rows including the hidden variant ID row (row 2)
      const allRows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      if (!allRows || allRows.length < 3) {
        setShowToast({ key: "error", label: t("HCM_EMPTY_SHEET") });
        setIsSubmitting(false);
        return;
      }

      const headers = allRows[0]; // Header row
      const variantIdRow = allRows[1]; // Hidden row with product variant IDs (fallback)
      const dataRows = allRows.slice(2); // Actual data rows

      // Find the indices of fixed columns
      const fromCodeIdx = headers.indexOf("From (Facility Code)");
      const toCodeIdx = headers.indexOf("To (Facility Code)");

      // Build a name→variantId lookup from known product variants
      const variantByName = {};
      productVariants.forEach((pv) => {
        variantByName[pv.name || pv.productVariantId] = pv.productVariantId;
      });

      // Build product column mapping: match header names against known product variants,
      // falling back to hidden row 2 for variant IDs
      const productColumns = [];
      const fixedHeaders = new Set(["Campaign Number", "Project Name", "From (Facility Code)", "From (Facility Name)", "To (Facility Code)", "To (Facility Name)"]);
      const boundaryHeaders = effectiveHierarchy.map((item) => item.boundaryType);
      const skipHeaders = new Set([...fixedHeaders, ...boundaryHeaders]);
      headers.forEach((header, idx) => {
        if (skipHeaders.has(header)) return;
        const variantId = variantByName[header] || (variantIdRow && variantIdRow[idx]) || "";
        if (variantId) {
          productColumns.push({ idx, productVariantId: variantId, name: header });
        }
      });

      if (!dataRows.length || !productColumns.length) {
        setShowToast({ key: "error", label: t("HCM_EMPTY_SHEET") });
        setIsSubmitting(false);
        return;
      }

      // --- Upload validations ---
      const errors = [];
      const validFromIds = new Set((fromFacilityList || []).map((f) => f.id));
      const validToIds = new Set((toFacilityList || []).map((f) => f.id));

      dataRows.forEach((row, rowIdx) => {
        const rowNum = rowIdx + 3; // Excel row number
        const senderId = fromCodeIdx >= 0 ? String(row[fromCodeIdx] || "").trim() : "";
        const receiverId = toCodeIdx >= 0 ? String(row[toCodeIdx] || "").trim() : "";

        // Skip entirely empty rows (template generates blank rows for user input)
        const hasAnyProduct = productColumns.some(({ idx }) => {
          const val = row[idx];
          return val !== undefined && val !== null && val !== "";
        });
        if (!senderId && !receiverId && !hasAnyProduct) return;

        if (!senderId) {
          errors.push(`Row ${rowNum}: Missing From Facility Code`);
        } else if (validFromIds.size > 0 && !validFromIds.has(senderId)) {
          errors.push(`Row ${rowNum}: Invalid From Facility "${senderId}"`);
        }

        if (!receiverId) {
          errors.push(`Row ${rowNum}: Missing To Facility Code`);
        } else if (validToIds.size > 0 && !validToIds.has(receiverId)) {
          errors.push(`Row ${rowNum}: Invalid To Facility "${receiverId}"`);
        }

        if (senderId && receiverId && senderId === receiverId) {
          errors.push(`Row ${rowNum}: From and To facility cannot be the same`);
        }

        // Validate quantities
        productColumns.forEach(({ idx, name }) => {
          const val = row[idx];
          if (val !== undefined && val !== null && val !== "") {
            const num = Number(val);
            if (!Number.isFinite(num) || num < 0 || !Number.isInteger(num)) {
              errors.push(`Row ${rowNum}: "${name}" must be a whole number >= 0`);
            }
          }
        });
      });

      if (errors.length > 0) {
        setShowToast({
          key: "error",
          label: `${errors.length} validation error(s): ${errors.slice(0, 3).join("; ")}${errors.length > 3 ? "..." : ""}`,
        });
        setIsSubmitting(false);
        return;
      }

      const userInfo = Digit.UserService.getUser()?.info;
      const timestamp = Date.now();
      const stockPayload = [];

      dataRows.forEach((row) => {
        const senderId = (fromCodeIdx >= 0 ? row[fromCodeIdx] : "") || fromFacility?.id || "";
        const receiverId = (toCodeIdx >= 0 ? row[toCodeIdx] : "") || "";

        if (!senderId || !receiverId || senderId === receiverId) return;

        // Create one stock entry per product column that has a valid quantity
        productColumns.forEach(({ idx, productVariantId }) => {
          const quantity = parseInt(row[idx], 10);
          if (!quantity || quantity <= 0) return;

          // Look up SKU from product variants
          const matchedVariant = productVariants.find((pv) => pv.productVariantId === productVariantId);
          const productVariantSku = matchedVariant?.name || productVariantId;

          stockPayload.push({
            tenantId,
            clientReferenceId: crypto.randomUUID(),
            productVariantId,
            quantity,
            referenceId: projectId || campaignId,
            referenceIdType: "PROJECT",
            transactionType: "DISPATCHED",
            senderType: "WAREHOUSE",
            senderId,
            receiverType: "WAREHOUSE",
            receiverId,
            dateOfEntry: timestamp,
            isDeleted: false,
            rowVersion: 1,
            additionalFields: {
              schema: "Stock",
              version: 1,
              fields: [
                { key: "sku", value: productVariantSku },
                { key: "stockEntryType", value: "ISSUED" },
                { key: "primaryRole", value: "SENDER" },
                { key: "secondaryRole", value: "RECEIVER" },
                { key: "status", value: "IN_TRANSIT" },
              ],
            },
            auditDetails: {
              createdBy: userInfo?.uuid,
              lastModifiedBy: userInfo?.uuid,
              createdTime: timestamp,
              lastModifiedTime: timestamp,
            },
            clientAuditDetails: {
              createdBy: userInfo?.uuid,
              createdTime: timestamp,
              lastModifiedTime: timestamp,
            },
          });
        });
      });

      if (!stockPayload.length) {
        setShowToast({ key: "error", label: t("HCM_EMPTY_SHEET") });
        setIsSubmitting(false);
        return;
      }

      let failedCount = 0;
      /*for (let i = 0; i < stockPayload.length; i++) {
        try {
          await stockMutation.mutateAsync({
            url: `/stock/v1/_create`,
            body: {
              RequestInfo: {
                authToken: Digit.UserService.getUser()?.access_token,
              },
              Stock: stockPayload[i],
            },
          });
        } catch (error) {
          console.error(`Stock create error for row ${i}:`, error);
          failedCount++;
        }
      }*/
           try {
  await stockMutation.mutateAsync({
    url: `/stock/v1/bulk/_create`,
    body: {
      RequestInfo: {
        authToken: Digit.UserService.getUser()?.access_token,
      },
      Stock: stockPayload,
    },
  });
} catch (error) {
  console.error("Bulk stock create error:", error);
  failedCount = stockPayload.length;
}

      if (failedCount > 0 && failedCount === stockPayload.length) {
        throw new Error("All stock transactions failed");
      }
      if (failedCount > 0) {
        setShowToast({
          key: "warning",
          label: `${stockPayload.length - failedCount}/${
            stockPayload.length
          } rows created. ${failedCount} failed.`,
        });
        return;
      }

      onSuccess?.();
    } catch (error) {
      // console.error("Stock upload error:", error);
      // setShowToast({ key: "error", label: t("HCM_STOCK_VALIDATION_ERROR") });
      setViewState("error");
    } finally {
      setIsSubmitting(false);
    }
  }, [
    uploadedFileData,
    tenantId,
    campaignId,
    projectId,
    fromFacility,
    fromFacilityList,
    toFacilityList,
    productVariants,
    stockMutation,
    onSuccess,
    t,
  ]);

  const isLoadingInitialData =
    campaignLoading ||
    hierarchyTypeLoading ||
    hierarchyLoading ||
    boundaryRelLoading ||
    projectsLoading;
  const allVisibleSelected =
    filteredFacilities.length > 0 &&
    filteredFacilities.every((f) => selectedFacilityIds.has(f.id));

  return (
    <>
      <PopUp
        className={"boundaries-pop-module"}
        type={"default"}
        heading={t("HCM_BULK_STOCK_UPLOAD_HEADING")}
        children={[]}
        onOverlayClick={onClose}
        onClose={onClose}
        footerChildren={
          viewState === "error"
            ? [
                <Button
                  type="button"
                  size="large"
                  variation="secondary"
                  label={t("HCM_BACK")}
                  onClick={() => setViewState("form")}
                />,
              ]
            : [
                <Button
                  type="button"
                  size="large"
                  variation="secondary"
                  label={t("HCM_BACK")}
                  onClick={onClose}
                />,
                <Button
                  type="button"
                  size="large"
                  variation="primary"
                  label={
                    isSubmitting
                      ? t("HCM_STOCK_PROCESSING")
                      : t("HCM_STOCK_SUBMIT")
                  }
                  onClick={handleSubmit}
                  isDisabled={!uploadedFileData?.length || isSubmitting}
                />,
              ]
        }
        sortFooterChildren={true}
        
        style={{ width: "60rem" }}
      >
        <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
          {isLoadingInitialData ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Loader />
            </div>
          ) : viewState === "error" ? (
            <div style={{ padding: "2rem 1rem" }}>
              <Panels
                type="error"
                message={t("HCM_STOCK_VALIDATION_ERROR")}
                info={t("PLEASE_CHECK_YOUR_FILE")}
                showAsSvg={false}
              />
            </div>
          ) : (
            <>
              <p style={{ marginBottom: "1.5rem", color: "#505A5F" }}>
                {t("HCM_BULK_STOCK_UPLOAD_DESC")}
              </p>

              <Card type={"secondary"}>
                <h2 style={{ fontSize: "1.2rem", fontWeight: "700" }}>
                  {t("HCM_SELECT_FROM_FACILITY")}
                </h2>
                <p style={{ color: "#505A5F", marginBottom: "0rem" }}>
                  {t("HCM_FROM_FACILITY_DESC")}
                </p>

                {fromVisibleLevels.length > 0 && (
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}
                  >
                    {fromVisibleLevels.map((h) => {
                      const options = hierarchyFilterOptions[h.boundaryType];
                      if (!options) return null;
                      const isUserLevel = userBoundary?.boundaryType === h.boundaryType;
                      const availableOptions = isUserLevel
                        ? [userBoundary.boundary]
                        : getAvailableOptions(h.boundaryType, fromHierarchyFilters);
                      return (
                        <div
                          key={h.boundaryType}
                          style={{ minWidth: "180px", flex: "1" }}
                        >
                          <label
                            style={{
                              display: "block",
                              fontWeight: "600",
                              marginBottom: "0.25rem",
                              fontSize: "0.875rem",
                            }}
                          >
                            {t(h.boundaryType)}
                          </label>
                          <Dropdown
                            t={t}
                            option={availableOptions.map((code) => ({ code, name: t(code) }))}
                            optionKey="name"
                            selected={
                              fromHierarchyFilters[h.boundaryType]
                                ? { code: fromHierarchyFilters[h.boundaryType], name: t(fromHierarchyFilters[h.boundaryType]) }
                                : undefined
                            }
                            select={(selected) => handleFromHierarchyChange(h.boundaryType, selected.code)}
                            placeholder={t("ES_COMMON_SELECT")}
                            style={{ width: "100%" }}
                            disable={isUserLevel}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}

                {fromFacilitiesLoading || facilityNamesLoading ? (
                  <Loader />
                ) : enrichedFromFacilityList?.length > 0 ? (
                  <div style={{}}>
                    <input
                      type="text"
                      placeholder={t("ES_COMMON_SEARCH")}
                      value={fromSearchQuery}
                      onChange={(e) => setFromSearchQuery(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.5rem 0.75rem",
                        border: "1px solid #D6D5D4",
                        borderRadius: "0.25rem",
                        marginBottom: "1rem",
                        fontSize: "1rem",
                        outline: "none",
                      }}
                    />
                    <div
                      style={{
                        maxHeight: "200px",
                        overflowY: "auto",
                        border: "1px solid #D6D5D4",
                        borderRadius: "0.25rem",
                        padding: "0.75rem",
                      }}
                    >
                      <RadioButtons
                        options={filteredFromFacilities.map((f) => ({
                          code: f.id,
                          name: f.name !== f.id ? `${f.name} (${f.id})` : f.id,
                        }))}
                        optionsKey="name"
                        selectedOption={
                          fromFacilityId
                            ? filteredFromFacilities
                                .map((f) => ({
                                  code: f.id,
                                  name: f.name !== f.id ? `${f.name} (${f.id})` : f.id,
                                }))
                                .find((f) => f.code === fromFacilityId)
                            : undefined
                        }
                        onSelect={(selected) => setFromFacilityId(selected.code)}
                      />
                    </div>
                    {fromFacility && (
                      <p
                        style={{
                          marginTop: "0.5rem",
                          color: "#0B4B66",
                          fontWeight: "600",
                        }}
                      >
                        {t("HCM_SELECTED")}:{" "}
                        {fromFacility.name || fromFacility.id}
                      </p>
                    )}
                  </div>
                ) : fromSelectedLevel >= 0 ? (
                  <p style={{ color: "#505A5F", marginBottom: "0rem" }}>
                    {t("HCM_FACILITY_API_FAILED_DESC")}
                  </p>
                ) : (
                  <p style={{ color: "#505A5F", marginBottom: "0rem" }}>
                    {t("HCM_SELECT_HIERARCHY_FIRST")}
                  </p>
                )}

                {fromSelectedLevel >= 0 && (
                  <div
                    style={{
                      display: "flex",
                      gap: "16px",
                      flexDirection: "column",
                    }}
                  >
                    <h2 style={{ fontSize: "1.2rem", fontWeight: "700" }}>
                      {t("HCM_SELECT_TO_FACILITIES")}
                    </h2>
                    <p style={{ color: "#505A5F", marginBottom: "0rem" }}>
                      {t("HCM_TO_FACILITIES_DESC")}
                    </p>

                    {toVisibleLevels.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "1rem",
                          marginBottom: "1rem",
                        }}
                      >
                        {toVisibleLevels.map((h) => {
                          const options = hierarchyFilterOptions[h.boundaryType];
                          if (!options) return null;
                          const availableOptions = getAvailableOptions(h.boundaryType, { ...fromHierarchyFilters, ...toHierarchyFilters });
                          return (
                            <div
                              key={h.boundaryType}
                              style={{ minWidth: "180px", flex: "1" }}
                            >
                              <label
                                style={{
                                  display: "block",
                                  fontWeight: "600",
                                  marginBottom: "0.25rem",
                                  fontSize: "0.875rem",
                                }}
                              >
                                {t(h.boundaryType)}
                              </label>
                              <Dropdown
                                t={t}
                                option={availableOptions.map((code) => ({ code, name: t(code) }))}
                                optionKey="name"
                                selected={
                                  toHierarchyFilters[h.boundaryType]
                                    ? { code: toHierarchyFilters[h.boundaryType], name: t(toHierarchyFilters[h.boundaryType]) }
                                    : undefined
                                }
                                select={(selected) => handleToHierarchyChange(h.boundaryType, selected.code)}
                                placeholder={t("ES_COMMON_SELECT")}
                                style={{ width: "100%" }}
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {toFacilitiesLoading ? (
                      <Loader />
                    ) : toFacilityList?.length > 0 ? (
                      <div style={{ marginBottom: "1rem" }}>
                        <input
                          type="text"
                          placeholder={t("ES_COMMON_SEARCH")}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "0.5rem 0.75rem",
                            border: "1px solid #D6D5D4",
                            borderRadius: "0.25rem",
                            marginBottom: "1rem",
                            fontSize: "1rem",
                            outline: "none",
                          }}
                        />
                        <CheckBox
                          checked={allVisibleSelected}
                          onChange={toggleSelectAll}
                          label={`${
                            allVisibleSelected
                              ? t("HCM_DESELECT_ALL")
                              : t("HCM_SELECT_ALL")
                          } (${filteredFacilities.length})`}
                          style={{ marginBottom: "0.5rem" }}
                        />
                        <div
                          style={{
                            maxHeight: "300px",
                            overflowY: "auto",
                            border: "1px solid #D6D5D4",
                            borderRadius: "0.25rem",
                          }}
                        >
                          {filteredFacilities.map((f) => (
                            <div
                              key={f.id}
                              style={{
                                padding: "0.5rem 0.75rem",
                                backgroundColor: selectedFacilityIds.has(f.id)
                                  ? "#FFF3E8"
                                  : "transparent",
                              }}
                            >
                              <CheckBox
                                checked={selectedFacilityIds.has(f.id)}
                                onChange={() => toggleFacility(f.id)}
                                label={f.name !== f.id ? `${f.name} (${f.id})` : f.id}
                              />
                            </div>
                          ))}
                        </div>
                        {selectedFacilityIds.size > 0 && (
                          <p style={{ marginTop: "0.5rem", color: "#505A5F" }}>
                            {selectedFacilityIds.size} {t("HCM_SELECTED")}
                          </p>
                        )}
                      </div>
                    ) : toSelectedLevel >= 0 ? (
                      <p style={{ color: "#505A5F", marginBottom: "1rem" }}>
                        {t("HCM_FACILITY_API_FAILED_DESC")}
                      </p>
                    ) : (
                      <p style={{ color: "#505A5F", marginBottom: "1rem" }}>
                        {t("HCM_SELECT_HIERARCHY_FIRST")}
                      </p>
                    )}
                  </div>
                )}

                <Button
                  label={
                    isDownloading
                      ? t("LOADING")
                      : t("HCM_DOWNLOAD_STOCK_TEMPLATE")
                  }
                  variation="secondary"
                  type="button"
                  icon="DownloadIcon"
                  onClick={handleDownloadTemplate}
                  isDisabled={isDownloading || fromSelectedLevel < 0 || toSelectedLevel < 0 || !fromFacilityId || selectedFacilityIds.size === 0}
                />
              </Card>

              <Card type={"secondary"} style={{ marginTop: "1.5rem" }}>
                <h2 style={{ fontSize: "1.2rem", fontWeight: "700" }}>
                  {t("HCM_UPLOAD_STOCK_TEMPLATE")}
                </h2>
                <BulkUpload
                  onSubmit={handleFileUpload}
                  fileData={uploadedFileData}
                  onFileDelete={handleFileDelete}
                  onFileDownload={handleFileDownload}
                />
              </Card>
            </>
          )}
        </div>

        {showToast && (
          <Toast
            label={showToast?.label}
            type={
              showToast?.key === "error"
                ? "error"
                : showToast?.key === "warning"
                ? "warning"
                : "success"
            }
            isDleteBtn={true}
            onClose={() => setShowToast(null)}
            transitionTime={5000}
          />
        )}
      </PopUp>
    </>
  );
};

export default NewShipmentPopup;
