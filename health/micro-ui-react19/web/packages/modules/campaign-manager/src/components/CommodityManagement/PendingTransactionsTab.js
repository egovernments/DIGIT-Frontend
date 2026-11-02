import React, { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Loader, Button, Toast, PopUp, TextArea, TextInput, Dropdown } from "@egovernments/digit-ui-components";
import ReusableTableWrapper from "./ReusableTableWrapper";
import { applyGenericFilters } from "../../utils/genericFilterUtils";
import GenericChart from "./GenericChart";
import UserDetails from "./UserDetails";
import { useCommodityProject } from "./CommodityProjectContext";
import getProjectServiceUrl from "../../utils/getProjectServiceUrl";

// Codes match what the mobile app stores in discrepancyReason
const DISCREPANCY_REASONS = ["IN_TRANSIT", "STOCK_LOSS", "STOCK_DAMAGE", "OTHERS"];

// Default record filter: returns still in transit
const isPendingReturn = (stock) => stock.stockEntryType === "RETURNED" && stock.status === "IN_TRANSIT";
const getStockQuantity = (stock) => stock?.quantity || 0;

const PendingTransactionsTab = ({
  rawStockData,
  stockLoading,
  tenantId,
  campaignId,
  projectId,
  userBoundary,
  isTopLevel,
  refetchStockData,
  header = "HCM_PENDING_RETURNS",
  noDataMessage = "HCM_NO_PENDING_RETURNS",
  excelFileName = "pending_transactions",
  secondaryAction = "reject", // "reject" | "partialAccept"
  filterStock = isPendingReturn,
  getQuantity = getStockQuantity,
}) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showToast, setShowToast] = useState(null);
  const [updatingIds, setUpdatingIds] = useState(new Set());
  const [acceptPopup, setAcceptPopup] = useState(null); // { stockId }
  const [rejectPopup, setRejectPopup] = useState(null); // { stockId }
  const [rejectComment, setRejectComment] = useState("");
  const [partialPopup, setPartialPopup] = useState(null); // { stockId, sentQuantity }
  const [partialQuantity, setPartialQuantity] = useState("");
  const [partialReason, setPartialReason] = useState(null);

  // Get user's staff project from context
  const { projects: contextProjects } = useCommodityProject();
  const userStaffProjectId = useMemo(() => {
    if (!contextProjects?.length) return null;
    const match = contextProjects.find(
      (p) => p.address?.boundary === userBoundary?.boundary
    );
    return match?.id || contextProjects[0]?.id || null;
  }, [contextProjects, userBoundary]);

  // Fetch project facilities using user's staff project
  const projectFacilityCriteria = useMemo(
    () => ({
      url: `${getProjectServiceUrl()}/facility/v1/_search`,
      params: { tenantId, limit: 1500, offset: 0 },
      body: { ProjectFacility: { projectId: [userStaffProjectId] } },
      config: {
        enabled: !!userStaffProjectId && !!tenantId,
        select: (data) => {
          const ids = new Set();
          (data?.ProjectFacilities || []).forEach((pf) => {
            if (pf.facilityId) ids.add(pf.facilityId);
          });
          return ids;
        },
      },
    }),
    [tenantId, userStaffProjectId]
  );
  const { data: projectFacilityIds = new Set(), isLoading: projectFacilitiesLoading } =
    Digit.Hooks.useCustomAPIHook(projectFacilityCriteria);

  // Extract unique facility IDs and product variant IDs from stock data
  const { facilityIds, productVariantIds } = useMemo(() => {
    const stocks = rawStockData || [];
    const fIds = new Set();
    const pvIds = new Set();
    stocks.forEach((stock) => {
      if (stock.senderId) fIds.add(stock.senderId);
      if (stock.receiverId) fIds.add(stock.receiverId);
      if (stock.productVariantId) pvIds.add(stock.productVariantId);
    });
    return { facilityIds: [...fIds], productVariantIds: [...pvIds] };
  }, [rawStockData]);

  // Fetch facility details
  const facilitySearchCriteria = useMemo(
    () => ({
      url: `/facility/v1/_search`,
      params: { tenantId, limit: facilityIds.length || 10, offset: 0 },
      body: { Facility: { id: facilityIds } },
      config: {
        enabled: !!facilityIds.length && !!tenantId,
        select: (data) => {
          const nameMap = {};
          (data?.Facilities || []).forEach((f) => {
            if (f.id) nameMap[f.id] = f.name || f.id;
          });
          const nameCount = {};
          Object.values(nameMap).forEach((name) => {
            nameCount[name] = (nameCount[name] || 0) + 1;
          });
          Object.entries(nameMap).forEach(([id, name]) => {
            if (nameCount[name] > 1) {
              const shortId = id.split("-").pop();
              nameMap[id] = `${name} (${shortId})`;
            }
          });
          return nameMap;
        },
      },
    }),
    [tenantId, facilityIds]
  );
  const { data: facilityNameMap = {}, isLoading: facilitiesLoading } =
    Digit.Hooks.useCustomAPIHook(facilitySearchCriteria);

  // Fetch product variants
  const variantSearchCriteria = useMemo(
    () => ({
      url: `/product/variant/v1/_search`,
      params: { tenantId, limit: productVariantIds.length || 10, offset: 0 },
      body: { ProductVariant: { id: productVariantIds } },
      config: {
        enabled: !!productVariantIds.length && !!tenantId,
        select: (data) => data?.ProductVariant || [],
      },
    }),
    [tenantId, productVariantIds]
  );
  const { data: productVariants = [], isLoading: variantsLoading } =
    Digit.Hooks.useCustomAPIHook(variantSearchCriteria);

  // Fetch products by productIds from variants
  const productIds = useMemo(() => {
    return [...new Set(productVariants.map((v) => v.productId).filter(Boolean))];
  }, [productVariants]);
  const productSearchCriteria = useMemo(
    () => ({
      url: `/product/v1/_search`,
      params: { tenantId, limit: productIds.length || 10, offset: 0 },
      body: { Product: { id: productIds } },
      config: {
        enabled: !!productIds.length && !!tenantId,
        select: (data) => data?.Product || [],
      },
    }),
    [tenantId, productIds]
  );
  const { data: products = [], isLoading: productsLoading } =
    Digit.Hooks.useCustomAPIHook(productSearchCriteria);

  // Build product name map: variantId -> "ProductName - Variation"
  const productNameMap = useMemo(() => {
    const map = {};
    productVariants.forEach((variant) => {
      const product = products.find((p) => p.id === variant.productId);
      const name = product?.name || "";
      const variation = variant?.variation || "";
      map[variant.id] =
        name && variation
          ? `${name} - ${variation}`
          : name || variation || variant.sku || variant.id;
    });
    return map;
  }, [productVariants, products]);

  // Filter: records matching filterStock where user's facility is the receiver
  const tableData = useMemo(() => {
    if (!rawStockData?.length) return [];
    return rawStockData
      .filter((stock) => {
        if (!filterStock(stock)) return false;
        // Only show where user's facility is the receiver (original sender getting stock back)
        if (projectFacilityIds.size > 0 && !projectFacilityIds.has(stock.receiverId))
          return false;
        return true;
      })
      .map((stock) => {
        const createdTime = stock?.auditDetails?.createdTime;
        const creationDate = createdTime
          ? new Date(createdTime).toLocaleString("en-US", {
              year: "numeric",
              month: "long",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            })
          : "N/A";

        const productName =
          productNameMap[stock?.productVariantId] ||
          stock?.additionalFields?.fields?.find((f) => f.key === "productName")
            ?.value ||
          "Unknown";

        return {
          stockId: stock.id,
          trn: stock.id || "N/A",
          creationDate,
          createdTime: createdTime || 0,
          sentFrom:
            facilityNameMap[stock?.senderId] || stock?.senderId || "N/A",
          sentTo:
            facilityNameMap[stock?.receiverId] || stock?.receiverId || "N/A",
          senderId: stock?.senderId || "",
          receiverId: stock?.receiverId || "",
          nameOfUser: stock?.nameOfUser || "",
          userName: stock?.userName || "",
          createdBy: stock?.auditDetails?.createdBy || "N/A",
          commodity: productName,
          quantity: getQuantity(stock),
        };
      })
      .sort((a, b) => (b.createdTime || 0) - (a.createdTime || 0));
  }, [rawStockData, facilityNameMap, productNameMap, projectFacilityIds, filterStock, getQuantity]);

  const filteredData = useMemo(() => {
    if (!tableData?.length) return [];
    return applyGenericFilters(tableData, { searchText: searchQuery });
  }, [tableData, searchQuery]);

  // Accept, Partially Accept or Reject a pending return transaction
  const handleAction = useCallback(
    async (stockId, action, comments, extraFields = []) => {
      if (updatingIds.has(stockId)) return;
      setUpdatingIds((prev) => new Set(prev).add(stockId));

      try {
        // Step 1: Search for the full stock object by ID
        const searchResponse = await Digit.CustomService.getResponse({
          url: `/stock/v1/_search`,
          params: { tenantId, limit: 1, offset: 0 },
          body: {
            Stock: { id: [stockId] },
          },
        });

        const stockObject = searchResponse?.Stock?.[0];
        if (!stockObject) {
          setShowToast({
            key: "error",
            label: t("HCM_STOCK_RECORD_NOT_FOUND"),
          });
          return;
        }

        // Step 2: Update the status in additionalFields from IN_TRANSIT to ACCEPTED/REJECTED
        // (a partial accept is stored as ACCEPTED plus the received quantity and discrepancy reason)
        const newStatus = action === "reject" ? "REJECTED" : "ACCEPTED";
        let updatedFields = [...(stockObject.additionalFields?.fields || [])];

        // Step 2b: Set status, comments and any extra fields in additionalFields, overwriting existing keys
        const fieldsToSet = [{ key: "status", value: newStatus }, ...extraFields];
        if (comments?.trim()) fieldsToSet.push({ key: "comments", value: comments.trim() });
        fieldsToSet.forEach(({ key, value }) => {
          if (updatedFields.some((f) => f.key === key)) {
            updatedFields = updatedFields.map((f) => (f.key === key ? { ...f, value } : f));
          } else {
            updatedFields.push({ key, value });
          }
        });

        const updatedStock = {
          ...stockObject,
          additionalFields: {
            ...stockObject.additionalFields,
            fields: updatedFields,
          },
        };

        // Step 3: Call stock update API
        await Digit.CustomService.getResponse({
          url: `/stock/v1/_update`,
          params: {},
          body: {
            Stock: updatedStock,
          },
        });

        setShowToast({
          key: "success",
          label:
            action === "accept"
              ? t("HCM_RETURN_ACCEPTED_SUCCESS")
              : action === "partialAccept"
              ? t("HCM_PARTIAL_ACCEPT_SUCCESS")
              : t("HCM_RETURN_REJECTED_SUCCESS"),
        });

        // Refetch stock data to update all tabs
        if (refetchStockData) {
          setTimeout(() => refetchStockData(), 2000);
        }
      } catch (error) {
        console.error("Stock update error:", error);
        setShowToast({
          key: "error",
          label: t("HCM_STOCK_UPDATE_FAILED"),
        });
      } finally {
        setUpdatingIds((prev) => {
          const next = new Set(prev);
          next.delete(stockId);
          return next;
        });
      }
    },
    [tenantId, t, updatingIds, refetchStockData]
  );

  // Open accept confirmation popup
  const handleAcceptClick = useCallback((stockId) => {
    setAcceptPopup({ stockId });
  }, []);

  // Confirm acceptance
  const handleAcceptConfirm = useCallback(() => {
    if (!acceptPopup?.stockId) return;
    handleAction(acceptPopup.stockId, "accept");
    setAcceptPopup(null);
  }, [acceptPopup, handleAction]);

  // Open reject popup
  const handleRejectClick = useCallback((stockId) => {
    setRejectComment("");
    setRejectPopup({ stockId });
  }, []);

  // Confirm rejection with mandatory comments
  const handleRejectConfirm = useCallback(() => {
    if (!rejectPopup?.stockId || !rejectComment.trim()) return;
    handleAction(rejectPopup.stockId, "reject", rejectComment);
    setRejectPopup(null);
    setRejectComment("");
  }, [rejectPopup, rejectComment, handleAction]);

  // Open partial accept popup
  const handlePartialAcceptClick = useCallback((row) => {
    setPartialQuantity("");
    setPartialReason(null);
    setPartialPopup({ stockId: row.stockId, sentQuantity: Number(row.quantity) || 0 });
  }, []);

  const closePartialPopup = useCallback(() => {
    setPartialPopup(null);
    setPartialQuantity("");
    setPartialReason(null);
  }, []);

  // Received quantity must be a whole number below the quantity sent (equal means a full accept)
  const isPartialQuantityValid =
    /^\d+$/.test(partialQuantity) && Number(partialQuantity) < (partialPopup?.sentQuantity || 0);

  const changePartialQuantity = (delta) => {
    const current = /^\d+$/.test(partialQuantity) ? Number(partialQuantity) : 0;
    const max = Math.max((partialPopup?.sentQuantity || 0) - 1, 0);
    setPartialQuantity(String(Math.min(Math.max(current + delta, 0), max)));
  };

  // Confirm partial acceptance with received quantity and discrepancy reason
  const handlePartialAcceptConfirm = useCallback(() => {
    if (!partialPopup?.stockId || !isPartialQuantityValid || !partialReason?.code) return;
    handleAction(partialPopup.stockId, "partialAccept", "", [
      { key: "receivedQuantity", value: partialQuantity },
      { key: "discrepancyReason", value: partialReason.code },
    ]);
    closePartialPopup();
  }, [partialPopup, isPartialQuantityValid, partialQuantity, partialReason, handleAction, closePartialPopup]);

  const columns = [
    { label: t("HCM_TRN"), key: "trn", grow: 1, minWidth: "120px", sortable: true },
    { label: t("HCM_CREATION_DATE"), key: "creationDate", grow: 1.5, minWidth: "200px", sortable: true },
    { label: t("HCM_RETURNED_BY"), key: "sentFrom", grow: 1, minWidth: "160px", sortable: true },
    { label: t("HCM_RETURN_TO"), key: "sentTo", grow: 1, minWidth: "160px", sortable: true },
    { label: t("HCM_CREATED_BY"), key: "createdBy", grow: 1, sortable: true },
    { label: t("HCM_COMMODITY"), key: "commodity", grow: 0.8, sortable: true },
    { label: t("HCM_QUANTITY"), key: "quantity", grow: 0.6, minWidth: "100px", sortable: true },
    { label: t("HCM_ACTION"), key: "action", grow: 1.5, minWidth: "240px", sortable: false },
  ];

  const customCellRenderer = {
    sentFrom: (row) => (
      <div>
        <div className="cm-cell-link">{row.sentFrom}</div>
        <div style={{ fontSize: "0.75rem", color: "#505A5F" }}>
          {row.senderId}
        </div>
      </div>
    ),
    sentTo: (row) => (
      <div>
        <div className="cm-cell-link">{row.sentTo}</div>
        <div style={{ fontSize: "0.75rem", color: "#505A5F" }}>
          {row.receiverId}
        </div>
      </div>
    ),
    quantity: (row) => (
      <span className="cm-cell-stock">{row.quantity?.toLocaleString()}</span>
    ),
    createdBy: (row) => {
      const displayName = row?.nameOfUser || "";
      const loginName = row?.userName || "";

      if (displayName || loginName) {
        return (
          <div>
            <div>{displayName || loginName}</div>
            {displayName && loginName && (
              <div style={{ fontSize: "0.75rem", color: "#505A5F" }}>{loginName}</div>
            )}
          </div>
        );
      }

      const userId = row?.createdBy;
      if (userId && userId !== "N/A") {
        return (
          <UserDetails
            uuid={userId}
            style={{ fontSize: "inherit" }}
            iconSize="14px"
            tooltipPosition="top"
            showIcon={false}
          />
        );
      }
      return "N/A";
    },
    action: (row) => {
      const isUpdating = updatingIds.has(row.stockId);
      return (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            type="button"
            variation="primary"
            label={isUpdating ? t("HCM_UPDATING") : t("HCM_ACCEPT")}
            onClick={() => handleAcceptClick(row.stockId)}
            isDisabled={isUpdating}
            size="small"
          />
          {secondaryAction === "partialAccept" ? (
            <Button
              type="button"
              variation="secondary"
              label={isUpdating ? t("HCM_UPDATING") : t("HCM_PARTIALLY_ACCEPT")}
              onClick={() => handlePartialAcceptClick(row)}
              isDisabled={isUpdating}
              size="small"
            />
          ) : (
            <Button
              type="button"
              variation="secondary"
              label={isUpdating ? t("HCM_UPDATING") : t("HCM_REJECT")}
              onClick={() => handleRejectClick(row.stockId)}
              isDisabled={isUpdating}
              size="small"
            />
          )}
        </div>
      );
    },
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const isLoading =
    stockLoading ||
    facilitiesLoading ||
    variantsLoading ||
    productsLoading ||
    projectFacilitiesLoading;

  if (isLoading) {
    return <Loader page={true} variant={"PageLoader"} />;
  }

  return (
    <div>
      <GenericChart
        header={t(header)}
        showSearch={true}
        className={"digit-stock-transactions-summary-tab"}
        subHeader={""}
        onChange={handleSearch}
      >
        <ReusableTableWrapper
          data={filteredData}
          columns={columns}
          isLoading={false}
          noDataMessage={noDataMessage}
          pagination={true}
          manualPagination={true}
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 20, 50, 100]}
          customCellRenderer={customCellRenderer}
          enableExcelDownload={false}
          excelFileName={excelFileName}
          className=""
          headerClassName=""
        />
      </GenericChart>

      {acceptPopup && (
        <PopUp
          type="alert"
          alertHeading={t("HCM_ACCEPT_RETURN")}
          alertMessage={t("HCM_CONFIRM_ACCEPT_MESSAGE")}
          children={[]}
          onClose={() => setAcceptPopup(null)}
          onOverlayClick={() => setAcceptPopup(null)}
          equalWidthButtons={true}
          footerChildren={[
            <Button
              key="cancel"
              type="button"
              size="large"
              variation="secondary"
              label={t("HCM_CANCEL")}
              onClick={() => setAcceptPopup(null)}
            />,
            <Button
              key="confirm"
              type="button"
              size="large"
              variation="primary"
              label={t("HCM_CONFIRM_ACCEPT")}
              onClick={handleAcceptConfirm}
            />,
          ]}
          style={{ maxWidth: "500px" }}
        />
      )}

      {rejectPopup && (
        <PopUp
          type="default"
          heading={t("HCM_REJECT_RETURN")}
          children={[]}
          onClose={() => {
            setRejectPopup(null);
            setRejectComment("");
          }}
          onOverlayClick={() => {
            setRejectPopup(null);
            setRejectComment("");
          }}
          equalWidthButtons={true}
          footerChildren={[
            <Button
              key="cancel"
              type="button"
              size="large"
              variation="secondary"
              label={t("HCM_CANCEL")}
              onClick={() => {
                setRejectPopup(null);
                setRejectComment("");
              }}
            />,
            <Button
              key="reject"
              type="button"
              size="large"
              variation="primary"
              label={t("HCM_CONFIRM_REJECT")}
              onClick={handleRejectConfirm}
              isDisabled={!rejectComment.trim()}
            />,
          ]}
          style={{ maxWidth: "500px" }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontWeight: 700, fontSize: "1rem" }}>
              {t("HCM_COMMENTS")} <span style={{ color: "#B91900" }}>*</span>
            </label>
            <TextArea
              value={rejectComment}
              onChange={(e) => setRejectComment(e.target.value)}
              placeholder={t("HCM_ENTER_COMMENTS")}
              style={{ maxWidth: "100%", minHeight: "100px" }}
            />
          </div>
        </PopUp>
      )}

      {partialPopup && (
        <PopUp
          type="default"
          heading={t("HCM_PARTIALLY_ACCEPT_STOCK")}
          description={t("HCM_PARTIALLY_ACCEPT_STOCK_DESC")}
          children={[]}
          onClose={closePartialPopup}
          onOverlayClick={closePartialPopup}
          equalWidthButtons={true}
          footerChildren={[
            <Button
              key="cancel"
              type="button"
              size="large"
              variation="secondary"
              label={t("HCM_CANCEL")}
              onClick={closePartialPopup}
            />,
            <Button
              key="confirm"
              type="button"
              size="large"
              variation="primary"
              label={t("HCM_CONFIRM")}
              onClick={handlePartialAcceptConfirm}
              isDisabled={!isPartialQuantityValid || !partialReason?.code}
            />,
          ]}
          style={{ maxWidth: "500px" }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontWeight: 700, fontSize: "1rem" }}>
                {t("HCM_ACTUAL_QUANTITY_RECEIVED")} <span style={{ color: "#B91900" }}>*</span>
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Button
                  type="button"
                  variation="secondary"
                  label="-"
                  onClick={() => changePartialQuantity(-1)}
                  size="medium"
                />
                <TextInput
                  type="number"
                  value={partialQuantity}
                  onChange={(e) => setPartialQuantity(e.target.value.replace(/\D/g, ""))}
                  style={{ textAlign: "center" }}
                />
                <Button
                  type="button"
                  variation="secondary"
                  label="+"
                  onClick={() => changePartialQuantity(1)}
                  size="medium"
                />
              </div>
              <span style={{ fontSize: "0.875rem", color: "#505A5F" }}>
                {t("HCM_QUANTITY_SENT")}: {partialPopup.sentQuantity.toLocaleString()}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontWeight: 700, fontSize: "1rem" }}>
                {t("HCM_DISCREPANCY_REASON")} <span style={{ color: "#B91900" }}>*</span>
              </label>
              <Dropdown
                t={t}
                option={DISCREPANCY_REASONS.map((code) => ({ code, name: t(`HCM_DISCREPANCY_REASON_${code}`) }))}
                optionKey="name"
                selected={partialReason}
                select={(selected) => setPartialReason(selected)}
                placeholder={t("ES_COMMON_SELECT")}
              />
            </div>
          </div>
        </PopUp>
      )}

      {showToast && (
        <Toast
          label={showToast?.label}
          type={showToast?.key === "error" ? "error" : "success"}
          isDleteBtn={true}
          onClose={() => setShowToast(null)}
          transitionTime={5000}
        />
      )}
    </div>
  );
};

export default PendingTransactionsTab;
