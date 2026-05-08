import { Fragment, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  CardSubHeader,
  CheckPoint,
  ConnectingCheckPoints,
  DisplayPhotos,
  Loader,
} from "@egovernments/digit-ui-react-components";
import { LOCALIZATION_KEY } from "../constants/Localization";
import PendingAtLME from "./timelineInstances/pendingAtLme";
import PendingForAssignment from "./timelineInstances/PendingForAssignment";
import PendingForReassignment from "./timelineInstances/PendingForReassignment";
import Reopen from "./timelineInstances/reopen";
import Resolved from "./timelineInstances/resolved";
import Rejected from "./timelineInstances/rejected";
import StarRated from "./timelineInstances/StarRated";

const TLCaption = ({ data }) => {
  const { t } = useTranslation();
  return (
    <div>
      {data?.date && <p>{data.date}</p>}
      <p>{data?.name}</p>
      <p>{data?.mobileNumber}</p>
      {data?.source && <p>{t("ES_COMMON_FILED_VIA_" + data.source.toUpperCase())}</p>}
    </div>
  );
};

const TimeLine = ({
  isLoading,
  data,
  serviceRequestId,
  complaintWorkflow,
  rating,
  zoomImage,
  complaintDetails,
  ComplainMaxIdleTime,
}) => {
  const { t } = useTranslation();

  function zoomImageWrapper(imageSource, thumbnailsToShow) {
    const newIndex = thumbnailsToShow.thumbs?.findIndex((link) => link === imageSource);
    zoomImage((newIndex > -1 && thumbnailsToShow?.fullImage?.[newIndex]) || imageSource);
  }

  let { timeline } = data;
  const totalTimelineLength = useMemo(() => timeline?.length, [timeline]);

  useEffect(() => {
    const filteredTimeline = timeline?.filter((status, index, array) => {
      return index === array.length - 1 && status.status === "PENDINGFORASSIGNMENT";
    });

    const onlyPendingForAssignmentStatusArray = timeline?.filter((e) => e?.status === "PENDINGFORASSIGNMENT");
    const duplicateCheckpoint = onlyPendingForAssignmentStatusArray?.at(-1);
    timeline?.push({
      ...duplicateCheckpoint,
      performedAction: "FILED",
      status: "COMPLAINT_FILED",
    });
  }, [timeline]);

  const getCommentsInCustomChildComponent = ({ comment, thumbnailsToShow, auditDetails, assigner, status }) => {
    const captionDetails = {
      date: auditDetails?.lastModified,
      name: assigner?.name,
      mobileNumber: assigner?.mobileNumber,
      source: status === "COMPLAINT_FILED" ? complaintDetails?.audit?.source : "",
    };
    return (
      <>
        {comment ? (
          <div>
            {comment.map((e, i) => (
              <div key={i} className="TLComments">
                <h3>{t("WF_COMMON_COMMENTS")}</h3>
                <p>{e}</p>
              </div>
            ))}
          </div>
        ) : null}
        {thumbnailsToShow?.thumbs?.length > 0 ? (
          <div className="TLComments">
            <h3>{t("CS_COMMON_ATTACHMENTS")}</h3>
            <DisplayPhotos
              srcs={thumbnailsToShow.thumbs}
              onClick={(src) => zoomImageWrapper(src, thumbnailsToShow)}
            />
          </div>
        ) : null}
        {captionDetails?.date ? <TLCaption data={captionDetails} /> : null}
      </>
    );
  };

  const getCheckPoint = ({
    status,
    caption,
    auditDetails,
    timeLineActions,
    index,
    performedAction,
    comment,
    thumbnailsToShow,
    assigner,
    totalTimelineLength,
  }) => {
    const isCurrent = index === 0;
    switch (status) {
      case "PENDINGFORREASSIGNMENT":
        return (
          <CheckPoint
            key={index}
            isCompleted={isCurrent}
            label={t(`CS_COMMON_${status}`)}
            customChild={getCommentsInCustomChildComponent({ comment, thumbnailsToShow, auditDetails, assigner })}
          />
        );

      case "PENDINGFORASSIGNMENT": {
        const isFirstPending = totalTimelineLength - (index + 1) === 0;
        return (
          <PendingForAssignment
            key={index}
            isCompleted={isCurrent}
            text={t(`CS_COMMON_${status}`)}
            customChild={getCommentsInCustomChildComponent({
              comment,
              ...(isFirstPending ? { auditDetails } : { thumbnailsToShow, auditDetails }),
            })}
          />
        );
      }

      case "PENDINGFORASSIGNMENT_AFTERREOPEN":
        return (
          <PendingForAssignment
            key={index}
            isCompleted={isCurrent}
            text={t(`CS_COMMON_${status}`)}
            customChild={getCommentsInCustomChildComponent({ comment, thumbnailsToShow, auditDetails, assigner })}
          />
        );

      case "PENDINGATLME": {
        const { name, mobileNumber } = caption?.length > 0 ? caption[0] : { name: "", mobileNumber: "" };
        return (
          <PendingAtLME
            key={index}
            isCompleted={isCurrent}
            name={name}
            mobile={mobileNumber}
            text={t(`CS_COMMON_${status}`)}
            customChild={getCommentsInCustomChildComponent({ comment, thumbnailsToShow, auditDetails, assigner })}
          />
        );
      }

      case "RESOLVED":
        return (
          <Resolved
            key={index}
            isCompleted={isCurrent}
            action={complaintWorkflow?.action}
            nextActions={index <= 1 && timeLineActions}
            complaintDetails={complaintDetails}
            ComplainMaxIdleTime={ComplainMaxIdleTime}
            serviceRequestId={serviceRequestId}
            reopenDate={Digit.DateUtils.ConvertTimestampToDate(auditDetails.lastModifiedTime)}
            customChild={getCommentsInCustomChildComponent({ comment, thumbnailsToShow, auditDetails, assigner })}
          />
        );

      case "REJECTED":
        return (
          <Rejected
            key={index}
            isCompleted={isCurrent}
            action={complaintWorkflow?.action}
            nextActions={index <= 1 && timeLineActions}
            complaintDetails={complaintDetails}
            ComplainMaxIdleTime={ComplainMaxIdleTime}
            serviceRequestId={serviceRequestId}
            reopenDate={Digit.DateUtils.ConvertTimestampToDate(auditDetails.lastModifiedTime)}
            customChild={getCommentsInCustomChildComponent({ comment, thumbnailsToShow, auditDetails, assigner })}
          />
        );

      case "CLOSEDAFTERRESOLUTION":
        return (
          <CheckPoint
            key={index}
            isCompleted={isCurrent}
            label={t(`CS_COMMON_CS_COMMON_${status}`)}
            customChild={
              <div>
                {getCommentsInCustomChildComponent({ comment, thumbnailsToShow, auditDetails, assigner })}
                {rating ? <StarRated text={t("CS_ADDCOMPLAINT_YOU_RATED")} rating={rating} /> : null}
              </div>
            }
          />
        );

      case "COMPLAINT_FILED":
        return (
          <CheckPoint
            key={index}
            isCompleted={isCurrent}
            label={t("CS_COMMON_COMPLAINT_FILED")}
            customChild={getCommentsInCustomChildComponent({ comment, auditDetails, assigner, status })}
          />
        );

      default:
        return (
          <CheckPoint
            key={index}
            isCompleted={isCurrent}
            label={t(`CS_COMMON_${status}`)}
            customChild={getCommentsInCustomChildComponent({ comment, thumbnailsToShow, auditDetails, assigner, status })}
          />
        );
    }
  };

  return (
    <>
      <CardSubHeader>{t(`${LOCALIZATION_KEY.CS_COMPLAINT_DETAILS}_COMPLAINT_TIMELINE`)}</CardSubHeader>
      {timeline && totalTimelineLength > 0 ? (
        <ConnectingCheckPoints>
          {timeline.map(({ status, caption, auditDetails, timeLineActions, performedAction, wfComment: comment, thumbnailsToShow, assigner }, index) =>
            getCheckPoint({ status, caption, auditDetails, timeLineActions, index, performedAction, comment, thumbnailsToShow, assigner, totalTimelineLength })
          )}
        </ConnectingCheckPoints>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default TimeLine;
