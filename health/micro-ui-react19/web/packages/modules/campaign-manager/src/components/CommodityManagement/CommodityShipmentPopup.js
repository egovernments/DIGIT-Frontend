import React, { useEffect,useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  PopUp,
  Button,
  Toast,
  TextInput,
  TextArea,
  Dropdown,
  Loader,
  Card,
  ErrorMessage,
} from "@egovernments/digit-ui-components";
import { I18N_KEYS } from "../../utils/i18nKeyConstants";

const COMMODITY_KEYS = I18N_KEYS.COMMODITY_MANAGEMENT;
const CONSOLE_MDMS_MODULENAME = "HCM-ADMIN-CONSOLE";

/**
 * CommodityShipmentPopup — modal for creating a single stock shipment from a warehouse.
 *
 * Props:
 *  - tenantId: current tenant
 *  - campaignId: campaign identifier
 *  - campaignNumber: campaign number for fetching campaign data (like BulkStockUpload)
 *  - fromFacility: { id, name } of the source warehouse (auto-filled, read-only)
 *  - productVariants: [{ productVariantId, name }] available commodities
 *  - warehouseStock: { [productVariantId]: currentStock } available stock at source
 *  - onClose: callback to close the popup
 *  - onSuccess: callback after successful shipment
 */
const CommodityShipmentPopup = ({
  tenantId,
  campaignId,
  campaignNumber,
  fromFacility,
  productVariants = [],
  selectedCommodity: defaultCommodityId,
  warehouseStock = {},
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation();

  // Form state
  const [waybillNumber, setWaybillNumber] = useState("");
  const [toFacility, setToFacility] = useState(null);
  const [comment, setComment] = useState("");

  // Commodity add state
  const [selectedCommodity, setSelectedCommodity] = useState(null);
  const [quantity, setQuantity] = useState("");

  // Shipment items list
  const [shipmentItems, setShipmentItems] = useState([]);

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(null);
  const [errors, setErrors] = useState({});

  // Stock mutation (bulk create like BulkStockUpload)
  const stockMutation = Digit.Hooks.useCustomAPIMutationHook({
    url: `/stock/v1/bulk/_create`,
    params: {},
    body: {},
    config: { enabled: false },
  });

  const moduleName = Digit.Utils.campaign.getModuleName();

  // Fetch BOUNDARY_HIERARCHY_TYPE from MDMS (same as BulkStockUpload)
  const { data: BOUNDARY_HIERARCHY_TYPE, isLoading: hierarchyTypeLoading } = Digit.Hooks.useCustomMDMS(
    tenantId,
    CONSOLE_MDMS_MODULENAME,
    [{ name: "HierarchySchema", filter: `[?(@.type=='${moduleName}')]` }],
    {
      select: (data) =>
        data?.[CONSOLE_MDMS_MODULENAME]?.HierarchySchema?.[0]?.hierarchy,
    },
    { schemaCode: "HierarchySchema" },
  );

  // Fetch boundary hierarchy definition (same as BulkStockUpload)
  const hierarchyDefCriteria = useMemo(
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
  const { data: hierarchyDefinition, isLoading: hierarchyLoading } = Digit.Hooks.useCustomAPIHook(
    hierarchyDefCriteria,
  );

  // Fetch boundary relationships for geographic containment filtering
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

  // Build boundary code → ancestor path map
  const boundaryAncestorMap = useMemo(() => {
    const boundaries = boundaryRelationships?.TenantBoundary?.[0]?.boundary || [];
    const map = {};
    const traverse = (node, ancestors) => {
      const currentPath = { ...ancestors };
      if (node?.boundaryType && node?.code) {
        currentPath[node.boundaryType] = node.code;
      }
      map[node?.code] = currentPath;
      (node?.children || []).forEach((child) => traverse(child, currentPath));
    };
    boundaries.forEach((root) => traverse(root, {}));
    return map;
  }, [boundaryRelationships]);

  // Build sorted hierarchy levels (same as BulkStockUpload)
  const sortedHierarchy = useMemo(() => {
    const bh =
      hierarchyDefinition?.BoundaryHierarchy?.[0]?.boundaryHierarchy || [];
    if (!bh.length) return [];
    const sorted = [];
    let current = bh.find((item) => !item?.parentBoundaryType);
    while (current) {
      sorted.push(current);
      const next = bh.find(
        (item) => item?.parentBoundaryType === current?.boundaryType,
      );
      if (!next) break;
      current = next;
    }
    return sorted;
  }, [hierarchyDefinition]);

  // Step 1: Fetch campaign data to get projectId (same as BulkStockUpload)
  const campaignReqCriteria = useMemo(
    () => ({
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
    }),
    [tenantId, campaignNumber],
  );
  const { data: campaignData, isLoading: campaignLoading } = Digit.Hooks.useCustomAPIHook(
    campaignReqCriteria,
  );
  const resolvedProjectId = campaignData?.projectId;

  // Step 2: Fetch all descendant project IDs + boundary map (same as BulkStockUpload)
  const projectSearchCriteria = useMemo(
    () => ({
      url: `/project/v1/_search`,
      params: { tenantId, limit: 1000, offset: 0, includeDescendants: true },
      body: { Projects: [{ id: resolvedProjectId, tenantId }] },
      config: {
        enabled: !!resolvedProjectId,
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
          if (ids.length === 0 && resolvedProjectId)
            ids.push(resolvedProjectId);
          return { ids, boundaryMap };
        },
      },
    }),
    [tenantId, resolvedProjectId],
  );
  const { data: projectData, isLoading: projectsLoading } = Digit.Hooks.useCustomAPIHook(
    projectSearchCriteria,
  );
  const allProjectIds = projectData?.ids || [];
  const projectBoundaryMap = projectData?.boundaryMap || {};

  // Step 3: Fetch project-facility mappings (same as BulkStockUpload)
  const facilityMappingCriteria = useMemo(
    () => ({
      url: `/project/facility/v1/_search`,
      params: { tenantId, limit: 1000, offset: 0 },
      body: { ProjectFacility: { projectId: allProjectIds } },
      config: {
        enabled: !!allProjectIds?.length,
        select: (data) => {
          const facilityToProject = {};
          const facilityToProjects = {}; // facilityId → [projectId, ...] (all mappings)
          const allFacilityIds = [];
          const seen = new Set();
          (data?.ProjectFacilities || []).forEach((pf) => {
            if (!pf.facilityId || !pf.projectId) return;
            if (!facilityToProject[pf.facilityId]) {
              facilityToProject[pf.facilityId] = pf.projectId;
            }
            if (!facilityToProjects[pf.facilityId]) {
              facilityToProjects[pf.facilityId] = [];
            }
            facilityToProjects[pf.facilityId].push(pf.projectId);
            if (!seen.has(pf.facilityId)) {
              seen.add(pf.facilityId);
              allFacilityIds.push(pf.facilityId);
            }
          });
          return { facilityToProject, facilityToProjects, allFacilityIds };
        },
      },
    }),
    [tenantId, allProjectIds],
  );
  const { data: facilityMappingData, isLoading: facilityMappingLoading } = Digit.Hooks.useCustomAPIHook(
    facilityMappingCriteria,
  );
  const facilityToProject = facilityMappingData?.facilityToProject || {};
  const facilityToProjects = facilityMappingData?.facilityToProjects || {};
  const allMappedFacilityIds = facilityMappingData?.allFacilityIds || [];

  // Step 4: Fetch facility details (names) for all mapped facilities
  const facilityDetailsCriteria = useMemo(
    () => ({
      url: `/facility/v1/_search`,
      params: {
        tenantId,
        limit: allMappedFacilityIds.length || 10,
        offset: 0,
      },
      body: { Facility: { id: allMappedFacilityIds } },
      config: {
        enabled: !!allMappedFacilityIds.length && !!tenantId,
        select: (data) => {
          return (data?.Facilities || []).map((f) => ({
            id: f.id,
            name: f.name || f.id,
          }));
        },
      },
    }),
    [tenantId, allMappedFacilityIds],
  );
  const { data: allCampaignFacilities = [], isLoading: facilityDetailsLoading } = Digit.Hooks.useCustomAPIHook(
    facilityDetailsCriteria,
  );

  // Build hierarchy level index: boundaryType → level number (0 = top)
  const hierarchyLevelIndex = useMemo(() => {
    const map = {};
    sortedHierarchy.forEach((h, idx) => {
      map[h.boundaryType] = idx;
    });
    return map;
  }, [sortedHierarchy]);

  // Helper: get the deepest hierarchy level for a facility across all its project mappings
  const getFacilityLevel = useCallback(
    (facilityId) => {
      const pids = facilityToProjects[facilityId] || [];
      let deepest = -1;
      for (const pid of pids) {
        const bInfo = projectBoundaryMap[pid];
        if (!bInfo?.boundaryType) continue;
        const level = hierarchyLevelIndex[bInfo.boundaryType] ?? -1;
        if (level > deepest) deepest = level;
      }
      return deepest;
    },
    [facilityToProjects, projectBoundaryMap, hierarchyLevelIndex],
  );

  // Determine the "From" facility's hierarchy level
  const fromFacilityLevel = useMemo(() => {
    return getFacilityLevel(fromFacility?.id);
  }, [getFacilityLevel, fromFacility]);

  // Get the From facility's boundary info for geographic containment filtering
  const fromFacilityBoundary = useMemo(() => {
    const pids = facilityToProjects[fromFacility?.id] || [];
    for (const pid of pids) {
      const bInfo = projectBoundaryMap[pid];
      if (bInfo?.boundary && bInfo?.boundaryType) {
        const level = hierarchyLevelIndex[bInfo.boundaryType] ?? -1;
        if (level === fromFacilityLevel) return bInfo;
      }
    }
    return null;
  }, [facilityToProjects, fromFacility, projectBoundaryMap, hierarchyLevelIndex, fromFacilityLevel]);

  // Filter "To" facilities: exclude source, only one level below AND under the same geographic subtree
  const [toSearchText, setToSearchText] = useState("");
  const filteredToFacilities = useMemo(() => {
    let list = allCampaignFacilities.filter((f) => f.id !== fromFacility?.id);
    if (fromFacilityLevel >= 0) {
      list = list.filter((f) => {
        const level = getFacilityLevel(f.id);
        if (level < 0) return false;
        if (level !== fromFacilityLevel + 1) return false;

        // Geographic containment: facility's boundary must have the From boundary as ancestor
        if (fromFacilityBoundary) {
          const fPids = facilityToProjects[f.id] || [];
          return fPids.some((pid) => {
            const bInfo = projectBoundaryMap[pid];
            if (!bInfo?.boundary) return false;
            const ancestors = boundaryAncestorMap[bInfo.boundary] || {};
            return ancestors[fromFacilityBoundary.boundaryType] === fromFacilityBoundary.boundary;
          });
        }
        return true;
      });
    }
    if (!toSearchText) return list;
    const lower = toSearchText.toLowerCase();
    return list.filter(
      (f) =>
        f.name?.toLowerCase().includes(lower) ||
        f.id?.toLowerCase().includes(lower),
    );
  }, [
    allCampaignFacilities,
    fromFacility,
    toSearchText,
    fromFacilityLevel,
    getFacilityLevel,
    fromFacilityBoundary,
    facilityToProjects,
    projectBoundaryMap,
    boundaryAncestorMap,
  ]);

  // Commodities available for dropdown: exclude already added items
  const availableCommodities = useMemo(() => {
    const addedIds = new Set(
      shipmentItems.map((item) => item.productVariantId),
    );
    return productVariants.filter((pv) => !addedIds.has(pv.productVariantId));
  }, [productVariants, shipmentItems]);

  // Validate and add commodity to shipment list
  const handleAddCommodity = useCallback(() => {
    const newErrors = {};
    if (!selectedCommodity) {
      newErrors.commodity = t(COMMODITY_KEYS.HCM_PLEASE_SELECT_COMMODITY);
    }
    const qty = parseInt(quantity, 10);
    if (!qty || qty <= 0) {
      newErrors.quantity = t(COMMODITY_KEYS.HCM_QUANTITY_MUST_BE_POSITIVE);
    }
    if (selectedCommodity && qty > 0) {
      const available = warehouseStock[selectedCommodity.productVariantId] || 0;
      if (qty > available) {
        newErrors.quantity = `${t(
          COMMODITY_KEYS.HCM_QUANTITY_EXCEEDS_STOCK,
        )} (${available})`;
      }
    }
    if (Object.keys(newErrors).length) {
      setErrors((prev) => ({ ...prev, ...newErrors }));
      return;
    }

    setShipmentItems((prev) => [
      ...prev,
      {
        productVariantId: selectedCommodity.productVariantId,
        name: selectedCommodity.name || selectedCommodity.productVariantId,
        quantity: qty,
      },
    ]);
    setSelectedCommodity(null);
    setQuantity("");
    setErrors((prev) => ({ ...prev, commodity: null, quantity: null }));
  }, [selectedCommodity, quantity, warehouseStock, t]);

  // Remove commodity from shipment list
  const handleRemoveItem = useCallback((index) => {
    setShipmentItems((prev) => prev.filter((_, i) => i !== index));
  }, []);
  useEffect(() => {
  if (defaultCommodityId && productVariants.length) {
    const found = productVariants.find(
      (p) => p.productVariantId === defaultCommodityId
    );
    if (found) {
      setSelectedCommodity(found);
    }
  }
}, [defaultCommodityId, productVariants]);

  // Validate and submit shipment
  const handleShip = useCallback(async () => {
    const newErrors = {};
    if (!toFacility) {
      newErrors.to = t(COMMODITY_KEYS.HCM_DESTINATION_REQUIRED);
    }

    // Auto-add current selection if user filled commodity + quantity but didn't click "Add"
    let effectiveItems = shipmentItems;
    if (selectedCommodity && quantity) {
      const qty = parseInt(quantity, 10);
      if (qty > 0 && !shipmentItems.some((item) => item.productVariantId === selectedCommodity.productVariantId)) {
        const available = warehouseStock[selectedCommodity.productVariantId] || 0;
        if (available > 0 && qty > available) {
          newErrors.quantity = `${t(COMMODITY_KEYS.HCM_QUANTITY_EXCEEDS_STOCK)} (${available})`;
        } else {
          const autoItem = {
            productVariantId: selectedCommodity.productVariantId,
            name: selectedCommodity.name || selectedCommodity.productVariantId,
            quantity: qty,
          };
          effectiveItems = [...shipmentItems, autoItem];
          setShipmentItems(effectiveItems);
          setSelectedCommodity(null);
          setQuantity("");
        }
      }
    }

    if (!effectiveItems.length) {
      newErrors.items = t(COMMODITY_KEYS.HCM_ADD_AT_LEAST_ONE_COMMODITY);
    }
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const userInfo = Digit.UserService.getUser()?.info;
      const timestamp = Date.now();
      // Use TO facility's projectId from project-facility mapping
      const rowProjectId = facilityToProject[toFacility.id] || "";
      const resolvedRefId =
        rowProjectId || campaignData?.projectId || campaignId;

      // Resolve administrativeArea from TO facility's project boundary
      const toProjectBoundary = projectBoundaryMap[rowProjectId];
      const administrativeArea = toProjectBoundary?.boundary || "";

      // Build stock payload matching APK structure for proper ES indexing
      const stockPayload = effectiveItems.map((item) => ({
        tenantId: tenantId,
        clientReferenceId: crypto.randomUUID(),
        facilityId: toFacility.id,
        productVariantId: item.productVariantId,
        quantity: item.quantity,
        referenceId: resolvedRefId,
        referenceIdType: "PROJECT",
        transactionType: "DISPATCHED",
        transactionReason: comment || "",
        senderType: "WAREHOUSE",
        senderId: fromFacility.id,
        receiverType: "WAREHOUSE",
        receiverId: toFacility.id,
        waybillNumber: waybillNumber || "",
        dateOfEntry: timestamp,
        nonRecoverableError: false,
        isDeleted: false,
        additionalFields: {
          schema: "Stock",
          version: 1,
          fields: [
            { key: "sku", value: item.name || "" },
            { key: "stockEntryType", value: "ISSUED" },
            { key: "primaryRole", value: "SENDER" },
            { key: "secondaryRole", value: "RECEIVER" },
            { key: "status", value: "IN_TRANSIT" },
            { key: "administrativeArea", value: administrativeArea },
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
      }));

      let failedCount = 0;

      // Use bulk create endpoint (like BulkStockUpload)
      try {
        await stockMutation.mutateAsync({
          url: `/stock/v1/bulk/_create`,
          body: {
            RequestInfo: {
              apiId: "hcm",
              ver: ".01",
              ts: timestamp,
              action: "_create",
              did: "1",
              key: "1",
              authToken: Digit.UserService.getUser()?.access_token,
              tenantId: tenantId,
            },
            Stock: stockPayload,
          },
        });
      } catch (error) {
        console.error("Bulk stock create error:", error);
        failedCount = stockPayload.length;
      }

      if (failedCount > 0) {
        setShowToast({
          key: "error",
          label: t(COMMODITY_KEYS.HCM_SHIPMENT_FAILED),
        });
      } else {
        onSuccess?.();
      }
    } catch (error) {
      console.error("Shipment error:", error);
      setShowToast({
        key: "error",
        label: t(COMMODITY_KEYS.HCM_SHIPMENT_FAILED),
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [
    toFacility,
    shipmentItems,
    selectedCommodity,
    quantity,
    warehouseStock,
    tenantId,
    fromFacility,
    stockMutation,
    facilityToProject,
    projectBoundaryMap,
    campaignData,
    campaignId,
    waybillNumber,
    comment,
    t,
    onSuccess,
  ]);

  const isLoadingInitialData =
    hierarchyTypeLoading ||
    hierarchyLoading ||
    boundaryRelLoading ||
    campaignLoading ||
    projectsLoading ||
    facilityMappingLoading ||
    facilityDetailsLoading;

  return (
    <>
      <PopUp
        className="cm-shipment-popup"
        type="default"
        style={{ maxWidth: "600px" }}
        heading={t(COMMODITY_KEYS.HCM_SHIP_COMMODITY)}
        children={[]}
        customIcon={"DeliveryTruckSpeed"}
        onOverlayClick={onClose}
        onClose={onClose}
        equalWidthButtons={true}
        footerChildren={isLoadingInitialData ? [] : [
          <Button
            key="close"
            type="button"
            size="large"
            variation="secondary"
            label={t(I18N_KEYS.COMPONENTS.HCM_CANCEL)}
            onClick={onClose}
            isDisabled={isSubmitting}
          />,
          <Button
            key="ship"
            type="button"
            size="large"
            variation="primary"
            label={
              isSubmitting
                ? t(COMMODITY_KEYS.HCM_SHIPPING)
                : t(COMMODITY_KEYS.HCM_SHIP_COMMODITY)
            }
            onClick={handleShip}
            isDisabled={isSubmitting}
          />,
        ]}
      >
        {isLoadingInitialData ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem" }}>
            <Loader />
          </div>
        ) : (
        <>
        <div className="cm-shipment-field">
          <label className="cm-shipment-label">
            {t(COMMODITY_KEYS.HCM_WAYBILL_NUMBER)}
          </label>
          <TextInput
            value={waybillNumber}
            onChange={(e) => setWaybillNumber(e.target.value)}
            placeholder={t(COMMODITY_KEYS.HCM_WAYBILL_NUMBER)}
          />
        </div>
        {/* Row 2: From + To */}
        <Card type={"secondary"}>
          <div className="cm-shipment-row">

          <div className="cm-shipment-field">
            <label className="cm-shipment-label">
              {t(COMMODITY_KEYS.HCM_FROM)}
            </label>
            <TextInput
              value={fromFacility?.name || fromFacility?.id || ""}
              disabled={true}
            />
          </div>
          <div className="cm-shipment-field">
            <label className="cm-shipment-label">
              {t(COMMODITY_KEYS.HCM_TO)}{" "}
              <span style={{ color: "#B91900" }}>*</span>
            </label>
            <Dropdown
              option={filteredToFacilities}
              optionKey="name"
              selected={toFacility}
              select={(val) => {
                setToFacility(val);
                if (errors.to) setErrors((prev) => ({ ...prev, to: null }));
              }}
              placeholder={t(COMMODITY_KEYS.HCM_SEARCH_STAFF_WAREHOUSE)}
              showSearchBar={true}
              onSearchTextChange={setToSearchText}
            />
            {errors.to && <ErrorMessage message={errors.to} showIcon={true} />}
          </div>
          </div>
        </Card>

        <Card type={"secondary"}>
          <div className="cm-shipment-commodity-row-heading">{t("COMMODITY_SPECIFICATIONS")}</div>
          <div className="cm-shipment-commodity-row">
            <div className="cm-shipment-field cm-shipment-commodity-field">
              <label className="cm-shipment-label">
                {t(COMMODITY_KEYS.HCM_COMMODITY)}
              </label>
              <Dropdown
                option={availableCommodities}
                optionKey="name"
                selected={selectedCommodity}
                select={(val) => {
                  setSelectedCommodity(val);
                  if (errors.commodity)
                    setErrors((prev) => ({ ...prev, commodity: null }));
                }}
                placeholder={t(COMMODITY_KEYS.HCM_SELECT_COMMODITY)}
              />
              {errors.commodity && (
                <ErrorMessage message={errors.commodity} showIcon={true} />
              )}
            </div>
            <div className="cm-shipment-field cm-shipment-quantity-field">
              <label className="cm-shipment-label">
                {t(COMMODITY_KEYS.HCM_QUANTITY)}
              </label>
              <TextInput
                type="number"
                value={quantity}
                onChange={(e) => {
                  setQuantity(e.target.value);
                  if (errors.quantity)
                    setErrors((prev) => ({ ...prev, quantity: null }));
                }}
                placeholder="0"
                min="1"
              />
              {errors.quantity && (
                <ErrorMessage message={errors.quantity} showIcon={true} />
              )}
            </div>
            <div className="cm-shipment-add-btn-wrapper">
              <Button
                type="button"
                variation="secondary"
                label={t(COMMODITY_KEYS.HCM_ADD)}
                onClick={handleAddCommodity}
                style={{ marginTop: "20px" }}
                icon={"AddBox"}
              />
            </div>
          </div>
          {/* Added Items List */}
          {shipmentItems.length > 0 && (
            <div className="cm-shipment-items-list">
              <table className="cm-shipment-items-table">
                <thead>
                  <tr>
                    <th>{t(COMMODITY_KEYS.HCM_COMMODITY)}</th>
                    <th>{t(COMMODITY_KEYS.HCM_QUANTITY)}</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {shipmentItems.map((item, index) => (
                    <tr key={item.productVariantId}>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>
                        <Button
                          onClick={() => handleRemoveItem(index)}
                          title={t(COMMODITY_KEYS.HCM_REMOVE)}
                          icon={"Delete"}
                          label={t(COMMODITY_KEYS.HCM_REMOVE)}
                          variation={"teritiary"}
                          size={"small"}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {errors.items && (
            <ErrorMessage message={errors.items} showIcon={true} />
          )}
        </Card>

        {/* Comment */}
        <div className="cm-shipment-field cm-shipment-comment">
          <label className="cm-shipment-label">
            {t(COMMODITY_KEYS.HCM_COMMENT)}
          </label>
          <TextArea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={t(COMMODITY_KEYS.HCM_COMMENT)}
            style={{ maxWidth: "100%" }}
          />
        </div>
        </>
        )}
      </PopUp>

      {showToast && (
        <div className="cm-shipment-toast-wrapper">
          <Toast
            label={showToast.label}
            type={showToast.key === "error" ? "error" : "success"}
            isDleteBtn={true}
            onClose={() => setShowToast(null)}
            transitionTime={5000}
          />
        </div>
      )}
    </>
  );
};

export default CommodityShipmentPopup;
