import React, { useState, Fragment } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ActionBar, SubmitBar, Button,ArrowLeft, ArrowForward } from "@egovernments/digit-ui-react-components";
import { PanelCard } from "@egovernments/digit-ui-components";
const Response = () => {

    const { t } = useTranslation();
    const history = useHistory();
    const queryStrings = Digit.Hooks.useQueryParams();
    const [campaignId, setCampaignId] = useState(queryStrings?.campaignId);
    const [isResponseSuccess, setIsResponseSuccess] = useState(
        queryStrings?.isSuccess === "true" ? true : queryStrings?.isSuccess === "false" ? false : true
    );
    const { state } = useLocation();
    return (
        <>
            <PanelCard
                animationProps={{
                    loop: false,
                    noAutoplay: false
                }}
                cardClassName=""
                cardStyles={{}}
                className=""
                customIcon=""
                description="The user data uploaded will be available in your microplan user assignment section"
                // footerChildren={[
                //     <Button label="OK" onClick={function noRefCheck() { }} type="button" />
                // ]}
                footerStyles={{}}
                iconFill=""
                info=""
                maxFooterButtonsAllowed={5}
                message={state?.message}
                multipleResponses={[]}
                props={{}}
                response={state?.fileName}
                sortFooterButtons
                style={{}}
                type="success"
            >

            </PanelCard>
            <ActionBar className="mc_back">
                <Link to={`/${window.contextPath}/employee/microplan/upload-user`}>
                    <Button
                        label={t("GO_BACK_TO_USER_MANAGEMENT")}
                        variation="secondary"
                        icon={<ArrowLeft styles={{ height: "1.25rem", width: "2.5rem" }} />}
                        type="button"
                        className="dm-workbench-download-template-btn dm-hover"
                        onButtonClick={(e) => {

                        }}
                    />
                </Link>
            </ActionBar>
        </>
    );
};

export default Response;
