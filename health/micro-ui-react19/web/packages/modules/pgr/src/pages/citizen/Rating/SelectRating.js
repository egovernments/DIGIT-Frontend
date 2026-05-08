import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { RatingCard, CardLabelError } from "@egovernments/digit-ui-react-components";
import useUpdateComplaint from "../../../hooks/useUpdateComplaint";

// Replaces Redux dispatch(updateComplaints) with useUpdateComplaint mutation.
const SelectRating = ({ parentRoute }) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [submitError, setError] = useState(false);

  const tenantId = Digit.Utils.getMultiRootTenant?.()
    ? Digit.ULBService.getStateId()
    : Digit.SessionStorage.get("CITIZEN.COMMON.HOME.CITY")?.code || Digit.ULBService.getCurrentTenantId();

  const complaintDetails = Digit.Hooks.pgr?.useComplaintDetails?.({ tenantId, id })?.complaintDetails;
  const updateComplaintMutation = useUpdateComplaint(tenantId);

  const onSubmitRating = (data) => {
    if (!complaintDetails || !data.rating || data.rating <= 0) {
      setError(true);
      return;
    }
    const payload = {
      service: {
        ...complaintDetails.service,
        rating: data.rating,
        additionalDetail: data.CS_FEEDBACK_WHAT_WAS_GOOD?.join(","),
      },
      workflow: {
        action: "RATE",
        comments: data.comments,
        verificationDocuments: [],
      },
    };
    updateComplaintMutation.mutate(payload, {
      onSuccess: (res) => {
        navigate(`${parentRoute}/response`, {
          state: {
            action: "RATE",
            serviceRequestId: res?.ServiceWrappers?.[0]?.service?.serviceRequestId,
          },
        });
      },
    });
  };

  const config = {
    texts: {
      header: "CS_COMPLAINT_RATE_HELP_TEXT",
      submitBarLabel: "CS_COMMONS_NEXT",
    },
    inputs: [
      {
        type: "rate",
        maxRating: 5,
        label: t("CS_COMPLAINT_RATE_TEXT"),
        error: submitError ? <CardLabelError>{t("CS_FEEDBACK_ENTER_RATING_ERROR")}</CardLabelError> : null,
      },
      {
        type: "checkbox",
        label: "CS_FEEDBACK_WHAT_WAS_GOOD",
        checkLabels: [
          t("CS_FEEDBACK_SERVICES"),
          t("CS_FEEDBACK_RESOLUTION_TIME"),
          t("CS_FEEDBACK_QUALITY_OF_WORK"),
          t("CS_FEEDBACK_OTHERS"),
        ],
      },
      { type: "textarea", label: t("CS_COMMON_COMMENTS"), name: "comments" },
    ],
  };

  return <RatingCard config={config} t={t} onSelect={onSubmitRating} />;
};

export default SelectRating;
