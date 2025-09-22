import React, { useState } from "react";
import { SVG } from "@egovernments/digit-ui-components";
import { ReactComponent as Graph } from '../../../../src/components/images/graph.svg';
import { ReactComponent as FeatureSearch } from '../../../../src/components/images/feature_search.svg';
import { ReactComponent as Chat } from '../../../../src/components/images/chat.svg';
import { ReactComponent as Calculate } from '../../../../src/components/images/calculate.svg';
import { ReactComponent as BarChart } from '../../../../src/components/images/bar_chart.svg';
import { ReactComponent as Employeeicon } from '../../../../src/components/images/employee.svg';
import { ReactComponent as Citizenicon } from '../../../../src/components/images/Citizen.svg';
import { useTranslation } from "react-i18next";
import he from 'he';
const iconMap = {
    Graph,
    FeatureSearch,
    Chat,
    Calculate,
    BarChart
};


import { useHistory } from "react-router-dom";
const Breadcrumb = ({ path }) => {
    const history = useHistory();
    const redirectPath = `/${window?.contextPath}/employee/sandbox/productPage`;
  
    const handleContinue = (e) => {
      e.preventDefault();
      history.push(redirectPath); // client-side navigate
    };

    return (
      <div style={{ width: "100%", backgroundColor: "#e4edf1", padding: "2rem 2rem 2rem 4rem" }}>
        <nav className="nav-breadcrumb">
          <a href={redirectPath} onClick={handleContinue}>Products</a>
          <span className="separator">/</span>
          <span className="current">{path}</span>
        </nav>
      </div>
    );
  };

