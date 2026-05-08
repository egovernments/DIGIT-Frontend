import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, DateWrap, KeyNote, CardSubHeader } from "@egovernments/digit-ui-react-components";
import { LOCALIZATION_KEY } from "../constants/Localization";

const Complaint = ({ data, path }) => {
  const { serviceCode, serviceRequestId, applicationStatus } = data;
  const navigate = useNavigate();
  const { t } = useTranslation();

  const closedStatus = ["RESOLVED", "REJECTED", "CLOSEDAFTERREJECTION", "CLOSEDAFTERRESOLUTION"];

  return (
    <Card onClick={() => navigate(`${path}/${serviceRequestId}`)}>
      <CardSubHeader>{t(`SERVICEDEFS.${serviceCode.toUpperCase()}`)}</CardSubHeader>
      <DateWrap date={Digit.DateUtils.ConvertTimestampToDate(data.auditDetails.createdTime)} />
      <KeyNote keyValue={t(`${LOCALIZATION_KEY.CS_COMMON}_COMPLAINT_NO`)} note={serviceRequestId} />
      <div className={`status-highlight ${closedStatus.includes(applicationStatus) ? "success" : ""}`}>
        <p>{(closedStatus.includes(applicationStatus) ? t("CS_COMMON_CLOSED") : t("CS_COMMON_OPEN")).toUpperCase()}</p>
      </div>
      {t(`${LOCALIZATION_KEY.CS_COMMON}_${applicationStatus}`)}
    </Card>
  );
};

export default Complaint;
