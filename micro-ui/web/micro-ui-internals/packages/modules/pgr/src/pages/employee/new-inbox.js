import React, { useMemo,useState,useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Header, InboxSearchComposer , Loader } from "@egovernments/digit-ui-react-components";
import inboxConfigPGR from "../inboxConfigPGR"
import { useLocation } from "react-router-dom";
const InboxV2 = () => {
  const { t } = useTranslation()
  //fetch this config from mdms and pass it to the preProcess fn
  const location = useLocation()
  const configs = inboxConfigPGR();
  const [pageConfig, setPageConfig] = useState(null)
  const moduleName = Digit.Utils.getConfigModuleName()
  const tenant = Digit.ULBService.getStateId();
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const { isLoading, data: wardsAndLocalities } = Digit.Hooks.useLocation(
    tenantId, 'Locality',
    {
        select: (data) => {
            const localities = []
            data?.TenantBoundary[0]?.boundary.forEach((item) => {
                localities.push({ code: item.code, name: item.name, i18nKey: `${tenantId?.replaceAll(".","_").toUpperCase()}_ADMIN_${item?.code}` })
            });
            return (localities);
            
        }
    });

  

    const serviceDefs = Digit.Hooks.pgr.useServiceDefs(tenantId, "PGR");


  const updatedConfig = useMemo(
    () => Digit.Utils.preProcessMDMSConfigInboxSearch(t, pageConfig, "sections.filter.uiConfig.fields", {
      updateDependent : [
        {
            key : "locality",
            value : wardsAndLocalities ? [...wardsAndLocalities] : []
        },
        {
          key : "serviceCode",
          value : serviceDefs ? [...serviceDefs] : []
      } 
      ]
    }),
    [pageConfig,wardsAndLocalities]);

  useEffect(() => {
    setPageConfig(_.cloneDeep(configs))
  }, [location])



  if (!pageConfig || isLoading) return <Loader />

  return (
    <React.Fragment>
      <Header styles={{ fontSize: "32px" }}>{t(updatedConfig?.label)}{location?.state?.count ? <span className="inbox-count">{location?.state?.count}</span> : null}</Header>
      <div className="inbox-search-wrapper">
        <InboxSearchComposer configs={updatedConfig} />
      </div>
    </React.Fragment>
  )
}

export default InboxV2