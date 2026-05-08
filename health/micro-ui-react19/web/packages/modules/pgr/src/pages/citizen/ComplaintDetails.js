import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Card,
  Header,
  CardSubHeader,
  StatusTable,
  Row,
  ImageViewer,
  Loader,
  Toast,
} from "@egovernments/digit-ui-react-components";

const ComplaintDetailsPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();

  const tenantId = Digit.Utils.getMultiRootTenant?.()
    ? Digit.ULBService.getStateId()
    : Digit.SessionStorage.get("CITIZEN.COMMON.HOME.CITY")?.code || Digit.ULBService.getCurrentTenantId();

  const { isLoading, error, complaintDetails, revalidate } = Digit.Hooks.pgr?.useComplaintDetails?.({ tenantId, id }) || {};
  const workflowDetails = Digit.Hooks.useWorkflowDetails?.({ tenantId, id, moduleCode: "PGR" });

  const [imageZoom, setImageZoom] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    revalidate?.();
  }, []);

  if (isLoading) return <Loader />;
  if (error) return <Card><p style={{ textAlign: "center" }}>{t("CS_COMMON_SOMETHING_WENT_WRONG")}</p></Card>;

  const service = complaintDetails?.service || {};
  const timeline = workflowDetails?.data?.timeline || [];

  return (
    <div className="pgr-complaint-details-citizen">
      <Header>{t("CS_COMPLAINT_DETAILS_COMPLAINT_DETAILS")}</Header>
      <Card>
        <StatusTable>
          <Row label={t("CS_COMPLAINT_DETAILS_COMPLAINT_NO")} text={service.serviceRequestId} />
          <Row label={t("CS_COMPLAINT_DETAILS_COMPLAINT_SUBTYPE")} text={t(`SERVICEDEFS.${service.serviceCode?.toUpperCase()}`)} />
          <Row label={t("CS_COMPLAINT_DETAILS_CURRENT_STATUS")} text={t(`CS_COMMON_${service.applicationStatus}`)} />
          <Row label={t("WF_INBOX_HEADER_LOCALITY")} text={service.address?.locality?.name} />
          {service.description && <Row label={t("CS_COMPLAINT_DETAILS_ADDITIONAL_DETAILS")} text={service.description} />}
        </StatusTable>
      </Card>

      {timeline.length > 0 && (
        <Card>
          <CardSubHeader>{t("CS_COMPLAINT_DETAILS_COMPLAINT_TIMELINE")}</CardSubHeader>
          {timeline.map((item, index) => (
            <div key={index} className="pgr-timeline-item">
              <span className="pgr-timeline-action">{t(`WF_PGR_${item.performedAction}`)}</span>
              {item.wfComment?.map((c, i) => <p key={i} className="pgr-timeline-comment">{c}</p>)}
            </div>
          ))}
        </Card>
      )}

      {imageZoom && <ImageViewer imageSrc={imageZoom} onClose={() => setImageZoom(null)} />}
      {toast && <Toast type={toast.type} label={t(toast.label)} onClose={() => setToast(null)} />}
    </div>
  );
};

export default ComplaintDetailsPage;
