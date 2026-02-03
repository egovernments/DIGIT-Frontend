import { Loader } from "@egovernments/digit-ui-components";
import React from "react";
import { useTranslation } from "react-i18next";
import ImageComponent from "./ImageComponent";

const Header = ({ showTenant = true }) => {
  const { data: storeData, isLoading } = Digit.Hooks.useStore.getInitData();
  const { stateInfo } = storeData || {};
  const { t } = useTranslation();

  if (isLoading) return <Loader />;

  //If HEADER_SVG config exists, return the custom block
  const headerSvgSecondaryUrl = window?.globalConfigs?.getConfig("SVG_HEADER_SECONDARY_LOGO_URL");
  if (headerSvgSecondaryUrl) {
    return (
      <div className="bannerHeader secondaryBannerHeader">
        <ImageComponent
          className="bannerLogo"
          src={stateInfo?.logoUrl}
          style={!showTenant ? { borderRight: "unset" } : {}}
          alt="Digit Banner"
        />
        <span style={{fontSize: "xx-large"}}>|</span>
        <ImageComponent
          className="svgHeaderLogo"
          src={headerSvgSecondaryUrl}
          alt="DIGIT Logo"
        />
      </div>
    );
  }

  // Default logic
  return (
    <div className="bannerHeader">
      <ImageComponent
        className="bannerLogo"
        src={stateInfo?.logoUrl}
        style={!showTenant ? { borderRight: "unset" } : {}}
        alt="Digit Banner"
      />
      {showTenant && stateInfo?.code && (
        <p>{t(`TENANT_TENANTS_${stateInfo?.code?.toUpperCase()}`)}</p>
      )}
    </div>
  );
};

export default Header;