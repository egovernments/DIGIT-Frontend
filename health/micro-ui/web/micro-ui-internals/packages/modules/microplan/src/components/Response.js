import React, { useState, Fragment } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ActionBar, SubmitBar, ArrowLeft, ArrowForward } from "@egovernments/digit-ui-react-components";
import { Button } from "@egovernments/digit-ui-components";
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
    const back=(state?.back)?state?.back:"BACK";
    const backlink=(state?.backlink)?(state.back):"employee";
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
                description={state.description}
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
                <Link to={`/${window.contextPath}${backlink}`}>
                    <Button
                        style={{ margin: "0.5rem", minWidth: "10rem", marginLeft: "6rem" }}
                        className="previous-button"
                        variation="secondary"
                        label={t(back)}
                        icon={"ArrowBack"}
                    />
                </Link>
            </ActionBar>
        </>
    );
};

export default Response;
