import React, { Fragment, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { DateRange } from "react-date-range";
import { format, isValid } from "date-fns";

const DateRangePicker = ({ t, config, onSelect, userType, formData, props, minDate, maxDate }) => {
  const { pathname } = useLocation();
  const pastCampaigns = pathname.includes("past-campaigns");
  const liveCampaigns = pathname.includes("live-campaigns");
  const [showPicker, setShowPicker] = useState(false);
  const ref = useRef();
  const [range, setRange] = useState({
    startDate: formData.dateRange.startDate ? new Date(formData.dateRange.startDate) : undefined,
    endDate: formData.dateRange.endDate ? new Date(formData.dateRange.endDate) : undefined,
    key: "selection",
  });

  // Use primitive timestamps as dependencies so React reliably detects date changes
  const propStartTime = formData.dateRange.startDate instanceof Date
    ? formData.dateRange.startDate.getTime()
    : (formData.dateRange.startDate || null);
  const propEndTime = formData.dateRange.endDate instanceof Date
    ? formData.dateRange.endDate.getTime()
    : (formData.dateRange.endDate || null);

  useEffect(() => {
    setRange({
      startDate: propStartTime && isValid(new Date(propStartTime)) ? new Date(propStartTime) : undefined,
      endDate: propEndTime && isValid(new Date(propEndTime)) ? new Date(propEndTime) : undefined,
      key: "selection",
    });
  }, [propStartTime, propEndTime]);

  const handleSelect = (ranges) => {
    const selectedRange = ranges.selection;
    setRange(selectedRange);
    onSelect(props?.name, {
      startDate: selectedRange?.startDate instanceof Date ? selectedRange.startDate.getTime() : undefined,
      endDate: selectedRange?.endDate instanceof Date ? selectedRange.endDate.getTime() : undefined,
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const nowEpoch = Date.now();
  const maxDateForPastCampaigns = new Date(nowEpoch - 24 * 60 * 60 * 1000);

  return (
    <div className="custom-daterange-wrapper commodity-management" ref={ref}>
      <div className="custom-daterange-input commodity-management" onClick={() => setShowPicker((prev) => !prev)}>
        <span>
          {isValid(range.startDate) ? format(range.startDate, "dd/MM/yyyy") : "Start Date"} -{" "}
          {isValid(range.endDate) ? format(range.endDate, "dd/MM/yyyy") : "End Date"}
        </span>
      </div>
      {showPicker && (
        <div className="custom-daterange-popup">
          <DateRange
            ranges={[range]}
            onChange={handleSelect}
            moveRangeOnFirstSelection={false}
            editableDateInputs={true}
            months={2}
            direction="horizontal"
            minDate={minDate || undefined}
            maxDate={pastCampaigns ? maxDateForPastCampaigns : maxDate || undefined}
          />
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
