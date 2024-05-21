import React from 'react'
import { useTranslation } from 'react-i18next'
import { CardSectionHeader } from '@egovernments/digit-ui-react-components'

const PayableAmt = ({ detail }) => {
    const { t } = useTranslation() 
    return (
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{ display: "flex", flexDirection: 'row', justifyContent: "space-between", padding: "1rem", border: "1px solid #D6D5D4", borderRadius: "5px" }}>
                <CardSectionHeader style={{ fontSize: "18px", marginRight: "1rem", marginBottom: "0px", color: "#505A5F" }}>{t("EXP_NET_PAYABLE")}</CardSectionHeader>
                <CardSectionHeader style={{ marginBottom: "0px" }}>{`₹ ${detail?.value}`}</CardSectionHeader>
            </div>
        </div>
    )
}

export default PayableAmt;