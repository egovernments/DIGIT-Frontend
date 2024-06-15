import React from 'react';
import {Button} from "@egovernments/digit-ui-components";

const UpcomingHearings = (props) => {
  const userName = Digit.SessionStorage.get("User");
  const date = 'May 14';
  const day = 'Tue';
  const time = '9:30am-12:00pm';
  const hearingType = 'Admission Hearings';
  const hearingCount = 4;
  const pendingTasks = 4;
  const upcomingHearings = 2;

  return (
    <div className="container">
      <div className="header">
        Good afternoon, <span className="userName">{userName?.info?.name}</span>
      </div>
      <div className="hearingCard">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className="hearingDate">
            <div className="dateText">{date.split(' ')[0]}</div>
            <div className="dateNumber">{date.split(' ')[1]}</div>
            <div className="dayText">{day}</div>
          </div>
          <div>
            <div className="timeText">
              {time}
            </div>
            <div className="hearingType">
              {hearingType} ({hearingCount})
            </div>
          </div>
        </div>
        <Button 
  label={"View Hearing"} 
  variation={"primary"} 
  onClick={props.handleNavigate}
/>
      </div>
      <div className="pendingTasks">
        You have <strong>{pendingTasks} pending tasks</strong> for {upcomingHearings} upcoming hearings.
      </div>
    </div>
  );
}

export default UpcomingHearings;
