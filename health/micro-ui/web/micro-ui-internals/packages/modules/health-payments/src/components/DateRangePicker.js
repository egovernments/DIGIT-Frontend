import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Calender } from "@egovernments/digit-ui-react-components";
import { DateRange, createStaticRanges } from "react-date-range";
import { TextBlock } from "@egovernments/digit-ui-components";
import {
  format,
  addMonths,
  addHours,
  startOfToday,
  endOfToday,
  endOfYesterday,
  addMinutes,
  addSeconds,
  isEqual,
  subYears,
  startOfYesterday,
  startOfWeek,
  endOfWeek,
  startOfYear,
  endOfYear,
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
} from "date-fns";
import { TextInput } from "@egovernments/digit-ui-components";

function isEndDateFocused(focusNumber) {
  return focusNumber === 1;
}

function isStartDateFocused(focusNumber) {
  return focusNumber === 0;
}

const DateRangePicker = ({ values, onFilterChange, t, labelClass, title, epochStartDate, epochEndDate, disabled }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [focusedRange, setFocusedRange] = useState([0, 0]);
  const [initialDate, setInitialDate] = useState({ ...values });
  const [selectionRange, setSelectionRange] = useState({ ...values });
  const wrapperRef = useRef(null);

  useEffect(() => {
    setSelectionRange({
      startDate: new Date(epochStartDate),
      endDate: new Date(epochEndDate),
    });
  }, []);

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
    if (!isModalOpen && selectionRange?.startDate instanceof Date && selectionRange?.endDate instanceof Date) {
      const startDate = selectionRange?.startDate;
      const endDate = selectionRange?.endDate;
      const duration = getDuration(selectionRange?.startDate, selectionRange?.endDate);
      const title = `${format(selectionRange?.startDate, "dd/MM/yyyy")} - ${format(selectionRange?.endDate, "dd/MM/yyyy")}`;
      onFilterChange({ range: { startDate, endDate, duration, title }, requestDate: { startDate, endDate, duration, title } });
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
          endDate: endOfYesterday(new Date()),
        }),
      },
      {
        label: t("DSS_THIS_WEEK"),
        range: () => ({
          startDate: startOfWeek(new Date()),
          endDate: endOfWeek(new Date()),
        }),
      },
      {
        label: t("DSS_THIS_MONTH"),
        range: () => ({
          startDate: startOfMonth(new Date()),
          endDate: endOfMonth(new Date()),
        }),
      },
      {
        label: t("DSS_THIS_QUARTER"),
        range: () => ({
          startDate: startOfQuarter(new Date()),
          endDate: endOfQuarter(new Date()),
        }),
      },
      {
        label: t("DSS_PREVIOUS_YEAR"),
        range: () => ({
          startDate: subYears(addMonths(startOfYear(new Date()), 3), 1),
          endDate: subYears(addMonths(endOfYear(new Date()), 3), 1),
        }),
      },
      {
        label: t("DSS_THIS_YEAR"),
        range: () => ({
          startDate: addMonths(startOfYear(new Date()), 3),
          endDate: addMonths(endOfYear(new Date()), 3),
        }),
      },
    ]);
  }, []);

  const getDuration = (startDate, endDate) => {
    let noOfDays = (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24);
    if (noOfDays > 91) {
      return "month";
    }
    if (noOfDays < 90 && noOfDays >= 14) {
      return "week";
    }
    if (noOfDays <= 14) {
      return "day";
    }
  };

  const styles = {
    selectedRange: {
      backgroundColor: "#4caf50", // Green background
    },
    selectedText: {
      color: "#ffffff", // White text
    },
    hoverDay: {
      backgroundColor: "#81c784", // Light green on hover
      color: "#000000", // Black text on hover
    },
  };

  const handleSelect = (ranges) => {
    const { range1: selection } = ranges;
    const { startDate, endDate, title, duration } = selection;
    setInitialDate((prevState) => ({
      ...prevState, // Keep the previous values
      startDate: startDate, // Update only the `startDate`
    }));
    if (isStartDateFocused(focusedRange[1])) {
      setSelectionRange(selection);
    }
    if (isEndDateFocused(focusedRange[1])) {
      setSelectionRange({ title, duration, startDate, endDate: addSeconds(addMinutes(addHours(endDate, 23), 59), 59) });
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

  function formatDateRange(selectionRange) {
    const startDate = new Date(selectionRange.startDate);
    const endDate = new Date(selectionRange.endDate);

    // old code
    // const format = (date) => {
    //     const day = String(date.getDate()).padStart(2, '0');
    //     const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    //     const year = date.getFullYear();
    //     return `${day}/${month}/${year}`;
    // };

    // return `${format(startDate)}-${format(endDate)}`;
    //INFO:: dofferent format
    // const format = (date) => {
    //   return date.toLocaleDateString("en-US", {
    //     month: "short",
    //     day: "2-digit",
    //     year: "numeric",
    //   });
    // };

    const format = (date) => {
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    };

    return `${format(startDate)} - ${format(endDate)}`;
  }

  return (
    <div className="">
      <div className="row border-none date-range-pair">
        <TextBlock body={t(`${title}`)}></TextBlock>
        <div className="employee-select-wrap attendence-date-picker" style={{ marginBottom: "0" }} ref={wrapperRef}>
          <TextInput
            title={initialDate.startDate === "" ? null : formatDateRange(selectionRange)}
            type="text"
            className="cursorPointer"
            onIconSelection={() => {
              setIsModalOpen((prevState) => !prevState);
            }}
            onChange={() => {}}
            populators={{ customIcon: "DateRange" }}
            value={initialDate.startDate === "" ? null : formatDateRange(selectionRange)}
          />

          {isModalOpen && (
            <div className="options-card" style={{ overflow: "visible", width: "unset", maxWidth: "fit-content" }}>
              <DateRange
                className="pickerShadow"
                focusedRange={focusedRange}
                values={values}
                ranges={[selectionRange]}
                // rangeColors={["#fbeee8"]}
                maxDate={new Date()}
                onChange={handleSelect}
                onRangeFocusChange={setFocusedRange}
                retainEndDateOnFirstSelection={true}
                showSelectionPreview={true}
                staticRanges={staticRanges}
                inputRanges={[]}
                // dayContentRenderer={(date) => {
                //     const isSelected =
                //         date >= selectionRange.startDate && date <= selectionRange.endDate;
                //     return (
                //         <div
                //             style={{
                //                 ...styles.selectedRange,
                //                 ...(isSelected && styles.selectedText),
                //             }}
                //         >
                //             {date.getDate()}
                //         </div>
                //     );
                // }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DateRangePicker;
