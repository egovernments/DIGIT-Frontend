import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, Banner, CardText, SubmitBar } from "@egovernments/digit-ui-react-components";
import { Link } from "react-router-dom";

// React 19: Redux replaced by useLocation().state passed from Create/index.js navigate call
const GetActionMessage = ({ action }) => {
  const { t } = useTranslation();
  switch (action) {
    case "REOPEN":
      return t("CS_COMMON_COMPLAINT_REOPENED");
    case "RATE":
      return t("CS_COMMON_THANK_YOU");
    default:
      return t("CS_COMMON_COMPLAINT_SUBMITTED");
  }
};

const Response = () => {
  const { t } = useTranslation();
  const { state } = useLocation();
  const { action, serviceRequestId, successful = true } = state || {};

  return (
    <Card>
      {serviceRequestId ? (
        <Banner
          message={<GetActionMessage action={action} />}
          complaintNumber={serviceRequestId}
          successful={successful}
        />
      ) : (
        <Banner message={t("CS_COMMON_COMPLAINT_NOT_SUBMITTED")} successful={false} />
      )}
      <CardText>{t("CS_COMMON_TRACK_COMPLAINT_TEXT")}</CardText>
      <Link to={`/${window?.contextPath}/citizen`}>
        <SubmitBar label={t("CORE_COMMON_GO_TO_HOME")} />
      </Link>
    </Card>
  );
};

export default Response;
