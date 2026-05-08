import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Card, CardHeader, CardLabel, Rating, CheckBox, TextArea, SubmitBar } from "@egovernments/digit-ui-react-components";
import { LOCALIZATION_KEY } from "../../../constants/Localization";
import useUpdateComplaint from "../../../hooks/useUpdateComplaint";

// React 19: Redux dispatch replaced by useUpdateComplaint mutation
const RatingAndFeedBack = () => {
  const { id } = useParams();
  const { handleSubmit } = useForm();
  const { t } = useTranslation();

  const tenantId =
    Digit.SessionStorage.get("CITIZEN.COMMON.HOME.CITY")?.code || Digit.ULBService.getCurrentTenantId();
  const updateComplaintMutation = useUpdateComplaint(tenantId);

  const [selection, setSelection] = useState([]);
  const [comment, setComment] = useState("");
  const [currentRating, setCurrentRating] = useState(0);

  const onSelect = (e) => setSelection((prev) => [...prev, e.target.value]);
  const onComments = (e) => setComment(e.target.value);
  const feedback = (e, ref, index) => setCurrentRating(index);

  const onSubmit = () => {
    const complaintDetails = Digit.SessionStorage.get(`complaint.${id}`);
    if (!complaintDetails) return;

    const payload = {
      service: {
        ...complaintDetails.service,
        rating: currentRating,
        additionalDetail: selection,
      },
      workflow: {
        action: "RATE",
        comments: comment,
        verificationDocuments: [],
      },
    };

    updateComplaintMutation.mutate(payload);
  };

  const labels = ["_SERVICES", "_RESOLUTION_TIME", "_QUALITY_OF_WORK", "_OTHERS"];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>{t(`${LOCALIZATION_KEY.CS_COMPLAINT}_RATE_HELP_TEXT`)}</CardHeader>
        <CardLabel>{t(`${LOCALIZATION_KEY.CS_COMPLAINT}_RATE_TEXT`)}</CardLabel>
        <Rating currentRating={currentRating} maxRating={5} onFeedback={(e, ref, i) => feedback(e, ref, i)} />
        <CardLabel>{t(`${LOCALIZATION_KEY.CS_FEEDBACK}_WHAT_WAS_GOOD`)}</CardLabel>
        {labels.map((label, index) => (
          <CheckBox key={index} onChange={onSelect} label={t(`${LOCALIZATION_KEY.CS_FEEDBACK}${label}`)} />
        ))}
        <CardLabel>{t(`${LOCALIZATION_KEY.CS_COMMON}_COMMENTS`)}</CardLabel>
        <TextArea name="" onChange={onComments} />
        <SubmitBar
          label={t(`${LOCALIZATION_KEY.CS_COMMON}_SUBMIT`)}
          disabled={updateComplaintMutation.isPending}
        />
      </Card>
    </form>
  );
};

export default RatingAndFeedBack;
