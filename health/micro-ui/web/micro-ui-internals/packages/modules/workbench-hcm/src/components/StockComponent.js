import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "@egovernments/digit-ui-react-components";
import getProjectServiceUrl from "../utils/getProjectServiceUrl";
import { Loader } from "@egovernments/digit-ui-components";
import ReusableTableWrapper from "./ReusableTableWrapper";
import UserDetails from "./UserDetails";

const StockComponent = (props) => {
  const { t } = useTranslation();
  const url = getProjectServiceUrl();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const tenantId = Digit?.ULBService?.getCurrentTenantId();

  const requestCriteria = {
    url: `/stock/v1/_search`,
    changeQueryName: `${props.projectId}-stock-${page}-${pageSize}`,
    params: {
      tenantId: tenantId,
      offset: page * pageSize,
      limit: pageSize,
    },
    body: {
      Stock: {
        referenceId: props.projectId,
      },
    },
    config: {
      enabled: props.projectId ? true : false,
      select: (data) => {
        return data?.Stock?.map((stock) => {
          // Extract values from additionalFields
          const getFieldValue = (fieldKey) => {
            const field = stock?.additionalFields?.fields?.find(f => f.key === fieldKey);
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
            expireDate: getFieldValue("expireDate") !== "NA" 
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
        });
      },
    },
  };

  const { isLoading, data: stockData } = Digit.Hooks.useCustomAPIHook(requestCriteria);

  const columns = [
    { label: t("WBH_STOCK_ID"), key: "id", width: "150px" },
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
          style={{ 
            fontSize: "inherit",
            color: "inherit"
          }}
          iconSize="14px"
          tooltipPosition="top"
        />
      );
    },
  };

  const isNextDisabled = Array.isArray(stockData) ? stockData.length < pageSize : true;

  if (isLoading) {
    return <Loader page={true} variant={"PageLoader"} />;
  }

  return (
    <div className="override-card" style={{ overflow: "auto" }}>
      <Header className="works-header-view">{t("WBH_STOCK_DETAILS")}</Header>
      
      {(!stockData || stockData.length === 0) ? (
        <h1>{t("WBH_NO_STOCK_FOUND")}</h1>
      ) : (
        <ReusableTableWrapper
          data={stockData}
          columns={columns}
          isLoading={false}
          noDataMessage="WBH_NO_STOCK_FOUND"
          pagination={true}
          paginationServer={true}
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