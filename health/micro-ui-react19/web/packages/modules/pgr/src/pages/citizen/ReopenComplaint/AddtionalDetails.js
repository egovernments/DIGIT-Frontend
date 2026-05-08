import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardHeader, CardText, TextArea, SubmitBar } from "@egovernments/digit-ui-react-components";
import { LOCALIZATION_KEY } from "../../../constants/Localization";
import useUpdateComplaint from "../../../hooks/useUpdateComplaint";

// React 19: Redux dispatch + useSelector replaced by useUpdateComplaint mutation + navigate state
const AddtionalDetails = ({ complaintDetails, parentRoute }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();

  const tenantId =
    Digit.SessionStorage.get("CITIZEN.COMMON.HOME.CITY")?.code || Digit.ULBService.getCurrentTenantId();
  const updateComplaintMutation = useUpdateComplaint(tenantId);

  const textInput = (e) => {
    const reopenDetails = Digit.SessionStorage.get(`reopen.${id}`) || {};
    Digit.SessionStorage.set(`reopen.${id}`, { ...reopenDetails, addtionalDetail: e.target.value });
  };

  const reopenComplaint = () => {
    const reopenDetails = Digit.SessionStorage.get(`reopen.${id}`) || {};
    if (!complaintDetails) return;

    const payload = {
      service: {
        ...complaintDetails.service,
        additionalDetail: { REOPEN_REASON: reopenDetails.reason },
      },
      workflow: {
        action: "REOPEN",
        comments: reopenDetails.addtionalDetail || "",
        assignes: [],
        verificationDocuments: reopenDetails.verificationDocuments || [],
      },
    };

    updateComplaintMutation.mutate(payload, {
      onSuccess: (res) => {
        navigate(`${parentRoute}/response`, {
          state: {
            action: "REOPEN",
            serviceRequestId: res?.ServiceWrappers?.[0]?.service?.serviceRequestId,
          },
        });
      },
    });
  };

  return (
    <Card>
      <CardHeader>{t(`${LOCALIZATION_KEY.CS_ADDCOMPLAINT}_PROVIDE_ADDITIONAL_DETAILS`)}</CardHeader>
      <CardText>{t(`${LOCALIZATION_KEY.CS_ADDCOMPLAINT}_ADDITIONAL_DETAILS_TEXT`)}</CardText>
      <TextArea name="AdditionalDetails" onChange={textInput} />
      <div onClick={reopenComplaint}>
        <SubmitBar
          label={t(`${LOCALIZATION_KEY.CS_HEADER}_REOPEN_COMPLAINT`)}
          disabled={updateComplaintMutation.isPending}
        />
      </div>
    </Card>
  );
};

export default AddtionalDetails;
