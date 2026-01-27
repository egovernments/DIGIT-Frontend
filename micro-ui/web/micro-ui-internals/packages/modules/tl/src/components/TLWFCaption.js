import React from "react";
import { useTranslation } from "react-i18next";
import { TelePhone, DisplayPhotos } from "@egovernments/digit-ui-react-components";
import TLWFReason from "./TLWFReason";

const TLWFCaption = ({ data, OpenImage }) => {
    const { t } = useTranslation();
    return (
        <div>
            {data.date && <p>{data.date}</p>}
            <p>{data.name}</p>
            {data.mobileNumber && <TelePhone mobile={data.mobileNumber} />}
            {data.source && <p>{t("ES_APPLICATION_DETAILS_APPLICATION_CHANNEL_" + data.source.toUpperCase())}</p>}
            {data.comment && <TLWFReason otherComment={data?.otherComment} headComment={data?.comment}></TLWFReason>}
            {data?.wfComment ? <div>{data?.wfComment?.map(e =>
                <div className="TLComments">
                    <h3>{t("WF_COMMON_COMMENTS")}</h3>
                    <p>{e}</p>
                </div>
            )}</div> : null}
            {data?.thumbnailsToShow?.thumbs?.length > 0 ? <div className="TLComments">
                <h3>{t("CS_COMMON_ATTACHMENTS")}</h3>
                <DisplayPhotos src={data?.thumbnailsToShow?.thumbs} onClick={(src, index) => { OpenImage(src, index, data?.thumbnailsToShow) }} />
            </div> : null}
        </div>
    );
};

export default TLWFCaption;
