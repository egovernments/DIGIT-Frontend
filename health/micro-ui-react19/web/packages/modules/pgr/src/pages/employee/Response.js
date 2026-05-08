import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { Card, Banner, CardText, SubmitBar } from "@egovernments/digit-ui-react-components";

// Response state is passed via location.state from the create complaint mutation result.
const BannerPicker = ({ response }) => {
  const { t } = useTranslation();
  if (response?.serviceRequestId) {
    return (
      <Banner
        message={t("CS_COMMON_COMPLAINT_SUBMITTED")}
        complaintNumber={response.serviceRequestId}
        successful={true}
      />
    );
  }
  return <Banner message={t("CS_COMMON_COMPLAINT_NOT_SUBMITTED")} successful={false} />;
};

const Response = () => {
  const { t } = useTranslation();
  const { state: locationState } = useLocation();

  return (
    <Card>
      <BannerPicker response={locationState} />
      <CardText>{t("ES_COMMON_TRACK_COMPLAINT_TEXT")}</CardText>
      <Link to={`/${window?.contextPath}/employee`}>
        <SubmitBar label={t("CORE_COMMON_GO_TO_HOME")} />
      </Link>
    </Card>
  );
};

export default Response;
