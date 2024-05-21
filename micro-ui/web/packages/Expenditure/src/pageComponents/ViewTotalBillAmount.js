import { CardSectionHeader } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

const TotalBillAmountView = ({ detail, ...props }) => {
  const { t } = useTranslation();
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "2rem", ...detail?.containerStyles }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          padding: "1rem",
          border: "1px solid #D6D5D4",
          borderRadius: "5px",
        }}
      >
        <CardSectionHeader style={{ marginRight: "1rem", marginBottom: "0px", color: "#505A5F" }}>
          {detail?.key ? t(detail.key) : t("RT_TOTAL")}
        </CardSectionHeader>
        <CardSectionHeader style={{ marginBottom: "0px" }}>{`₹ ${detail?.value}`}</CardSectionHeader>
      </div>
    </div>
  );
};

export default TotalBillAmountView;