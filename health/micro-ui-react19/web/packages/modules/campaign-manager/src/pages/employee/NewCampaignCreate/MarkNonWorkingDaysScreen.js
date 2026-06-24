import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { HeaderComponent, Button, Card } from "@egovernments/digit-ui-components";
import { I18N_KEYS } from "../../../utils/i18nKeyConstants";
import { CalendarIcon } from "../../../components/icons/CalendarIcon";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  getDay,
} from "date-fns";

const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const MarkNonWorkingDaysScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const campaignName = searchParams.get("campaignName");
  const campaignNumber = searchParams.get("campaignNumber");
  const tenantId = searchParams.get("tenantId") || Digit.ULBService.getCurrentTenantId();

  const [showPicker, setShowPicker] = useState(false);
  const [leftMonth, setLeftMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [selectedDates, setSelectedDates] = useState(new Set());
  const [excludeWeekends, setExcludeWeekends] = useState(false);
  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const rightMonth = addMonths(leftMonth, 1);

  const toKey = (date) => format(date, "yyyy-MM-dd");

  const toDisplayLabel = (key) => {
    const [year, month, day] = key.split("-").map(Number);
    return format(new Date(year, month - 1, day), "do MMMM yyyy");
  };

  const buildCalendarDays = (month) => {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(month), { weekStartsOn: 0 });
    const days = [];
    let cursor = start;
    while (cursor <= end) {
      days.push(new Date(cursor));
      cursor = addDays(cursor, 1);
    }
    return days;
  };

  const isWeekend = (date) => {
    const dow = getDay(date);
    return dow === 0 || dow === 6;
  };

  const toggleDate = (date, belongsToMonth) => {
    if (!belongsToMonth) return;
    if (excludeWeekends && isWeekend(date)) return;
    const key = toKey(date);
    setSelectedDates((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const removeDate = (key) => {
    setSelectedDates((prev) => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  };

  const handleExcludeWeekends = (checked) => {
    setExcludeWeekends(checked);
    if (checked) {
      // Remove any individually-selected weekend dates — they're now implicitly excluded
      setSelectedDates((prev) => {
        const next = new Set();
        for (const key of prev) {
          const [year, month, day] = key.split("-").map(Number);
          if (!isWeekend(new Date(year, month - 1, day))) {
            next.add(key);
          }
        }
        return next;
      });
    }
  };

  const renderMonth = (month, showLeft, showRight) => {
    const days = buildCalendarDays(month);
    return (
      <div className="nonwd-month">
        <div className="nonwd-month-header">
          {showLeft ? (
            <button
              className="nonwd-nav-btn"
              onClick={() => setLeftMonth((prev) => subMonths(prev, 1))}
              aria-label="Previous month"
            >
              ‹
            </button>
          ) : (
            <span className="nonwd-nav-placeholder" />
          )}
          <span className="nonwd-month-title">{format(month, "MMMM yyyy")}</span>
          {showRight ? (
            <button
              className="nonwd-nav-btn"
              onClick={() => setLeftMonth((prev) => addMonths(prev, 1))}
              aria-label="Next month"
            >
              ›
            </button>
          ) : (
            <span className="nonwd-nav-placeholder" />
          )}
        </div>
        <div className="nonwd-day-labels">
          {DAY_LABELS.map((d) => (
            <span key={d} className="nonwd-day-label">
              {d}
            </span>
          ))}
        </div>
        <div className="nonwd-days-grid">
          {days.map((day, i) => {
            const belongs = isSameMonth(day, month);
            const key = toKey(day);
            const isSelected = selectedDates.has(key);
            const wkndExcluded = belongs && excludeWeekends && isWeekend(day);
            return (
              <button
                key={i}
                className={[
                  "nonwd-day",
                  !belongs ? "nonwd-day-other" : "",
                  isSelected ? "nonwd-day-selected" : "",
                  wkndExcluded ? "nonwd-day-weekend-excluded" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => toggleDate(day, belongs)}
                tabIndex={belongs && !wkndExcluded ? 0 : -1}
                disabled={!belongs || wkndExcluded}
                type="button"
              >
                {format(day, "d")}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const handleBack = () => {
    navigate(
      `/${window.contextPath}/employee/campaign/setup-attendance?campaignName=${campaignName}&campaignNumber=${campaignNumber}&tenantId=${tenantId}`
    );
  };

  const handleConfirm = () => {
    const backLink = `/${window.contextPath}/employee/campaign/setup-attendance?campaignName=${campaignName}&campaignNumber=${campaignNumber}&tenantId=${tenantId}`;
    navigate(
      `/${window.contextPath}/employee/campaign/response?isSuccess=true&campaignName=${campaignName}&campaignNumber=${campaignNumber}&tenantId=${tenantId}`,
      {
        state: {
          message: I18N_KEYS.CAMPAIGN_CREATE.HCM_NON_WORKING_DAYS_SUCCESS_HEADING,
          text: I18N_KEYS.CAMPAIGN_CREATE.HCM_NON_WORKING_DAYS_SUCCESS_DESC,
          actionLabel: I18N_KEYS.CAMPAIGN_CREATE.HCM_BACK_TO_SETUP_ATTENDANCE,
          actionLink: backLink,
          primaryActionVariation: "primary",
          primaryActionIcon: "Undo",
          isPrimaryIconSuffix: false,
        },
      }
    );
  };

  const sortedDates = Array.from(selectedDates).sort();
  const inputSummary =
    selectedDates.size > 0
      ? `${selectedDates.size} ${selectedDates.size === 1 ? "day" : "days"} selected`
      : "";

  return (
    <div>
      <HeaderComponent className="campaign-header-style">
        {t(I18N_KEYS.CAMPAIGN_CREATE.HCM_NON_WORKING_DAYS_PAGE_HEADING)}
      </HeaderComponent>
      <p className="name-description" style={{ marginTop: "0.75rem" }}>
        {t(I18N_KEYS.CAMPAIGN_CREATE.HCM_NON_WORKING_DAYS_PAGE_DESC)}
      </p>

      <Card style={{ padding: "1.5rem", marginTop: "2rem" }}>
        <div className="nonwd-field-row">
          <span className="nonwd-field-label">
            {t(I18N_KEYS.CAMPAIGN_CREATE.HCM_SELECT_NON_WORKING_DAYS_LABEL)}
            <span style={{ color: "#c84c0e" }}>*</span>
          </span>

          <div className="nonwd-picker-wrapper" ref={pickerRef}>
            {/* Input trigger */}
            <div
              className="nonwd-input"
              onClick={() => setShowPicker((prev) => !prev)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setShowPicker((prev) => !prev)}
            >
              <span className="nonwd-input-text">{inputSummary}</span>
              <span className="nonwd-calendar-icon">
                <CalendarIcon />
              </span>
            </div>

            {/* Calendar popup — checkbox + months only */}
            {showPicker && (
              <div className="nonwd-popup">
                <label className="nonwd-exclude-weekends">
                  <input
                    type="checkbox"
                    checked={excludeWeekends}
                    onChange={(e) => handleExcludeWeekends(e.target.checked)}
                  />
                  <span>{t(I18N_KEYS.CAMPAIGN_CREATE.HCM_EXCLUDE_ALL_WEEKENDS)}</span>
                </label>

                <div className="nonwd-calendars">
                  {renderMonth(leftMonth, true, false)}
                  {renderMonth(rightMonth, false, true)}
                </div>
              </div>
            )}

            {/* Persistent selection display — always visible outside the popup */}
            {selectedDates.size > 0 && (
              <div className="nonwd-selected-footer">
                <div className="nonwd-selected-chips">
                  {sortedDates.map((d) => (
                    <span key={d} className="nonwd-chip">
                      {toDisplayLabel(d)}
                      <button
                        className="nonwd-chip-remove"
                        type="button"
                        onClick={() => removeDate(d)}
                        aria-label={`Remove ${toDisplayLabel(d)}`}
                      >
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <line x1="1" y1="1" x2="9" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          <line x1="9" y1="1" x2="1" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      <div className="nonwd-footer">
        <Button
          label={t(I18N_KEYS.CAMPAIGN_CREATE.HCM_BACK_TO_SETUP_ATTENDANCE)}
          variation="secondary"
          icon="ArrowBack"
          type="button"
          onClick={handleBack}
        />
        <Button
          label={t(I18N_KEYS.CAMPAIGN_CREATE.HCM_CONFIRM_AND_SAVE)}
          variation="primary"
          icon="CheckCircle"
          type="button"
          onClick={handleConfirm}
        />
      </div>
    </div>
  );
};

export default MarkNonWorkingDaysScreen;
