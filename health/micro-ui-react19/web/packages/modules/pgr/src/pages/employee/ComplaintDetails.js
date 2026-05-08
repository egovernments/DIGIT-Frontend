import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardLabel,
  CardLabelDesc,
  CardSubHeader,
  ConnectingCheckPoints,
  CheckPoint,
  Row,
  StatusTable,
  PopUp,
  ImageViewer,
  TextArea,
  UploadFile,
  Toast,
  ActionBar,
  Menu,
  SubmitBar,
  Dropdown,
  Loader,
  Modal,
  SectionalDropdown,
} from "@egovernments/digit-ui-react-components";
import useUpdateComplaint from "../../hooks/useUpdateComplaint";

const CloseBtn = ({ onClick }) => (
  <div className="icon-bg-secondary" onClick={onClick} style={{ cursor: "pointer" }}>✕</div>
);

const TLCaption = ({ data, comments }) => {
  const { t } = useTranslation();
  return (
    <div>
      {data?.date && <p>{data.date}</p>}
      <p>{data?.name}</p>
      <p>{data?.mobileNumber}</p>
      {data?.source && <p>{t(`ES_COMMON_FILED_VIA_${data.source.toUpperCase()}`)}</p>}
      {comments?.map((e, i) => (
        <div key={i} className="TLComments">
          <h3>{t("WF_COMMON_COMMENTS")}</h3>
          <p>{e}</p>
        </div>
      ))}
    </div>
  );
};

