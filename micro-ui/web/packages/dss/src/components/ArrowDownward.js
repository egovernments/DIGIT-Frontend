import React from "react";
import {SVG} from "@digit-ui/digit-ui-react-components";

export function ArrowDownwardElement(marginRight, marginLeft)
{
    return <SVG.ArrowDownward style={
        {
            display: "inline-block", 
            verticalAlign: "baseline", 
            marginRight: !marginRight ? "0px" : marginRight,
            marginLeft: !marginLeft ? "0px" : marginLeft
        }
    }/>
};