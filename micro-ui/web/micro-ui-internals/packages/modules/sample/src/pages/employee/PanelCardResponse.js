import React from "react";
import { PanelCard, InfoCard, Button } from "@egovernments/digit-ui-components";

const PanelCardResponse = () => {
  const children = [
    <InfoCard
      variant={"success"}
      className={"panelcard-infocard"}
      text={"This is success"}
    />,
  ];

  const footerChildren = [
    <Button
      type={"button"}
      size={"large"}
      variation={"secondary"}
      label="Button1"
    />,
    <Button
      type={"button"}
      size={"large"}
      variation={"primary"}
      label="Button2"
    />,
  ];

  return (
    <PanelCard
      type="success"
      children={children}
      footerChildren={footerChildren}
      maxFooterButtonsAllowed={5}
      message="Success Message!"
      sortFooterButtons={true}
    />
  );
};

export default PanelCardResponse;
