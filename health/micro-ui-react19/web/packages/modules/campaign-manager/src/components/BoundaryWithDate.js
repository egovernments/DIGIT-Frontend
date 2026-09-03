import React, { useState, useEffect, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { LabelFieldPair, Header } from "@egovernments/digit-ui-react-components";
import { Card, FieldV1 } from "@egovernments/digit-ui-components";
import { DustbinIcon } from "./icons/DustbinIcon";
import { I18N_KEYS } from "../utils/i18nKeyConstants";

const BoundaryWithDate = ({ project, props, onSelect, dateReducerDispatch, canDelete, onDeleteCard }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  // const { t } = useTranslation();
  const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
  const today = Digit.Utils.date.getDate(Date.now());
  // newDateFormat FieldV1 fires onChange(isoString) not onChange(event); extract local YYYY-MM-DD
  const isoToLocalDate = (iso) => {
    if (!iso) return undefined;
    const dt = new Date(iso);
    return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
  };
  const [startDate, setStartDate] = useState(project?.startDate ? Digit.Utils.date.getDate(project?.startDate) : ""); // Set default start date to today
  const [endDate, setEndDate] = useState(project?.endDate ? Digit.Utils.date.getDate(project?.endDate) : ""); // Default end date
  const [cycleDates, setCycleDates] = useState(null);
  // Field-level errors per cycle ({ [cycleIndex]: { startDate: errorKey, endDate: errorKey } }).
  // This screen edits an already-configured campaign - the admin may not remember every
  // adjacent cycle's dates, so unlike the campaign-creation wizard, a bad pick here is left in
  // place with an inline error rather than being silently rejected or clearing other cycles.
  const [cycleErrors, setCycleErrors] = useState({});

  useEffect(() => {
    setStartDate(project?.startDate ? Digit.Utils.date.getDate(project?.startDate) : "");
    setEndDate(project?.endDate ? Digit.Utils.date.getDate(project?.endDate) : "");
    if (project?.additionalDetails?.projectType?.cycles?.length > 0) {
      const cycleDateData = project?.additionalDetails?.projectType?.cycles?.map((cycle) => ({
        cycleIndex: cycle.id,
        startDate: cycle.startDate ? Digit.Utils.date.getDate(cycle.startDate) : "",
        endDate: cycle?.endDate ? Digit.Utils.date.getDate(cycle.endDate) : "",
      }));
      setCycleDates(cycleDateData);
    }
  }, [project]);

  const handleDateChange = ({ date, endDate = false, cycleDate = false, cycleIndex }) => {
    if (typeof date === "undefined" || date <= today) {
      return null;
    }
    if (!endDate) {
      dateReducerDispatch({
        type: "START_DATE",
        date: date,
        item: project,
      });
    } else {
      dateReducerDispatch({
        type: "END_DATE",
        date: date,
        item: project,
      });
    }
  };

  const handleCycleDateChange = ({ date, endDate = false, cycleIndex }) => {
    if (typeof date === "undefined" || date <= today) {
      return null;
    }

    // Compare against adjacent cycles as plain "YYYY-MM-DD" strings (lexicographically
    // sortable) - same source (cycleDates) the min/max populators already read from. This
    // only computes and records an error; it does not change what gets dispatched below.
    const cycleArrayIndex = cycleDates?.findIndex((c) => c.cycleIndex === cycleIndex);
    const currentCycle = cycleArrayIndex > -1 ? cycleDates?.[cycleArrayIndex] : null;
    const previousCycle = cycleArrayIndex > 0 ? cycleDates?.[cycleArrayIndex - 1] : null;

    let errorKey = null;
    if (!endDate) {
      const previousAnchor = previousCycle?.endDate || previousCycle?.startDate;
      if (previousAnchor && date <= previousAnchor) {
        errorKey = "HCM_CYCLE_START_BEFORE_PREVIOUS_CYCLE_ERROR";
      } else if (currentCycle?.endDate && date >= currentCycle.endDate) {
        errorKey = "HCM_CYCLE_START_AFTER_OWN_END_ERROR";
      }
    } else if (currentCycle?.startDate) {
      if (date <= currentCycle.startDate) {
        errorKey = "HCM_CYCLE_END_BEFORE_OWN_START_ERROR";
      }
    } else if (previousCycle?.endDate && date <= previousCycle.endDate) {
      errorKey = "HCM_CYCLE_END_BEFORE_PREVIOUS_CYCLE_ERROR";
    }

    setCycleErrors((prev) => ({
      ...prev,
      [cycleIndex]: { ...prev?.[cycleIndex], [endDate ? "endDate" : "startDate"]: errorKey },
    }));

    if (!endDate) {
      dateReducerDispatch({
        type: "CYCLE_START_DATE",
        date: date,
        item: project,
        cycleIndex: cycleIndex,
        cycles: project?.additionalDetails?.projectType?.cycles,
      });
    } else {
      dateReducerDispatch({
        type: "CYCLE_END_DATE",
        date: date,
        item: project,
        cycleIndex: cycleIndex,
        cycles: project?.additionalDetails?.projectType?.cycles,
      });
    }
  };

  return (
    <Card className={"boundary-with-container"}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Header className="header">{t(`${project?.address?.boundary}`)}</Header>
        {canDelete && (
          <div className="delete-resource-icon" onClick={onDeleteCard}>
            <DustbinIcon />
          </div>
        )}
      </div>
      <LabelFieldPair style={{ display: "grid", gridTemplateColumns: "13rem 2fr", alignItems: "start", gap: "1rem" }}>
        <div className="campaign-dates">
          <p>{t(I18N_KEYS.CAMPAIGN_CREATE.HCM_CAMPAIGN_DATES)}</p>
          <span className="mandatory-date">*</span>
        </div>
        <div className="date-field-container">
          <FieldV1
            withoutLabel={true}
            type="date"
            value={startDate}
            nonEditable={startDate?.length > 0 && today >= startDate ? true : false}
            placeholder={t(I18N_KEYS.COMMON.HCM_START_DATE)}
            populators={
              today >= startDate
                ? { newDateFormat: true }
                : {
                    newDateFormat: true,
                    min: Digit.Utils.date.getDate(Date.now() + ONE_DAY_IN_MS),
                  }
            }
            onChange={(d) => {
              handleDateChange({
                date: isoToLocalDate(d),
              });
            }}
          />
          <FieldV1
            withoutLabel={true}
            type="date"
            value={endDate}
            nonEditable={endDate?.length > 0 && today >= endDate ? true : false}
            placeholder={t(I18N_KEYS.COMMON.HCM_END_DATE)}
            populators={{
              newDateFormat: true,
              min:
                startDate >= today
                  ? Digit.Utils.date.getDate(new Date(startDate).getTime() + 2 * ONE_DAY_IN_MS)
                  : Digit.Utils.date.getDate(Date.now() + 2 * ONE_DAY_IN_MS),
            }}
            onChange={(d) => {
              handleDateChange({
                date: isoToLocalDate(d),
                endDate: true,
              });
            }}
          />
        </div>
      </LabelFieldPair>
      {cycleDates?.length > 0 && (
        <Card className={"cycle-date-container"}>
          {cycleDates?.map((item, index) => (
            <LabelFieldPair style={{ display: "grid", gridTemplateColumns: "13rem 2fr", alignItems: "start" }}>
              <div className="campaign-dates">
                <p>{`${t(I18N_KEYS.COMPONENTS.CYCLE)} ${item?.cycleIndex}`}</p>
                <span className="mandatory-date">*</span>
              </div>
              <div className="date-field-container">
                <FieldV1
                  withoutLabel={true}
                  type="date"
                  nonEditable={item?.startDate?.length > 0 && today >= item?.startDate ? true : false}
                  value={item?.startDate}
                  placeholder={t(I18N_KEYS.COMMON.HCM_START_DATE)}
                  error={cycleErrors?.[item?.cycleIndex]?.startDate ? t(cycleErrors[item.cycleIndex].startDate) : ""}
                  populators={{
                    newDateFormat: true,
                    min:
                      index > 0 && !isNaN(new Date(cycleDates?.find((j) => j.cycleIndex == index)?.endDate)?.getTime())
                        ? new Date(new Date(cycleDates?.find((j) => j.cycleIndex == index)?.endDate)?.getTime() + ONE_DAY_IN_MS)
                            ?.toISOString()
                            ?.split("T")?.[0]
                        : today >= startDate
                        ? today
                        : startDate,
                    max: endDate,
                  }}
                  onChange={(d) => {
                    handleCycleDateChange({
                      date: isoToLocalDate(d),
                      cycleIndex: item?.cycleIndex,
                    });
                  }}
                />
                <FieldV1
                  withoutLabel={true}
                  type="date"
                  value={item?.endDate}
                  nonEditable={
                    item?.endDate?.length > 0 &&
                    today >= item?.endDate &&
                    (cycleDates?.[index + 1] ? today >= cycleDates?.[index + 1]?.startDate : true)
                      ? true
                      : false
                  }
                  placeholder={t(I18N_KEYS.COMMON.HCM_END_DATE)}
                  error={cycleErrors?.[item?.cycleIndex]?.endDate ? t(cycleErrors[item.cycleIndex].endDate) : ""}
                  populators={{
                    newDateFormat: true,
                    min: !isNaN(new Date(cycleDates?.find((j) => j.cycleIndex == index + 1)?.startDate)?.getTime())
                      ? new Date(new Date(cycleDates?.find((j) => j.cycleIndex == index + 1)?.startDate)?.getTime() + ONE_DAY_IN_MS)
                          ?.toISOString()
                          ?.split("T")?.[0]
                      : today >= startDate
                      ? today
                      : startDate,
                    max: endDate,
                  }}
                  onChange={(d) => {
                    handleCycleDateChange({
                      date: isoToLocalDate(d),
                      endDate: true,
                      cycleIndex: item?.cycleIndex,
                    });
                  }}
                />
              </div>
            </LabelFieldPair>
          ))}
        </Card>
      )}
    </Card>
  );
};

export default BoundaryWithDate;
