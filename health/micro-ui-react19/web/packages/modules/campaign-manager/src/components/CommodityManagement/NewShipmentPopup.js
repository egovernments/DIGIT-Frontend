import React, { useState, useMemo, useCallback } from "react";
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
import { saveAs } from "file-saver";

const CONSOLE_MDMS_MODULENAME = "HCM-ADMIN-CONSOLE";

const NewShipmentPopup = ({
  campaignNumber,
  campaignId,
  tenantId,
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
  const [viewState, setViewState] = useState("form"); // "form" | "success" | "error"
  const [uploadSummary, setUploadSummary] = useState({
    total: 0,
    success: 0,
    failed: 0,
  });

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

  const boundaryRelationshipCriteria = useMemo(
    () => ({
      url: `/boundary-service/boundary-relationships/_search`,
      params: {
        tenantId,
        hierarchyType: BOUNDARY_HIERARCHY_TYPE,
        includeChildren: true,
      },
      body: {},
      config: { enabled: !!BOUNDARY_HIERARCHY_TYPE, cacheTime: 1000000 },
    }),
    [tenantId, BOUNDARY_HIERARCHY_TYPE],
  );

  const {
    data: boundaryRelationships,
    isLoading: boundaryRelLoading,
  } = Digit.Hooks.useCustomAPIHook(boundaryRelationshipCriteria);

  const boundaryAncestorMap = useMemo(() => {
    const boundaries =
      boundaryRelationships?.TenantBoundary?.[0]?.boundary || [];
    const map = {};
    const traverse = (node, ancestors) => {
      const currentPath = { ...ancestors };
      if (node?.boundaryType && node?.code)
        currentPath[node.boundaryType] = node.code;
      map[node?.code] = currentPath;
      if (node?.children)
        node.children.forEach((child) => traverse(child, currentPath));
    };
    boundaries.forEach((root) => traverse(root, {}));
    return map;
  }, [boundaryRelationships]);

  // Fetch campaign data → projectId + product variants
  const campaignReqCriteria = useMemo(
    () => ({
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
    }),
    [tenantId, campaignNumber],
  );

  const {
    data: campaignData,
    isLoading: campaignLoading,
  } = Digit.Hooks.useCustomAPIHook(campaignReqCriteria);

  const projectId = campaignData?.projectId;

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

  // Which projects have facilities
  const allFacilityReqCriteria = useMemo(
    () => ({
      url: `/project/facility/v1/_search`,
      params: { tenantId, limit: 1000, offset: 0 },
      body: { ProjectFacility: { projectId: allProjectIds } },
      config: {
        enabled: !!allProjectIds?.length,
        select: (data) => {
          const projectIdsWithFacilities = new Set();
          (data?.ProjectFacilities || []).forEach((pf) => {
            if (pf.projectId) projectIdsWithFacilities.add(pf.projectId);
          });
          return projectIdsWithFacilities;
        },
      },
    }),
    [tenantId, allProjectIds],
  );

  const {
    data: projectIdsWithFacilities,
    isLoading: allFacilitiesLoading,
  } = Digit.Hooks.useCustomAPIHook(allFacilityReqCriteria);

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
      if (values.size > 0) options[h.boundaryType] = Array.from(values).sort();
    });
    return options;
  }, [
    projectIdsWithFacilities,
    projectBoundaryMap,
    sortedHierarchy,
    boundaryAncestorMap,
  ]);

  const getAvailableOptions = useCallback(
    (boundaryType, filters) => {
      const allOptions = hierarchyFilterOptions[boundaryType] || [];
      return allOptions.filter((code) =>
        Object.entries(projectBoundaryMap).some(([pid, bInfo]) => {
          if (!projectIdsWithFacilities?.has(pid)) return false;
          const ancestors = boundaryAncestorMap[bInfo.boundary] || {};
          if (ancestors[boundaryType] !== code) return false;
          return Object.entries(filters).every(([type, value]) => {
            if (!value || type === boundaryType) return true;
            return ancestors[type] === value;
          });
        }),
      );
    },
    [
      hierarchyFilterOptions,
      projectBoundaryMap,
      projectIdsWithFacilities,
      boundaryAncestorMap,
    ],
  );

  const fromSelectedLevel = useMemo(() => {
    let level = -1;
    sortedHierarchy.forEach((h, idx) => {
      if (fromHierarchyFilters[h.boundaryType]) level = idx;
    });
    return level;
  }, [fromHierarchyFilters, sortedHierarchy]);

  const toHierarchyLevels = useMemo(() => {
    if (fromSelectedLevel < 0) return [];
    return sortedHierarchy.slice(fromSelectedLevel + 1);
  }, [sortedHierarchy, fromSelectedLevel]);

  const fromFilteredProjectIds = useMemo(() => {
    if (!allProjectIds.length || fromSelectedLevel < 0) return [];
    const targetBoundaryType = sortedHierarchy[fromSelectedLevel]?.boundaryType;
    if (!targetBoundaryType) return [];
    return allProjectIds.filter((pid) => {
      const bInfo = projectBoundaryMap[pid];
      if (!bInfo?.boundary) return false;
      if (bInfo.boundaryType !== targetBoundaryType) return false;
      const ancestors = boundaryAncestorMap[bInfo.boundary] || {};
      return Object.entries(fromHierarchyFilters).every(
        ([type, value]) => !value || ancestors[type] === value,
      );
    });
  }, [
    allProjectIds,
    fromHierarchyFilters,
    fromSelectedLevel,
    sortedHierarchy,
    projectBoundaryMap,
    boundaryAncestorMap,
  ]);

  const toSelectedLevel = useMemo(() => {
    let level = -1;
    toHierarchyLevels.forEach((h) => {
      if (toHierarchyFilters[h.boundaryType]) {
        const idx = sortedHierarchy.findIndex(
          (s) => s.boundaryType === h.boundaryType,
        );
        if (idx > level) level = idx;
      }
    });
    return level;
  }, [toHierarchyFilters, toHierarchyLevels, sortedHierarchy]);

  const toFilteredProjectIds = useMemo(() => {
    if (!allProjectIds.length) return [];

    // When From is at the deepest hierarchy level (no sub-levels exist),
    // show same-level sibling facilities scoped by the parent hierarchy context.
    if (toHierarchyLevels.length === 0 && fromSelectedLevel >= 0) {
      const targetBoundaryType =
        sortedHierarchy[fromSelectedLevel]?.boundaryType;
      if (!targetBoundaryType) return [];
      // Drop the deepest From filter so siblings at the same level are included
      const parentFilters = { ...fromHierarchyFilters };
      delete parentFilters[targetBoundaryType];
      return allProjectIds.filter((pid) => {
        const bInfo = projectBoundaryMap[pid];
        if (!bInfo?.boundary) return false;
        if (bInfo.boundaryType !== targetBoundaryType) return false;
        const ancestors = boundaryAncestorMap[bInfo.boundary] || {};
        return Object.entries(parentFilters).every(
          ([type, value]) => !value || ancestors[type] === value,
        );
      });
    }

    const hasToFilters = Object.values(toHierarchyFilters).some((v) => !!v);
    if (!hasToFilters) return [];
    const targetBoundaryType =
      toSelectedLevel >= 0
        ? sortedHierarchy[toSelectedLevel]?.boundaryType
        : null;
    if (!targetBoundaryType) return [];
    const combinedFilters = { ...fromHierarchyFilters, ...toHierarchyFilters };
    return allProjectIds.filter((pid) => {
      const bInfo = projectBoundaryMap[pid];
      if (!bInfo?.boundary) return false;
      if (bInfo.boundaryType !== targetBoundaryType) return false;
      const ancestors = boundaryAncestorMap[bInfo.boundary] || {};
      return Object.entries(combinedFilters).every(
        ([type, value]) => !value || ancestors[type] === value,
      );
    });
  }, [
    allProjectIds,
    fromHierarchyFilters,
    toHierarchyFilters,
    toSelectedLevel,
    toHierarchyLevels,
    fromSelectedLevel,
    sortedHierarchy,
    projectBoundaryMap,
    boundaryAncestorMap,
  ]);

  const fromFacilityReqCriteria = useMemo(
    () => ({
      url: `/project/facility/v1/_search`,
      params: { tenantId, limit: 1000, offset: 0 },
      body: { ProjectFacility: { projectId: fromFilteredProjectIds } },
      config: {
        enabled: !!fromFilteredProjectIds?.length,
        select: (data) => {
          const seen = new Set();
          const unique = [];
          (data?.ProjectFacilities || []).forEach((pf) => {
            if (!seen.has(pf.facilityId)) {
              seen.add(pf.facilityId);
              unique.push({
                id: pf.facilityId,
                name: pf.facilityId,
                projectId: pf.projectId,
              });
            }
          });
          return unique;
        },
      },
    }),
    [tenantId, fromFilteredProjectIds],
  );

  const {
    data: rawFromFacilityList,
    isLoading: fromFacilitiesLoading,
  } = Digit.Hooks.useCustomAPIHook(fromFacilityReqCriteria);

  const fromFacilityList = useMemo(() => {
    if (!rawFromFacilityList?.length) return rawFromFacilityList;
    return rawFromFacilityList.map((f) => {
      const bInfo = projectBoundaryMap[f.projectId];
      return {
        ...f,
        boundaryType: bInfo?.boundaryType || "",
        boundary: bInfo?.boundary || "",
      };
    });
  }, [rawFromFacilityList, projectBoundaryMap]);

  const toFacilityReqCriteria = useMemo(
    () => ({
      url: `/project/facility/v1/_search`,
      params: { tenantId, limit: 1000, offset: 0 },
      body: { ProjectFacility: { projectId: toFilteredProjectIds } },
      config: {
        enabled: !!toFilteredProjectIds?.length,
        select: (data) => {
          const seen = new Set();
          const unique = [];
          (data?.ProjectFacilities || []).forEach((pf) => {
            if (!seen.has(pf.facilityId)) {
              seen.add(pf.facilityId);
              unique.push({
                id: pf.facilityId,
                name: pf.facilityId,
                projectId: pf.projectId,
              });
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

  const toFacilityList = useMemo(() => {
    if (!rawToFacilityList?.length) return rawToFacilityList;
    return rawToFacilityList.map((f) => {
      const bInfo = projectBoundaryMap[f.projectId];
      return {
        ...f,
        boundaryType: bInfo?.boundaryType || "",
        boundary: bInfo?.boundary || "",
      };
    });
  }, [rawToFacilityList, projectBoundaryMap]);

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

  const filteredFromFacilities = useMemo(() => {
    if (!fromFacilityList?.length) return [];
    if (!fromSearchQuery?.trim()) return fromFacilityList;
    const q = fromSearchQuery.toLowerCase();
    return fromFacilityList.filter(
      (f) =>
        (f.id && f.id.toLowerCase().includes(q)) ||
        (f.name && f.name.toLowerCase().includes(q)) ||
        (f.boundary && f.boundary.toLowerCase().includes(q)),
    );
  }, [fromFacilityList, fromSearchQuery]);

  const fromFacility = useMemo(
    () => fromFacilityList?.find((f) => f.id === fromFacilityId) || null,
    [fromFacilityList, fromFacilityId],
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
        (f.name && f.name.toLowerCase().includes(q)) ||
        (f.boundary && f.boundary.toLowerCase().includes(q)),
    );
  }, [toFacilityList, searchQuery, fromFacilityId]);
  // const filteredFacilities = useMemo(() => {
  //   if (!toFacilityList?.length) return [];
  //   if (!searchQuery?.trim()) return toFacilityList;
  //   const q = searchQuery.toLowerCase();
  //   return toFacilityList.filter(
  //     (f) =>
  //       (f.id && f.id.toLowerCase().includes(q)) ||
  //       (f.name && f.name.toLowerCase().includes(q)) ||
  //       (f.boundary && f.boundary.toLowerCase().includes(q)),
  //   );
  // }, [toFacilityList, searchQuery]);

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

  const handleFromHierarchyChange = useCallback(
    (boundaryType, value) => {
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
    },
    [sortedHierarchy],
  );

  const handleToHierarchyChange = useCallback(
    (boundaryType, value) => {
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
    },
    [toHierarchyLevels],
  );

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
    const boundaryHeaders = sortedHierarchy.map((item) => item.boundaryType);
    const productHeaders = productVariants.map(
      (pv) => pv.name || pv.productVariantId,
    );
    return {
      boundaryHeaders,
      stockHeaders: [
        ...boundaryHeaders,
        "Project Id",
        "From (Facility Code)",
        "From (Facility Name)",
        "To (Facility Code)",
        "To (Facility Name)",
        ...productHeaders,
      ],
    };
  }, [sortedHierarchy, productVariants]);

  const handleDownloadTemplate = async ({
    selectedFacilities,
    boundaryAncestorMap,
    hierarchyFilterOptions,
    productVariants,
    fromFacility,
    allToFacilities,
    fromFacilityList,
  }) => {
    setIsDownloading(true);
    try {
      const safeFacilities = Array.isArray(selectedFacilities)
        ? selectedFacilities.filter((f) => f && f.name)
        : [];

      if (!safeFacilities.length) {
        alert("No valid facilities selected");
        return;
      }

      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Stock Data");
      const { boundaryHeaders, stockHeaders } = getTemplateHeaders();
      const MAX_ROW = 1000;

      // ─── HELPERS ────────────────────────────────────────────────
      function getExcelCol(col) {
        let temp = "";
        while (col > 0) {
          let rem = (col - 1) % 26;
          temp = String.fromCharCode(65 + rem) + temp;
          col = Math.floor((col - 1) / 26);
        }
        return temp;
      }
      const getColIndex = (name) =>
        stockHeaders.findIndex(
          (h) => h?.trim()?.toLowerCase() === name?.trim()?.toLowerCase(),
        ) + 1;

      // ─── ✅ STEP 1: FREEZE HEADER ROW ────────────────────────────
      // Must be set before adding rows
      sheet.views = [
        { state: "frozen", ySplit: 1, topLeftCell: "A2", activeCell: "A2" },
      ];

      // ─── STEP 2: HEADER ROW ──────────────────────────────────────
      const headerRow = sheet.addRow(stockHeaders);
      headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
      headerRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF1F4E79" },
      };
      headerRow.alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true,
      };
      headerRow.height = 30;

      // ─── ✅ STEP 3: LOCK HEADER ROW CELLS ────────────────────────
      // Lock every cell in row 1 so protection blocks editing them
      headerRow.eachCell((cell) => {
        cell.protection = { locked: true };
      });

      // ─── STEP 4: DATA ROWS ───────────────────────────────────────
      safeFacilities.forEach((facility) => {
        const row = [];
        const ancestors =
          (boundaryAncestorMap && facility?.boundary
            ? boundaryAncestorMap[facility.boundary]
            : null) || {};
        boundaryHeaders.forEach((bh) => row.push(ancestors[bh] || ""));
        row.push(facility?.projectId || "");
        row.push(fromFacility?.id || "");
        row.push(fromFacility?.name || "");
        row.push(facility?.id || "");
        row.push(facility?.name || "");
        (productVariants || []).forEach(() => row.push(""));
        sheet.addRow(row);
      });

      // ─── ✅ STEP 5: UNLOCK ALL DATA CELLS ────────────────────────
      // Must happen AFTER rows are added so cells exist
      // Without this, sheet protection would lock everything
      for (let r = 2; r <= sheet.rowCount; r++) {
        sheet.getRow(r).eachCell({ includeEmpty: true }, (cell) => {
          cell.protection = { locked: false };
        });
      }

      // ─── STEP 6: HIERARCHY HIDDEN SHEET ─────────────────────────
      const hierarchySheet = workbook.addWorksheet("hierarchy");
      const headerToColumnMap = {};
      let colIndex = 1;

      boundaryHeaders.forEach((boundaryType) => {
        const values = hierarchyFilterOptions[boundaryType];
        if (!Array.isArray(values) || !values.length) return;
        const colLetter = getExcelCol(colIndex);
        values.forEach((val, i) => {
          hierarchySheet.getCell(`${colLetter}${i + 1}`).value = val || "";
        });
        headerToColumnMap[boundaryType] = { colLetter, length: values.length };
        colIndex++;
      });
      hierarchySheet.state = "hidden"; // ✅ NOT veryHidden — breaks dropdowns

      // ─── STEP 7: FACILITY HIDDEN SHEET ──────────────────────────
      const hiddenSheet = workbook.addWorksheet("hidden");
      const allFacilitiesForDropdown = [
        ...(fromFacilityList || []),
        ...(allToFacilities || []),
      ];
      const seenIds = new Set();
      const uniqueFacilities = allFacilitiesForDropdown.filter((f) => {
        if (!f?.name || seenIds.has(f.id)) return false;
        seenIds.add(f.id);
        return true;
      });
      uniqueFacilities.forEach((f, i) => {
        hiddenSheet.getCell(`A${i + 1}`).value = f.name || f.id; // col A = names
        hiddenSheet.getCell(`B${i + 1}`).value = f.id || ""; // col B = codes
      });
      hiddenSheet.state = "hidden"; // ✅ NOT veryHidden
      const facilityCount = uniqueFacilities.length || 1;

      // ─── ✅ STEP 8: ALL DATA VALIDATIONS WITH ERROR MESSAGES ─────
      // 8a. Boundary dropdowns
      boundaryHeaders.forEach((boundaryType) => {
        const col = getColIndex(boundaryType);
        if (col <= 0) return;
        const colLetter = getExcelCol(col);
        const meta = headerToColumnMap[boundaryType];
        if (!meta) return;
        sheet.dataValidations.add(`${colLetter}2:${colLetter}${MAX_ROW}`, {
          type: "list",
          allowBlank: true,
          formulae: [
            `'hierarchy'!$${meta.colLetter}$1:$${meta.colLetter}$${meta.length}`,
          ],
          showErrorMessage: true,
          errorStyle: "stop",
          errorTitle: `Invalid ${boundaryType}`,
          error: `Please select a valid ${boundaryType} from the dropdown.`,
          showInputMessage: true,
          promptTitle: boundaryType,
          prompt: `Select ${boundaryType} from the list.`,
        });
      });

      // 8b. Facility Name dropdowns — col A of hidden sheet (MANDATORY)
      ["From (Facility Name)", "To (Facility Name)"].forEach((header) => {
        const col = getColIndex(header);
        if (col <= 0) return;
        const colLetter = getExcelCol(col);
        sheet.dataValidations.add(`${colLetter}2:${colLetter}${MAX_ROW}`, {
          type: "list",
          allowBlank: false,
          formulae: [`'hidden'!$A$1:$A$${facilityCount}`],
          showErrorMessage: true,
          errorStyle: "stop",
          errorTitle: "Invalid Facility Name",
          error: "Facility name must be selected from the provided list.",
          showInputMessage: true,
          promptTitle: "Facility Name",
          prompt: "Select a facility name from the dropdown.",
        });
      });

      // 8d. Project Id — mandatory, cannot be empty
      const projectIdCol = getColIndex("Project Id");
      if (projectIdCol > 0) {
        const cl = getExcelCol(projectIdCol);
        sheet.dataValidations.add(`${cl}2:${cl}${MAX_ROW}`, {
          type: "textLength",
          operator: "greaterThanOrEqual",
          allowBlank: false,
          formulae: [1],
          showErrorMessage: true,
          errorStyle: "stop",
          errorTitle: "Missing Project Id",
          error: "Project Id is mandatory and cannot be empty.",
        });
      }

      // 8e. Product quantity columns — whole number >= 1
      const productStart =
        stockHeaders.length - (productVariants?.length || 0) + 1;
      for (let col = productStart; col <= stockHeaders.length; col++) {
        const colLetter = getExcelCol(col);
        const productName = stockHeaders[col - 1];
        sheet.dataValidations.add(`${colLetter}2:${colLetter}${MAX_ROW}`, {
          type: "whole",
          operator: "greaterThanOrEqual",
          allowBlank: true,
          formulae: [1],
          showErrorMessage: true,
          errorStyle: "stop",
          errorTitle: "Invalid Quantity",
          error: `Quantity for '${productName}' must be a whole number ≥ 1.`,
          showInputMessage: true,
          promptTitle: "Quantity",
          prompt: "Enter a whole number ≥ 1 (leave empty to skip).",
        });
      }

      // ─── STEP 9: COLUMN WIDTHS ───────────────────────────────────
      sheet.columns = stockHeaders.map(() => ({ width: 30 }));

      // ─── ✅ STEP 10: SHEET PROTECTION ────────────────────────────
      // MUST be the very last step — after cell protection and validations
      await sheet.protect("HCM@1234", {
        sheet: true,
        insertColumns: false, // ✅ blocks adding new columns
        deleteColumns: false, // ✅ blocks deleting columns
        insertRows: true, // allow adding new data rows
        deleteRows: true, // allow removing rows
        formatCells: true, // allow formatting data cells
        formatColumns: false,
        formatRows: true,
        sort: true,
        autoFilter: true,
        selectLockedCells: true,
        selectUnlockedCells: true,
      });

      // ─── STEP 11: DOWNLOAD ───────────────────────────────────────
      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(
        new Blob([buffer]),
        `Stock_Template_${campaignNumber || "campaign"}.xlsx`,
      );
      setShowToast({ key: "success", label: t("HCM_DOWNLOAD_STOCK_TEMPLATE") });
    } catch (error) {
      //  catch (err) {
      //   console.error("TEMPLATE ERROR:", err);
      //   alert("Failed to generate template: " + err.message);
      // }

      console.error("Error downloading template:", error);
      setShowToast({ key: "error", label: t("HCM_STOCK_VALIDATION_ERROR") });
    } finally {
      setIsDownloading(false);
    }
  };

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
      const allRows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      if (!allRows || allRows.length < 2) {
        setShowToast({ key: "error", label: t("HCM_EMPTY_SHEET") });
        setIsSubmitting(false);
        return;
      }

      const headers = allRows[0]; // row 1 — header
      const dataRows = allRows
        .slice(1)
        .filter((row) =>
          row.some(
            (cell) => cell !== null && cell !== undefined && cell !== "",
          ),
        ); // skip completely empty rows

      // ─── ✅ VALIDATION 1: Template structure — column count must match ──────────
      const { stockHeaders, boundaryHeaders } = getTemplateHeaders();
      if (headers.length !== stockHeaders.length) {
        setShowToast({
          key: "error",
          label: `${t(
            "HCM_STOCK_VALIDATION_ERROR",
          )}: Template structure has changed. Expected ${
            stockHeaders.length
          } columns, found ${headers.length}.`,
        });
        setIsSubmitting(false);
        return;
      }

      // ─── ✅ VALIDATION 2: Header names must match exactly ───────────────────────
      const mismatchedHeaders = stockHeaders
        .map((expected, idx) => ({ expected, actual: headers[idx], idx }))
        .filter(({ expected, actual }) => expected !== actual);

      if (mismatchedHeaders.length > 0) {
        const detail = mismatchedHeaders
          .map(
            ({ expected, actual, idx }) =>
              `Col ${idx + 1}: expected "${expected}", found "${actual}"`,
          )
          .join("; ");
        setShowToast({
          key: "error",
          label: `${t(
            "HCM_STOCK_VALIDATION_ERROR",
          )}: Column headers don't match template. ${detail}`,
        });
        setIsSubmitting(false);
        return;
      }

      if (!dataRows.length) {
        setShowToast({ key: "error", label: t("HCM_EMPTY_SHEET") });
        setIsSubmitting(false);
        return;
      }

      // ─── Column index helpers ────────────────────────────────────────────────────
      const colIdx = (name) => headers.indexOf(name);
      const fromNameIdx = colIdx("From (Facility Name)");
      const toNameIdx = colIdx("To (Facility Name)");
      const fromCodeIdx = colIdx("From (Facility Code)");
      const toCodeIdx = colIdx("To (Facility Code)");
      const projectIdIdx = colIdx("Project Id");

      // ─── Build valid facility name set from known lists ─────────────────────────
      const validFacilityNames = new Set([
        ...(fromFacilityList || []).map((f) => f.name || f.id),
        ...(toFacilityList || []).map((f) => f.name || f.id),
      ]);

      // ─── Build product column mapping ───────────────────────────────────────────
      const variantByName = {};
      productVariants.forEach((pv) => {
        variantByName[pv.name || pv.productVariantId] = pv.productVariantId;
      });

      const fixedAndBoundaryHeaders = new Set([
        ...boundaryHeaders,
        "Project Id",
        "From (Facility Code)",
        "From (Facility Name)",
        "To (Facility Code)",
        "To (Facility Name)",
      ]);

      const productColumns = [];
      headers.forEach((header, idx) => {
        if (fixedAndBoundaryHeaders.has(header)) return;
        const variantId = variantByName[header] || "";
        if (variantId)
          productColumns.push({
            idx,
            productVariantId: variantId,
            name: header,
          });
      });

      if (!productColumns.length) {
        setShowToast({ key: "error", label: t("HCM_EMPTY_SHEET") });
        setIsSubmitting(false);
        return;
      }

      // ─── ✅ VALIDATION 3 + 4 + 5: Per-row validation ────────────────────────────
      const rowErrors = [];

      dataRows.forEach((row, rowIndex) => {
        const displayRow = rowIndex + 2; // +2 because row 1 is header, dataRows starts at row 2
        const errors = [];

        // VALIDATION 3a: Project Id is mandatory
        const projectId = row[projectIdIdx];
        if (
          projectIdIdx >= 0 &&
          (!projectId || String(projectId).trim() === "")
        ) {
          errors.push(`Project Id is required`);
        }

        // VALIDATION 3b + 2: From Facility Name — mandatory + must be in valid list
        const fromName = fromNameIdx >= 0 ? row[fromNameIdx] : null;
        if (!fromName || String(fromName).trim() === "") {
          errors.push(`From (Facility Name) is required`);
        } else if (
          validFacilityNames.size > 0 &&
          !validFacilityNames.has(String(fromName).trim())
        ) {
          errors.push(
            `From (Facility Name) "${fromName}" is not a valid facility`,
          );
        }

        // VALIDATION 3c + 2: To Facility Name — mandatory + must be in valid list
        const toName = toNameIdx >= 0 ? row[toNameIdx] : null;
        if (!toName || String(toName).trim() === "") {
          errors.push(`To (Facility Name) is required`);
        } else if (
          validFacilityNames.size > 0 &&
          !validFacilityNames.has(String(toName).trim())
        ) {
          errors.push(`To (Facility Name) "${toName}" is not a valid facility`);
        }

        // VALIDATION 3d: From and To must differ
        const fromCode = fromCodeIdx >= 0 ? row[fromCodeIdx] : null;
        const toCode = toCodeIdx >= 0 ? row[toCodeIdx] : null;
        if (
          fromCode &&
          toCode &&
          String(fromCode).trim() === String(toCode).trim()
        ) {
          errors.push(`From and To facility cannot be the same`);
        }

        // VALIDATION 4: Product quantity — must be a whole number > 0 if provided
        productColumns.forEach(({ idx, name }) => {
          const rawVal = row[idx];
          if (rawVal === null || rawVal === undefined || rawVal === "") return; // blank is allowed
          const numVal = Number(rawVal);
          if (!Number.isInteger(numVal) || numVal <= 0) {
            errors.push(
              `Quantity for "${name}" must be a whole number > 0 (found: ${rawVal})`,
            );
          }
        });

        if (errors.length > 0) {
          rowErrors.push({ row: displayRow, errors });
        }
      });

      // ─── If any row errors, show first few and stop ──────────────────────────────
      if (rowErrors.length > 0) {
        const MAX_SHOWN = 3;
        const shown = rowErrors.slice(0, MAX_SHOWN);
        const remaining = rowErrors.length - MAX_SHOWN;
        const errorMessage = shown
          .map(({ row, errors }) => `Row ${row}: ${errors.join(", ")}`)
          .join(" | ");
        const suffix =
          remaining > 0 ? ` (+${remaining} more rows with errors)` : "";
        setShowToast({
          key: "error",
          label: `Validation failed — ${errorMessage}${suffix}`,
          transitionTime: 10000,
        });
        setIsSubmitting(false);
        return;
      }

      // ─── Build stock payload (same as before) ────────────────────────────────────
      const userInfo = Digit.UserService.getUser()?.info;
      const timestamp = Date.now();
      const stockPayload = [];

      dataRows.forEach((row) => {
        const rowProjectId =
          projectIdIdx >= 0 ? String(row[projectIdIdx] || "").trim() : "";
        const senderId =
          fromCodeIdx >= 0
            ? String(row[fromCodeIdx] || "").trim()
            : fromFacility?.id || "";
        const receiverId =
          toCodeIdx >= 0 ? String(row[toCodeIdx] || "").trim() : "";

        if (!senderId || !receiverId || senderId === receiverId) return;

        productColumns.forEach(({ idx, productVariantId }) => {
          const quantity = parseInt(row[idx], 10);
          if (!quantity || quantity <= 0) return;

          stockPayload.push({
            tenantId,
            clientReferenceId: crypto.randomUUID(),
            productVariantId,
            quantity,
            referenceId: rowProjectId || campaignData?.projectId || campaignId,
            referenceIdType: "PROJECT",
            transactionType: "RECEIVED",
            senderType: "WAREHOUSE",
            senderId,
            receiverType: "WAREHOUSE",
            receiverId,
            dateOfEntry: timestamp,
            isDeleted: false,
            rowVersion: 1,
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

      // ─── API call ─────────────────────────────────────────────────────────────────
      let failedCount = 0;
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
          transitionTime: 5000000,
        });
        return;
      }

      setViewState("success");
      setUploadSummary({
        total: stockPayload.length,
        success: stockPayload.length - failedCount,
        failed: failedCount,
      });
    } catch (error) {
      setViewState("error");
    } finally {
      setIsSubmitting(false);
    }
  }, [
    uploadedFileData,
    tenantId,
    campaignData,
    campaignId,
    stockMutation,
    onSuccess,
    t,
    fromFacilityList, // ✅ added — needed for facility name validation
    toFacilityList, // ✅ added — needed for facility name validation
    productVariants, // ✅ added — needed for column mapping
    sortedHierarchy, // ✅ added — needed for boundary header list
    getTemplateHeaders, // ✅ added — needed for structure validation
    fromFacility,
  ]);

  const isLoadingInitialData =
    hierarchyTypeLoading ||
    hierarchyLoading ||
    campaignLoading ||
    projectsLoading ||
    boundaryRelLoading ||
    allFacilitiesLoading;
  const allVisibleSelected =
    filteredFacilities.length > 0 &&
    filteredFacilities.every((f) => selectedFacilityIds.has(f.id));
  const safeFacilities = useMemo(
    () =>
      (selectedFacilities || []).filter(
        (f) => f && typeof f === "object" && f.name,
      ),
    [selectedFacilities],
  );

  // Add this new memo — uses ALL projects with facilities, ignoring filters
  const allHierarchyOptions = useMemo(() => {
    if (!projectIdsWithFacilities?.size || !sortedHierarchy?.length) return {};
    const options = {};
    sortedHierarchy.forEach((h) => {
      const values = new Set();
      // ✅ Iterate ALL projects, not filtered ones
      Object.entries(projectBoundaryMap).forEach(([pid, bInfo]) => {
        if (!projectIdsWithFacilities.has(pid)) return;
        const ancestors = boundaryAncestorMap[bInfo.boundary] || {};
        const val = ancestors[h.boundaryType];
        if (val) values.add(val);
      });
      if (values.size > 0) options[h.boundaryType] = Array.from(values).sort();
    });
    return options;
  }, [
    projectIdsWithFacilities,
    projectBoundaryMap,
    sortedHierarchy,
    boundaryAncestorMap,
  ]);

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
          viewState === "success"
            ? [
                <Button
                  type="button"
                  size="large"
                  variation="primary"
                  label={t("ES_COMMON_CLOSE")}
                  onClick={() => {
                    setViewState("form");
                    onSuccess?.();
                  }}
                />,
              ]
            : viewState === "error"
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
          ) : viewState === "success" ? (
            <div style={{ padding: "2rem 1rem" }}>
              <Panels
                type="success"
                message={t("HCM_STOCK_UPLOAD_SUCCESS")}
                info={`${selectedFacilityIds.size} facilities updated successfully`}
                response={t("HCM_STOCK_UPLOAD_PROCESSED")}
                showAsSvg={false}
                animationProps={{ loop: false }}
                multipleResponses={[
                  `Total Rows: ${uploadSummary.total}`,
                  `Successful: ${uploadSummary.success}`,
                  `Failed: ${uploadSummary.failed}`,
                ]}
              />
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

                {Object.keys(hierarchyFilterOptions).length > 0 && (
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}
                  >
                    {sortedHierarchy.map((h) => {
                      if (!hierarchyFilterOptions[h.boundaryType]) return null;
                      const availableOptions = getAvailableOptions(
                        h.boundaryType,
                        fromHierarchyFilters,
                      );
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
                            option={[
                              { code: "", name: t("ES_COMMON_ALL") },
                              ...availableOptions.map((code) => ({
                                code,
                                name: t(code),
                              })),
                            ]}
                            optionKey="name"
                            selected={
                              fromHierarchyFilters[h.boundaryType]
                                ? {
                                    code: fromHierarchyFilters[h.boundaryType],
                                    name: t(
                                      fromHierarchyFilters[h.boundaryType],
                                    ),
                                  }
                                : { code: "", name: t("ES_COMMON_ALL") }
                            }
                            select={(value) =>
                              handleFromHierarchyChange(
                                h.boundaryType,
                                value.code,
                              )
                            }
                            style={{ width: "100%" }}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}

                {fromFacilitiesLoading ? (
                  <Loader />
                ) : fromFacilityList?.length > 0 ? (
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
                          name: f.boundaryType
                            ? `${
                                f.name !== f.id ? `${f.name} (${f.id})` : f.id
                              }  ${t(f.boundaryType)}${
                                f.boundary ? `: ${f.boundary}` : ""
                              }`
                            : f.name !== f.id
                            ? `${f.name} (${f.id})`
                            : f.id,
                        }))}
                        optionsKey="name"
                        selectedOption={
                          fromFacilityId
                            ? filteredFromFacilities
                                .map((f) => ({
                                  code: f.id,
                                  name: f.boundaryType
                                    ? `${
                                        f.name !== f.id
                                          ? `${f.name} (${f.id})`
                                          : f.id
                                      }  ${t(f.boundaryType)}${
                                        f.boundary ? `: ${f.boundary}` : ""
                                      }`
                                    : f.name !== f.id
                                    ? `${f.name} (${f.id})`
                                    : f.id,
                                }))
                                .find((f) => f.code === fromFacilityId)
                            : undefined
                        }
                        onSelect={(selected) =>
                          setFromFacilityId(selected.code)
                        }
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
                ) : fromFilteredProjectIds?.length > 0 ? (
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

                    {toHierarchyLevels.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "1rem",
                          marginBottom: "1rem",
                        }}
                      >
                        {toHierarchyLevels.map((h) => {
                          if (!hierarchyFilterOptions[h.boundaryType])
                            return null;
                          const availableOptions = getAvailableOptions(
                            h.boundaryType,
                            { ...fromHierarchyFilters, ...toHierarchyFilters },
                          );
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
                                option={[
                                  { code: "", name: t("ES_COMMON_ALL") },
                                  ...availableOptions.map((code) => ({
                                    code,
                                    name: t(code),
                                  })),
                                ]}
                                optionKey="name"
                                selected={
                                  toHierarchyFilters[h.boundaryType]
                                    ? {
                                        code:
                                          toHierarchyFilters[h.boundaryType],
                                        name: t(
                                          toHierarchyFilters[h.boundaryType],
                                        ),
                                      }
                                    : { code: "", name: t("ES_COMMON_ALL") }
                                }
                                select={(value) =>
                                  handleToHierarchyChange(
                                    h.boundaryType,
                                    value.code,
                                  )
                                }
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
                                label={
                                  f.boundaryType
                                    ? `${
                                        f.name !== f.id
                                          ? `${f.name} (${f.id})`
                                          : f.id
                                      }  ${t(f.boundaryType)}${
                                        f.boundary ? `: ${f.boundary}` : ""
                                      }`
                                    : f.name !== f.id
                                    ? `${f.name} (${f.id})`
                                    : f.id
                                }
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
                    ) : toFilteredProjectIds?.length > 0 ? (
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
                  // onClick={handleDownloadTemplate}
                  onClick={() =>
                    handleDownloadTemplate({
                      selectedFacilities: safeFacilities,
                      boundaryAncestorMap,
                      hierarchyFilterOptions: allHierarchyOptions, // ✅ full options, not filtered
                      productVariants,
                      fromFacility,
                      allToFacilities: toFacilityList,
                      fromFacilityList: fromFacilityList,
                    })
                  }
                  isDisabled={isDownloading}
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
            transitionTime={showToast?.transitionTime}
          />
        )}
      </PopUp>
    </>
  );
};

export default NewShipmentPopup;
