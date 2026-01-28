import { Loader } from "@egovernments/digit-ui-components";
import React from "react";
import { useTranslation } from "react-i18next";
// import ImageComponent from "./ImageComponent";

const SandBoxHeader = ({ showTenant = true }) => {
  const { data: storeData, isLoading } = Digit.Hooks.useStore.getInitData();
  const { stateInfo } = storeData || {};
  const { t } = useTranslation();

  if (isLoading) return <Loader />;

  return (
    <div className="bannerHeader">
        <div className="SandboxLogoAlignCenter">
        {/* <SandboxHeaderImg/> */}
        </div>
      {/* <ImageComponent className="bannerLogo" src={stateInfo?.logoUrl} style={!showTenant ? { borderRight: "unset" } : {}} alt="Digit Banner" /> */}
      {showTenant && stateInfo?.code && <p>{t(`TENANT_TENANTS_${stateInfo?.code?.toUpperCase()}`)}</p>}
    </div>
  );
};

export default SandBoxHeader;