const HeroSection = ({ title, headline, img }) => (
    <div style={{
        width: '100%', backgroundColor: '#e4edf1', padding: '3rem 2rem 3rem 4rem', minHeight: '35rem'
    }}>
        <div style={{ display: 'flex', height: '400px', margin: '0 auto', marginLeft: '2rem' }}>
            <div style={{ marginLeft: '2rem', width: '50%', paddingRight: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h2 style={{ color: '#215B73', fontSize: '2.5rem', margin: '0rem 0rem' }}>{title}</h2>
                <p style={{ fontSize: '3.75rem', fontWeight: 'bold', lineHeight: '1.3', margin: '1.5rem 0rem' }}>
                    {headline.map((segment, i) => (
                        <span key={i} style={{ color: segment.color }}>{segment.text} </span>
                    ))}
                </p>
            </div>
            <div style={{ width: '65%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <img
                    src={img || "https://digit-sandbox-prod-s3.s3.ap-south-1.amazonaws.com/assets/5e72d0b559dea9fc2f5ff2bd4c66c63c3aff8bcc.png"}
                    alt="Business License UI"
                    style={{ height: '100%', width: 'auto', objectFit: 'contain', minHeight: '35rem' }}
                />
            </div>
        </div>
    </div>
);

const AboutSection = ({ about }) =>
(
    <div style={{ width: '100%', backgroundColor: '#ffffff', padding: '0rem 2rem 0rem 4rem' }}>
        <div className="about-container">
            <div className="about-title-wrapper">
                <h2 className="about-title">{about.title}</h2>
                <div className="title-underline"></div>
            </div>
            {about.paragraphs.map((para, i) => {
                const decodedpara = he.decode(para); // decode &lt;strong&gt;

                return (
                    <p key={i} className="about-description" dangerouslySetInnerHTML={{ __html: decodedpara }}></p>
                )
            })}
            <div className="roles-column-align">
                <div className="roles-section">
                    {about.roles.map((r, i) => (
                        <RoleBlock key={i} description={r.description} />
                    ))}
                </div>
            </div>
        </div>
    </div>
);



const RoleBlock = ({ description }) => {
    const decodedDescription = he.decode(description); // decode &lt;strong&gt;
    const isCitizen = decodedDescription.toLowerCase().includes('citizen');
    return (
        <div className="role-block">
            <div className="role-icon-wrapper">
                {isCitizen ? <Citizenicon /> : <Employeeicon />}
            </div>
            <p dangerouslySetInnerHTML={{ __html: decodedDescription }} />
        </div>
    );
};



const ExperienceSection = ({ experience, t = { t } }) => (
    <div style={{ width: '100%', backgroundColor: '#e4edf1', padding: '0rem 2rem 0rem 4rem' }}>
        <div className="about-container-2" style={{ backgroundColor: '#e4edf1' }}>
            <div className="about-title-wrapper">
                <h2 className="about-title">{experience.title}</h2>
                <div className="title-underline-2"></div>
            </div>
            <p className="about-description">{experience.description}</p>
            {experience.roles.map((r, i) => (
                <UserRoleBlock key={i} role={r.role} imageUrl={r.imageUrl} reverse={r.reverse} cards={r.cards} config={r.config} t={t} />
            ))}
        </div>
    </div>
);

const UserRoleBlock = ({ role, imageUrl, reverse, cards, config, t }) => (
    <div className="cs-wrapper-align">
        <div className="cs-wrapper">
            {!reverse && <RoleContent role={role} cards={cards} config={config} t={t} />}
            <div className={`cs-right ${reverse ? `cs-justify-start` : `cs-justify-end`}`}>
                <img src={imageUrl} alt="UI" className="cs-image" />
            </div>
            {reverse && <RoleContent role={role} cards={cards} config={config} t={t} />}
        </div>
    </div>
);

const RoleContent = ({ role, cards, config, t }) => (
    <div className="cs-left">
        <h2 className="cs-title">{role}</h2>
        {cards.map(({ icon, text }, idx) => {
            const IconComponent = iconMap[icon];
            return (
                <div key={idx} className="cs-card">
                    <IconComponent className="cs-icon" />
                    <span>{text}</span>
                </div>
            );
        })}
        <button

            onClick=

            {() => {
                try {
                    if (config.isExternal) {
                        window.open(config?.action, "_blank");
                    } else {
                        handleButtonClick(config?.action);
                    }
                } catch (error) {
                    console.error("Error navigating to URL:", error);
                }
            }}
            className="cs-button"> {t(config.title)} ➔</button>
    </div>
);

const WalkthroughSection = ({ activeTab, setActiveTab, t }) => {
    const iframeSrc = activeTab === "citizen"
        ? "https://example.com"
        : "https://www.wikipedia.org";

    return (
        <div className="walkthrough-container" style={{ width: '100%', backgroundColor: '#ffffff', padding: '3rem 6rem' }}>
            <div className="wt-c1">
                <h2 className="wt-title">{t("SB_WALK_THROUHG_HEADER")}</h2>
                <p className="wt-subtitle">{t("SB_WALK_THROUHG_DESCRIPTION")}</p>
            </div>
            <div className="wt-tabs-center wt-tabs-and-iframe">
                <div className="wt-tab-wrapper">
                    <div className={`wt-tab ${activeTab === "citizen" ? "active" : ""}`} onClick={() => setActiveTab("citizen")}>{t("SB_WALK_THROUHG_CITIZEN")}</div>
                    <div className={`wt-tab ${activeTab === "employee" ? "active" : ""}`} onClick={() => setActiveTab("employee")}>{t("SB_WALK_THROUHG_EMPLOYEE")}</div>
                </div>
                <div className="wt-iframe-wrapper">
                    <iframe src={iframeSrc} title="Digit Sandbox" className="wt-iframe"></iframe>
                </div>
            </div>
        </div>
    );
};

const content = {
    heroTitle: "Local Business License Issuing System",
    heroHeadline: [
        { text: "Get your", color: "#215B73" },
        { text: "business license issued", color: "#C84C0E" },
        { text: "easily", color: "#215B73" },
    ],
    about: {
        title: "About Local Business License Issuing System",
        paragraphs: [
            "The Local Business License Issuing system is an end-to-end product that enables <strong>businesses to apply for licenses</strong> and <strong>governments to ensure compliance and issue license certificates</strong> based on local regulations.",
            "Each product on DIGIT allows specific roles to be assigned to each user. The default workflow has two types of users: Citizen and Government Employee."
        ],
        roles: [
            { description: "Citizens can apply online or with help of counter employee at a service counter and make payment." },
            { description: "Government employees can verify documents, log field inspections and take action—such as approving, rejecting, or sending applications back—based on predefined rules." },
        ]
    },
    experience: {
        title: "Experience Local Business Issuing System",
        description: "On Sandbox, the government employee has been set up as a super-user, with all employee roles being assigned to it.  For each user, a new browser tab will open with the appropriate interface. Please do not share any sensitive or private details as this instance of Local Business License Issuing System is shared across users.",
        roles: [
            {
                role: "Citizens",
                // imageUrl: "https://digit-sandbox-prod-s3.s3.ap-south-1.amazonaws.com/assets/b49b43c60c88ed87c0a54cf6dc06b26ce83c1bcf.png",
                reverse: false,
                cards: [
                    { icon: "Graph", text: "Fill necessary details and upload relevant documents" },
                    { icon: "Calculate", text: "Track application(s) until issuance" },
                    { icon: "FeatureSearch", text: "Make dummy online payments" },
                    { icon: "Chat", text: "Download sample license and payment receipts" },
                    { icon: "BarChart", text: "Get notifications through emails and SMS" }
                ]
            },
            {
                role: "Employee",
                // imageUrl: "https://digit-sandbox-prod-s3.s3.ap-south-1.amazonaws.com/assets/8ae2d85d61e5ca4df1c3e12602f2027e7e3b56bd.png",
                reverse: true,
                cards: [
                    { icon: "Graph", text: "Track applications based on SLAs" },
                    { icon: "Calculate", text: "Verify documents and conduct field verification" },
                    { icon: "FeatureSearch", text: "Take action at each step and assign forward" },
                    { icon: "Chat", text: "Leave comments on document verification and field verification" },
                    { icon: "BarChart", text: "Review performance through the Dashboard" }
                ]
            }
        ]
    }
};

const handleButtonClick = (action) => {
    const url = '/' + window.contextPath + action + "?from=sandbox";
    window.open(url, "_blank");
};


function getImageByType(config, type) {
    const contentArray = config[0]?.subsections?.[1]?.content;

    if (!Array.isArray(contentArray)) {
        return null;
    }

    const imageObject = contentArray.find(item => item.type === type);

    return imageObject?.text || null;
}


const ProductDetailsComponentUpdated = ({ config, module }) => {

    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState("citizen");


    content.heroTitle = `${t(config[0].heading)}`
    content.about.title = `${t(config[0].subsections[0].title)}`
    content.about.paragraphs = config[0].subsections[0].content
        .filter(c => c.type === "paragraph")
        .map(c => `${t(c.text)}`);

    const roleItems = config[0].subsections[0].content.filter(c => c.type === "role");

    content.about.roles = roleItems.length > 0
        ? roleItems.map(c => ({
            description: t(c.text || "Data missing")
        }))
        : [
            { description: t(`${module}` + "_SECTION1_ROLE_1") },
            { description: t(`${module}` + "_SECTION1_ROLE_2") }
        ];



    content.experience.title = `${t(config[0].subsections[2].title)}`
    content.experience.description = config[0].subsections[2].content.filter(c => c.type === "paragraph").map(c => `${t(c.text)}`)

    const heroHeadlineItems = config[0].subsections[1].content.filter(c => c.type === "heroHeadline");

    content.heroHeadline = heroHeadlineItems.length > 0
        ? content.heroHeadline.map((item, idx) => ({
            text: t(heroHeadlineItems[idx]?.text || "Data missing"),
            color: item.color
        }))
        : [
            { text: t(`${module}` + "_SECTION2_HL1"), color: "#215B73" },
            { text: t(`${module}` + "_SECTION2_HL2"), color: "#C84C0E" },
            { text: t(`${module}` + "_SECTION2_HL3"), color: "#215B73" },
        ];

    content.experience.roles = config[0].subsections[2].content.map(c => `${t(c.text)}`)

    const section = config[0].subsections[2].content;

    const roleConfigs = {
        citizen: {
            imageUrl: getImageByType(config, 'citizen-image') || "https://digit-sandbox-prod-s3.s3.ap-south-1.amazonaws.com/assets/b49b43c60c88ed87c0a54cf6dc06b26ce83c1bcf.png",
            reverse: false,
            defaultIcons: ["Graph", "Calculate", "FeatureSearch", "Chat", "BarChart"]
        },
        employee: {
            imageUrl: getImageByType(config, 'employee-image') || "https://digit-sandbox-prod-s3.s3.ap-south-1.amazonaws.com/assets/8ae2d85d61e5ca4df1c3e12602f2027e7e3b56bd.png",
            reverse: true,
            defaultIcons: ["Graph", "Calculate", "FeatureSearch", "Chat", "BarChart"]
        },
        stakeholder: {
            imageUrl: getImageByType(config, 'stakeholder-image') || "https://digit-sandbox-prod-s3.s3.ap-south-1.amazonaws.com/assets/b49b43c60c88ed87c0a54cf6dc06b26ce83c1bcf.png",
            reverse: false,
            defaultIcons: ["Graph", "Calculate", "FeatureSearch", "Chat", "BarChart"]
        }
    };

    const roles = [];
    let currentRoleIndex = -1;

    section.forEach(item => {
        const roleType = item.text?.split("_")[1].toLowerCase();
        if (item.type === "step-heading") {
            currentRoleIndex++;
            roles[currentRoleIndex] = {
                role: t(item.text),
                imageUrl: roleConfigs[roleType].imageUrl,
                reverse: currentRoleIndex % 2 === 1,
                cards: [],
                config: {
                    action: config[0].cards[currentRoleIndex].action,
                    isExternal: config[0].cards[currentRoleIndex].isExternal,
                    title: config[0].cards[currentRoleIndex].title,
                }
            };
        } else if (item.type === "step" && currentRoleIndex > -1) {
            const icon = roleConfigs[roleType].defaultIcons[roles[currentRoleIndex].cards.length] || "Graph";
            roles[currentRoleIndex].cards.push({ icon, text: t(item.text) });
        }
    });

    content.experience.roles = roles;
    return (
        <div style={{ paddingLeft: '0.5rem' }}>
            <Breadcrumb path={`${t(config[0].heading)}`} />
            <HeroSection title={content.heroTitle} headline={content.heroHeadline} img={getImageByType(config, 'banner-image')} />
            <AboutSection about={content.about} />
            <ExperienceSection experience={content.experience} t={t} />
            <WalkthroughSection activeTab={activeTab} setActiveTab={setActiveTab} t={t} />
        </div>
    );
};

export default ProductDetailsComponentUpdated;
