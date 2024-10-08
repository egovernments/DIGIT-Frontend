import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
// import { ArrowDown, Modal, ButtonSelector, Calender } from "@egovernments/digit-ui-react-components";
import ButtonSelector from "../atoms/ButtonSelector";
import { ArrowDown, Calender } from "../atoms/svgindex";
import Modal from "../hoc/Modal";
import { DateRange, createStaticRanges } from "react-date-range";
import { format, addMonths, addHours, startOfToday, endOfToday, endOfYesterday, addMinutes, addSeconds, isEqual, subYears, startOfYesterday, startOfWeek, endOfWeek, startOfYear, endOfYear, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter } from "date-fns";
import { COLOR_FILL } from "../atoms/contants";

function isEndDateFocused(focusNumber) {
    return focusNumber === 1;
}

function isStartDateFocused(focusNumber) {
    return focusNumber === 0;
}

const DateRangeNew = ({populators, values, onFilterChange, t, labelClass, label, customStyles, inputRef}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [focusedRange, setFocusedRange] = useState([0, 0]);
    const [selectionRange, setSelectionRange] = useState({
        ...values,
        startDate: typeof values?.startDate === "string" ? new Date(values?.startDate) : values?.startDate,
        endDate: typeof values?.endDate === "string" ? new Date(values?.endDate) : values?.endDate
    });
    const wrapperRef = useRef(inputRef);

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
            const title = `${format(selectionRange?.startDate, 'dd/MM/yyyy')} - ${format(selectionRange?.endDate, 'dd/MM/yyyy')}`;
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
                })
            },
            {
                label: t("DSS_YESTERDAY"),
                range: () => ({
                    startDate: startOfYesterday(new Date()),
                    endDate: endOfYesterday(new Date()),
                })
            },
            {
                label: t("DSS_THIS_WEEK"),
                range: () => ({
                    startDate: startOfWeek(new Date()),
                    endDate: endOfWeek(new Date()),
                })
            },
            {
                label: t('DSS_THIS_MONTH'),
                range: () => ({
                    startDate: startOfMonth(new Date()),
                    endDate: endOfMonth(new Date()),
                })
            },
            {
                label: t('DSS_THIS_QUARTER'),
                range: () => ({
                    startDate: startOfQuarter(new Date()),
                    endDate: endOfQuarter(new Date()),
                })
            },
            {
                label: t('DSS_PREVIOUS_YEAR'),
                range: () => ({
                    startDate: subYears(addMonths(startOfYear(new Date()), 3), 1),
                    endDate: subYears(addMonths(endOfYear(new Date()), 3), 1)
                })
            },
            {
                label: t('DSS_THIS_YEAR'),
                range: () => ({
                    startDate: addMonths(startOfYear(new Date()), 3),
                    endDate: addMonths(endOfYear(new Date()), 3)
                })
            }
        ])
    }, [])

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

    const handleSelect = (ranges) => {
        const { range1: selection } = ranges;
        const { startDate, endDate, title, duration } = selection;
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

    return (
        <>
            <div className="filter-label" style={{...customStyles}}>{label}</div>
            <div className="employee-select-wrap" ref={wrapperRef}>
                <div className="select">
                    <input className="employee-select-wrap--elipses" type="text" value={values?.title ? `${values?.title}` : ""} readOnly />
                    <Calender className="cursorPointer" onClick={() => setIsModalOpen((prevState) => !prevState)} />
                </div>
                {isModalOpen && (
                    <div className="options-card date-range" style={{ overflow: "visible", width: "unset"}}>
                        <DateRange
                            className="pickerShadow"
                            focusedRange={focusedRange}
                            ranges={[selectionRange]}
                            rangeColors={[COLOR_FILL]}
                            onChange={handleSelect}
                            onRangeFocusChange={setFocusedRange}
                            retainEndDateOnFirstSelection={true}
                            showSelectionPreview={true}
                            staticRanges={staticRanges}
                            inputRanges={[]}
                            weekStartsOn={1}
                            maxDate={populators?.maxDate}
                            minDate={populators?.minDate}
                            startDatePlaceholder={t("EVENTS_START_DATE_LABEL")}
                            endDatePlaceholder={t("EVENTS_END_DATE_LABEL")}
                        />
                    </div>
                )}
            </div>
        </>
    );
};

export default DateRangeNew;
