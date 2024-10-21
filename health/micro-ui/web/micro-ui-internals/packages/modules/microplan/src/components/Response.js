import React, { useState, Fragment } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ActionBar, SubmitBar, ArrowLeft, ArrowForward } from "@egovernments/digit-ui-react-components";
import { PanelCard } from "@egovernments/digit-ui-components";
import { Button } from "@egovernments/digit-ui-react-components";
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
                message={t(state?.message)}
                multipleResponses={[]}
                props={{}}
                response={state?.fileName}
                sortFooterButtons
                style={{}}
                type="success"
            >

            </PanelCard>
            <ActionBar className="mc_back">
                <Link to={`/${window.contextPath}/employee/microplan/user-management`}>
                    <Button
                        style={{ margin: "0.5rem", minWidth: "12rem", marginLeft: "6rem" }}
                        className="previous-button"
                        variation="secondary"
                        label={t("BACK")}
                        icon="ArrowBack"
                    />
                </Link>
            </ActionBar>
        </>
    );
};

export default Response;
