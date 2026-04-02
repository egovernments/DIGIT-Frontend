import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Loader, Button, HeaderComponent } from "@egovernments/digit-ui-components";
import ReusableTableWrapper from "./ReusableTableWrapper";
import UserDetails from "./UserDetails";

const transformStock = (stock) => {
  const getFieldValue = (fieldKey) => {
    const field = stock?.additionalFields?.fields?.find((f) => f.key === fieldKey);
    return field?.value || "NA";
  };

  return {
    ...stock,
    productName: getFieldValue("productName"),
    variation: getFieldValue("variation"),
    materialNoteNumber: getFieldValue("materialNoteNumber"),
    distributorName: getFieldValue("distributorName"),
    batchNumber: getFieldValue("batchNumber"),
    quantitySent: getFieldValue("quantitySent"),
    quantityReceived: getFieldValue("quantityReceived"),
    expireDate:
      getFieldValue("expireDate") !== "NA"
        ? new Date(parseInt(getFieldValue("expireDate"))).toLocaleDateString()
        : "NA",
    quantity: stock?.quantity || 0,
    transactionType: stock?.transactionType || "NA",
    transactionReason: stock?.transactionReason || "NA",
    transactionDate: stock?.auditDetails?.createdTime
      ? new Date(stock.auditDetails.createdTime).toLocaleDateString()
      : "NA",
    wayBillNumber: stock?.wayBillNumber || "NA",
    senderId: stock?.senderId || "NA",
    senderType: stock?.senderType || "NA",
    receiverId: stock?.receiverId || "NA",
    receiverType: stock?.receiverType || "NA",
    createdBy: stock?.auditDetails?.createdBy || "NA",
    lastModifiedBy: stock?.auditDetails?.lastModifiedBy || "NA",
  };
};

