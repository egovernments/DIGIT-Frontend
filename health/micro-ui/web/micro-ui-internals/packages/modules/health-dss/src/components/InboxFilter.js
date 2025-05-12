import React, { useState,useEffect } from "react";
import { LabelFieldPair, MultiSelectDropdown } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";

const InboxFilter = ({ onSelect, props: customProps, ...props }) => {
  const { t } = useTranslation();
  const [filterValues, setFilterValues] = useState({ campaignType: null, boundary: null });

  const body = {
    ProjectStaff: {
      staffId: [Digit.UserService.getUser().info.uuid],
    },
  };
  const params = {
    tenantId: Digit.ULBService.getCurrentTenantId(),
    limit: 1000,
    offset: 0,
  };
  const result = Digit.Hooks.DSS.useCampaignsInboxSearch({
    body,
    params,
    config: {},
  })?.data?.Project;

  // TODO : Need to confirm whether to show all the campaigntypes by default or get the unique campaigntypes from response and show them
  const campaignTypeOptions = [...new Map(result.map((item) => [item.name, { code: item.name, name: item.name }])).values()];
  // TODO : Need to confirm whether to show all the boundaryCodes by default or get the unique boundaryCodes from response and show them
  const boundaryTypeOptions = [
    ...new Map(result.map((item) => [item.address?.boundary, { code: item.address?.boundary, name: item.address?.boundary }])).values(),
  ];

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

  useEffect(() => {
    onSelect(customProps.name, {
      filterValues: {
        campaignType: props?.formData?.inboxFilter?.filterValues?.campaignType,
        boundary: filterValues?.boundary,
      },
    });
  }, [filterValues?.boundary]);

  useEffect(() => {
    onSelect(customProps.name, {
      filterValues: {
        campaignType: filterValues?.campaignType,
        boundary: props?.formData?.inboxFilter?.filterValues?.boundary,
      },
    });
  }, [filterValues?.campaignType]);

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
            options={campaignTypeOptions}
            selected={props?.formData?.inboxFilter?.filterValues?.campaignType?.length === 0 ? [] : filterValues["campaignType"]}
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
            options={boundaryTypeOptions}
            selected={props?.formData?.inboxFilter?.filterValues?.boundary?.length === 0 ? [] : filterValues["boundary"]}
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
