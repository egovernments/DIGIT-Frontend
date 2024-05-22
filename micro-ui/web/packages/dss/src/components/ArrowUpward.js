import React from "react";
import {SVG} from "@digit-ui/digit-ui-react-components";

export function ArrowUpwardElement(marginRight, marginLeft) 
{ 
    return <SVG.ArrowUpward style={
        {
            display: "inline-block", 
            verticalAlign: "baseline", 
            marginRight: !marginRight ? "0px" : marginRight, 
            marginLeft: !marginLeft ? "0px" : marginLeft
        }
    }/>
};