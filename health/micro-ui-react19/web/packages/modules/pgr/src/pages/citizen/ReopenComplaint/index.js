import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FormStep, TextArea, CardLabel, Dropdown } from "@egovernments/digit-ui-react-components";
import useUpdateComplaint from "../../../hooks/useUpdateComplaint";

const ReopenComplaint = ({ parentRoute }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state: locationState } = useLocation();
  const complaintId = locationState?.id;

  const tenantId =
    Digit.SessionStorage.get("CITIZEN.COMMON.HOME.CITY")?.code || Digit.ULBService.getCurrentTenantId();
  const updateComplaintMutation = useUpdateComplaint(tenantId);

  const { complaintDetails } = Digit.Hooks.pgr?.useComplaintDetails?.({ tenantId, id: complaintId }) || {};

  const reopenReasons = [
    t("CS_REOPEN_OPTION_ONE"),
    t("CS_REOPEN_OPTION_TWO"),
    t("CS_REOPEN_OPTION_THREE"),
    t("CS_REOPEN_OPTION_FOUR"),
  ];

  const [selectedReason, setSelectedReason] = useState(null);
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);

  const onSubmit = () => {
    if (!complaintDetails || !selectedReason) return;
    const payload = {
      service: complaintDetails.service,
      workflow: {
        action: "REOPEN",
        comments: `${selectedReason} ${additionalDetails}`.trim(),
        documents: uploadedFile ? [{ documentType: "PHOTO", fileStoreId: uploadedFile }] : [],
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

  const config = {
    texts: { header: "CS_COMMON_REOPEN", submitBarLabel: "CS_COMMON_SUBMIT" },
  };

  return (
    <FormStep config={config} onSelect={onSubmit} t={t} isDisabled={!selectedReason || updateComplaintMutation.isPending}>
      <CardLabel>{t("CS_REOPEN_COMPLAINT")}</CardLabel>
      <Dropdown option={reopenReasons} selected={selectedReason} select={setSelectedReason} />
      <CardLabel style={{ marginTop: "16px" }}>{t("CS_ADDCOMPLAINT_ADDITIONAL_DETAILS")}</CardLabel>
      <TextArea value={additionalDetails} onChange={(e) => setAdditionalDetails(e.target.value)} />
    </FormStep>
  );
};

export default ReopenComplaint;
