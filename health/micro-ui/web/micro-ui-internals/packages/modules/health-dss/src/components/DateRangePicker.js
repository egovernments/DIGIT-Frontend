import React, { Fragment, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { DateRange } from "react-date-range";
import { format, isValid } from "date-fns";

const DateRangePicker = ({ t, config, onSelect, userType, formData, props }) => {
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

  useEffect(() => {
    setRange({
      startDate: formData.dateRange.startDate && isValid(new Date(formData.dateRange.startDate)) ? new Date(formData.dateRange.startDate) : undefined,
      endDate: formData.dateRange.endDate && isValid(new Date(formData.dateRange.endDate)) ? new Date(formData.dateRange.endDate) : undefined,
      key: "selection",
    });
  }, [formData.dateRange]);

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
    <div className="custom-daterange-wrapper" ref={ref}>
      <div className="custom-daterange-input" onClick={() => setShowPicker((prev) => !prev)}>
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
            maxDate={pastCampaigns ? maxDateForPastCampaigns : undefined}
          />
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
