import React, { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, HeaderComponent, Card, Loader, Toast, PopUp } from "@egovernments/digit-ui-components";
import BulkUpload from "../../../components/BulkUpload";
import StockComponent from "../../../components/StockComponent";
import { CONSOLE_MDMS_MODULENAME } from "../../../Module";
import { I18N_KEYS } from "../../../utils/i18nKeyConstants";
import XLSX from "xlsx";

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
  const [uploadedFileData, setUploadedFileData] = useState([]);
  const [showToast, setShowToast] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showUploadPopup, setShowUploadPopup] = useState(false);

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

  const projectSearchCriteria = useMemo(() => ({
    url: `/health-project/v1/_search`,
    params: { tenantId: tenantId, limit: 1000, offset: 0, includeDescendants: true },
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
  const allProjectIds = projectData?.ids || [];
  const projectBoundaryMap = projectData?.boundaryMap || {};

  // Fetch ALL project facilities to know which projects have facilities
  const allFacilityReqCriteria = useMemo(() => ({
    url: `/health-project/facility/v1/_search`,
    params: { tenantId: tenantId, limit: 1000, offset: 0 },
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

  // Build sorted hierarchy
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

  // Filter project IDs for "From" — only projects at the exact selected level
  const fromFilteredProjectIds = useMemo(() => {
    if (!allProjectIds.length || fromSelectedLevel < 0) return [];
    const targetBoundaryType = sortedHierarchy[fromSelectedLevel]?.boundaryType;
    if (!targetBoundaryType) return [];
    return allProjectIds.filter((pid) => {
      const bInfo = projectBoundaryMap[pid];
      if (!bInfo?.boundary) return false;
      // Only include projects whose own boundaryType matches the lowest selected level
      if (bInfo.boundaryType !== targetBoundaryType) return false;
      const ancestors = boundaryAncestorMap[bInfo.boundary] || {};
      return Object.entries(fromHierarchyFilters).every(([type, value]) => {
        if (!value) return true;
        return ancestors[type] === value;
      });
    });
  }, [allProjectIds, fromHierarchyFilters, fromSelectedLevel, sortedHierarchy, projectBoundaryMap, boundaryAncestorMap]);

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
      // Only include projects whose own boundaryType matches the lowest selected To level
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
    url: `/health-project/facility/v1/_search`,
    params: { tenantId: tenantId, limit: 1000, offset: 0 },
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
    url: `/health-project/facility/v1/_search`,
    params: { tenantId: tenantId, limit: 1000, offset: 0 },
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

  // Stock mutation hook
  const stockMutationReq = {
    url: `/stock/v1/_create`,
    params: {},
    body: {},
    config: {
      enabled: false,
    },
  };

  const stockMutation = Digit.Hooks.useCustomAPIMutationHook(stockMutationReq);

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
    // Reset To filters, To facility selections, and From facility when From changes
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

  // Build template headers
  const getTemplateHeaders = useCallback(() => {
    const boundaryHeaders = sortedHierarchy.map((item) => item.boundaryType);
    return { boundaryHeaders, stockHeaders: [...boundaryHeaders, "Project Id", "From (Facility Code)", "From (Facility Name)", "To (Facility Code)", "To (Facility Name)", "Product Variant Id", "Product Variant Name", "Quantity"] };
  }, [sortedHierarchy]);

  // Handle template download with selected facilities pre-filled
  const handleDownloadTemplate = useCallback(() => {
    setIsDownloading(true);
    try {
      const { boundaryHeaders, stockHeaders } = getTemplateHeaders();
      const facilitiesToInclude = selectedFacilities.length > 0 ? selectedFacilities : [];

      const dataRows = [];
      facilitiesToInclude.forEach((facility) => {
        productVariants.forEach((pv) => {
          const row = [];
          boundaryHeaders.forEach(() => row.push(""));
          row.push(facility?.projectId || ""); // Project Id
          row.push(fromFacility?.id || ""); // From (Facility Code)
          row.push(fromFacility?.name || ""); // From (Facility Name)
          row.push(facility?.id || ""); // To (Facility Code)
          row.push(facility?.name || facility?.id || ""); // To (Facility Name)
          row.push(pv.productVariantId);
          row.push(pv.name || pv.productVariantId);
          row.push(""); // Quantity - user fills this
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
        ["1. 'From' is the source warehouse and 'To' is the destination facility"],
        facilitiesToInclude.length > 0
          ? ["2. From and To facilities have been pre-filled based on your selection"]
          : ["2. Fill in the From and To facility codes for each row"],
        ["3. From and To must be different facilities"],
        ["4. Each row represents one stock transaction (one facility + one product variant)"],
        ["5. Enter the Quantity for each row"],
        ["6. Delete rows you do not need"],
        ["7. Save the file and upload it back on the stock upload screen"],
      ];
      const readmeWs = XLSX.utils.aoa_to_sheet(readmeData);
      readmeWs["!cols"] = [{ wch: 80 }];
      XLSX.utils.book_append_sheet(wb, readmeWs, "ReadMe");

      XLSX.writeFile(wb, `Stock_Template_${campaignName || "campaign"}.xlsx`);
      setShowToast({ key: "success", label: t(I18N_KEYS.CAMPAIGN_CREATE.HCM_DOWNLOAD_STOCK_TEMPLATE) });
    } catch (error) {
      console.error("Error downloading template:", error);
      setShowToast({ key: "error", label: t(I18N_KEYS.CAMPAIGN_CREATE.HCM_STOCK_VALIDATION_ERROR) });
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
      const rows = XLSX.utils.sheet_to_json(sheet);

      if (!rows?.length) {
        setShowToast({ key: "error", label: t("HCM_EMPTY_SHEET") });
        setIsSubmitting(false);
        return;
      }

      // One API call per row
      const stockPayload = [];
      const userInfo = Digit.UserService.getUser()?.info;
      const timestamp = Date.now();

      rows.forEach((row) => {
        const rowProjectId = row["Project Id"] || "";
        const senderId = row["From (Facility Code)"] || row["Sender Facility Code"] || "";
        const receiverId = row["To (Facility Code)"] || row["Receiver Facility Code"] || "";
        const productVariantId = row["Product Variant Id"] || "";
        const quantity = parseInt(row["Quantity"], 10);

        if (!senderId || !receiverId || senderId === receiverId) return;
        if (!productVariantId || !quantity || quantity <= 0) return;

        stockPayload.push({
          tenantId: tenantId,
          clientReferenceId: crypto.randomUUID(),
          productVariantId: productVariantId,
          quantity: quantity,
          referenceId: rowProjectId || campaignData?.projectId || campaignId,
          referenceIdType: "PROJECT",
          transactionType: "RECEIVED",
          senderType: "WAREHOUSE",
          senderId: senderId,
          receiverType: "WAREHOUSE",
          receiverId: receiverId,
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
        setShowToast({ key: "warning", label: `${stockPayload.length - failedCount}/${stockPayload.length} rows created. ${failedCount} failed.`, transitionTime: 5000000 });
        return;
      }

      setShowToast({ key: "success", label: t(I18N_KEYS.CAMPAIGN_CREATE.HCM_STOCK_UPLOAD_SUCCESS) });
      setTimeout(() => {
        navigate(`/${window?.contextPath}/employee/campaign/view-details?campaignNumber=${campaignNumber}&tenantId=${tenantId}`);
      }, 2000);
    } catch (error) {
      console.error("Stock upload error:", error);
      setShowToast({ key: "error", label: t(I18N_KEYS.CAMPAIGN_CREATE.HCM_STOCK_VALIDATION_ERROR) });
    } finally {
      setIsSubmitting(false);
    }
  }, [uploadedFileData, productVariants, tenantId, campaignData, campaignId, stockMutation, campaignNumber, navigate, t]);

  if (hierarchyTypeLoading || hierarchyLoading || campaignLoading || projectsLoading || boundaryRelLoading || allFacilitiesLoading) {
    return <Loader />;
  }

  const allVisibleSelected = filteredFacilities.length > 0 && filteredFacilities.every((f) => selectedFacilityIds.has(f.id));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <HeaderComponent>{t(I18N_KEYS.CAMPAIGN_CREATE.HCM_BULK_STOCK_UPLOAD_HEADING)}</HeaderComponent>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Button
            label={t("HCM_UPLOAD_STOCK")}
            variation="primary"
            type="button"
            icon="UploadIcon"
            onClick={() => setShowUploadPopup(true)}
          />
          <Button
            label={t("HCM_BACK")}
            variation="secondary"
            type="button"
            onClick={() =>
              navigate(`/${window?.contextPath}/employee/campaign/view-details?campaignNumber=${campaignNumber}&tenantId=${tenantId}`)
            }
          />
        </div>
      </div>

      {/* Stock Transactions Table */}
      {allProjectIds?.length > 0 && <StockComponent allProjectIds={allProjectIds} />}

      {/* Upload Stock Popup */}
      {showUploadPopup && (
        <PopUp
          className={"boundaries-pop-module"}
          type={"default"}
          heading={t(I18N_KEYS.CAMPAIGN_CREATE.HCM_BULK_STOCK_UPLOAD_HEADING)}
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
              label={isSubmitting ? t(I18N_KEYS.CAMPAIGN_CREATE.HCM_STOCK_PROCESSING) : t(I18N_KEYS.CAMPAIGN_CREATE.HCM_STOCK_SUBMIT)}
              title={t(I18N_KEYS.CAMPAIGN_CREATE.HCM_STOCK_SUBMIT)}
              onClick={handleSubmit}
              isDisabled={!uploadedFileData?.length || isSubmitting}
            />,
          ]}
          sortFooterChildren={true}
          style={{ width: "60rem" }}
        >
          <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
            <p style={{ marginBottom: "1.5rem", color: "#505A5F" }}>
              {t(I18N_KEYS.CAMPAIGN_CREATE.HCM_BULK_STOCK_UPLOAD_DESC)}
            </p>

            {/* Step 1: From hierarchy + facility, To hierarchy + facility, Download */}
            <Card>
              {/* FROM: Hierarchy filter + Facility selection */}
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

              {/* TO: Hierarchy filter (levels below From) + Facility selection */}
              {fromSelectedLevel >= 0 && (
                <div>
                  <h2 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "0.75rem", marginTop: "1rem" }}>
                    {t("HCM_SELECT_TO_FACILITIES")}
                  </h2>
                  <p style={{ color: "#505A5F", marginBottom: "0.75rem" }}>{t("HCM_TO_FACILITIES_DESC")}</p>

                  {toHierarchyLevels.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
                      {toHierarchyLevels.map((h) => {
                        const options = hierarchyFilterOptions[h.boundaryType];
                        if (!options) return null;
                        const availableOptions = getAvailableOptions(h.boundaryType, { ...fromHierarchyFilters, ...toHierarchyFilters });
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
                                <option key={code} value={code}>{code}</option>
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
                label={isDownloading ? t(I18N_KEYS.CAMPAIGN_CREATE.LOADING) : t(I18N_KEYS.CAMPAIGN_CREATE.HCM_DOWNLOAD_STOCK_TEMPLATE)}
                variation="secondary"
                type="button"
                icon="DownloadIcon"
                style={{ marginTop: "1.5rem" }}
                onClick={handleDownloadTemplate}
                isDisabled={isDownloading}
              />
            </Card>

            {/* Step 2: Upload Stock Data */}
            <Card style={{ marginTop: "1.5rem" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "1rem" }}>
                {t(I18N_KEYS.CAMPAIGN_CREATE.HCM_UPLOAD_STOCK_TEMPLATE)}
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
          transitionTime={showToast?.transitionTime}
        />
      )}
    </div>
  );
};

export default BulkStockUpload;
