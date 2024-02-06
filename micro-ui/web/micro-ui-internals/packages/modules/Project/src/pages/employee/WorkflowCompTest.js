import React,{ Fragment,useState } from 'react'
import { WorkflowTimeline,WorkflowActions } from '@egovernments/digit-ui-react-components'

// Action
// Date and Time
// Name,Designation
// phone
//comments
//attachments
const WorkflowCompTest = (props) => {
    
  return (
      <>
          <WorkflowTimeline businessService={"estimate-approval-2"} applicationNo={undefined} tenantId={"pg.citya"} />
          <WorkflowActions 
              forcedActionPrefix={"ACTIONS"}
              ActionBarStyle={{}}
              MenuStyle={{}}
              businessService={"estimate-approval-2"} 
              applicationNo={undefined} 
              tenantId={"pg.citya"}
              saveAttendanceState={{ displaySave: false, updatePayload: [] }}
              moduleCode="Estimate"
          />
      </>
  )
}
//MR/2022-23/02/20/000457
//MR/2022-23/02/20/000460

//MR/2022-23/02/20/000461
export default WorkflowCompTest