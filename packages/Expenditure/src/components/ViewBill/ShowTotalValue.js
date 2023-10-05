import { BreakLine, CardSectionHeader } from "@egovernments/digit-ui-react-components";
import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";

const ShowTotalValue = ({topBreakLine, bottomBreakLine, label="", value=""}) => {
    const {t} = useTranslation();
    return (
        <>
            {topBreakLine && <BreakLine style={{margin : "0px", padding : "0px"}}/>}
            <div style={{margin: "0px", display: "flex", justifyContent:"space-between", height : "3rem"}}>
                    <CardSectionHeader>{t(label)}</CardSectionHeader>
                    <CardSectionHeader>{value}</CardSectionHeader>
            </div>
            {bottomBreakLine && <BreakLine style={{margin : "0px", padding : "0px"}}/>}
        </>
    )
}

export default ShowTotalValue;