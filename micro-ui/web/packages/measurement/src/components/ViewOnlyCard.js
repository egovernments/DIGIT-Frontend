import { Amount } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const ViewOnlyCard = (props) => {
  const { watch } = props;
  const { t } = useTranslation();
  // Extract the "SOR" and "NONSOR" arrays from the props
  const SOR = watch("SOR") || watch("SORtable");
  const NONSOR = watch("NONSOR") || watch("NONSORtable");

  // Calculate the sum of "amount" values in both arrays
  const totalAmount = useMemo(
    () => SOR?.reduce((acc, item) => acc + parseFloat(item?.amount), 0) + NONSOR?.reduce((acc, item) => acc + parseFloat(item?.amount), 0) || 0,
    [SOR, NONSOR]
  );

  return (
    <div className="view-only-card-container">
      <div className="view-only-card">
        <span>{t("MB_AMOUNT_TOTAL")}:</span>
        <Amount customStyle={{ textAlign: "right" }} value={totalAmount} t={t} roundOff={false}></Amount>
      </div>
    </div>
  );
};

export default ViewOnlyCard;