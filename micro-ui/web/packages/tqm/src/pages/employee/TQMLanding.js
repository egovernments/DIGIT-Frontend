import React, { Fragment } from "react";
import {
  BackButton,
  Card,
  AddNewIcon,
  InboxIcon,
  ViewReportIcon,
  CardText,
  CardHeader,
  ULBHomeCard,
  ShippingTruck,
  DashboardIcon,
  IssueIcon,
  TreatmentQualityIcon,
  VehicleLogIcon,
} from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import TQMPendingTask from "./TQMPendingTask";

const TQMLanding = () => {
  const { t } = useTranslation();
  const state = Digit.ULBService.getStateId();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  const history = useHistory();
  const module = [
    {
      name: "ES_COMMON_INBOX",
      link: `/${window?.contextPath}/employee/fsm/fstp-inbox`,
      icon: <InboxIcon/>,
    },
    {
      name: "ES_FSM_VEHICLE_LOG",
      link: `/${window?.contextPath}/employee/fsm/fstp-add-vehicle`,
      // icon: <VehicleLogIcon/>,
    },
    {
      name: "ES_TQM_TREATMENT_QUALITY",
      link: `/${window?.contextPath}/employee/tqm/home`,
      // icon: <TreatmentQualityIcon/>,
    },
    {
      name: "ES_TQM_VIEW_DASHBOARD",
      link: `/${window?.contextPath}/employee/dss/dashboard/pqm`,
      // icon: <DashboardIcon/>,
    },
  ];

  return (
    <React.Fragment>
      <VehicleLogIcon></VehicleLogIcon>
      <ULBHomeCard module={module} />
      {/* <TQMPendingTask /> */}
    </React.Fragment>
  );
};

export default TQMLanding;
