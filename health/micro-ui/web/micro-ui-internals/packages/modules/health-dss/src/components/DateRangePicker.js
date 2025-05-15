import React, { Fragment, useEffect, useRef, useState } from "react";
import { DateRange } from "react-date-range";
import { format } from "date-fns";

const DateRangePicker = ({ t, config, onSelect, userType, formData, props }) => {
  const [showPicker, setShowPicker] = useState(false);
  const ref = useRef();
  const [range, setRange] = useState({
    startDate: formData.dateRange.startDate,
    endDate: formData.dateRange.endDate,
    key: "selection",
  });

  useEffect(() => {
    setRange({
      startDate: formData.dateRange?.startDate || null,
      endDate: formData.dateRange?.endDate || null,
      key: "selection",
    });
  }, [formData.dateRange]);

  const handleSelect = (ranges) => {
    const selectedRange = ranges.selection;
    setRange(selectedRange);
    onSelect(props?.name, {
      startDate: selectedRange.startDate?.getTime(),
      endDate: selectedRange.endDate?.getTime(),
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

  return (
    <div className="custom-daterange-wrapper" ref={ref}>
      <div className="custom-daterange-input" onClick={() => setShowPicker((prev) => !prev)}>
        <span>
          {range.startDate ? format(range.startDate, "dd/MM/yyyy") : "Start Date"}-{" "}
          {range.endDate ? format(range.endDate, "dd/MM/yyyy") : "End Date"}
        </span>
      </div>
      {showPicker && (
        <div className="custom-daterange-popup">
          <DateRange ranges={[range]} onChange={handleSelect} moveRangeOnFirstSelection={false} editableDateInputs={true} />
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
