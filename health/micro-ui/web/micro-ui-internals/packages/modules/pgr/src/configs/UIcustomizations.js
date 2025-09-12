import { Link, useLocation, useHistory, useParams } from "react-router-dom";
import _ from "lodash";
import React, { useState, Fragment } from "react";
import { Button as ButtonNew, Dropdown,Toast } from "@egovernments/digit-ui-components";
import { DeleteIconv2, DownloadIcon, FileIcon, Button, Card, CardSubHeader, EditIcon, ArrowForward } from "@egovernments/digit-ui-react-components";

//create functions here based on module name set in mdms(eg->SearchProjectConfig)
//how to call these -> Digit?.Customizations?.[masterName]?.[moduleName]
// these functions will act as middlewares
// var Digit = window.Digit || {};



export const UICustomizations = {
 


  PGRInboxConfig:{
    preProcess: (data, additionalDetails) => {
      console.log("PGRInboxConfig preProcess", data, additionalDetails);
      data.body.inbox.tenantId = Digit.ULBService.getCurrentTenantId();
      return data;
    },
  }

};
