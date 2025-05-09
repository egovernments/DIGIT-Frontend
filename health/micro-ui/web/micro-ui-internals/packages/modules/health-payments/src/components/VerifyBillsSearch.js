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
const VerifyBillsSearch = ({ onSubmit = () => { }, onClear = () => { } }) => {
    const { t } = useTranslation();

    const [billID, setBillID] = useState(null);
    const [billStatus, setBillStatus] = useState(null);
    const [key, setKey] = useState(0);

    // const handleFilterChange = (data) => {
    //     setDateRange(data.range);
    // };

    const handleSearch = (data) => {
        onSubmit(billID, billStatus);
    };

    const handleClear = () => {
        // setDateRange({ startDate: '', endDate: '', title: '' });
        setBillID("");
        setBillStatus("");
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
            <div style={{ width: "80%" }}>
                <TextBlock body={"STATUS"}></TextBlock>
                <TextInput
                    value={billStatus}
                    onChange={(e) => {
                        setBillStatus(e.target.value);
                    }}
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

export default VerifyBillsSearch;
