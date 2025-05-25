import React, { Fragment } from "react";
import { HeaderComponent, Card, CardText, CardHeader, Button, } from "@egovernments/digit-ui-components";
import { Row, Col } from "@egovernments/digit-ui-react-components";
import { SVG } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";


const ProjectBreadCrumb = ({ location, defaultPath }) => {
    const { t } = useTranslation();
    const searchParams = new URLSearchParams(location.search);
    const module = location.pathname.split('/').pop();
    const pathVar = location.pathname.replace(defaultPath + "/", "").split("?")?.[0];

    const crumbs = [
        {
            path: `/${window?.contextPath}/employee/sandbox/landing`,
            content: t("HOME"),
            show: true,
        },
        {
            path: `/${window?.contextPath}/employee/sandbox/productPage`,
            content: t("SANDBOX_PRODUCTS"),
            show: location.pathname.includes("productDetailsPage") || location.pathname.includes("productPage") ? true : false,
        },
        {
            path: `/${window?.contextPath}/employee/sandbox/productDetailsPage/${module}`,
            content: t(`${module.toUpperCase()}_PRODUCT_DETAILS_HEADER`),
            show: location.pathname.includes("productDetailsPage") ? true : false,
        },
        {
            path: pathVar === "application-management/home" ? "" : `/${window?.contextPath}/employee/sandbox/application-management/home`,
            content: t("APPLICATION_MANAGEMENT_CRUMB"),
            show: false,
        },
        {
            path: searchParams.get("module") ? "" : `/${window?.contextPath}/employee/sandbox/application-management/home`,
            content: t(`APPLICATON_MODULE_CRUMB_${searchParams.get("module")}`),
            show: !!searchParams.get("module"),
        },
    ];

    return <BreadCrumb crumbs={crumbs} spanStyle={bredCrumbStyle} />;
};


const renderContentItem = (item, itemIndex, module, t) => {
    switch (item.type) {
        case "paragraph":
            return (
                <CardText className="custom-section-paragraph" key={itemIndex}>
                    <p>{t(item.text)}</p>
                </CardText>
            );
        case "step-heading":
            return (
                <CardText key={itemIndex} className="custom-step-header">
                    {t(item.text)}
                </CardText>
            );
        case "step":
            return (
                <li key={itemIndex} className="custom-step-item">
                    {t(item.text)}
                </li>
            );
        case "image":
            return (
                <div key={itemIndex} className="custom-image-container">
                    <img src={item.text} alt={`${module}Image`} className="custom-image" />
                </div>
            );
        default:
            return null;
    }
};


const ProductDetailsComponentUpdated = ({ config, module }) => {
    const { t } = useTranslation();

    const moduleConfig = config?.find((item) => item.module === module) || {};
    const IconComponent = moduleConfig.icon ? Digit.Utils.iconRender(moduleConfig.icon, "#c84c0e") : null;

    const handleButtonClick = (action) => {
        const url = '/' + window.contextPath + action;
        window.open(url, "_blank");
    };

    return (
        <div>

            <div style={{ width: '100%', backgroundColor: '#f0f4f8', padding: '3rem 6rem' }}>
                <div style={{ display: 'flex', height: '400px', margin: '0 auto' }}>
                    {/* Left 60% */}
                    <div style={{ width: '50%', paddingRight: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <h2 style={{ color: '#2c3e50', fontSize: '2rem', marginBottom: '1.5rem' }}>
                            Local Business License Issuing System
                        </h2>
                        <p style={{ fontSize: '2.50rem', fontWeight: 'bold', lineHeight: '1.3' }}>
                            <span style={{ color: '#34495e' }}>Get your </span>
                            <span style={{ color: '#b24b2d' }}>business </span>
                            <span style={{ color: '#b24b2d' }}>license issued </span>
                            <span style={{ color: '#34495e' }}>easily</span>
                        </p>
                    </div>

                    {/* Right 40% */}
                    <div style={{ width: '50%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <img
                            src="https://digit-sandbox-prod-s3.s3.ap-south-1.amazonaws.com/assets/5e72d0b559dea9fc2f5ff2bd4c66c63c3aff8bcc.png"
                            alt="Business License UI"
                            style={{ height: '100%', width: 'auto', objectFit: 'contain' }}
                        />
                    </div>
                </div>
            </div>

            {/* Second Section */}
            <div style={{ width: '100%', backgroundColor: '#ffffff', padding: '3rem 6rem' }}>
                <div className="about-container">
                    <div className="about-title-wrapper">
                        <h2 className="about-title">About Local Business License Issuing System</h2>
                        <div className="title-underline"></div>
                    </div>

                    <p className="about-description">
                        The Local Business License Issuing system is an end-to-end product that enables
                        <strong> businesses to apply for licenses </strong> and
                        <strong> governments to ensure compliance and issue license certificates </strong>
                        based on local regulations. This solution is <em>fully configurable</em> and can be extended to
                        support a wide range of licenses, permits and certificates.
                    </p>

                    <p className="about-description">
                        Each product on DIGIT allows specific roles to be assigned to each user.
                        The default workflow has two types of users: Citizen and Government Employee.
                    </p>

                    <div className="roles-section">
                        <div className="role-block">
                            <div className="role-icon-wrapper">
                                <SVG.Person className="role-icon" />
                            </div>
                            <p>
                                <strong>Citizens</strong> can apply online or with help of counter employee at a service counter and make payment.
                            </p>
                        </div>

                        <div className="role-block">
                            <div className="role-icon-wrapper">
                                <SVG.Person className="role-icon" />
                            </div>
                            <p>
                                <strong>Government employees</strong> can verify documents, log field inspections and take action—such as approving,
                                rejecting, or sending applications back—based on predefined rules. These actions can be done by one single user or by multiple users.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsComponentUpdated;

