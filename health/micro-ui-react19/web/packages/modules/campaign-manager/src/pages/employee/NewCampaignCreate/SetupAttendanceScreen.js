import { Card, HeaderComponent } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ListAltCheck, Groups, Visibility } from "@egovernments/digit-ui-svg-components";
import { I18N_KEYS } from "../../../utils/i18nKeyConstants";

const SetupAttendanceScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const campaignName = searchParams.get("campaignName");
  const campaignNumber = searchParams.get("campaignNumber");
  const tenantId = searchParams.get("tenantId") || Digit.ULBService.getCurrentTenantId();

  const cards = [
    {
      id: "setup-attendance-create-registers",
      icon: <ListAltCheck fill={"#C84C0E"} width={"40"} height={"40"} />,
      heading: t(I18N_KEYS.CAMPAIGN_CREATE.HCM_CREATE_NEW_REGISTERS_HEADING),
      description: t(I18N_KEYS.CAMPAIGN_CREATE.HCM_CREATE_NEW_REGISTERS_DESC),
      onClick: () => {
        navigate(
          `/${window.contextPath}/employee/campaign/create-registers-screen?key=1&campaignName=${campaignName}&campaignNumber=${campaignNumber}&tenantId=${tenantId}`
        );
      },
    },
    {
      id: "setup-attendance-map-users",
      icon: <Groups fill={"#C84C0E"} width={"40"} height={"40"} />,
      heading: t(I18N_KEYS.CAMPAIGN_CREATE.HCM_MAP_USERS_TO_REGISTERS_HEADING),
      description: t(I18N_KEYS.CAMPAIGN_CREATE.HCM_MAP_USERS_TO_REGISTERS_DESC),
      onClick: () => {
        navigate(
          `/${window.contextPath}/employee/campaign/map-users-to-registers?campaignName=${campaignName}&campaignNumber=${campaignNumber}&tenantId=${tenantId}`
        );
      },
    },
    {
      id: "setup-attendance-view-registers",
      icon: <Visibility fill={"#C84C0E"} width={"40"} height={"40"} />,
      heading: t(I18N_KEYS.CAMPAIGN_CREATE.HCM_VIEW_REGISTERS_HEADING),
      description: t(I18N_KEYS.CAMPAIGN_CREATE.HCM_VIEW_REGISTERS_DESC),
      onClick: () => {
        navigate(
          `/${window.contextPath}/employee/campaign/map-users-to-registers?campaignName=${campaignName}&campaignNumber=${campaignNumber}&tenantId=${tenantId}`
        );
      },
    },
  ];

  return (
    <div>
      <HeaderComponent className={"campaign-header-style"}>
        {t(I18N_KEYS.CAMPAIGN_CREATE.HCM_SETUP_ATTENDANCE_PAGE_HEADING)}
      </HeaderComponent>
      <p className="name-description">{t(I18N_KEYS.CAMPAIGN_CREATE.HCM_SETUP_ATTENDANCE_PAGE_DESC)}</p>
      <div className="containerStyle" style={{ marginTop: "1.5rem" }}>
        {cards.map((card) => (
          <Card
            key={card.id}
            className="digit-campaign-home-card"
            onClick={card.onClick}
            id={card.id}
          >
            <div className="digit-campaign-home-icon">{card.icon}</div>
            <div className="digit-campaign-home-text">
              <div className="digit-campaign-home-text-header">{card.heading}</div>
              <div className="digit-campaign-home-text-description">{card.description}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SetupAttendanceScreen;
