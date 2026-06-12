import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, HeaderComponent, Card, Loader, Toast, PopUp } from "@egovernments/digit-ui-components";
import StockComponent from "./StockComponent";
import BulkUpload from "../BulkUpload";
import XLSX from "xlsx";
import useBatchStockCreation from "../../hooks/useBatchStockCreation";

const CONSOLE_MDMS_MODULENAME = "HCM-ADMIN-CONSOLE";

const BulkStockUpload = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const campaignNumber = searchParams.get("campaignNumber");
  const campaignName = searchParams.get("campaignName");
  const campaignId = searchParams.get("campaignId");
  const projectType = searchParams.get("projectType");
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const moduleName = Digit.Utils.campaign.getModuleName();

  const [fromFacilityId, setFromFacilityId] = useState("");
  const [selectedFacilityIds, setSelectedFacilityIds] = useState(new Set());
  const [fromSearchQuery, setFromSearchQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [fromHierarchyFilters, setFromHierarchyFilters] = useState({});
  const [toHierarchyFilters, setToHierarchyFilters] = useState({});
  const [accumulatedChildData, setAccumulatedChildData] = useState({ ids: [], boundaryMap: {} });
  const [uploadedFileData, setUploadedFileData] = useState([]);
  const [showToast, setShowToast] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showUploadPopup, setShowUploadPopup] = useState(false);

  // Batch stock creation hook
  const {
    processBatches,
    batchStatus,
    isProcessing,
    failedRecords: batchFailedRecords,
    isComplete,
    result: batchResult,
    reset: resetBatchState,
    abort: abortBatchProcessing,
  } = useBatchStockCreation({ tenantId });

  // Ref to store original sheet data for error sheet generation
  const originalSheetDataRef = useRef(null);
  // Ref to map clientReferenceId -> original row index
  const clientRefToRowIndexRef = useRef({});

  // Abort batch processing on unmount
  useEffect(() => {
    return () => {
      abortBatchProcessing();
    };
  }, [abortBatchProcessing]);

  // Handle batch completion
  useEffect(() => {
    if (!isComplete || !batchResult) return;

    if (batchResult === "success") {
      setShowToast({ key: "success", label: t("HCM_STOCK_UPLOAD_SUCCESS") });
      setTimeout(() => {
        navigate(`/${window?.contextPath}/employee/campaign/view-details?campaignNumber=${campaignNumber}&tenantId=${tenantId}`);
      }, 2000);
    } else if (batchResult === "partial_failure") {
      setShowToast({
        key: "warning",
        label: t("HCM_BATCH_PARTIAL_FAILURE_TOAST", {
          succeeded: batchStatus.totalRecords - batchStatus.failedRecords,
          total: batchStatus.totalRecords,
          failed: batchStatus.failedRecords,
        }),
      });
    } else if (batchResult === "all_failed") {
      setShowToast({ key: "error", label: t("HCM_BATCH_ALL_FAILED_TOAST") });
    }
  }, [isComplete, batchResult]);

  // Download error sheet for failed records
  const downloadErrorSheet = useCallback(() => {
    const sheetData = originalSheetDataRef.current;
    const clientRefToRowIndex = clientRefToRowIndexRef.current;
    if (!sheetData || !batchFailedRecords.length) return;

    const { headers, dataRows, variantIdRow } = sheetData;

    // Build set of failed clientReferenceIds
    const failedClientRefIds = new Set(batchFailedRecords.map((f) => f.stockRecord.clientReferenceId));

    // Build set of row indices that have failures
    const failedRowIndices = new Set();
    Object.entries(clientRefToRowIndex).forEach(([clientRefId, rowIndex]) => {
      if (failedClientRefIds.has(clientRefId)) {
        failedRowIndices.add(rowIndex);
      }
    });

    // Build new sheet with CREATION_STATUS column
    const newHeaders = [...headers, "CREATION_STATUS"];
    const newVariantIdRow = [...variantIdRow, ""];
    const newDataRows = dataRows.map((row, idx) => {
      const paddedRow = [...row];
      // Pad row to match header length if needed
      while (paddedRow.length < headers.length) {
        paddedRow.push("");
      }
      const status = failedRowIndices.has(idx) ? "CREATION_FAILED" : "SUCCESS";
      return [...paddedRow, status];
    });

    const wsData = [newHeaders, newVariantIdRow, ...newDataRows];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    ws["!cols"] = newHeaders.map(() => ({ wch: 30 }));
    ws["!rows"] = [null, { hidden: true }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Stock Data");

    XLSX.writeFile(wb, `Stock_Error_Report_${campaignName || "campaign"}.xlsx`);
    setShowToast({ key: "warning", label: t("HCM_BATCH_ERROR_SHEET_DOWNLOADED", { failed: batchFailedRecords.length }) });
  }, [batchFailedRecords, campaignName, t]);

  // Fetch project types from MDMS to get resources for the current project type
  const { data: projectTypeData, isLoading: projectTypeLoading } = Digit.Hooks.useCustomMDMS(
    tenantId,
    "HCM-PROJECT-TYPES",
    [{ name: "projectTypes" }],
    { select: (MdmsRes) => MdmsRes },
    { schemaCode: "HCM-PROJECT-TYPES.projectTypes" }
  );

  // Fetch BOUNDARY_HIERARCHY_TYPE from MDMS
  const { data: BOUNDARY_HIERARCHY_TYPE, isLoading: hierarchyTypeLoading } = Digit.Hooks.useCustomMDMS(
    tenantId,
    CONSOLE_MDMS_MODULENAME,
    [
      {
        name: "HierarchySchema",
        filter: `[?(@.type=='${moduleName}')]`,
      },
    ],
    {
      select: (data) => {
        return data?.[CONSOLE_MDMS_MODULENAME]?.HierarchySchema?.[0]?.hierarchy;
      },
    },
    { schemaCode: "HierarchySchema" }
  );

  // Fetch boundary hierarchy definition
  const hierarchyDefinitionReqCriteria = useMemo(() => {
    return {
      url: `/boundary-service/boundary-hierarchy-definition/_search`,
      changeQueryName: `${BOUNDARY_HIERARCHY_TYPE}`,
      body: {
        BoundaryTypeHierarchySearchCriteria: {
          tenantId: tenantId,
          limit: 2,
          offset: 0,
          hierarchyType: BOUNDARY_HIERARCHY_TYPE,
        },
      },
      config: {
        enabled: !!BOUNDARY_HIERARCHY_TYPE,
      },
    };
  }, [tenantId, BOUNDARY_HIERARCHY_TYPE]);

  const { data: hierarchyDefinition, isLoading: hierarchyLoading } = Digit.Hooks.useCustomAPIHook(hierarchyDefinitionReqCriteria);

  // Fetch boundary relationships (full tree)
  const boundaryRelationshipCriteria = useMemo(() => ({
    url: `/boundary-service/boundary-relationships/_search`,
    params: {
      tenantId: tenantId,
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

  // Fetch campaign data to get projectId, product variants
  const campaignReqCriteria = useMemo(() => ({
    url: `/project-factory/v1/project-type/search`,
    body: {
      CampaignDetails: {
        tenantId: tenantId,
        campaignNumber: campaignNumber,
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

  // Step 1: Fetch all project IDs for this campaign
  const projectId = campaignData?.projectId;
  const projectServicePath = window.globalConfigs?.getConfig("PROJECT_SERVICE_PATH") || `health-project`;

  const projectSearchCriteria = useMemo(() => ({
    url: `/${projectServicePath}/v1/_search`,
    params: { tenantId: tenantId, limit: 1000, offset: 0, includeDescendants: false, includeImmediateChildren: true },
    body: {
      Projects: [
        {
          id: projectId,
          tenantId: tenantId,
        },
      ],
    },
    config: {
      enabled: !!projectId,
      select: (data) => {
        const projects = data?.Project || [];
        const ids = [];
        const boundaryMap = {}; // projectId -> { boundary, boundaryType }
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
          if (proj?.descendants) {
            proj.descendants.forEach(collectProject);
          }
        });
        if (ids.length === 0 && projectId) ids.push(projectId);
        return { ids, boundaryMap };
      },
    },
  }), [tenantId, projectId]);

  const { data: projectData, isLoading: projectsLoading } = Digit.Hooks.useCustomAPIHook(projectSearchCriteria);
  const initialProjectIds = projectData?.ids || [];
  const initialBoundaryMap = projectData?.boundaryMap || {};

  // Build sorted hierarchy (moved up before child search logic)
  const sortedHierarchy = useMemo(() => {
    const boundaryHierarchy = hierarchyDefinition?.BoundaryHierarchy?.[0]?.boundaryHierarchy || [];
    if (!boundaryHierarchy.length) return [];
    const sorted = [];
    let current = boundaryHierarchy.find((item) => !item?.parentBoundaryType);
    while (current) {
      sorted.push(current);
      const next = boundaryHierarchy.find((item) => item?.parentBoundaryType === current?.boundaryType);
      if (!next) break;
      current = next;
    }
    return sorted;
  }, [hierarchyDefinition]);

  // Determine which hierarchy level the "From" selection is at (the lowest level with a value)
  const fromSelectedLevel = useMemo(() => {
    let level = -1;
    sortedHierarchy.forEach((h, idx) => {
      if (fromHierarchyFilters[h.boundaryType]) level = idx;
    });
    return level;
  }, [fromHierarchyFilters, sortedHierarchy]);

  // "To" hierarchy only shows levels BELOW the "From" selected level
  const toHierarchyLevels = useMemo(() => {
    if (fromSelectedLevel < 0) return [];
    return sortedHierarchy.slice(fromSelectedLevel + 1);
  }, [sortedHierarchy, fromSelectedLevel]);

  // Determine the lowest selected level in To filters
  const toSelectedLevel = useMemo(() => {
    let level = -1;
    toHierarchyLevels.forEach((h) => {
      if (toHierarchyFilters[h.boundaryType]) {
        const idx = sortedHierarchy.findIndex((s) => s.boundaryType === h.boundaryType);
        if (idx > level) level = idx;
      }
    });
    return level;
  }, [toHierarchyFilters, toHierarchyLevels, sortedHierarchy]);

  // Merge initial + accumulated child project results
  const allProjectIds = useMemo(() => {
    return [...new Set([...initialProjectIds, ...accumulatedChildData.ids])];
  }, [initialProjectIds, accumulatedChildData]);

  const projectBoundaryMap = useMemo(() => ({
    ...initialBoundaryMap,
    ...accumulatedChildData.boundaryMap,
  }), [initialBoundaryMap, accumulatedChildData]);

  // Determine which parent-level project IDs need a child search.
  // Searches the MERGED allProjectIds so multi-level cascading works.
  const childSearchProjectIds = useMemo(() => {
    const targetLevelIdx = toSelectedLevel >= 0 ? toSelectedLevel : (fromSelectedLevel >= 0 ? fromSelectedLevel + 1 : -1);
    if (targetLevelIdx < 0 || targetLevelIdx >= sortedHierarchy.length) return [];
    const targetBoundaryType = sortedHierarchy[targetLevelIdx]?.boundaryType;
    if (!targetBoundaryType) return [];

    // Check if target-level projects already exist in MERGED results
    const hasTargetProjects = allProjectIds.some((pid) => {
      const bInfo = projectBoundaryMap[pid];
      return bInfo?.boundaryType === targetBoundaryType;
    });
    if (hasTargetProjects) return [];

    // Find the parent level (one above target in sortedHierarchy)
    if (targetLevelIdx <= 0) return [];
    const parentBoundaryType = sortedHierarchy[targetLevelIdx - 1]?.boundaryType;
    if (!parentBoundaryType) return [];

    // Find parent-level projects from MERGED results. Only check From-level filters.
    const fromFiltersOnly = { ...fromHierarchyFilters };
    return allProjectIds.filter((pid) => {
      const bInfo = projectBoundaryMap[pid];
      if (!bInfo?.boundary || bInfo.boundaryType !== parentBoundaryType) return false;
      const ancestors = boundaryAncestorMap[bInfo.boundary] || {};
      return Object.entries(fromFiltersOnly).every(([type, value]) => {
        if (!value) return true;
        return ancestors[type] === value;
      });
    });
  }, [allProjectIds, projectBoundaryMap, sortedHierarchy, toSelectedLevel, fromSelectedLevel, fromHierarchyFilters, boundaryAncestorMap]);

  // Dynamic child project search
  const childProjectSearchCriteria = useMemo(() => ({
    url: `/${projectServicePath}/v1/_search`,
    params: { tenantId, limit: 1000, offset: 0, includeDescendants: false, includeImmediateChildren: true },
    body: { Projects: childSearchProjectIds.map((id) => ({ id, tenantId })) },
    config: {
      enabled: !!childSearchProjectIds.length,
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
            };
          }
          if (proj?.descendants) proj.descendants.forEach(collectProject);
        };
        projects.forEach(collectProject);
        return { ids: [...idSet], boundaryMap };
      },
    },
    changeQueryName: `childProjects_${childSearchProjectIds.join(",")}`,
  }), [tenantId, childSearchProjectIds]);

  const {
    data: childProjectData,
    isLoading: childProjectsLoading,
  } = Digit.Hooks.useCustomAPIHook(childProjectSearchCriteria);

  // Accumulate child project data so it persists across criteria changes
  useEffect(() => {
    if (!childProjectData?.ids?.length) return;
    setAccumulatedChildData((prev) => {
      const newIds = [...new Set([...prev.ids, ...(childProjectData.ids || [])])];
      const newMap = { ...prev.boundaryMap, ...(childProjectData.boundaryMap || {}) };
      if (newIds.length === prev.ids.length) return prev;
      return { ids: newIds, boundaryMap: newMap };
    });
  }, [childProjectData]);

  // Fetch ALL project facilities to know which projects have facilities
  const allFacilityReqCriteria = useMemo(() => ({
    url: `/${projectServicePath}/facility/v1/_search`,
    params: { tenantId: tenantId, limit: 1500, offset: 0 },
    body: {
      ProjectFacility: {
        projectId: allProjectIds,
      },
    },
    config: {
      enabled: !!allProjectIds?.length,
      select: (data) => {
        const projectFacilities = data?.ProjectFacilities || [];
        const projectIdsWithFacilities = new Set();
        projectFacilities.forEach((pf) => {
          if (pf.projectId) projectIdsWithFacilities.add(pf.projectId);
        });
        return projectIdsWithFacilities;
      },
    },
  }), [tenantId, allProjectIds]);

  const { data: projectIdsWithFacilities, isLoading: allFacilitiesLoading } = Digit.Hooks.useCustomAPIHook(allFacilityReqCriteria);

  // Build hierarchy filter options only from projects that have facilities
  const hierarchyFilterOptions = useMemo(() => {
    if (!projectIdsWithFacilities?.size || !sortedHierarchy?.length) return {};
    const options = {};
    sortedHierarchy.forEach((h) => {
      const values = new Set();
      Object.entries(projectBoundaryMap).forEach(([pid, bInfo]) => {
        if (!projectIdsWithFacilities.has(pid)) return;
        const ancestors = boundaryAncestorMap[bInfo.boundary] || {};
        const val = ancestors[h.boundaryType];
        if (val) values.add(val);
      });
      if (values.size > 0) {
        options[h.boundaryType] = Array.from(values).sort();
      }
    });
    return options;
  }, [projectIdsWithFacilities, projectBoundaryMap, sortedHierarchy, boundaryAncestorMap]);

  // Build "To" hierarchy filter options from boundary tree (not project-data-based)
  const toHierarchyFilterOptions = useMemo(() => {
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

  // Get cascading "To" options from boundary tree
  const getToAvailableOptions = useCallback((boundaryType, filters) => {
    const allOptions = toHierarchyFilterOptions[boundaryType] || [];
    const currentLevelIdx = sortedHierarchy.findIndex((h) => h.boundaryType === boundaryType);
    return allOptions.filter((code) => {
      const ancestors = boundaryAncestorMap[code] || {};
      return Object.entries(filters).every(([type, value]) => {
        if (type === boundaryType) return true;
        const filterLevelIdx = sortedHierarchy.findIndex((h) => h.boundaryType === type);
        if (filterLevelIdx >= currentLevelIdx) return true;
        if (!value) return true;
        return ancestors[type] === value;
      });
    });
  }, [toHierarchyFilterOptions, boundaryAncestorMap, sortedHierarchy]);

  // Get cascading options for a given filter set (only projects with facilities)
  const getAvailableOptions = useCallback((boundaryType, filters) => {
    const allOptions = hierarchyFilterOptions[boundaryType] || [];
    return allOptions.filter((code) => {
      return Object.entries(projectBoundaryMap).some(([pid, bInfo]) => {
        if (!projectIdsWithFacilities?.has(pid)) return false;
        const ancestors = boundaryAncestorMap[bInfo.boundary] || {};
        if (ancestors[boundaryType] !== code) return false;
        return Object.entries(filters).every(([type, value]) => {
          if (!value || type === boundaryType) return true;
          return ancestors[type] === value;
        });
      });
    });
  }, [hierarchyFilterOptions, projectBoundaryMap, projectIdsWithFacilities, boundaryAncestorMap]);

  // Filter project IDs for "From" — only projects at the exact selected level
  const fromFilteredProjectIds = useMemo(() => {
    if (!allProjectIds.length || fromSelectedLevel < 0) return [];
    const targetBoundaryType = sortedHierarchy[fromSelectedLevel]?.boundaryType;
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
  }, [allProjectIds, fromHierarchyFilters, fromSelectedLevel, sortedHierarchy, projectBoundaryMap, boundaryAncestorMap]);

  // Filter project IDs for "To" — only projects at the exact selected To level
  const toFilteredProjectIds = useMemo(() => {
    if (!allProjectIds.length) return [];
    const hasToFilters = Object.values(toHierarchyFilters).some((v) => !!v);
    if (!hasToFilters) return [];
    const targetBoundaryType = toSelectedLevel >= 0
      ? sortedHierarchy[toSelectedLevel]?.boundaryType
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
  }, [allProjectIds, fromHierarchyFilters, toHierarchyFilters, toSelectedLevel, sortedHierarchy, projectBoundaryMap, boundaryAncestorMap]);

  // Fetch "From" facilities
  const fromFacilityReqCriteria = useMemo(() => ({
    url: `/${projectServicePath}/facility/v1/_search`,
    params: { tenantId: tenantId, limit: 1500, offset: 0 },
    body: {
      ProjectFacility: {
        projectId: fromFilteredProjectIds,
      },
    },
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
  }), [tenantId, fromFilteredProjectIds]);

  const { data: rawFromFacilityList, isLoading: fromFacilitiesLoading } = Digit.Hooks.useCustomAPIHook(fromFacilityReqCriteria);

  // Enrich From facilities with boundary level info
  const fromFacilityList = useMemo(() => {
    if (!rawFromFacilityList?.length) return rawFromFacilityList;
    return rawFromFacilityList.map((f) => {
      const bInfo = projectBoundaryMap[f.projectId];
      return { ...f, boundaryType: bInfo?.boundaryType || "", boundary: bInfo?.boundary || "" };
    });
  }, [rawFromFacilityList, projectBoundaryMap]);

  // Fetch "To" facilities
  const toFacilityReqCriteria = useMemo(() => ({
    url: `/${projectServicePath}/facility/v1/_search`,
    params: { tenantId: tenantId, limit: 1500, offset: 0 },
    body: {
      ProjectFacility: {
        projectId: toFilteredProjectIds,
      },
    },
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
  }), [tenantId, toFilteredProjectIds]);

  const { data: rawToFacilityList, isLoading: toFacilitiesLoading } = Digit.Hooks.useCustomAPIHook(toFacilityReqCriteria);

  // Enrich To facilities with boundary level info
  const toFacilityList = useMemo(() => {
    if (!rawToFacilityList?.length) return rawToFacilityList;
    return rawToFacilityList.map((f) => {
      const bInfo = projectBoundaryMap[f.projectId];
      return { ...f, boundaryType: bInfo?.boundaryType || "", boundary: bInfo?.boundary || "" };
    });
  }, [rawToFacilityList, projectBoundaryMap]);

  // Extract product variants from MDMS project type resources
  const productVariants = useMemo(() => {
    if (!projectTypeData) return [];
    const projectTypes = projectTypeData?.["HCM-PROJECT-TYPES"]?.projectTypes || [];
    const matchedType = projectTypes.find((pt) => pt?.code === projectType);
    if (!matchedType?.resources) return [];
    const variants = [];
    const seen = new Set();
    matchedType.resources.forEach((r) => {
      if (r?.productVariantId && !seen.has(r.productVariantId)) {
        seen.add(r.productVariantId);
        variants.push({
          productVariantId: r.productVariantId,
          name: r.name || r.productVariantId,
        });
      }
    });
    return variants;
  }, [projectTypeData, projectType]);

  // Filter "From" facilities by search
  const filteredFromFacilities = useMemo(() => {
    if (!fromFacilityList?.length) return [];
    if (!fromSearchQuery?.trim()) return fromFacilityList;
    const q = fromSearchQuery.toLowerCase();
    return fromFacilityList.filter(
      (f) => (f.id && f.id.toLowerCase().includes(q)) || (f.name && f.name.toLowerCase().includes(q)) || (f.boundary && f.boundary.toLowerCase().includes(q)) || (f.boundaryType && f.boundaryType.toLowerCase().includes(q))
    );
  }, [fromFacilityList, fromSearchQuery]);

  // Get selected "From" facility object
  const fromFacility = useMemo(() => {
    if (!fromFacilityId || !fromFacilityList?.length) return null;
    return fromFacilityList.find((f) => f.id === fromFacilityId);
  }, [fromFacilityList, fromFacilityId]);

  // Filter "To" facilities by search
  const filteredFacilities = useMemo(() => {
    if (!toFacilityList?.length) return [];
    if (!searchQuery?.trim()) return toFacilityList;
    const q = searchQuery.toLowerCase();
    return toFacilityList.filter(
      (f) => (f.id && f.id.toLowerCase().includes(q)) || (f.name && f.name.toLowerCase().includes(q)) || (f.boundary && f.boundary.toLowerCase().includes(q)) || (f.boundaryType && f.boundaryType.toLowerCase().includes(q))
    );
  }, [toFacilityList, searchQuery]);

  // Get selected "To" facility objects
  const selectedFacilities = useMemo(() => {
    if (!toFacilityList?.length || !selectedFacilityIds.size) return [];
    return toFacilityList.filter((f) => selectedFacilityIds.has(f.id));
  }, [toFacilityList, selectedFacilityIds]);

  // Handle "From" hierarchy filter change (cascading + clear To filters)
  const handleFromHierarchyChange = useCallback((boundaryType, value) => {
    setFromHierarchyFilters((prev) => {
      const next = { ...prev };
      next[boundaryType] = value;
      let foundCurrent = false;
      sortedHierarchy.forEach((h) => {
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
  }, [sortedHierarchy]);

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

  // Toggle facility selection
  const toggleFacility = useCallback((facilityId) => {
    setSelectedFacilityIds((prev) => {
      const next = new Set(prev);
      if (next.has(facilityId)) {
        next.delete(facilityId);
      } else {
        next.add(facilityId);
      }
      return next;
    });
  }, []);

  // Select/Deselect all visible facilities
  const toggleSelectAll = useCallback(() => {
    setSelectedFacilityIds((prev) => {
      const allVisibleIds = filteredFacilities.map((f) => f.id);
      const allSelected = allVisibleIds.every((id) => prev.has(id));
      const next = new Set(prev);
      if (allSelected) {
        allVisibleIds.forEach((id) => next.delete(id));
      } else {
        allVisibleIds.forEach((id) => next.add(id));
      }
      return next;
    });
  }, [filteredFacilities]);

  // Build template headers — one column per product variant for quantity
  const getTemplateHeaders = useCallback(() => {
    const boundaryHeaders = sortedHierarchy.map((item) => item.boundaryType);
    const productHeaders = productVariants.map((pv) => pv.name || pv.productVariantId);
    return {
      boundaryHeaders,
      stockHeaders: [...boundaryHeaders, "Project Id", "From (Facility Code)", "From (Facility Name)", "To (Facility Code)", "To (Facility Name)", ...productHeaders],
    };
  }, [sortedHierarchy, productVariants]);

  // Handle template download with selected facilities pre-filled
  const handleDownloadTemplate = useCallback(() => {
    setIsDownloading(true);
    try {
      const { boundaryHeaders, stockHeaders } = getTemplateHeaders();
      const facilitiesToInclude = selectedFacilities.length > 0 ? selectedFacilities : [];

      const dataRows = [];
      facilitiesToInclude.forEach((facility) => {
        const row = [];
        boundaryHeaders.forEach(() => row.push(""));
        row.push(facility?.projectId || ""); // Project Id
        row.push(fromFacility?.id || ""); // From (Facility Code)
        row.push(fromFacility?.name || ""); // From (Facility Name)
        row.push(facility?.id || ""); // To (Facility Code)
        row.push(facility?.name || facility?.id || ""); // To (Facility Name)
        productVariants.forEach(() => row.push("")); // Quantity columns - user fills these
        dataRows.push(row);
      });

      // Hidden row with product variant IDs (row 2) for upload parsing
      const variantIdRow = [];
      boundaryHeaders.forEach(() => variantIdRow.push(""));
      variantIdRow.push(""); // Project Id
      variantIdRow.push(""); // From (Facility Code)
      variantIdRow.push(""); // From (Facility Name)
      variantIdRow.push(""); // To (Facility Code)
      variantIdRow.push(""); // To (Facility Name)
      productVariants.forEach((pv) => variantIdRow.push(pv.productVariantId));

      const wsData = [stockHeaders, variantIdRow, ...dataRows];
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      ws["!cols"] = stockHeaders.map(() => ({ wch: 30 }));
      // Hide the variant ID row (row index 1, 0-based)
      ws["!rows"] = [null, { hidden: true }];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Stock Data");

      const readmeData = [
        ["Instructions"],
        [""],
        ["1. 'From' is the source warehouse and 'To' is the destination facility"],
        facilitiesToInclude.length > 0
          ? ["2. From and To facilities have been pre-filled based on your selection"]
          : ["2. Fill in the From and To facility codes for each row"],
        ["3. From and To must be different facilities"],
        ["4. Each row represents one shipment between a facility pair"],
        ["5. Enter the Quantity for each product column"],
        ["6. Leave a product quantity empty or 0 to skip it"],
        ["7. Do NOT modify or delete the hidden row (row 2) — it contains product variant IDs"],
        ["8. Delete facility rows you do not need"],
        ["9. Save the file and upload it back on the stock upload screen"],
      ];
      const readmeWs = XLSX.utils.aoa_to_sheet(readmeData);
      readmeWs["!cols"] = [{ wch: 80 }];
      XLSX.utils.book_append_sheet(wb, readmeWs, "ReadMe");

      XLSX.writeFile(wb, `Stock_Template_${campaignName || "campaign"}.xlsx`);
      setShowToast({ key: "success", label: t("HCM_DOWNLOAD_STOCK_TEMPLATE") });
    } catch (error) {
      console.error("Error downloading template:", error);
      setShowToast({ key: "error", label: t("HCM_STOCK_VALIDATION_ERROR") });
    } finally {
      setIsDownloading(false);
    }
  }, [selectedFacilities, fromFacility, getTemplateHeaders, productVariants, campaignName, t]);

  // Handle file upload
  const handleFileUpload = useCallback((files) => {
    try {
      let file;
      if (Array.isArray(files)) {
        file = files[0];
      } else if (files instanceof FileList) {
        file = files[0];
      } else if (files instanceof File) {
        file = files;
      } else if (files?.[0]) {
        file = files[0];
      }
      if (!file) return;
      const blobUrl = URL.createObjectURL(file);
      setUploadedFileData([{ filename: file.name, url: blobUrl, file: file }]);
    } catch (err) {
      console.error("File upload error:", err);
      setShowToast({ key: "error", label: err?.message || "File upload failed" });
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

  // Parse uploaded Excel and create stock transactions
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
      const projectIdIdx = headers.indexOf("Project Id");

      // Build a name→variantId lookup from known product variants
      const variantByName = {};
      productVariants.forEach((pv) => {
        variantByName[pv.name || pv.productVariantId] = pv.productVariantId;
      });

      // Build product column mapping: match header names against known product variants,
      // falling back to hidden row 2 for variant IDs
      const productColumns = [];
      const fixedHeaders = new Set(["Project Id", "From (Facility Code)", "From (Facility Name)", "To (Facility Code)", "To (Facility Name)"]);
      const boundaryHeaders = sortedHierarchy.map((item) => item.boundaryType);
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

      // Validate quantities before building payload
      const validationErrors = [];
      dataRows.forEach((row, rowIdx) => {
        productColumns.forEach(({ idx, name: productName }) => {
          const val = row[idx];
          if (val === undefined || val === null || val === "") return;
          const num = parseInt(val, 10);
          if (num > 10000000) {
            validationErrors.push(`Row ${rowIdx + 3}: "${productName}" quantity (${num}) exceeds maximum allowed (10,000,000)`);
          }
        });
      });
      if (validationErrors.length > 0) {
        setShowToast({ key: "error", label: validationErrors[0] });
        setIsSubmitting(false);
        return;
      }

      const stockPayload = [];
      const clientRefToRowIndex = {};
      const userInfo = Digit.UserService.getUser()?.info;
      const timestamp = Date.now();

      dataRows.forEach((row, rowIndex) => {
        const rowProjectId = (projectIdIdx >= 0 ? row[projectIdIdx] : "") || "";
        const senderId = (fromCodeIdx >= 0 ? row[fromCodeIdx] : "") || fromFacility?.id || "";
        const receiverId = (toCodeIdx >= 0 ? row[toCodeIdx] : "") || "";

        if (!senderId || !receiverId || senderId === receiverId) return;

        // Resolve administrativeArea from receiver's project boundary
        const resolvedRefId = rowProjectId || campaignData?.projectId || campaignId;
        const recvProjectBoundary = projectBoundaryMap[rowProjectId];
        const administrativeArea = recvProjectBoundary?.boundary || "";
        const mrnNumber = `${Math.random().toString(16).slice(2, 6).toUpperCase()}-${Math.random().toString(16).slice(2, 6).toUpperCase()}-${Math.random().toString(16).slice(2, 6).toUpperCase()}`;

        // Create one stock entry per product column that has a valid quantity
        productColumns.forEach(({ idx, productVariantId, name: productName }) => {
          const quantity = parseInt(row[idx], 10);
          if (!quantity || quantity <= 0) return;

          const clientReferenceId = crypto.randomUUID();
          clientRefToRowIndex[clientReferenceId] = rowIndex;

          stockPayload.push({
            tenantId: tenantId,
            clientReferenceId,
            facilityId: receiverId,
            productVariantId: productVariantId,
            quantity: quantity,
            referenceId: resolvedRefId,
            referenceIdType: "PROJECT",
            campaignNumber: campaignNumber || "",
            transactionType: "DISPATCHED",
            transactionReason: "DISPATCHED",
            senderType: "WAREHOUSE",
            senderId: senderId,
            receiverType: "WAREHOUSE",
            receiverId: receiverId,
            dateOfEntry: timestamp,
            nonRecoverableError: false,
            isDeleted: false,
            additionalFields: {
              schema: "Stock",
              version: 1,
              fields: [
                { key: "sku", value: productName || "" },
                { key: "stockEntryType", value: "ISSUED" },
                { key: "primaryRole", value: "RECEIVER" },
                { key: "secondaryRole", value: "SENDER" },
                { key: "status", value: fromSelectedLevel === 0 ? "ACCEPTED" : "IN_TRANSIT" },
                { key: "administrativeArea", value: administrativeArea },
                { key: "stockInHand", value: "0.0" },
                { key: "mrnNumber", value: mrnNumber },
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
              lastModifiedBy: userInfo?.uuid,
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

      // Store original sheet data and clientRef mapping for error sheet generation
      originalSheetDataRef.current = { headers, dataRows, variantIdRow };
      clientRefToRowIndexRef.current = clientRefToRowIndex;

      // Close the popup and start batch processing in the background
      setShowUploadPopup(false);
      setUploadedFileData([]);
      setIsSubmitting(false);

      // Start batch processing (non-blocking, updates state as it progresses)
      processBatches(stockPayload);
    } catch (error) {
      console.error("Stock upload error:", error);
      setShowToast({ key: "error", label: t("HCM_STOCK_VALIDATION_ERROR") });
      setIsSubmitting(false);
    }
  }, [uploadedFileData, productVariants, tenantId, campaignData, campaignId, campaignNumber, navigate, t, processBatches, fromFacility, sortedHierarchy, projectBoundaryMap]);

  if (hierarchyTypeLoading || hierarchyLoading || campaignLoading || projectsLoading || boundaryRelLoading || allFacilitiesLoading || projectTypeLoading) {
    return <Loader />;
  }

  const allVisibleSelected = filteredFacilities.length > 0 && filteredFacilities.every((f) => selectedFacilityIds.has(f.id));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <HeaderComponent className="cm-header">
            {t("HCM_BULK_STOCK_UPLOAD_HEADING")}
        </HeaderComponent>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Button
            label={t("HCM_UPLOAD_STOCK")}
            variation="primary"
            type="button"
            icon="FileUpload"
            onClick={() => setShowUploadPopup(true)}
            isDisabled={isProcessing}
          />
          <Button
            label={t("HCM_BACK")}
            variation="secondary"
            type="button"
            onClick={() => navigate(-1)}
          />
        </div>
      </div>

      {/* Inline Batch Processing Status Card */}
      {(isProcessing || isComplete) && (() => {
        const { statusKey, statusParams } = batchStatus;
        const sp = statusParams || {};
        let statusText = "";
        switch (statusKey) {
          case "HCM_BATCH_STARTING": statusText = t("HCM_BATCH_STARTING"); break;
          case "HCM_BATCH_CREATING": statusText = t("HCM_BATCH_CREATING", { current: sp.current, total: sp.total }); break;
          case "HCM_BATCH_VERIFYING": statusText = t("HCM_BATCH_VERIFYING", { current: sp.current, total: sp.total, attempt: sp.attempt, maxAttempts: sp.maxAttempts }); break;
          case "HCM_BATCH_ALL_SUCCESS": statusText = t("HCM_BATCH_ALL_SUCCESS"); break;
          case "HCM_BATCH_PROCESSING_COMPLETE": statusText = t("HCM_BATCH_PROCESSING_COMPLETE", { failedCount: sp.failedCount }); break;
          default: statusText = statusKey ? t(statusKey) : "";
        }
        return (
        <Card style={{ marginBottom: "1rem", padding: "1.5rem" }}>
          {isProcessing && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <span style={{ fontWeight: "600", fontSize: "1rem" }}>{statusText}</span>
                <span style={{ fontSize: "0.875rem", color: "#505A5F" }}>
                  {t("HCM_BATCH_PROGRESS_LABEL", { current: batchStatus.currentBatch, total: batchStatus.total })}
                </span>
              </div>
              <div style={{ width: "100%", backgroundColor: "#E0E0E0", borderRadius: "4px", height: "8px", marginBottom: "0.75rem" }}>
                <div
                  style={{
                    width: `${batchStatus.total > 0 ? (batchStatus.completed / batchStatus.total) * 100 : 0}%`,
                    backgroundColor: "#F47738",
                    height: "8px",
                    borderRadius: "4px",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
              <p style={{ fontSize: "0.875rem", color: "#505A5F" }}>
                {t("HCM_BATCH_RECORDS_STATUS", {
                  processed: batchStatus.processedRecords,
                  total: batchStatus.totalRecords,
                  failed: batchStatus.failedRecords,
                })}
              </p>
            </div>
          )}
          {isComplete && batchResult === "success" && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ color: "#00703C", fontWeight: "600" }}>
                {t("HCM_BATCH_SUCCESS_MSG", { total: batchStatus.totalRecords })}
              </p>
              <Button
                label={t("HCM_CLOSE")}
                variation="secondary"
                type="button"
                onClick={resetBatchState}
                style={{ marginLeft: "1rem" }}
              />
            </div>
          )}
          {isComplete && batchResult === "partial_failure" && (
            <div>
              <p style={{ color: "#B4762B", fontWeight: "600", marginBottom: "0.75rem" }}>
                {t("HCM_BATCH_PARTIAL_FAILURE_MSG", { failed: batchStatus.failedRecords, total: batchStatus.totalRecords })}
              </p>
              <div style={{ display: "flex", gap: "1rem" }}>
                <Button
                  label={t("HCM_DOWNLOAD_RESULT_SHEET")}
                  variation="primary"
                  type="button"
                  icon="FileDownload"
                  onClick={downloadErrorSheet}
                />
                <Button
                  label={t("HCM_CLOSE")}
                  variation="secondary"
                  type="button"
                  onClick={resetBatchState}
                />
              </div>
            </div>
          )}
          {isComplete && batchResult === "all_failed" && (
            <div>
              <p style={{ color: "#D4351C", fontWeight: "600", marginBottom: "0.75rem" }}>
                {t("HCM_BATCH_ALL_FAILED_MSG", { total: batchStatus.totalRecords })}
              </p>
              <div style={{ display: "flex", gap: "1rem" }}>
                <Button
                  label={t("HCM_DOWNLOAD_RESULT_SHEET")}
                  variation="primary"
                  type="button"
                  icon="FileDownload"
                  onClick={downloadErrorSheet}
                />
                <Button
                  label={t("HCM_CLOSE")}
                  variation="secondary"
                  type="button"
                  onClick={resetBatchState}
                />
              </div>
            </div>
          )}
        </Card>
        );
      })()}

      {/* Stock Transactions Table */}
      {allProjectIds?.length > 0 && <StockComponent allProjectIds={allProjectIds} />}

      {/* Upload Stock Popup */}
      {showUploadPopup && (
        <PopUp
          className={"boundaries-pop-module"}
          type={"default"}
          heading={t("HCM_BULK_STOCK_UPLOAD_HEADING")}
          children={[]}
          onOverlayClick={() => setShowUploadPopup(false)}
          onClose={() => setShowUploadPopup(false)}
          footerChildren={[
            <Button
              type={"button"}
              size={"large"}
              variation={"secondary"}
              label={t("HCM_BACK")}
              title={t("HCM_BACK")}
              onClick={() => setShowUploadPopup(false)}
            />,
            <Button
              type={"button"}
              size={"large"}
              variation={"primary"}
              label={isSubmitting ? t("HCM_STOCK_PROCESSING") : t("HCM_STOCK_SUBMIT")}
              title={t("HCM_STOCK_SUBMIT")}
              onClick={handleSubmit}
              isDisabled={!uploadedFileData?.length || isSubmitting}
            />,
          ]}
          sortFooterChildren={true}
          style={{ width: "60rem" }}
        >
          <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
            <p style={{ marginBottom: "1.5rem", color: "#505A5F" }}>
              {t("HCM_BULK_STOCK_UPLOAD_DESC")}
            </p>

            <Card>
              <h2 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "0.75rem" }}>
                {t("HCM_SELECT_FROM_FACILITY")}
              </h2>
              <p style={{ color: "#505A5F", marginBottom: "0.75rem" }}>{t("HCM_FROM_FACILITY_DESC")}</p>

              {Object.keys(hierarchyFilterOptions).length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
                  {sortedHierarchy.map((h) => {
                    const options = hierarchyFilterOptions[h.boundaryType];
                    if (!options) return null;
                    const availableOptions = getAvailableOptions(h.boundaryType, fromHierarchyFilters);
                    return (
                      <div key={h.boundaryType} style={{ minWidth: "180px", flex: "1" }}>
                        <label style={{ display: "block", fontWeight: "600", marginBottom: "0.25rem", fontSize: "0.875rem" }}>
                          {t(h.boundaryType)}
                        </label>
                        <select
                          value={fromHierarchyFilters[h.boundaryType] || ""}
                          onChange={(e) => handleFromHierarchyChange(h.boundaryType, e.target.value)}
                          style={{ width: "100%", padding: "0.5rem", border: "1px solid #D6D5D4", borderRadius: "0.25rem", fontSize: "1rem", backgroundColor: "#fff" }}
                        >
                          <option value="">{t("ES_COMMON_ALL")}</option>
                          {availableOptions.map((code) => (
                            <option key={code} value={code}>{t(code)}</option>
                          ))}
                        </select>
                      </div>
                    );
                  })}
                </div>
              )}

              {fromFacilitiesLoading ? (
                <Loader />
              ) : fromFacilityList?.length > 0 ? (
                <div style={{ marginBottom: "1.5rem" }}>
                  <input
                    type="text"
                    placeholder={t("ES_COMMON_SEARCH")}
                    value={fromSearchQuery}
                    onChange={(e) => setFromSearchQuery(e.target.value)}
                    style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #D6D5D4", borderRadius: "0.25rem", marginBottom: "0.5rem", fontSize: "1rem", outline: "none" }}
                  />
                  <div style={{ maxHeight: "200px", overflowY: "auto", border: "1px solid #D6D5D4", borderRadius: "0.25rem", padding: "0.25rem 0" }}>
                    {filteredFromFacilities.map((f) => (
                      <div
                        key={f.id}
                        style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0.75rem", cursor: "pointer", backgroundColor: fromFacilityId === f.id ? "#FFF3E8" : "transparent" }}
                        onClick={() => setFromFacilityId(f.id)}
                      >
                        <input type="radio" name="fromFacility" checked={fromFacilityId === f.id} readOnly style={{ cursor: "pointer", width: "1rem", height: "1rem", flexShrink: 0 }} />
                        <div>
                          <span>{f.name !== f.id ? `${f.name} (${f.id})` : f.id}</span>
                          {f.boundaryType && (
                            <span style={{ marginLeft: "0.5rem", fontSize: "0.75rem", color: "#787878", backgroundColor: "#F0F0F0", padding: "0.125rem 0.375rem", borderRadius: "0.25rem" }}>
                              {t(f.boundaryType)}{f.boundary ? `: ${f.boundary}` : ""}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {fromFacility && (
                    <p style={{ marginTop: "0.5rem", color: "#0B4B66", fontWeight: "600" }}>
                      {t("HCM_SELECTED")}: {fromFacility.name || fromFacility.id}
                    </p>
                  )}
                </div>
              ) : fromFilteredProjectIds?.length > 0 ? (
                <p style={{ color: "#505A5F", marginBottom: "1rem" }}>{t("HCM_FACILITY_API_FAILED_DESC")}</p>
              ) : (
                <p style={{ color: "#505A5F", marginBottom: "1rem" }}>{t("HCM_SELECT_HIERARCHY_FIRST")}</p>
              )}

              {fromSelectedLevel >= 0 && (
                <div>
                  <h2 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "0.75rem", marginTop: "1rem" }}>
                    {t("HCM_SELECT_TO_FACILITIES")}
                  </h2>
                  <p style={{ color: "#505A5F", marginBottom: "0.75rem" }}>{t("HCM_TO_FACILITIES_DESC")}</p>

                  {toHierarchyLevels.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
                      {toHierarchyLevels.map((h) => {
                        const options = toHierarchyFilterOptions[h.boundaryType];
                        if (!options) return null;
                        const availableOptions = getToAvailableOptions(h.boundaryType, { ...fromHierarchyFilters, ...toHierarchyFilters });
                        return (
                          <div key={h.boundaryType} style={{ minWidth: "180px", flex: "1" }}>
                            <label style={{ display: "block", fontWeight: "600", marginBottom: "0.25rem", fontSize: "0.875rem" }}>
                              {t(h.boundaryType)}
                            </label>
                            <select
                              value={toHierarchyFilters[h.boundaryType] || ""}
                              onChange={(e) => handleToHierarchyChange(h.boundaryType, e.target.value)}
                              style={{ width: "100%", padding: "0.5rem", border: "1px solid #D6D5D4", borderRadius: "0.25rem", fontSize: "1rem", backgroundColor: "#fff" }}
                            >
                              <option value="">{t("ES_COMMON_ALL")}</option>
                              {availableOptions.map((code) => (
                                <option key={code} value={code}>{t(code)}</option>
                              ))}
                            </select>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {(toFacilitiesLoading || childProjectsLoading) ? (
                    <Loader />
                  ) : toFacilityList?.length > 0 ? (
                    <div style={{ marginBottom: "1rem" }}>
                      <input
                        type="text"
                        placeholder={t("ES_COMMON_SEARCH")}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #D6D5D4", borderRadius: "0.25rem", marginBottom: "0.5rem", fontSize: "1rem", outline: "none" }}
                      />
                      <div
                        style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem", cursor: "pointer" }}
                        onClick={toggleSelectAll}
                      >
                        <input type="checkbox" checked={allVisibleSelected} readOnly style={{ cursor: "pointer", width: "1rem", height: "1rem" }} />
                        <span style={{ fontWeight: "600" }}>
                          {allVisibleSelected ? t("HCM_DESELECT_ALL") : t("HCM_SELECT_ALL")} ({filteredFacilities.length})
                        </span>
                      </div>
                      <div style={{ maxHeight: "300px", overflowY: "auto", border: "1px solid #D6D5D4", borderRadius: "0.25rem", padding: "0.25rem 0" }}>
                        {filteredFacilities.map((f) => (
                          <div
                            key={f.id}
                            style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0.75rem", cursor: "pointer", backgroundColor: selectedFacilityIds.has(f.id) ? "#FFF3E8" : "transparent" }}
                            onClick={() => toggleFacility(f.id)}
                          >
                            <input type="checkbox" checked={selectedFacilityIds.has(f.id)} readOnly style={{ cursor: "pointer", width: "1rem", height: "1rem", flexShrink: 0 }} />
                            <div>
                              <span>{f.name !== f.id ? `${f.name} (${f.id})` : f.id}</span>
                              {f.boundaryType && (
                                <span style={{ marginLeft: "0.5rem", fontSize: "0.75rem", color: "#787878", backgroundColor: "#F0F0F0", padding: "0.125rem 0.375rem", borderRadius: "0.25rem" }}>
                                  {t(f.boundaryType)}{f.boundary ? `: ${f.boundary}` : ""}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      {selectedFacilityIds.size > 0 && (
                        <p style={{ marginTop: "0.5rem", color: "#505A5F" }}>
                          {selectedFacilityIds.size} {t("HCM_SELECTED")}
                        </p>
                      )}
                    </div>
                  ) : toFilteredProjectIds?.length > 0 ? (
                    <p style={{ color: "#505A5F", marginBottom: "1rem" }}>{t("HCM_FACILITY_API_FAILED_DESC")}</p>
                  ) : (
                    <p style={{ color: "#505A5F", marginBottom: "1rem" }}>{t("HCM_SELECT_HIERARCHY_FIRST")}</p>
                  )}
                </div>
              )}

              <Button
                label={isDownloading ? t("LOADING") : t("HCM_DOWNLOAD_STOCK_TEMPLATE")}
                variation="secondary"
                type="button"
                icon="DownloadIcon"
                style={{ marginTop: "1.5rem" }}
                onClick={handleDownloadTemplate}
                isDisabled={isDownloading}
              />
            </Card>

            <Card style={{ marginTop: "1.5rem" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "1rem" }}>
                {t("HCM_UPLOAD_STOCK_TEMPLATE")}
              </h2>

              <BulkUpload
                onSubmit={handleFileUpload}
                fileData={uploadedFileData}
                onFileDelete={handleFileDelete}
                onFileDownload={handleFileDownload}
              />
            </Card>
          </div>
        </PopUp>
      )}

      {showToast && (
        <Toast
          label={showToast?.label}
          type={showToast?.key === "error" ? "error" : showToast?.key === "warning" ? "warning" : "success"}
          isDleteBtn={true}
          onClose={() => setShowToast(null)}
          transitionTime={5000}
        />
      )}
    </div>
  );
};

export default BulkStockUpload;
