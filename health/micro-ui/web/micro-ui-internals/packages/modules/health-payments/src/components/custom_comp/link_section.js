import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next";
import { useLocation, useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { CustomSVG } from "@egovernments/digit-ui-components";
import { SVG } from "@egovernments/digit-ui-components";
import { Card, Button } from "@egovernments/digit-ui-components";



const getIconComponent = (iconName = "") => {
    return require("@egovernments/digit-ui-react-components")?.[iconName];
}

const CustomInboxSearchLinks = ({ headerText, links, businessService, customClass = "", logoIcon }) => {

    const { t } = useTranslation();
    const history = useHistory();
    const { roles: userRoles } = Digit.UserService.getUser().info;
    const [linksToShow, setLinksToShow] = useState([]);
    const IconComponent = getIconComponent(logoIcon?.component);

    useEffect(() => {
        if (links) {
            setLinksToShow(links);
        }
        // let linksToShow = links.filter(({ roles }) => roles.some((role) => userRoles.map(({ code }) => code).includes(role)) || !roles?.length);

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
                            {hyperlink ? <a href={`/${window?.contextPath}${url}`}>{t(text)}</a> :
                                <Button
                                    icon="ArrowForward"
                                    label={t(text)}
                                    onClick={() => {
                                        history.push(`/${window?.contextPath}${url}`);
                                    }}
                                    type="button"
                                    variation="link"
                                />
                            }
                        </span>
                    );
                })}
            </div>
        </Card>
    )

}

export default CustomInboxSearchLinks;