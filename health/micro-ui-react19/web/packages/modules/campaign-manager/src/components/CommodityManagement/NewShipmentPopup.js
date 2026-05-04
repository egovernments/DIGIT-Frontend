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
  MultiSelectDropdown,
} from "@egovernments/digit-ui-components";
import BulkUpload from "../BulkUpload";

const CONSOLE_MDMS_MODULENAME = "HCM-ADMIN-CONSOLE";

const NewShipmentPopup = ({
  campaignNumber,
  campaignId,
  tenantId,
  projectId: projectIdProp,
  userBoundary,
  isTopLevel,
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
      (rule?.cycles || []).forEach((cycle) => {
        (cycle?.deliveries || []).forEach((delivery) => {
          (delivery?.doseCriteria || []).forEach((dose) => {
            (dose?.ProductVariants || []).forEach((pv) => {
              if (pv?.productVariantId && !seen.has(pv.productVariantId)) {
                seen.add(pv.productVariantId);
                variants.push({ productVariantId: pv.productVariantId, name: pv.name || pv.productVariantId });
              }
            });
          });
        });
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
          const idSet = new Set();
          const boundaryMap = {};
          const collectProject = (proj) => {
            if (!proj?.id || idSet.has(proj.id)) return;
            idSet.add(proj.id);
            if (proj?.address?.boundary) {
              boundaryMap[proj.id] = {
                boundary: proj.address.boundary,
                boundaryType: proj.address.boundaryType,
                referenceId: proj.referenceId,
              };
            }
            // Recurse into nested descendants
            if (proj?.descendants) proj.descendants.forEach(collectProject);
          };
          projects.forEach(collectProject);
          if (idSet.size === 0 && projectId) idSet.add(projectId);
          return { ids: [...idSet], boundaryMap };
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

  // Auto-select the first from facility when the facility list changes (new boundary → new list)
  useEffect(() => {
    if (!fromFacilityList?.length) return;
    setFromFacilityId(fromFacilityList[0].id);
  }, [fromFacilityList]);

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
        if (type === boundaryType) return true;
        const filterLevelIdx = sortedHierarchy.findIndex((h) => h.boundaryType === type);
        if (filterLevelIdx >= currentLevelIdx) return true;
        if (Array.isArray(value)) {
          if (!value.length) return true;
          return value.includes(ancestors[type]);
        }
        if (!value) return true;
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
      const val = toHierarchyFilters[h.boundaryType];
      if (Array.isArray(val) ? val.length > 0 : !!val) {
        const idx = effectiveHierarchy.findIndex((s) => s.boundaryType === h.boundaryType);
        if (idx > level) level = idx;
      }
    });
    return level;
  }, [toHierarchyFilters, toHierarchyLevels, effectiveHierarchy]);

  // From: show only the user's assigned boundary level (disabled, for context)
  const fromVisibleLevels = useMemo(() => {
    if (!userBoundary?.boundaryType || !effectiveHierarchy.length) return [];
    const userLevel = effectiveHierarchy.find((h) => h.boundaryType === userBoundary.boundaryType);
    return userLevel ? [userLevel] : [];
  }, [userBoundary, effectiveHierarchy]);

  // To: show hierarchy levels below From based on context
  // - Top level (Country): only the immediate next level
  // - Non-top level: all levels below From except the last level of the full hierarchy
  // - Edge case: always show at least 1 To level
  const toVisibleLevels = useMemo(() => {
    if (!toHierarchyLevels.length) return [];
    const fromBType = effectiveHierarchy[fromSelectedLevel]?.boundaryType;
    const fromIsTopLevel = isTopLevel || fromBType === sortedHierarchy[0]?.boundaryType;
    if (fromIsTopLevel) {
      return toHierarchyLevels.slice(0, 1);
    }
    const lastBoundaryType = sortedHierarchy[sortedHierarchy.length - 1]?.boundaryType;
    const withoutLast = toHierarchyLevels.filter((h) => h.boundaryType !== lastBoundaryType);
    return withoutLast.length > 0 ? withoutLast : toHierarchyLevels.slice(0, 1);
  }, [toHierarchyLevels, isTopLevel, effectiveHierarchy, fromSelectedLevel, sortedHierarchy]);

  // "From" uses the exact projectId passed from the dashboard (user's assigned project)
  const fromFilteredProjectIds = useMemo(() => {
    if (!projectIdProp) return [];
    return [projectIdProp];
  }, [projectIdProp]);

  // Filter project IDs for "To" — only projects whose referenceId matches this campaign
  const toFilteredProjectIds = useMemo(() => {
    if (!allProjectIds.length) return [];
    const hasToFilters = Object.values(toHierarchyFilters).some((v) => Array.isArray(v) ? v.length > 0 : !!v);
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
      // Only include projects belonging to this campaign
      if (campaignNumber && bInfo.referenceId && bInfo.referenceId !== campaignNumber) return false;
      const ancestors = boundaryAncestorMap[bInfo.boundary] || {};
      return Object.entries(combinedFilters).every(([type, value]) => {
        if (Array.isArray(value)) {
          if (!value.length) return true;
          return value.includes(ancestors[type]);
        }
        if (!value) return true;
        return ancestors[type] === value;
      });
    });
  }, [allProjectIds, fromHierarchyFilters, toHierarchyFilters, toSelectedLevel, effectiveHierarchy, projectBoundaryMap, boundaryAncestorMap, campaignNumber]);

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

  // Enrich facility lists with resolved names (dedup by id as safety net)
  const enrichedFromFacilityList = useMemo(() => {
    if (!fromFacilityList?.length) return fromFacilityList;
    const seen = new Set();
    return fromFacilityList
      .filter((f) => {
        if (seen.has(f.id)) return false;
        seen.add(f.id);
        return true;
      })
      .map((f) => ({
        ...f,
        name: facilityNameMap[f.id] || f.id,
      }));
  }, [fromFacilityList, facilityNameMap]);

  const toFacilityList = useMemo(() => {
    if (!rawToFacilityList?.length) return rawToFacilityList;
    const seen = new Set();
    return rawToFacilityList
      .filter((f) => {
        if (seen.has(f.id)) return false;
        seen.add(f.id);
        return true;
      })
      .map((f) => ({
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

  // Fetch stock balance data for validation using 2-query config:
  // Query 1 filters Data.facilityId = fromFacilityId (covers RECEIPT/ISSUED)
  // Query 2 filters Data.transactingFacilityId = fromFacilityId (covers REJECTED/RETURNED back)
  const stockBalanceCriteria = useMemo(() => ({
    url: `/dashboard-analytics/dashboard/getChartV2`,
    body: {
      aggregationRequestDto: {
        visualizationCode: "commodityFacilityStockByFacility",
        visualizationType: "metric",
        queryType: "",
        requestDate: { startDate: 0, endDate: Date.now(), interval: "day", title: "home" },
        filters: { campaignNumber: campaignNumber || "", facilityId: fromFacilityId || "" },
        aggregationFactors: null,
      },
      headers: { tenantId: tenantId || "" },
    },
    config: {
      enabled: !isTopLevel && !!tenantId && !!campaignNumber && !!fromFacilityId,
      select: (data) => {
        // Combine results from both queries and dedup by record id
        const r1 = data?.responseData?.customData?.rawResponse?.facilityStockTransformer || [];
        const r2 = data?.responseData?.customData?.rawResponse?.transactingStockTransformer || [];
        const seen = new Set();
        const combined = [];
        [...r1, ...r2].forEach((r) => {
          if (r.id && !seen.has(r.id)) {
            seen.add(r.id);
            combined.push(r);
          }
        });
        return combined;
      },
    },
    changeQueryName: `stockBalance_shipment_${campaignNumber}_${fromFacilityId}`,
  }), [tenantId, campaignNumber, isTopLevel, fromFacilityId]);

  const { data: stockRecords } = Digit.Hooks.useCustomAPIHook(stockBalanceCriteria);

  // Compute per-facility stock map from raw ES records using stockEntryType + status
  // Records come from 2-query config: facilityId=fromFacilityId OR transactingFacilityId=fromFacilityId
  // Direction: RECEIVED → facilityId is receiver; DISPATCHED → facilityId is sender
  const facilityStockMap = useMemo(() => {
    if (!stockRecords?.length || !fromFacilityId) return {};
    const map = {};
    const init = (fId, pvId) => {
      if (!map[fId]) map[fId] = {};
      if (!map[fId][pvId]) map[fId][pvId] = 0;
    };
    stockRecords.forEach((record) => {
      const pvId = record.productVariantId;
      const qty = record.quantity || 0;
      const entryType = record.stockEntryType || "";
      const eventType = record.eventType || record.transactionType || "";
      if (!pvId) return;

      // Determine direction: RECEIVED → facilityId is receiver, DISPATCHED → facilityId is sender
      const isInbound = eventType === "RECEIVED";
      const senderId = isInbound ? record.transactingFacilityId : record.facilityId;
      const receiverId = isInbound ? record.facilityId : record.transactingFacilityId;

      if (entryType === "ISSUED") {
        const status = record.status || "";
        if (status === "REJECTED") {
          // Rejected dispatch: stock came back, net zero
        } else {
          // ACCEPTED or IN_TRANSIT: stock physically left sender
          if (senderId === fromFacilityId) {
            init(fromFacilityId, pvId); map[fromFacilityId][pvId] -= qty;
          }
          // ACCEPTED: receiver gained stock
          if (status === "ACCEPTED" && receiverId === fromFacilityId) {
            init(fromFacilityId, pvId); map[fromFacilityId][pvId] += qty;
          }
        }
      } else if (entryType === "RECEIPT") {
        if (receiverId === fromFacilityId) {
          // I confirmed receipt → +qty
          init(fromFacilityId, pvId); map[fromFacilityId][pvId] += qty;
        }
      } else if (entryType === "EXCESS") {
        // Received more than expected → additional stock for receiver
        if (receiverId === fromFacilityId) {
          init(fromFacilityId, pvId); map[fromFacilityId][pvId] += qty;
        }
      } else if (entryType === "LESS") {
        // Received less than expected → reduces receiver stock
        if (receiverId === fromFacilityId) {
          init(fromFacilityId, pvId); map[fromFacilityId][pvId] -= qty;
        }
      } else if (entryType === "RETURNED") {
        const retStatus = record.status || "";
        if (retStatus === "REJECTED") {
          // Return rejected by receiver, stock stays with returner, net zero
        } else {
          // ACCEPTED or IN_TRANSIT: stock has physically left the returner
          if (senderId === fromFacilityId) {
            init(fromFacilityId, pvId); map[fromFacilityId][pvId] -= qty;
          }
          // Only ACCEPTED: receiver (original sender) gains stock back
          if (retStatus === "ACCEPTED" && receiverId === fromFacilityId) {
            init(fromFacilityId, pvId); map[fromFacilityId][pvId] += qty;
          }
        }
      }
    });
    return map;
  }, [stockRecords, fromFacilityId]);

  // Determine if the "From" level is top level (skip stock validation)
  const topLevelBoundaryType = sortedHierarchy[0]?.boundaryType;
  const fromBoundaryType = effectiveHierarchy[fromSelectedLevel]?.boundaryType;
  const isFromTopLevel = isTopLevel || fromBoundaryType === topLevelBoundaryType;

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

  // Handle "To" hierarchy filter change (cascading, multi-select arrays)
  const handleToHierarchyChange = useCallback((boundaryType, values) => {
    setToHierarchyFilters((prev) => {
      const next = { ...prev };
      next[boundaryType] = values; // array of selected boundary codes
      // Clear all levels below the changed level
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
      const ExcelJS = (await import("exceljs")).default;
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
      // Set column widths before adding data (ExcelJS handles this more reliably)
      ws.columns = stockHeaders.map((header) => ({ header, width: 30, style: { font: { bold: false } } }));
      // Bold header row (row 1 was auto-created by ws.columns)
      ws.getRow(1).font = { bold: true };
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
        // Look up facility's actual boundary ancestors for accurate boundary columns
        const facilityBoundaryInfo = projectBoundaryMap[facility.projectId];
        const facilityAncestors = boundaryAncestorMap[facilityBoundaryInfo?.boundary] || {};
        boundaryHeaders.forEach((bType) => {
          const code = fromHierarchyFilters[bType] || facilityAncestors[bType] || "";
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

      const dataRowCount = selectedFacilities.length;

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

      // --- Lock cells & protect sheet ---
      // Only unlock product quantity cells — all other columns (boundary, facility, campaign) are locked
      const firstProductCol = boundaryHeaders.length + 6 + 1; // 1-based col index (6 fixed: CampaignNumber, ProjectName, FromCode, FromName, ToCode, ToName)
      const lastProductCol = firstProductCol + productVariants.length - 1;

      for (let r = 3; r <= dataRowCount + 2; r++) {
        for (let c = firstProductCol; c <= lastProductCol; c++) {
          const cell = ws.getCell(r, c);
          // Unlock for editing
          cell.protection = { locked: false };
          // Force numeric format so Excel rejects non-numeric input
          cell.numFmt = '0';
          cell.value = null;
          // Data validation: only whole numbers >= 0 and <= 10,000,000
          cell.dataValidation = {
            type: 'whole',
            operator: 'between',
            formulae: [0, 10000000],
            allowBlank: true,
            showInputMessage: true,
            promptTitle: 'Quantity',
            prompt: 'Enter a whole number between 0 and 10,000,000',
            showErrorMessage: true,
            errorStyle: 'stop',
            errorTitle: 'Invalid quantity',
            error: 'Quantity must be a whole number between 0 and 10,000,000.',
          };
        }
      }

      // --- ReadMe sheet ---
      const readmeWs = wb.addWorksheet("ReadMe");
      const readmeLines = [
        "Instructions",
        "",
        "1. Only the product quantity columns are editable — all other columns are locked.",
        "2. Each row corresponds to a selected facility. Do NOT add or delete rows.",
        "3. Boundary, Campaign Number, Project Name, and Facility columns are pre-filled and cannot be modified.",
        "4. 'From' is the source warehouse and 'To' is the destination facility.",
        "5. Enter a whole number (0 or greater) for each product quantity.",
        "6. Leave a product quantity empty or 0 to skip that product for the row.",
        "7. Do NOT modify or delete the hidden row (row 2) — it contains product variant IDs.",
        "8. Do NOT add, delete, or rearrange columns — the sheet structure is protected.",
        "9. Save the file and upload it back on the stock upload screen.",
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
    projectBoundaryMap,
    boundaryAncestorMap,
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
      const XLSX = (await import("xlsx")).default;
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
      // Validate against the specific facilities selected in the popup, not all available
      const errors = [];

      // Filter out completely empty rows (template may have trailing blanks)
      const nonEmptyDataRows = dataRows.filter((row) => {
        const hasAnyValue = row.some((cell) => cell !== undefined && cell !== null && cell !== "");
        return hasAnyValue;
      });

      // Ensure uploaded rows don't exceed the number of selected facilities
      if (nonEmptyDataRows.length > selectedFacilityIds.size) {
        errors.push(
          `File contains ${nonEmptyDataRows.length} data rows but only ${selectedFacilityIds.size} facilities were selected. Do not add extra rows.`
        );
      }

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
        } else if (senderId !== fromFacilityId) {
          errors.push(`Row ${rowNum}: From Facility "${senderId}" doesn't match selected From Facility`);
        }

        if (!receiverId) {
          errors.push(`Row ${rowNum}: Missing To Facility Code`);
        } else if (!selectedFacilityIds.has(receiverId)) {
          errors.push(`Row ${rowNum}: To Facility "${receiverId}" is not one of the selected To Facilities`);
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
            } else if (num > 10000000) {
              errors.push(`Row ${rowNum}: "${name}" quantity (${num}) exceeds maximum allowed (10,000,000)`);
            }
          }
        });
      });

      // Stock balance validation: check that dispatched quantities don't exceed available stock
      if (!isFromTopLevel) {
        // Aggregate total quantities per senderId per productVariantId across all data rows
        const aggregatedQty = {};
        dataRows.forEach((row) => {
          const senderId = fromCodeIdx >= 0 ? String(row[fromCodeIdx] || "").trim() : "";
          if (!senderId) return;
          productColumns.forEach(({ idx, productVariantId, name }) => {
            const val = row[idx];
            if (val === undefined || val === null || val === "") return;
            const num = Number(val);
            if (!Number.isFinite(num) || num <= 0) return;
            const key = `${senderId}|${productVariantId}`;
            if (!aggregatedQty[key]) aggregatedQty[key] = { senderId, productVariantId, name, total: 0 };
            aggregatedQty[key].total += num;
          });
        });

        // Compare each against available stock
        Object.values(aggregatedQty).forEach(({ senderId, productVariantId, name, total }) => {
          const available = facilityStockMap[senderId]?.[productVariantId] || 0;
          if (total > available) {
            const facilityName = facilityNameMap[senderId] || senderId;
            errors.push(`"${name}" from "${facilityName}": shipping ${total} but only ${Math.max(0, available)} available`);
          }
        });
      }

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
            referenceId: fromFacility?.projectId || projectId || campaignId,
            referenceIdType: "PROJECT",
            campaignNumber: campaignNumber || "",
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
                { key: "campaignNumber", value: campaignNumber || "" },
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
    isFromTopLevel,
    facilityStockMap,
    facilityNameMap,
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
                        {toVisibleLevels.map((h, idx) => {
                          // Progressive reveal: only show this level if all previous levels have selections
                          if (idx > 0) {
                            const prevBoundaryType = toVisibleLevels[idx - 1]?.boundaryType;
                            const prevSelected = toHierarchyFilters[prevBoundaryType];
                            if (!prevSelected || (Array.isArray(prevSelected) && prevSelected.length === 0)) return null;
                          }
                          const options = hierarchyFilterOptions[h.boundaryType];
                          if (!options) return null;
                          const availableOptions = getAvailableOptions(h.boundaryType, { ...fromHierarchyFilters, ...toHierarchyFilters });
                          const selectedCodes = toHierarchyFilters[h.boundaryType] || [];
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
                              <MultiSelectDropdown
                                disablePortal={true}
                                t={t}
                                options={availableOptions.map((code) => ({ code, name: t(code) }))}
                                optionsKey="code"
                                selected={selectedCodes.map((code) => ({ code, name: t(code) }))}
                                onSelect={() => {}}
                                onClose={(selectedArray) => {
                                  const codes = (selectedArray || [])
                                    .map((arr) => arr?.[1]?.code)
                                    .filter(Boolean);
                                  handleToHierarchyChange(h.boundaryType, codes);
                                }}
                                config={{
                                  isDropdownWithChip: true,
                                  chipKey: "code",
                                }}
                                isSearchable={true}
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
