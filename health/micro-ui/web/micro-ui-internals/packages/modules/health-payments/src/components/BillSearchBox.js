import { SubmitBar, LinkLabel, Label } from "@egovernments/digit-ui-react-components";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, Dropdown, TextBlock, TextInput, ButtonGroup, Button } from "@egovernments/digit-ui-components";

const BillSearchBox = ({ onLevelSelect }) => {
    const { t } = useTranslation();


    const onSubmit = (data, e) => {
        onLevelSelect();
    };

    const clearSearch = () => {
        onLevelSelect();
    };

    const closeToast = () => {
        setShowToast(null);
    };

    const handleFilterRefresh = () => { };

    return (
        <React.Fragment>
            <Card variant="search">
                {/*<div style={{ maxWidth: "100%", width: "100%" }}>
          <TextBlock body={t("HCM_AM_ATTENDANCE_ID")}></TextBlock>
          <TextInput type="text"></TextInput>
        </div>*/}
                <div style={{ maxWidth: "100%", width: "100%" }}>
                    <TextBlock body={`${t("HCM_AM_BILL_AGGREGATION_FOR_EMPLOYEE_MAPPED_AT")}`}></TextBlock>
                    <Dropdown
                        t={t}
                        option={[
                            { "name": "HCM_AM_DISTRICT_LEVEL", "code": 'HCM_AM_DISTRICT_LEVEL' },
                            { "name": "HCM_AM_PROVIENCE_LEVEL", "code": "HCM_AM_PROVIENCE_LEVEL" }
                        ]}
                        name={"code"}
                        optionKey={"name"}
                        select={(value) => {
                            //    handleProjectChange(value);
                        }}
                    />
                </div>

                <ButtonGroup
                    buttonsArray={[
                        <Button variation="teritiary" label={t(`HCM_AM_CLEAR`)} type="button" onClick={() => { }} size="large" />,
                        <Button variation="primary" label={t(`HCM_AM_SEARCH`)} type="button" onClick={() => { }} size="large" />,
                    ]}
                ></ButtonGroup>

                {/*showToast && <Toast 
          error={showToast.error}
          warning={showToast.warning}
          label={t(showToast.label)}
          isDleteBtn={true}
          onClose={closeToast} />
       */}
            </Card>
        </React.Fragment>
    );
};

export default BillSearchBox;
