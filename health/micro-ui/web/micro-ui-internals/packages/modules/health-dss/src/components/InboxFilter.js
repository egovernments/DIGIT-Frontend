import React, { useState,useEffect } from "react";
import { LabelFieldPair, MultiSelectDropdown } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";

const InboxFilter = ({ onSelect, props: customProps, ...props }) => {
  const { t } = useTranslation();
  const [filterValues, setFilterValues] = useState({ campaignType: null, boundary: null });

  const handleDropdownChange = (key, value) => {
    const transformedValue = Array.isArray(value)
      ? value.map((item) => ({
          code: item?.[1]?.code,
          name: item?.[1]?.name,
        }))
      : [];
    setFilterValues((prev) => ({
      ...prev,
      [key]: transformedValue,
    }));
  };

  let options = [
    { code: "1", name: "SMC" },
    { code: "2", name: "IRS" },
    { code: "3", name: "INS" },
  ];

  let options2 = [
    { code: "1", name: "Gaza" },
    { code: "2", name: "Sofala" },
    { code: "3", name: "Nampula" },
    { code: "4", name: "Tete" },
  ];

  useEffect(() => {
    onSelect(customProps.name, {
      filterValues: filterValues,
    });

  }, [filterValues]);

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "flex-start",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <LabelFieldPair vertical>
        <div className="custom-filter-names">{t("FILTER_BY_CAMPAIGN_TYPE")}</div>
        <div style={{ width: "100%" }}>
          <MultiSelectDropdown
            options={options}
            selected={filterValues["campaignType"] || []}
            optionsKey={"name"}
            onSelect={(value) => handleDropdownChange("campaignType", value)}
            t={t}
          />
        </div>
      </LabelFieldPair>
      <LabelFieldPair vertical>
        <div className="custom-filter-names">{t("FILTER_BY_BOUNDARY")}</div>
        <div style={{ width: "100%" }}>
          <MultiSelectDropdown
            options={options2}
            selected={filterValues["boundary"] || []}
            optionsKey={"name"}
            onSelect={(value) => handleDropdownChange("boundary", value)}
            t={t}
          />
        </div>
      </LabelFieldPair>
    </div>
  );
};

export default InboxFilter;
