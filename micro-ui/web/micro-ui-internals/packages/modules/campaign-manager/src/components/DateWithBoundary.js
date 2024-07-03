import React, { useState, useEffect } from "react";
import { DatePicker, LabelFieldPair, Header } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { Button, Dropdown, ErrorMessage, FieldV1, TextInput } from "@egovernments/digit-ui-components";

const DateWithBoundary = ({ onSelect, formData, ...props }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
  const today = Digit.Utils.date.getDate(Date.now() + ONE_DAY_IN_MS);
  const [dates, setDates] = useState({
    startDate: props?.props?.sessionData?.HCM_CAMPAIGN_DATE?.campaignDates?.startDate || today,
    endDate: props?.props?.sessionData?.HCM_CAMPAIGN_DATE?.campaignDates?.endDate || today,
  });
  const [startDate, setStartDate] = useState(props?.props?.sessionData?.HCM_CAMPAIGN_DATE?.campaignDates?.startDate); // Set default start date to today
  const [endDate, setEndDate] = useState(props?.props?.sessionData?.HCM_CAMPAIGN_DATE?.campaignDates?.endDate); // Default end date
  const [executionCount, setExecutionCount] = useState(0);
  const [error, setError] = useState(null);
  const [startValidation, setStartValidation] = useState(null);

  const { isLoading, data, refetch } = Digit.Hooks.campaign.useSearchCampaign({
    tenantId: tenantId,
    filter: {
      ids: [id],
    },
    config: {
      select: (data) => {
        return data?.[0];
      },
      enabled: id ? true : false,
      staleTime: 0,
      cacheTime: 0,
    },
  });

  const { data: BOUNDARY_HIERARCHY_TYPE } = Digit.Hooks.useCustomMDMS(tenantId, "HCM-ADMIN-CONSOLE", [{ name: "hierarchyConfig" }], {
    select: (data) => {
      return data?.["HCM-ADMIN-CONSOLE"]?.hierarchyConfig?.find((item) => item.isActive)?.hierarchy;
    },
  });
  useEffect(() => {
    setDates({
      startDate: props?.props?.sessionData?.HCM_CAMPAIGN_DATE?.campaignDates?.startDate,
      endDate: props?.props?.sessionData?.HCM_CAMPAIGN_DATE?.campaignDates?.endDate,
    });
    setStartDate(props?.props?.sessionData?.HCM_CAMPAIGN_DATE?.campaignDates?.startDate);
    setEndDate(props?.props?.sessionData?.HCM_CAMPAIGN_DATE?.campaignDates?.endDate);
  }, [props?.props?.sessionData?.HCM_CAMPAIGN_DATE?.campaignDates]);

  useEffect(() => {
    if (props?.props?.isSubmitting && !endDate && !startDate) {
      setError({ startDate: "CAMPAIGN_FIELD_MANDATORY", endDate: "CAMPAIGN_FIELD_MANDATORY" });
    } else if (props?.props?.isSubmitting && !startDate) {
      setError({ startDate: "CAMPAIGN_FIELD_MANDATORY" });
    } else if (props?.props?.isSubmitting && !endDate) {
      setError({ endDate: "CAMPAIGN_FIELD_MANDATORY" });
    } else if (!props?.props?.isSubmitting) {
      setError(null);
    }
  }, [props?.props?.isSubmitting]);
  useEffect(() => {
    if (!startDate && startValidation) {
      setError({ startDate: "CAMPAIGN_START_DATE_ERROR" });
    } else if (!endDate && startValidation) {
      setError({ endDate: "CAMPAIGN_END_DATE_ERROR" });
    } else if (new Date(endDate).getTime() < new Date(startDate).getTime() && startValidation) {
      setError({ endDate: "CAMPAIGN_END_DATE_BEFORE_ERROR" });
      onSelect("campaignDates", { startDate: startDate, endDate: endDate });
    } else if (startValidation && new Date(endDate).getTime() === new Date(startDate).getTime()) {
      setError({ endDate: "CAMPAIGN_END_DATE_SAME_ERROR" });
      onSelect("campaignDates", { startDate: startDate, endDate: endDate });
    } else if (startDate || endDate) {
      setError(null);
      onSelect("campaignDates", { startDate: startDate, endDate: endDate });
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (executionCount < 5) {
      onSelect("campaignDates", { startDate: startDate, endDate: endDate });
      setExecutionCount((prevCount) => prevCount + 1);
    }
  });

  function setStart(value) {
    setStartDate(value);
  }

  function setEnd(date) {
    setEndDate(date);
  }

  const selectBoundary = () => {};
  return (
    <React.Fragment>
      <Header>{t(`HCM_CAMPAIGN_DATES_CHANGE_BOUNDARY_HEADER`)}</Header>
      <div style={{ border: "1px solid #d6d5d4", borderRadius: "4px", padding: "1rem", backgroundColor: "#FAFAFA" }}>
        <p className="dates-description">{t(`HCM_CAMPAIGN_DATES_CHANGE_BOUNDARY_SUB_TEXT`)}</p>
        <div style={{ display: "grid", gridTemplateColumns: "20rem 20rem 20rem", gap: "2rem" }}>
          <LabelFieldPair style={{ display: "grid", gridTemplateColumns: "1fr", alignItems: "start" }}>
            <div className="campaign-dates">
              <p>{t(`HCM_CAMPAIGN_SELECT_BOUNDARY_HIERARCHY`)}</p>
              <span className="mandatory-date">*</span>
            </div>
            <div className="date-field-container">
              <Dropdown
                style={{ paddingBottom: "1rem" }}
                variant={error ? "error" : ""}
                t={t}
                option={[]}
                optionKey={"code"}
                selected={null}
                select={(value) => {}}
              />
            </div>
          </LabelFieldPair>
          <LabelFieldPair style={{ display: "grid", gridTemplateColumns: "1fr", alignItems: "start" }}>
            <div className="campaign-dates">
              <p>{t(`HCM_CAMPAIGN_SELECT_BOUNDARY_HIERARCHY`)}</p>
              <span className="mandatory-date">*</span>
            </div>
            <div className="date-field-container">
              <Dropdown
                style={{ paddingBottom: "1rem" }}
                variant={error ? "error" : ""}
                t={t}
                option={[]}
                optionKey={"code"}
                selected={null}
                select={(value) => {}}
              />
            </div>
          </LabelFieldPair>
          <Button variation="primary" label={t(`CAMPAIGN_SELECT_BOUNDARY_BUTTON`)} onButtonClick={selectBoundary} />
        </div>
      </div>
    </React.Fragment>
  );
};

export default DateWithBoundary;
