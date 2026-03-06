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
} from "@egovernments/digit-ui-components";
import BulkUpload from "../BulkUpload";
import XLSX from "xlsx";

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
      url: `/health-project/v1/_search`,
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
      url: `/health-project/facility/v1/_search`,
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
      url: `/health-project/facility/v1/_search`,
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
      url: `/health-project/facility/v1/_search`,
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
    url: `/stock/v1/_create`,
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
    return {
      boundaryHeaders,
      stockHeaders: [
        ...boundaryHeaders,
        "Project Id",
        "From (Facility Code)",
        "From (Facility Name)",
        "To (Facility Code)",
        "To (Facility Name)",
        "Product Variant Id",
        "Product Variant Name",
        "Quantity",
      ],
    };
  }, [sortedHierarchy]);

  const handleDownloadTemplate = useCallback(() => {
    setIsDownloading(true);
    try {
      const { boundaryHeaders, stockHeaders } = getTemplateHeaders();
      const dataRows = [];
      selectedFacilities.forEach((facility) => {
        productVariants.forEach((pv) => {
          const row = [];
          const facilityAncestors =
            boundaryAncestorMap[facility.boundary] || {};
          boundaryHeaders.forEach((boundaryType) =>
            row.push(facilityAncestors[boundaryType] || ""),
          );
          row.push(facility?.projectId || "");
          row.push(fromFacility?.id || "");
          row.push(fromFacility?.name || "");
          row.push(facility?.id || "");
          row.push(facility?.name || facility?.id || "");
          row.push(pv.productVariantId);
          row.push(pv.name || pv.productVariantId);
          row.push("");
          dataRows.push(row);
        });
      });

      const wsData = [stockHeaders, ...dataRows];
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      ws["!cols"] = stockHeaders.map(() => ({ wch: 30 }));
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Stock Data");

      const readmeData = [
        ["Instructions"],
        [""],
        [
          "1. 'From' is the source warehouse and 'To' is the destination facility",
        ],
        selectedFacilities.length > 0
          ? [
              "2. From and To facilities have been pre-filled based on your selection",
            ]
          : ["2. Fill in the From and To facility codes for each row"],
        ["3. From and To must be different facilities"],
        [
          "4. Each row represents one stock transaction (one facility + one product variant)",
        ],
        ["5. Enter the Quantity for each row"],
        ["6. Delete rows you do not need"],
        ["7. Save the file and upload it back on the stock upload screen"],
      ];
      const readmeWs = XLSX.utils.aoa_to_sheet(readmeData);
      readmeWs["!cols"] = [{ wch: 80 }];
      XLSX.utils.book_append_sheet(wb, readmeWs, "ReadMe");

      XLSX.writeFile(wb, `Stock_Template_${campaignNumber || "campaign"}.xlsx`);
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
    campaignNumber,
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
      const rows = XLSX.utils.sheet_to_json(sheet);

      if (!rows?.length) {
        setShowToast({ key: "error", label: t("HCM_EMPTY_SHEET") });
        setIsSubmitting(false);
        return;
      }

      const userInfo = Digit.UserService.getUser()?.info;
      const timestamp = Date.now();
      const stockPayload = [];

      rows.forEach((row) => {
        const rowProjectId = row["Project Id"] || "";
        const senderId =
          row["From (Facility Code)"] || row["Sender Facility Code"] || "";
        const receiverId =
          row["To (Facility Code)"] || row["Receiver Facility Code"] || "";
        const productVariantId = row["Product Variant Id"] || "";
        const quantity = parseInt(row["Quantity"], 10);
        if (!senderId || !receiverId || senderId === receiverId) return;
        if (!productVariantId || !quantity || quantity <= 0) return;
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

      if (!stockPayload.length) {
        setShowToast({ key: "error", label: t("HCM_EMPTY_SHEET") });
        setIsSubmitting(false);
        return;
      }

      let failedCount = 0;
      for (let i = 0; i < stockPayload.length; i++) {
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

      // setShowToast({ key: "success", label: t("HCM_STOCK_UPLOAD_SUCCESS") });
      setViewState("success");
      setUploadSummary({
        total: stockPayload.length,
        success: stockPayload.length - failedCount,
        failed: failedCount,
      });

      setViewState("success");
      // setTimeout(() => onSuccess?.(), 2000);
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
    campaignData,
    campaignId,
    stockMutation,
    onSuccess,
    t,
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

  const selectStyle = {
    width: "100%",
    padding: "0.5rem",
    border: "1px solid #D6D5D4",
    borderRadius: "0.25rem",
    fontSize: "1rem",
    backgroundColor: "#fff",
  };

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
                          <select
                            value={fromHierarchyFilters[h.boundaryType] || ""}
                            onChange={(e) =>
                              handleFromHierarchyChange(
                                h.boundaryType,
                                e.target.value,
                              )
                            }
                            style={selectStyle}
                          >
                            <option value="">{t("ES_COMMON_ALL")}</option>
                            {availableOptions.map((code) => (
                              <option key={code} value={code}>
                                {t(code)}
                              </option>
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
                            ? `${f.name !== f.id ? `${f.name} (${f.id})` : f.id}  ${t(f.boundaryType)}${f.boundary ? `: ${f.boundary}` : ""}`
                            : f.name !== f.id ? `${f.name} (${f.id})` : f.id,
                        }))}
                        optionsKey="name"
                        selectedOption={
                          fromFacilityId
                            ? filteredFromFacilities
                                .map((f) => ({
                                  code: f.id,
                                  name: f.boundaryType
                                    ? `${f.name !== f.id ? `${f.name} (${f.id})` : f.id}  ${t(f.boundaryType)}${f.boundary ? `: ${f.boundary}` : ""}`
                                    : f.name !== f.id ? `${f.name} (${f.id})` : f.id,
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
                              <select
                                value={toHierarchyFilters[h.boundaryType] || ""}
                                onChange={(e) =>
                                  handleToHierarchyChange(
                                    h.boundaryType,
                                    e.target.value,
                                  )
                                }
                                style={selectStyle}
                              >
                                <option value="">{t("ES_COMMON_ALL")}</option>
                                {availableOptions.map((code) => (
                                  <option key={code} value={code}>
                                    {code}
                                  </option>
                                ))}
                              </select>
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
                            padding: "0.25rem 0",
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
                                    ? `${f.name !== f.id ? `${f.name} (${f.id})` : f.id}  ${t(f.boundaryType)}${f.boundary ? `: ${f.boundary}` : ""}`
                                    : f.name !== f.id ? `${f.name} (${f.id})` : f.id
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
                  onClick={handleDownloadTemplate}
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