// Action modal (Assign / Reject / Resolve / Reopen)
const ComplaintDetailsModal = ({ workflowDetails, complaintDetails, close, popup, selectedAction, onAssign, tenantId, t }) => {
  const stateArray = workflowDetails?.data?.initialActionState?.nextActions?.filter((ele) => ele?.action === selectedAction);
  const employeeRaw = Digit.Hooks.pgr?.useEmployeeFilter?.(
    tenantId,
    stateArray?.[0]?.assigneeRoles?.join(",") || "",
    complaintDetails
  );
  const employeeData = employeeRaw?.map((d) => ({ heading: d.department, options: d.employees })) || null;

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [comments, setComments] = useState("");
  const [file, setFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState(null);

  const cityDetails = Digit.ULBService.getCurrentUlb();
  const reopenReasons = [t("CS_REOPEN_OPTION_ONE"), t("CS_REOPEN_OPTION_TWO"), t("CS_REOPEN_OPTION_THREE"), t("CS_REOPEN_OPTION_FOUR")];
  const [selectedReopenReason, setSelectedReopenReason] = useState(null);

  useEffect(() => {
    if (!file) return;
    (async () => {
      setError(null);
      if (file.size >= 5242880) return setError(t("CS_MAXIMUM_UPLOAD_SIZE_EXCEEDED"));
      try {
        const stateId = Digit.Utils.getMultiRootTenant?.() ? Digit.ULBService.getStateId() : cityDetails?.code;
        const response = await Digit.UploadServices.Filestorage("property-upload", file, stateId);
        if (response?.data?.files?.length > 0) setUploadedFile(response.data.files[0].fileStoreId);
        else setError(t("CS_FILE_UPLOAD_ERROR"));
      } catch {
        setError(t("CS_FILE_UPLOAD_ERROR"));
      }
    })();
  }, [file]);

  const actionLabel = {
    ASSIGN: t("CS_ACTION_ASSIGN"), REASSIGN: t("CS_ACTION_ASSIGN"),
    REJECT: t("CS_COMMON_REJECT"), REOPEN: t("CS_COMMON_REOPEN"),
  }[selectedAction] || t("CS_COMMON_RESOLVE");

  return (
    <Modal
      headerBarMain={<h2>{actionLabel}</h2>}
      headerBarEnd={<CloseBtn onClick={() => close(popup)} />}
      actionCancelLabel={t("CS_COMMON_CANCEL")}
      actionCancelOnSubmit={() => close(popup)}
      actionSaveLabel={actionLabel}
      actionSaveOnSubmit={() => {
        if (selectedAction === "REJECT" && !comments) return setError(t("CS_MANDATORY_COMMENTS"));
        onAssign(selectedEmployee, comments, uploadedFile);
      }}
      error={error}
      setError={setError}
    >
      <Card>
        {!["REJECT", "RESOLVE", "REOPEN"].includes(selectedAction) && (
          <>
            <CardLabel>{t("CS_COMMON_EMPLOYEE_NAME")}</CardLabel>
            {employeeData && <SectionalDropdown selected={selectedEmployee} menuData={employeeData} displayKey="name" select={setSelectedEmployee} />}
          </>
        )}
        {selectedAction === "REOPEN" && (
          <>
            <CardLabel>{t("CS_REOPEN_COMPLAINT")}</CardLabel>
            <Dropdown selected={selectedReopenReason} option={reopenReasons} select={setSelectedReopenReason} />
          </>
        )}
        <CardLabel>{t("CS_COMMON_EMPLOYEE_COMMENTS")}</CardLabel>
        <TextArea name="comment" onChange={(e) => { setError(null); setComments(e.target.value); }} value={comments} />
        <CardLabel>{t("CS_ACTION_SUPPORTING_DOCUMENTS")}</CardLabel>
        <CardLabelDesc>{t("CS_UPLOAD_RESTRICTIONS")}</CardLabelDesc>
        <UploadFile
          id="pgr-doc"
          accept=".jpg"
          onUpload={(e) => setFile(e.target.files[0])}
          onDelete={() => setUploadedFile(null)}
          message={uploadedFile ? `1 ${t("CS_ACTION_FILEUPLOADED")}` : t("CS_ACTION_NO_FILEUPLOADED")}
        />
      </Card>
    </Modal>
  );
};

// Main complaint details page
export const ComplaintDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const queryClient = useQueryClient();
  const updateComplaintMutation = useUpdateComplaint(tenantId);

  const [toast, setToast] = useState(null);
  const [displayMenu, setDisplayMenu] = useState(false);
  const [popup, setPopup] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [imageZoom, setImageZoom] = useState(null);

  const { isLoading, complaintDetails, revalidate } = Digit.Hooks.pgr?.useComplaintDetails?.({ tenantId, id }) || {};
  const workflowDetails = Digit.Hooks.useWorkflowDetails?.({ tenantId, id, moduleCode: "PGR", role: "EMPLOYEE" });

  // Normalise workflowDetails shape from the framework
  if (workflowDetails?.data) {
    workflowDetails.data.initialActionState =
      workflowDetails.data.initialActionState || { ...workflowDetails.data.actionState } || {};
    workflowDetails.data.actionState = { ...workflowDetails.data };
  }

  const closeModal = () => { setPopup(null); setSelectedAction(null); };

  const onAssign = async (employee, comments, fileStoreId) => {
    const wfAction = workflowDetails?.data?.initialActionState?.nextActions?.find((a) => a.action === selectedAction);
    const payload = {
      ...complaintDetails,
      workflow: {
        action: selectedAction,
        assignes: employee ? [employee.uuid] : undefined,
        comments,
        documents: fileStoreId ? [{ documentType: "PHOTO", fileStoreId }] : undefined,
      },
    };
    updateComplaintMutation.mutate(payload, {
      onSuccess: () => {
        setToast({ type: "success", label: `CS_ACTION_${selectedAction}_SUCCESS` });
        revalidate?.();
        queryClient.invalidateQueries({ queryKey: ["pgr-inbox"] });
      },
      onError: () => setToast({ type: "error", label: "CS_ACTION_FAILED" }),
    });
    closeModal();
  };

  if (isLoading) return <Loader />;

  const service = complaintDetails?.service || {};
  const timeline = workflowDetails?.data?.timeline || [];
  const nextActions = workflowDetails?.data?.initialActionState?.nextActions || [];

  return (
    <div className="pgr-complaint-details">
      <Card>
        <CardSubHeader>{t("CS_COMPLAINT_DETAILS_COMPLAINT_DETAILS")}</CardSubHeader>
        <StatusTable>
          <Row label={t("CS_COMPLAINT_DETAILS_COMPLAINT_NO")} text={service.serviceRequestId} />
          <Row label={t("CS_COMPLAINT_DETAILS_COMPLAINT_SUBTYPE")} text={t(`SERVICEDEFS.${service.serviceCode?.toUpperCase()}`)} />
          <Row label={t("CS_COMPLAINT_DETAILS_CURRENT_STATUS")} text={t(`CS_COMMON_${service.applicationStatus}`)} />
          <Row label={t("WF_INBOX_HEADER_LOCALITY")} text={service.address?.locality?.name} />
          <Row label={t("CS_COMPLAINT_DETAILS_ADDITIONAL_DETAILS")} text={service.description} />
        </StatusTable>
      </Card>

      {timeline.length > 0 && (
        <Card>
          <CardSubHeader>{t("CS_COMPLAINT_DETAILS_COMPLAINT_TIMELINE")}</CardSubHeader>
          <ConnectingCheckPoints>
            {timeline.map((item, index) => (
              <div key={index}>
                <CheckPoint
                  isCompleted={index === 0}
                  label={t(`WF_PGR_${item.performedAction}`)}
                  customChild={<TLCaption data={item} comments={item.wfComment} />}
                />
              </div>
            ))}
          </ConnectingCheckPoints>
        </Card>
      )}

      {nextActions.length > 0 && (
        <ActionBar>
          {displayMenu && (
            <Menu
              options={nextActions.map((a) => t(`CS_ACTION_${a.action}`))}
              onSelect={(option) => {
                const action = nextActions.find((a) => t(`CS_ACTION_${a.action}`) === option);
                setSelectedAction(action?.action);
                setPopup(action?.action);
                setDisplayMenu(false);
              }}
            />
          )}
          <SubmitBar label={t("ES_COMMON_TAKE_ACTION")} onSubmit={() => setDisplayMenu(!displayMenu)} />
        </ActionBar>
      )}

      {popup && (
        <PopUp>
          <ComplaintDetailsModal
            workflowDetails={workflowDetails}
            complaintDetails={complaintDetails}
            close={closeModal}
            popup={popup}
            selectedAction={selectedAction}
            onAssign={onAssign}
            tenantId={tenantId}
            t={t}
          />
        </PopUp>
      )}

      {imageZoom && <ImageViewer imageSrc={imageZoom} onClose={() => setImageZoom(null)} />}
      {toast && <Toast type={toast.type} label={t(toast.label)} onClose={() => setToast(null)} />}
    </div>
  );
};
