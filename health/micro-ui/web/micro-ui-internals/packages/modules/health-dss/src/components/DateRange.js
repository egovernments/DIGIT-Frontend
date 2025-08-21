import { Calender } from "@egovernments/digit-ui-react-components";
import {
  addHours,
  addMinutes,
  addMonths,
  addSeconds,
  differenceInDays,
  endOfMonth,
  endOfDay,
  endOfQuarter,
  endOfToday,
  endOfWeek,
  endOfYear,
  endOfYesterday,
  format,
  startOfMonth,
  startOfQuarter,
  startOfToday,
  startOfWeek,
  startOfYear,
  startOfYesterday,
  subSeconds,
  subYears,
} from "date-fns";
import React, { useEffect, Fragment, useMemo, useRef, useState } from "react";
import { createStaticRanges, DateRangePicker } from "react-date-range";
import { getDuration } from "../utils/getDuration";

function isEndDateFocused(focusNumber) {
  return focusNumber === 1;
}

function isStartDateFocused(focusNumber) {
  return focusNumber === 0;
}

const DateRange = ({ values, onFilterChange, t }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [focusedRange, setFocusedRange] = useState([0, 0]);
  const [selectionRange, setSelectionRange] = useState(values);
  const wrapperRef = useRef(null);
  const dateFilterSelected = JSON.parse(window.sessionStorage.getItem("Digit.DSS_FILTERS"))?.value?.dateFilterSelected;
  const isHealthCampaignDashboard = Digit.SessionStorage.get("projectSelected")?.value ? Object.keys(Digit.SessionStorage.get("projectSelected")?.value)?.length > 0 : false
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  useEffect(() => {
    if (!isModalOpen) {
      const now = new Date();
  // Get the local start of the day
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, -1);
      const startDate = selectionRange?.startDate || startOfDay?.toISOString();
      const endDate = selectionRange?.endDate || endOfDay?.toISOString();
      const interval = getDuration(startDate, startDate);
      const title = `${format(startDate, "MMM d, yyyy")} - ${format(startDate, "MMM d, yyyy")}`;
      onFilterChange({ range: { startDate, endDate, interval, title }, requestDate: { startDate, endDate, interval, title } });
    }
  }, [selectionRange, isModalOpen]);

  const staticRanges = useMemo(() => {
    return createStaticRanges([
      {
        label: t("DSS_TODAY"),
        range: () => ({
          startDate: startOfToday(new Date()),
          endDate: endOfToday(new Date()),
        }),
      },
      {
        label: t("DSS_YESTERDAY"),
        range: () => ({
          startDate: startOfYesterday(new Date()),
          endDate: subSeconds(endOfYesterday(new Date()), 1),
        }),
      },
      {
        label: t("DSS_THIS_WEEK"),
        range: () => ({
          startDate: startOfWeek(new Date()),
          endDate: endOfToday(new Date()),
        }),
      },
      {
        label: t("DSS_THIS_MONTH"),
        range: () => ({
          startDate: startOfMonth(new Date()),
          endDate: endOfToday(new Date()),
          // endDate: subSeconds(endOfMonth(new Date()), 1),
        }),
      },
      {
        label: t("DSS_THIS_QUARTER"),
        range: () => ({
          startDate: startOfQuarter(new Date()),
          endDate: subSeconds(endOfToday(new Date()), 1),
          // endDate: subSeconds(endOfQuarter(new Date()), 1),
        }),
      },
      {
        label: t("DSS_PREVIOUS_YEAR"),
        range: () => {
          if (new Date().getMonth() < 3) {
            return {
              startDate: subYears(addMonths(startOfYear(new Date()), 3), 2),
              endDate: subSeconds(subYears(addMonths(endOfYear(new Date()), 3), 2), 1),
            };
          } else {
            return {
              startDate: subYears(addMonths(startOfYear(new Date()), 3), 1),
              endDate: subSeconds(subYears(addMonths(endOfYear(new Date()), 3), 1), 1),
            };
          }
        },
      },
      {
        label: t("DSS_THIS_YEAR"),
        range: () => {
          return {
            startDate: Digit.Utils.dss.getDefaultFinacialYear().startDate,
            endDate: Digit.Utils.dss.getDefaultFinacialYear().endDate,
          };
          /*
          Removed Current financial thing
          const currDate = new Date().getMonth();
          if (currDate < 3) {
            return {
              startDate: subYears(addMonths(startOfYear(new Date()), 3), 1),
              endDate: subSeconds(subYears(addMonths(endOfYear(new Date()), 3), 1), 1),
            };
          } else {
            return {
              startDate: addMonths(startOfYear(new Date()), 3),
              endDate: subSeconds(addMonths(endOfYear(new Date()), 3), 1),
            };
          }
          */
        },
      },
    ]);
  }, []);

  const handleSelect = (ranges, e) => {
    let { range1: selection } = ranges;
    selection = { ...selection, endDate: endOfDay(selection?.endDate) };
    const { startDate, endDate, title, interval } = selection;
    if (
      staticRanges.some((range) => {
        let newRange = range.range();
        return differenceInDays(newRange.startDate, startDate) === 0 && differenceInDays(newRange.endDate, endDate) === 0;
      })
    ) {
      setSelectionRange(selection);
      setIsModalOpen(false);
    } else if (isStartDateFocused(focusedRange[1])) {
      setSelectionRange(selection);
    } else if (isEndDateFocused(focusedRange[1])) {
      setSelectionRange({ title, interval, startDate, endDate: endDate });
      setIsModalOpen(false);
    }
  };

  const handleFocusChange = (focusedRange) => {
    const [rangeIndex, rangeStep] = focusedRange;
    setFocusedRange(focusedRange);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const dssFiltersValue = JSON.parse(window.sessionStorage.getItem("Digit.DSS_FILTERS"))?.value;
  return (
    <div className="digit-date-range-label-field">
      <div className="digit-date-range-label">{t(`ES_DSS_DATE_RANGE`)}</div>
      <div className="employee-select-wrap" ref={wrapperRef}>
        <div className={`select ${dateFilterSelected!=="DSS_CUSTOM_DATE_RANGE" ? "disabled" : ""} ${isModalOpen ? "dss-input-active-border" : ""}`} style={{position: "sticky"}}>
          <input
            className={`employee-select-wrap--elipses ${dateFilterSelected!=="DSS_CUSTOM_DATE_RANGE" ? "disabled" : ""}`}
            type="text"
            value={
              values?.startDate && values?.endDate
                ? `${format(new Date(values.startDate), "MMM d, yyyy")} - ${format(new Date(values.endDate), "MMM d, yyyy")}`
                : ""
            }
            readOnly
            onClick={() => setIsModalOpen((prevState) => !prevState)}
          />
          <Calender className="cursorPointer" fill={`${dateFilterSelected==="DSS_CUSTOM_DATE_RANGE" ? "black" : "grey"}`} onClick={() => setIsModalOpen((prevState) => !prevState)} />
        </div>
        {isModalOpen && dateFilterSelected==="DSS_CUSTOM_DATE_RANGE" &&(
          <div className="digit-options-card">
            <DateRangePicker
              className="pickerShadow"
              focusedRange={focusedRange}
              ranges={[selectionRange]}
              minDate={new Date(dssFiltersValue?.filters?.campaignStartDate ?
                  Number(dssFiltersValue?.filters?.campaignStartDate) : dssFiltersValue?.range?.startDate.split("T")[0])}
              maxDate={new Date()}
              rangeColors={["#9E9E9E"]}
              onChange={handleSelect}
              onRangeFocusChange={setFocusedRange}
              retainEndDateOnFirstSelection={true}
              showSelectionPreview={true}
              staticRanges={isHealthCampaignDashboard ? [] : staticRanges}
              inputRanges={[]}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DateRange;
