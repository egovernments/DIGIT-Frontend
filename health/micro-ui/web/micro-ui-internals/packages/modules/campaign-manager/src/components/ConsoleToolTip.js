
import React from "react";
import { InfoOutline } from "@egovernments/digit-ui-svg-components";
import { TooltipWrapper } from "@egovernments/digit-ui-components";

const ConsoleTooltip = ({toolTipContent,placement="bottom-end",iconFill="#787878"}) => {
  return (
    <span className="icon-wrapper">

    <TooltipWrapper content={toolTipContent} placement={placement} children={<InfoOutline fill={iconFill} width={"20px"} height={"20px"} />} />
    </span>
  );
};


export default ConsoleTooltip;