const StockComponent = ({ allProjectIds }) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const tenantId = Digit?.ULBService?.getCurrentTenantId();

  const [selectedDate, setSelectedDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const getDateRange = (dateString) => {
    if (!dateString) return {};
    const date = new Date(dateString);
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    return {
      fromDate: startOfDay.getTime(),
      toDate: endOfDay.getTime(),
    };
  };

  const allProjectIdSet = useMemo(() => new Set(allProjectIds || []), [allProjectIds]);

  const stockSearchCriteria = useMemo(
    () => ({
      url: `/stock/v1/_search`,
      changeQueryName: `stock-${allProjectIds?.join("-")}-${selectedDate || "all"}`,
      params: {
        tenantId,
        offset: 0,
        limit: 1000,
      },
      body: {
        Stock: {
          ...getDateRange(selectedDate),
        },
      },
      config: {
        enabled: !!allProjectIds?.length,
        select: (data) => {
          const stocks = data?.Stock || [];
          return stocks
            .filter((stock) => allProjectIdSet.has(stock?.referenceId))
            .map(transformStock);
        },
      },
    }),
    [tenantId, allProjectIds, allProjectIdSet, selectedDate]
  );

  const { data: stockData, isLoading: stockLoading } = Digit.Hooks.useCustomAPIHook(stockSearchCriteria);

  const columns = [
    { label: t("WBH_STOCK_ID"), key: "id", width: "150px" },
    { label: t("WBH_PRODUCT_VARIANT"), key: "productVariantId" },
    { label: t("WBH_PRODUCT_NAME"), key: "productName" },
    { label: t("WBH_VARIATION"), key: "variation" },
    { label: t("WBH_MATERIAL_NOTE_NUMBER"), key: "materialNoteNumber" },
    { label: t("WBH_BATCH_NUMBER"), key: "batchNumber", width: "100px" },
    { label: t("WBH_QUANTITY_SENT"), key: "quantitySent", width: "100px" },
    { label: t("WBH_QUANTITY_RECEIVED"), key: "quantityReceived", width: "100px" },
    { label: t("WBH_QUANTITY"), key: "quantity", width: "100px" },
    { label: t("WBH_TRANSACTION_TYPE"), key: "transactionType" },
    { label: t("WBH_TRANSACTION_REASON"), key: "transactionReason" },
    { label: t("WBH_WAY_BILL_NUMBER"), key: "wayBillNumber" },
    { label: t("WBH_SENDER_TYPE"), key: "senderType" },
    { label: t("WBH_RECEIVER_TYPE"), key: "receiverType" },
    { label: t("HCM_ADMIN_CONSOLE_USER_ID"), key: "createdBy" },
    { label: t("WBH_EXPIRE_DATE"), key: "expireDate" },
    { label: t("WBH_TRANSACTION_DATE"), key: "transactionDate" },
    { label: t("WBH_DISTRIBUTOR_NAME"), key: "distributorName" },
  ];

  const customCellRenderer = {
    transactionType: (row) => {
      const typeColors = {
        RECEIVED: "green",
        DISPATCHED: "blue",
        RETURNED: "orange",
        DAMAGED: "red",
      };
      const color = typeColors[row.transactionType] || "black";
      return (
        <span style={{ color, fontWeight: "500" }}>
          {row.transactionType}
        </span>
      );
    },
    quantity: (row) => {
      const qty = row.quantity || 0;
      const color = qty === 0 ? "red" : qty < 100 ? "orange" : "green";
      return (
        <span style={{ color, fontWeight: "600" }}>
          {qty}
        </span>
      );
    },
    quantitySent: (row) => {
      const qty = parseInt(row.quantitySent) || 0;
      return (
        <span style={{ fontWeight: "500" }}>
          {qty}
        </span>
      );
    },
    quantityReceived: (row) => {
      const qtySent = parseInt(row.quantitySent) || 0;
      const qtyReceived = parseInt(row.quantityReceived) || 0;
      const color = qtyReceived < qtySent ? "orange" : "green";
      return (
        <span style={{ color, fontWeight: "500" }}>
          {qtyReceived}
        </span>
      );
    },
    senderType: (row) => {
      return t(`WBH_SENDER_TYPE_${row.senderType}`);
    },
    receiverType: (row) => {
      return t(`WBH_RECEIVER_TYPE_${row.receiverType}`);
    },
    createdBy: (row) => {
      const userId = row?.createdBy;
      if (!userId || userId === "NA") {
        return "NA";
      }
      return (
        <UserDetails
          uuid={userId}
          style={{ fontSize: "inherit", color: "inherit" }}
          iconSize="14px"
          tooltipPosition="top"
        />
      );
    },
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    setPage(0);
  };

  const clearDateFilter = () => {
    setSelectedDate("");
    setPage(0);
  };

  if (stockLoading) {
    return <Loader page={true} variant={"PageLoader"} />;
  }

  return (
    <div className="override-card" style={{ overflow: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
        <HeaderComponent className="works-header-view">{t("WBH_STOCK_DETAILS")}</HeaderComponent>
      </div>

      {showFilters && (
        <div
          style={{
            padding: "16px",
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
            marginBottom: "16px",
            border: "1px solid #e0e0e0",
          }}
        >
          <h4 style={{ marginBottom: "12px", color: "#333" }}>{t("FILTER_BY_DATE")}</h4>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
            <div style={{ minWidth: "250px" }}>
              <label style={{ marginBottom: "8px", color: "#555", display: "block" }}>{t("SELECT_DATE")}</label>
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                style={{
                  padding: "8px 12px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "14px",
                  width: "100%",
                  maxWidth: "200px",
                }}
              />
            </div>
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-end" }}>
              <Button
                variation="secondary"
                label={t("CLEAR_FILTER")}
                onClick={clearDateFilter}
                isDisabled={!selectedDate}
                style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem" }}
              />
              {selectedDate && (
                <span style={{ color: "#666", fontSize: "14px", alignSelf: "center" }}>
                  {t("FILTERING_BY")}: {new Date(selectedDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {!stockData || stockData.length === 0 ? (
        <h1>{t("WBH_NO_STOCK_FOUND")}</h1>
      ) : (
        <ReusableTableWrapper
          data={stockData}
          columns={columns}
          isLoading={false}
          noDataMessage="WBH_NO_STOCK_FOUND"
          pagination={true}
          manualPagination={true}
          paginationTotalRows={stockData?.length || 0}
          paginationPerPage={pageSize}
          paginationRowsPerPageOptions={[10, 20, 50, 100]}
          onChangePage={(newPage) => setPage(newPage - 1)}
          onChangeRowsPerPage={(newPerPage) => {
            setPageSize(newPerPage);
            setPage(0);
          }}
          customCellRenderer={customCellRenderer}
          className=""
          headerClassName=""
        />
      )}
    </div>
  );
};

export default StockComponent;
