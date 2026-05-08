import { ActionLinks, CheckPoint } from "@egovernments/digit-ui-react-components";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import StarRated from "./StarRated";

const Resolved = ({
  action,
  nextActions,
  complaintDetails,
  ComplainMaxIdleTime = 3600000,
  rating,
  serviceRequestId,
  reopenDate,
  isCompleted,
  customChild,
}) => {
  const { t } = useTranslation();

  const buildActions = (actions) =>
    actions?.map((action, index) => {
      if (!action || action === "COMMENT") return null;
      if (action === "REOPEN" && Date?.now() - complaintDetails?.service?.auditDetails?.lastModifiedTime >= ComplainMaxIdleTime)
        return null;
      return (
        <Link key={index} to={`/${window?.contextPath}/citizen/pgr/${action.toLowerCase()}/${serviceRequestId}`}>
          <ActionLinks>{t(`CS_COMMON_${action}`)}</ActionLinks>
        </Link>
      );
    });

  if (action === "RESOLVE") {
    return (
      <CheckPoint isCompleted={isCompleted} label={t("CS_COMMON_COMPLAINT_RESOLVED")} customChild={<div>{buildActions(nextActions)}{customChild}</div>} />
    );
  } else if (action === "RATE") {
    return (
      <CheckPoint isCompleted={isCompleted} label={t("CS_COMMON_COMPLAINT_RESOLVED")} customChild={<div>{customChild}</div>} />
    );
  } else if (action === "REOPEN") {
    return <CheckPoint isCompleted={isCompleted} label={t("CS_COMMON_COMPLAINT_REOPENED")} info={reopenDate} customChild={customChild} />;
  } else {
    return (
      <CheckPoint isCompleted={isCompleted} label={t("CS_COMMON_COMPLAINT_RESOLVED")} customChild={<div>{buildActions(nextActions)}{customChild}</div>} />
    );
  }
};

export default Resolved;
