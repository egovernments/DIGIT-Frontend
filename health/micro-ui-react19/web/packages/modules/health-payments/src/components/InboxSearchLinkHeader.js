import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { SVG } from "@egovernments/digit-ui-components";
import { Card, Button } from "@egovernments/digit-ui-components";

const InboxSearchLinkHeader = ({ headerText, links, businessService, customClass = "", logoIcon }) => {

    const { t } = useTranslation();
    const navigate = useNavigate();
    const [linksToShow, setLinksToShow] = useState([]);

    useEffect(() => {
        if (links) {
            setLinksToShow(links);
        }
    }, []);

    const renderHeader = () => <div style={{ display: "flex" }}>
        <span className="">
            <SVG.Payments width={"32px"} height={"32px"} fill={"#c84c0e"} />
        </span>
        <span className="inbox-header-text" style={{ color: "#0b4b66" }}>{t(headerText)}</span>
    </div>

    return (
        <Card>
            {renderHeader()}
            <div className="contents">
                {linksToShow.map(({ url, text, icon, hyperlink = false }, index) => {
                    return (
                        <span className="link" key={index}>
                            <Button
                                icon="ArrowForward"
                                label={t(text)}
                                onClick={() => {
                                    navigate(`/${window?.contextPath}${url}`);
                                }}
                                type="button"
                                variation="link"
                            />
                        </span>
                    );
                })}
            </div>
        </Card>
    )

}

export default InboxSearchLinkHeader;