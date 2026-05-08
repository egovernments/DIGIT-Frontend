import { useTranslation } from "react-i18next";
import { FormStep, Banner } from "@egovernments/digit-ui-react-components";

// React 19: Redux replaced by data passed via props from the parent multi-step form
const GetActionMessage = ({ action }) => {
  const { t } = useTranslation();
  return action === "REOPEN" ? t("CS_COMMON_COMPLAINT_REOPENED") : t("CS_COMMON_COMPLAINT_SUBMITTED");
};

const Response = ({ config, onSelect, t, data }) => {
  const { t: tFallback } = useTranslation();
  const translate = t || tFallback;

  return (
    <FormStep config={config} onSelect={onSelect} t={translate}>
      {data?.serviceRequestId ? (
        <Banner
          message={<GetActionMessage action={data.action} />}
          complaintNumber={data.serviceRequestId}
          successful={true}
        />
      ) : (
        <Banner message={translate("CS_COMMON_COMPLAINT_NOT_SUBMITTED")} successful={false} />
      )}
    </FormStep>
  );
};

export default Response;
