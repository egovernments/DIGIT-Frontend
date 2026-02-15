import React, { useState, useRef, useEffect } from "react";
import { Button, SidePanel, Tag } from "@egovernments/digit-ui-components";
import NewDrawerFieldComposer, { Tabs } from "./NewDrawerFieldComposer";
import NewAppFieldScreenWrapper from "./NewAppFieldScreenWrapper";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useTranslation } from "react-i18next";
import { deselectField, setShowPopupPreview } from "./redux/remoteConfigSlice";
import { useDispatch, useSelector } from "react-redux";
import ConsoleTooltip from "../../../components/ConsoleToolTip";
import { I18N_KEYS } from "../../../utils/i18nKeyConstants";
import AIAssistantChat from "./AIAssistant/AIAssistantChat";
import { toggleChat } from "./AIAssistant/aiAssistantSlice";

const SidePanelApp = ({ showPanelProperties }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { currentData } = useSelector((state) => state.remoteConfig);
  const { byName: panelProperties } = useSelector((state) => state.fieldPanelMaster);
  const isAIOpen = useSelector((state) => state.aiAssistant.isOpen);
  const [activeTab, setActiveTab] = useState("content");
  const sidePanelRef = useRef(null);

  // Outside-click handler: close AI assistant when clicking outside the side panel
  useEffect(() => {
    if (!isAIOpen || showPanelProperties) return;

    const handleMouseDown = (e) => {
      if (sidePanelRef.current && !sidePanelRef.current.contains(e.target)) {
        dispatch(toggleChat());
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [isAIOpen, showPanelProperties, dispatch]);

  // Get panel configuration for tabs
  const panelConfig = panelProperties?.drawerPanelConfig || {};
  const tabs = Object.keys(panelConfig);

  const handleBackClick = () => {
    // Close popup preview if open
    dispatch(setShowPopupPreview(false));
    // Deselect field
    dispatch(deselectField());
  };

  // Determine page type tag based on data.type
  const pageTypeTag = currentData?.type === "template"
    ? { label: `${t(I18N_KEYS.APP_CONFIGURATION.TEMPLATE_SCREEN)} ${t(I18N_KEYS.APP_CONFIGURATION.PARTIALLY_CONFIGURABLE_PARENTHESES)}`, type: "warning" }
    : { label: `${t(I18N_KEYS.APP_CONFIGURATION.FORM_SCREEN)} ${t(I18N_KEYS.APP_CONFIGURATION.FULLY_CONFIGURABLE_PARENTHESES)}`, type: "default" };

  const labelStyles = {
    fontFamily: "Roboto",
    fontWeight: 600,
    fontStyle: "SemiBold",
    fontSize: "12px",
    textAlign: "right"
  };

  const handleAIToggle = () => {
    dispatch(toggleChat());
  };

  return (
    <div ref={sidePanelRef}>
      <SidePanel
        bgActive
        className="app-configuration-side-panel"
        defaultOpenWidth={370}
        closedContents={[]}
        closedFooter={[<en />]}
        closedHeader={[]}
        closedSections={[]}
        defaultClosedWidth=""
        footer={[]}
        header={[
          showPanelProperties ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%" }}>
              <Button
                className=""
                variation="secondary"
                label={t(I18N_KEYS.APP_CONFIGURATION.BACK_TO_PAGE_PROPERTIES)}
                title={t(I18N_KEYS.APP_CONFIGURATION.BACK_TO_PAGE_PROPERTIES)}
                icon="ArrowBack"
                size="small"
                onClick={handleBackClick}
              />
              <div className="app-config-drawer-subheader">
                <div className={"app-config-drawer-subheader-text"}>{t(I18N_KEYS.APP_CONFIGURATION.APPCONFIG_PROPERTIES)}</div>
                <span className="icon-wrapper new">
                  <ConsoleTooltip iconFill={"#0B4B66"} style={{marginLeft:"0rem",top:"0rem"}} className="app-config-tooltip" toolTipContent={t(I18N_KEYS.APP_CONFIGURATION.TIP_APPCONFIG_PROPERTIES)} />
                </span>
              </div>
              {tabs.length > 0 && (
                <div style={{ width: "100%" }}>
                  <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div className="app-config-page-properties typography caption-s" style={{ color: "#0B4B66", marginLeft: "0px", paddingTop: "0px" }}>
                  {isAIOpen ? "AI Assistant" : t(I18N_KEYS.APP_CONFIGURATION.FIELD_CONFIGURATION)}
                </div>
                <button
                  className={`ai-assistant-sidepanel-btn${isAIOpen ? " active" : ""}`}
                  onClick={handleAIToggle}
                  title={isAIOpen ? "Back to fields" : "AI Assistant"}
                >
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    {isAIOpen ? (
                      <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                    ) : (
                      <React.Fragment>
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                        <path d="M7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z" />
                      </React.Fragment>
                    )}
                  </svg>
                  {isAIOpen ? "Fields" : "AI"}
                </button>
              </div>
              {/* PAGE TYPE TAG below header - only show when not in AI mode */}
              {!isAIOpen && (
                <Tag
                  label={pageTypeTag.label}
                  showIcon={false}
                  type={pageTypeTag.type}
                  stroke={false}
                  labelStyle={currentData?.type === "template" ? {
                    color: "#5C450A",
                    ...labelStyles
                  } : {
                    color: "#1C00BD", ...labelStyles
                  }}
                  style={currentData?.type === "template" ? { backgroundColor: "#FFF7D6", borderRadius: "8px",width:"100%"} : { backgroundColor: "#EBECFE", borderRadius: "8px" ,width:"100%"}}
                />
              )}
            </div>
          )
        ]}
        hideScrollIcon
        isDraggable={false}
        position="right"
        sections={[]}
        type="static"
      >
        {showPanelProperties ? (
          <NewDrawerFieldComposer activeTab={activeTab} onTabChange={setActiveTab} />
        ) : isAIOpen ? (
          <AIAssistantChat />
        ) : (
          <DndProvider backend={HTML5Backend}>
            <NewAppFieldScreenWrapper />
          </DndProvider>
        )}
      </SidePanel>
    </div>
  );
};

export default SidePanelApp;
