import { Loader } from "../../../../ui-components/dist/main";
import React from "react";
import { useTranslation } from "react-i18next";
import useStore from "../../libraries/src/hooks/useStore";

const Header = ({ showTenant = true }) => {
  const { data: storeData, isLoading } = useStore.getInitData();
  const { stateInfo } = storeData || {};
  const { t } = useTranslation();

  if (isLoading) return <Loader />;

  return (
    <div className="bannerHeader">
      <img className="bannerLogo" src={stateInfo?.logoUrl} style={!showTenant ? { borderRight: "unset" } : {}} />
      {showTenant && stateInfo?.code && <p>{t(`TENANT_TENANTS_${stateInfo?.code?.toUpperCase()}`)}</p>}
    </div>
  );
};

export default Header;
