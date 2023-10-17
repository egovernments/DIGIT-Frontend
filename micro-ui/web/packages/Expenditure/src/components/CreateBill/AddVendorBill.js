import React from 'react'
import { useTranslation } from 'react-i18next'
import { FormComposer, LinkLabel, Card, CardSectionHeader, BreakLine } from "@egovernments/digit-ui-react-components";
import { addVendorBillConfig } from '../../configs/addVendorBillConfig';

const AddVendorBill = (props) => {
    const { t } = useTranslation()
    const { noBreakLine, wrapInCard, contractType } = props
    const config = addVendorBillConfig(contractType);
    const onSubmit = (data) => {
        //TODO: based on API response, pass as true/false
        props.setbillCreated(true)
        //handle proceed when no formcomposer : Organisation_Work_Order, Department_Purchase_Order
    }

    const addVendorBill = () => {}

    return (
        <React.Fragment>
            <Card noCardStyle={!wrapInCard}>
                <FormComposer
                    heading={""}
                    label={config.label.submit}
                    config={config.form}
                    onSubmit={onSubmit}
                    noBoxShadow
                    cardStyle={{"padding" : 0}}
                    fieldStyle={{ fontWeight: '600' }}
                    sectionHeadStyle={{marginBottom: '1rem'}}
                    labelBold={true}
                /> 
                <LinkLabel style={{ display: "flex", marginTop: "1.5rem", marginLeft: "1rem" }} onClick={addVendorBill}>+ {t("EXP_ADD_ANOTHER_VENDOR_BILL")}</LinkLabel>
                {!noBreakLine && <BreakLine />}
                <div style={{margin: "32px 16px", display: "flex", justifyContent:"space-between"}}>
                    <CardSectionHeader style={{marginBottom: 0}}>{t("EXP_TOTAL_VENDOR_BILL")}</CardSectionHeader>
                    <CardSectionHeader style={{marginBottom: 0}}>{`₹ ${Digit.Utils.dss.formatter(120000, 'number')}`}</CardSectionHeader>
                </div>
            </Card>
        </React.Fragment>
  )
}

export default AddVendorBill