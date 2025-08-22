import { TextBlock, TextInput, Card, Button, ButtonGroup } from "@egovernments/digit-ui-components";
import React, { useEffect, Fragment, useState, } from "react";
import { useTranslation } from "react-i18next";
import DateRangePicker from "./DateRangePicker";

/**
 * MyBillsSearch component allows users to search for bills based on bill ID and date range.
 *
 * @param {function} onSubmit - Callback function when search is executed.
 * @param {function} onClear - Callback function when the search is cleared.
 * @returns {JSX.Element} The JSX content for the search component.
 */
const MyBillsSearch = ({ onSubmit = () => { }, onClear = () => { } }) => {
    const { t } = useTranslation();

    const [billID, setBillID] = useState(null);
    const [dateRange, setDateRange] = useState({
        startDate: '',
        endDate: '',
        title: '',
    });
    // To force re-rendering of DateRangePicker
    const [key, setKey] = useState(0);

    const handleFilterChange = (data) => {
        setDateRange(data.range);
    };

    const handleSearch = (data) => {

        // Check if startDate and endDate are the same
        const isSameDateTime =
            dateRange.startDate &&
            dateRange.endDate &&
            new Date(dateRange.startDate).getTime() === new Date(dateRange.endDate).getTime();

        const finalDateRange = isSameDateTime
            ? { startDate: '', endDate: '', title: '' } // Empty dateRange if start and end are the same
            : dateRange;

        onSubmit(billID, finalDateRange);
    };

    const handleClear = () => {
        setDateRange({ startDate: '', endDate: '', title: '' });
        setBillID("");
        setKey((prevKey) => prevKey + 1);
        onClear();
    };

    return (
        <Card variant="search" style={{ marginBottom: "1.5rem" }}>
            <div style={{ width: "80%" }}>
                <TextBlock body={`${t("HCM_AM_BILL_ID")}`}></TextBlock>
                <TextInput
                    value={billID}
                    onChange={(e) => {
                        setBillID(e.target.value);
                    }}
                />
            </div>
            <div style={{ maxWidth: "100%", width: "100%" }}>
                <DateRangePicker
                    key={key} // Add key to force re-render
                    values={dateRange}
                    onFilterChange={handleFilterChange}
                    t={(key) => key} // Simple translation function
                    labelClass="custom-label"
                    title={t("HCM_AM_SELECTE_DATA_RANGE")}
                    epochStartDate={new Date().getTime()}
                    epochEndDate={new Date().getTime()}
                    disabled={false}
                />
            </div>

            <ButtonGroup
                buttonsArray={[
                    <Button variation="teritiary" label={t(`HCM_AM_CLEAR`)} type="button" onClick={handleClear} size="large" />,
                    <Button variation="primary" label={t(`HCM_AM_SEARCH`)} type="button" onClick={handleSearch} size="large" />,
                ]}
            ></ButtonGroup>


        </Card>


    );
};

export default MyBillsSearch;
