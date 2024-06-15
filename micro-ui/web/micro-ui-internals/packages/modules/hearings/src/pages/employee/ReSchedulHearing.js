import React from 'react';
import { useHistory } from 'react-router-dom';
import { useState } from 'react';
import {
  FormComposerV2,
  InfoCard,
  Stepper,
  Button,
  Timeline,
  InfoButton,
  PopUp,
} from "@egovernments/digit-ui-components";
import { Dropdown } from '@egovernments/digit-ui-components';
import { CardLabel } from '@egovernments/digit-ui-react-components';

const RescheduleHearing = () => {
  const history = useHistory();
  let a = "FSM-2018-22-3-001";
  let b = "John vs Doe";
  let c = "NIA S";
  const [showpopup, setShowpopup] = useState(true);

  const handleNavigate = (path) => {
    const contextPath = window?.contextPath || ''; // Adjust as per your context path logic
    history.push(`/${contextPath}${path}`);
  };


  const children = [
    <div>Case Number:{a}</div>,
    <div>Case Name:{b}</div>,
    <div>Case Type:{c}</div>,
    <CardLabel style={{ width: "16rem", marginBottom: "0px" }}>Purpose Of Hearing</CardLabel>,
    <Dropdown
      style={{ width: "100%" }}
      option={[]}
      optionKey={"code"}
      select={(value) => {
      }}
    />
  ];

  const footerChildren = [
    <Button
      type={"button"}
      size={"large"}
      variation={"secondary"}
      label="Back"
      onClick={() => handleNavigate('/employee/hearings/view-hearing')}
    />,
    <Button
      type={"button"}
      size={"large"}
      variation={"primary"}
      label="Generate Order"
      onClick={() => handleNavigate('/employee/orders/orders-create?orderType=SCHEDULE')}
    />,
  ];


  return (

    <PopUp
      type="default"
      onClose={() => setShowpopup(false)}
      onOverlayClick={() => setShowpopup(false)}
      heading="RESCHEDULE HEARING"
      // subheading="Subheading"
      // description="description of the popup"
      showIcon={true}
      children={children}
      footerChildren={footerChildren}
    ></PopUp>
  );
};

export default RescheduleHearing;
