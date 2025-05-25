import React, { Fragment, useState } from "react";
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
    const [activeTab, setActiveTab] = useState("citizen");

    const iframeSrc =
        activeTab === "citizen"
            ? "https://example.com"
            : "https://www.wikipedia.org";

    const moduleConfig = config?.find((item) => item.module === module) || {};
    const IconComponent = moduleConfig.icon ? Digit.Utils.iconRender(moduleConfig.icon, "#c84c0e") : null;

    const handleButtonClick = (action) => {
        const url = '/' + window.contextPath + action;
        window.open(url, "_blank");
    };

    return (
        <div>

            <div style={{ width: '100%', backgroundColor: '#f0f4f8', padding: '2rem 3rem' }}>
                <nav class="nav-breadcrumb">
                    <a href={`/${window?.contextPath}/employee/sandbox/productPage`} >Products</a>
                    <span class="separator">/</span>
                    <span class="current">Local Business License Issuing System</span>
                </nav>
            </div>
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

            {/* Third Section */}

            <div style={{ width: '100%', backgroundColor: '#f0f4f8', padding: '3rem 6rem' }}>
                <div className="about-container-2">
                    <div className="about-title-wrapper">
                        <h2 className="about-title">Experience Local Business Issuing System</h2>
                        <div className="title-underline-2"></div>
                    </div>

                    <p className="about-description">
                        On Sandbox, the government employee has been set up as a super-user, with all employee roles being assigned to it.  For each user, a new browser tab will open with the appropriate interface. Please do not share any sensitive or private details as this instance of Local Business License Issuing System is shared across users.
                    </p>

                    <div className="cs-wrapper">
                        <div className="cs-left">
                            <h2 className="cs-title">Citizens</h2>

                            <div className="cs-card">
                                <img src="/icons/network.svg" alt="" className="cs-icon" />
                                <span>Fill necessary details and upload relevant documents</span>
                            </div>

                            <div className="cs-card">
                                <img src="/icons/form.svg" alt="" className="cs-icon" />
                                <span>Track application(s) until issuance</span>
                            </div>

                            <div className="cs-card">
                                <img src="/icons/payment.svg" alt="" className="cs-icon" />
                                <span className="cs-italic">Make dummy online payments</span>
                            </div>

                            <div className="cs-card">
                                <img src="/icons/download.svg" alt="" className="cs-icon" />
                                <span className="cs-italic">Download sample license and payment receipts</span>
                            </div>

                            <div className="cs-card">
                                <img src="/icons/notify.svg" alt="" className="cs-icon" />
                                <span className="cs-italic">Get notifications through emails and SMS</span>
                            </div>

                            <button className="cs-button">Explore as a Citizen ➔</button>
                        </div>

                        <div className="cs-right">
                            <img
                                src="https://digit-sandbox-prod-s3.s3.ap-south-1.amazonaws.com/assets/b49b43c60c88ed87c0a54cf6dc06b26ce83c1bcf.png"
                                alt="UI"
                                className="cs-image"
                            />
                        </div>
                    </div>

                    <div className="cs-wrapper">

                        <div className="cs-right">
                            <img
                                src="https://digit-sandbox-prod-s3.s3.ap-south-1.amazonaws.com/assets/8ae2d85d61e5ca4df1c3e12602f2027e7e3b56bd.png"
                                alt="UI"
                                className="cs-image"
                            />
                        </div>
                        <div className="cs-left">
                            <h2 className="cs-title">Employee</h2>

                            <div className="cs-card">
                                <img src="/icons/network.svg" alt="" className="cs-icon" />
                                <span>Track applications based on SLAs</span>
                            </div>

                            <div className="cs-card">
                                <img src="/icons/form.svg" alt="" className="cs-icon" />
                                <span>Verify documents and conduct field verification</span>
                            </div>

                            <div className="cs-card">
                                <img src="/icons/payment.svg" alt="" className="cs-icon" />
                                <span className="cs-italic">Take action at each step and assign forward</span>
                            </div>

                            <div className="cs-card">
                                <img src="/icons/download.svg" alt="" className="cs-icon" />
                                <span className="cs-italic">Leave comments on document verification and field verification</span>
                            </div>

                            <div className="cs-card">
                                <img src="/icons/notify.svg" alt="" className="cs-icon" />
                                <span className="cs-italic">Review performance through the Dashboard</span>
                            </div>

                            <button className="cs-button">Explore as a Employee ➔</button>
                        </div>

                    </div>





                </div>
            </div>

            {/* Fourth Section */}
            <div className="walkthrough-container"
             style={{ width: '100%', backgroundColor: '#ffffff', padding: '3rem 6rem' }}
            >
                <div className="wt-c1">
                    <h2 className="wt-title">Walkthrough on Sandbox</h2>
                    <p className="wt-subtitle">
                        Learn how to navigate and use the product on Sandbox.
                    </p>
                </div>
                
                <div className="wt-tabs-center wt-tabs-and-iframe">
                    <div className="wt-tab-wrapper">
                        <div
                            className={`wt-tab ${activeTab === "citizen" ? "active" : ""}`}
                            onClick={() => setActiveTab("citizen")}
                        >
                            Citizen
                        </div>
                        <div
                            className={`wt-tab ${activeTab === "employee" ? "active" : ""}`}
                            onClick={() => setActiveTab("employee")}
                        >
                            Employee
                        </div>
                    </div>

                    <div className="wt-iframe-wrapper">
                        <iframe
                            src={iframeSrc}
                            title="Digit Sandbox"
                            className="wt-iframe"
                        ></iframe>
                    </div>
                
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsComponentUpdated;

