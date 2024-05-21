import React from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardSectionHeader, CollapseAndExpandGroups } from '@egovernments/digit-ui-react-components'
import MustorRollDetailsTable from './MustorRollDetailsTable'

const mustorRollIds = ['Muster Roll 1- ID (MSR/2022-23/08/0004) - Date (20-09-2022-27/09-2022)', 'Muster Roll 2- ID (MSR/2022-23/08/0004) - Date (20-09-2022-27/09-2022)', 'Muster Roll 3- ID (MSR/2022-23/08/0004) - Date (20-09-2022-27/09-2022)', 'Muster Roll 4- ID (MSR/2022-23/08/0004) - Date (20-09-2022-27/09-2022)']
const MustorRollDetails = ({ wrapInCard }) => {
  const { t } = useTranslation()

  return (
    <React.Fragment>
       <Card noCardStyle={!wrapInCard} style={{margin: '0px 16px'}}>
          <CardSectionHeader style={{marginBottom: '1rem'}}>{t("EXP_MUSTER_ROLL_DETAILS")}</CardSectionHeader>
          {
            mustorRollIds.map(id => {
              return (
              <CollapseAndExpandGroups key={id} groupElements={true} headerLabel="Muster Roll 1- ID (MSR/2022-23/08/0004) - Date (20-09-2022-27/09-2022)" headerValue="₹ 30,000">
                <div style={{marginTop: '16px'}}>
                  <MustorRollDetailsTable />
                </div>
              </CollapseAndExpandGroups>
            )
            })
          }
          
          <div style={{margin: "32px 0px", display: "flex", justifyContent:"space-between"}}>
              <CardSectionHeader style={{marginBottom: 0}}>{t("EXP_TOTAL_LABOUR_BILL")}</CardSectionHeader>
              <CardSectionHeader style={{marginBottom: 0}}>{`₹ ${Digit.Utils.dss.formatter(120000, 'number')}`}</CardSectionHeader>
          </div>
       </Card>
    </React.Fragment>
  )
}

export default MustorRollDetails