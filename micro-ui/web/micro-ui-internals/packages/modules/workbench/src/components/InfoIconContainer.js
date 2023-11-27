import React from "react";
import { InfoBannerIcon } from "@egovernments/digit-ui-react-components";

const InfoIconContainer = ({ setShowTooltipFlag, selectedDetails }) => (
    <div className="info-icon-container">
        <div
            className="info-icon"
            onClick={() => {
                setShowTooltipFlag(true);
            }}
        >
            {selectedDetails && selectedDetails.length > 0 && selectedDetails[0].data && (
                <span>
                    <InfoBannerIcon fill={"#f47738"} />
                </span>
            )}
        </div>
    </div>
);

export default InfoIconContainer;
