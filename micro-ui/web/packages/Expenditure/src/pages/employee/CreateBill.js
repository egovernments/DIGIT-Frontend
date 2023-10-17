import React, {useState} from 'react'
import { useTranslation } from 'react-i18next'
import { Header, Card, BreakLine, CardSectionHeader, ActionBar, SubmitBar } from '@egovernments/digit-ui-react-components'
import AddVendorBill from '../../components/CreateBill/AddVendorBill'
import MustorRollDetails from '../../components/CreateBill/MustorRollDetails'
import CommissionDetails from '../../components/CreateBill/CommissionDetails'
import CreateBillSuccess from '../../components/CreateBill/CreateBillSuccess'
import { useLocation } from 'react-router-dom'

const CreateBill = () => {
  const { t } = useTranslation()
  const [billCreated, setbillCreated] = useState(null)
  const { state } = useLocation()
  const contractType = state?.contractType || ""

  const handleProceed = () => {
    //handle proceed when no formcomposer : Department_Work_Order
    //set true/false based on bill creation success/failure
    setbillCreated(false)
  }

  let uiTobeRendered;
  switch(contractType) {
    case 'Organisation_Work_Order':
      uiTobeRendered = (
        <Card>
          <MustorRollDetails/>
          <BreakLine />
          <AddVendorBill noBreakLine setbillCreated={setbillCreated} contractType={contractType}/>
          <BreakLine />
          <CommissionDetails/>
          <BreakLine/>
          <div style={{margin: "32px 16px", display: "flex", justifyContent:"space-between"}}>
            <CardSectionHeader style={{marginBottom: 0}}>{t("EXP_TOTAL_BILL_AMOUNT")}</CardSectionHeader>
            <CardSectionHeader style={{marginBottom: 0}}>{`₹ ${Digit.Utils.dss.formatter(360000, 'number')}`}</CardSectionHeader>
          </div>
        </Card>
      )
      break

    case 'Department_Work_Order':
      uiTobeRendered = (
        <Card>
          <MustorRollDetails/>
          <BreakLine />
          <CommissionDetails/>
          <BreakLine/>
          <div style={{margin: "32px 16px", display: "flex", justifyContent:"space-between"}}>
            <CardSectionHeader style={{marginBottom: 0}}>{t("EXP_TOTAL_BILL_AMOUNT")}</CardSectionHeader>
            <CardSectionHeader style={{marginBottom: 0}}>{`₹ ${Digit.Utils.dss.formatter(360000, 'number')}`}</CardSectionHeader>
          </div>
          <ActionBar>
            <SubmitBar onSubmit={handleProceed} label={t("CS_COMMON_PROCEED")} />
          </ActionBar>
        </Card>
      )
      break

    case 'Department_Purchase_Order':
      uiTobeRendered = (
        <Card>
          <AddVendorBill setbillCreated={setbillCreated} contractType={contractType}/>
        </Card>
      )
      break

    default:
      uiTobeRendered = null
      break

  }

  
  return (
    <React.Fragment>
      { billCreated === null ? 
        (
          <React.Fragment>
            <Header>{t("EXP_CREATE_BILL")}</Header>
            {uiTobeRendered}
          </React.Fragment>
        ) :
        <CreateBillSuccess isSuccess={billCreated}/> 
       } 
    </React.Fragment>
  )
}

export default CreateBill;