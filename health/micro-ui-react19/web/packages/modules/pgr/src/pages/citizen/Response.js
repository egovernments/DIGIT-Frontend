import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { Card, Banner, CardText, SubmitBar } from "@egovernments/digit-ui-react-components";

// Response state (action, serviceRequestId) passed via location.state from the mutation caller.
const Response = () => {
  const { t } = useTranslation();
  const { state: locationState } = useLocation();
  const action = locationState?.action;
  const serviceRequestId = locationState?.serviceRequestId;

  const getMessage = () => {
    if (action === "REOPEN") return t("CS_COMMON_COMPLAINT_REOPENED");
    if (action === "RATE") return t("CS_COMMON_THANK_YOU");
    return t("CS_COMMON_COMPLAINT_SUBMITTED");
  };

  const getBodyText = () =>
    action === "RATE" ? t("CS_COMMON_RATING_SUBMIT_TEXT") : t("CS_COMMON_TRACK_COMPLAINT_TEXT");

  return (
    <Card>
      {serviceRequestId ? (
        <Banner message={getMessage()} complaintNumber={serviceRequestId} successful={true} />
      ) : (
        <Banner message={t("CS_COMMON_COMPLAINT_NOT_SUBMITTED")} successful={false} />
      )}
      <CardText>{getBodyText()}</CardText>
      <Link to={`/${window?.contextPath}/citizen`}>
        <SubmitBar label={t("CORE_COMMON_GO_TO_HOME")} />
      </Link>
    </Card>
  );
};

export default Response;
