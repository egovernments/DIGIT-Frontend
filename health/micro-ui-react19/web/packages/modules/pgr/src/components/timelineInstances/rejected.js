import { ActionLinks, CheckPoint } from "@egovernments/digit-ui-react-components";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import StarRated from "./StarRated";

const Rejected = ({
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

  if (action === "REJECTED") {
    return (
      <CheckPoint isCompleted={isCompleted} label={t("CS_COMMON_COMPLAINT_REJECTED")} customChild={<div>{buildActions(nextActions)}</div>} />
    );
  } else if (action === "RATE" && rating) {
    return (
      <CheckPoint
        isCompleted={isCompleted}
        label={t("CS_COMMON_COMPLAINT_REJECTED")}
        customChild={<div>{rating ? <StarRated text={t("CS_ADDCOMPLAINT_YOU_RATED")} rating={rating} /> : null}{customChild}</div>}
      />
    );
  } else if (action === "REOPEN") {
    return <CheckPoint isCompleted={isCompleted} label={t("CS_COMMON_COMPLAINT_REOPENED")} info={reopenDate} />;
  } else {
    return (
      <CheckPoint isCompleted={isCompleted} label={t("CS_COMMON_COMPLAINT_REJECTED")} customChild={<div>{buildActions(nextActions)}</div>} />
    );
  }
};

export default Rejected;
