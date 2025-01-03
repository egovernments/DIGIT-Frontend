import { LabelFieldPair, CardLabel, SubmitBar, LinkLabel, TextBlock, TextInput, Card, Button, ButtonGroup } from "@egovernments/digit-ui-components";
import React, { useEffect, Fragment, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useMyContext } from "../utils/context";
import { Dropdown, MultiSelectDropdown } from "@egovernments/digit-ui-components";
import DateRangePicker from "./DateRangePicker";

const MyBillsSearch = ({ onSubmit = () => { }, onClear = () => { } }) => {
    const { t } = useTranslation();

    const [dateRange, setDateRange] = useState({
        startDate: new Date(),
        endDate: new Date(),
        title: '',
    });

    const handleFilterChange = (data) => {
        setDateRange(data.range);
    };


    return (
        <Card variant="search" style={{ marginBottom: "1.5rem" }}>
            <div style={{ width: "80%" }}>
                <TextBlock body={`${t("HCM_AM_BILL_ID")} *`}></TextBlock>
                <TextInput
                />
            </div>
            <div style={{ maxWidth: "100%", width: "100%" }}>
                <DateRangePicker
                    values={dateRange}
                    onFilterChange={handleFilterChange}
                    t={(key) => key} // Simple translation function
                    labelClass="custom-label"
                    title="Select Date Range"
                    epochStartDate={new Date().getTime()}
                    epochEndDate={new Date().getTime()}
                    disabled={false}
                />
            </div>

            <ButtonGroup
                buttonsArray={[
                    <Button variation="teritiary" label={t(`HCM_AM_CLEAR`)} type="button" onClick={() => { }} size="large" />,
                    <Button variation="primary" label={t(`HCM_AM_SEARCH`)} type="button" onClick={() => { }} size="large" />,
                ]}
            ></ButtonGroup>


        </Card>


    );
};

export default MyBillsSearch;
