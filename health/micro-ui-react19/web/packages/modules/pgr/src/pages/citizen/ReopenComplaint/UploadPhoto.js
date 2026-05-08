import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, SubmitBar, ImageUploadHandler, CardLabelError, LinkButton } from "@egovernments/digit-ui-react-components";
import { LOCALIZATION_KEY } from "../../../constants/Localization";

// React 19: useHistory replaced by useNavigate; props.match.path handled via parentRoute prop
const UploadPhoto = ({ complaintDetails, parentRoute, skip }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [verificationDocuments, setVerificationDocuments] = useState(null);
  const [valid, setValid] = useState(true);

  const handleUpload = (ids) => {
    if (ids?.length) {
      const documents = ids.map((docId) => ({
        documentType: "PHOTO",
        fileStoreId: docId,
        documentUid: "",
        additionalDetails: {},
      }));
      setVerificationDocuments(documents);
    }
  };

  useEffect(() => {
    const reopenDetails = Digit.SessionStorage.get(`reopen.${id}`) || {};
    Digit.SessionStorage.set(`reopen.${id}`, { ...reopenDetails, verificationDocuments });
  }, [verificationDocuments, id]);

  const save = () => {
    if (!verificationDocuments) {
      setValid(false);
    } else {
      navigate(`${parentRoute}/addional-details/${id}`);
    }
  };

  const handleSkip = () => navigate(`${parentRoute}/addional-details/${id}`);

  return (
    <Card>
      <ImageUploadHandler
        header={t(`${LOCALIZATION_KEY.CS_ADDCOMPLAINT}_UPLOAD_PHOTO`)}
        tenantId={complaintDetails?.service?.tenantId}
        cardText=""
        onPhotoChange={handleUpload}
        uploadedImages={null}
      />
      {!valid && <CardLabelError>{t(`${LOCALIZATION_KEY.CS_ADDCOMPLAINT}_UPLOAD_ERROR_MESSAGE`)}</CardLabelError>}
      <SubmitBar label={t(`${LOCALIZATION_KEY.PT_COMMONS}_NEXT`)} onSubmit={save} />
      {skip ? <LinkButton label={t(`${LOCALIZATION_KEY.CORE_COMMON}_SKIP_CONTINUE`)} onClick={handleSkip} /> : null}
    </Card>
  );
};

export default UploadPhoto;
